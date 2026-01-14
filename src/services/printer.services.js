import ip from "ip";
import os from "os";
import net from "net";
import NetworkPrinter from "@point-of-sale/network-receipt-printer";
import ReceiptPrinterEncoder from "@point-of-sale/receipt-printer-encoder";
import { pool } from "../db.js";
import { ValidarRespuestaSp, IsNull } from "../utils/util.js";
import {
  TypeResultErrorControlado,
  TypeResultErrorNoControlado,
  TypeResultExitoso,
  SpGestionarImpresoras,
} from "../utils/constantes.js";

const PUERTO_IMPRESORA = 9100;

/**
 * Obtiene la IP local de la interfaz de red principal (la que tiene gateway/internet)
 * Prioriza interfaces con gateway (Wi-Fi, Ethernet) sobre adaptadores virtuales
 */
function obtenerIPLocal() {
  const interfaces = os.networkInterfaces();
  const candidatos = [];

  for (const [nombre, direcciones] of Object.entries(interfaces)) {
    for (const dir of direcciones) {
      // Solo IPv4, no internas (loopback)
      if (dir.family === "IPv4" && !dir.internal) {
        candidatos.push({
          nombre,
          ip: dir.address,
          // Priorizar interfaces comunes de internet
          prioridad: nombre.toLowerCase().includes("wi-fi") ||
            nombre.toLowerCase().includes("wifi") ||
            nombre.toLowerCase().includes("ethernet") ||
            nombre.toLowerCase().includes("eth") ? 1 :
            nombre.toLowerCase().includes("local area connection") ? 2 : 3
        });
      }
    }
  }

  // Ordenar por prioridad y retornar la mejor opción
  candidatos.sort((a, b) => a.prioridad - b.prioridad);

  if (candidatos.length > 0) {
    console.log(`Interfaces detectadas: ${candidatos.map(c => `${c.nombre}(${c.ip})`).join(", ")}`);
    console.log(`Usando interfaz: ${candidatos[0].nombre} (${candidatos[0].ip})`);
    return candidatos[0].ip;
  }

  // Fallback al método original
  return ip.address();
}

/**
 * Verifica si una IP tiene el puerto 9100 abierto
 */
async function verificarPuerto(
  ipAddress,
  port = PUERTO_IMPRESORA,
  timeout = 1000
) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);

    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });

    socket.on("error", () => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, ipAddress);
  });
}

/**
 * Escanea la red y devuelve solo las impresoras con puerto 9100 abierto
 * Nota: No depende de ping ICMP, escanea directamente el puerto 9100
 */
export async function buscarImpresorasEnRed() {
  const posibles = [];

  const localIp = obtenerIPLocal();
  const subnetInfo = ip.subnet(localIp, "255.255.255.0");
  const baseIp =
    subnetInfo.networkAddress.split(".").slice(0, 3).join(".") + ".";
  console.log(`Escaneando red: ${baseIp}1 - ${baseIp}254 (verificando puerto ${PUERTO_IMPRESORA} directamente)`);

  // Escanear en lotes para no saturar la red
  const BATCH_SIZE = 50;

  for (let batch = 0; batch < Math.ceil(254 / BATCH_SIZE); batch++) {
    const promesas = [];
    const start = batch * BATCH_SIZE + 1;
    const end = Math.min(start + BATCH_SIZE, 255);

    for (let i = start; i < end; i++) {
      const host = `${baseIp}${i}`;
      // Verificar directamente el puerto 9100 sin depender del ping
      promesas.push(
        verificarPuerto(host, PUERTO_IMPRESORA, 500).then((tienePuerto) => {
          if (tienePuerto) {
            console.log(`Impresora encontrada en: ${host}`);
            posibles.push({ ip: host });
          }
        })
      );
    }

    await Promise.all(promesas);
  }

  if (posibles.length === 0) {
    return ValidarRespuestaSp(
      TypeResultErrorControlado,
      "No se encontraron impresoras.",
      []
    );
  } else {
    return ValidarRespuestaSp(
      TypeResultExitoso,
      "Impresoras encontradas correctamente.",
      posibles
    );
  }
}

export async function enviarPruebaDeImpresion(ipAddress) {
  console.log(`Enviando prueba de impresión a ${ipAddress}...`);

  const printer = new NetworkPrinter({
    host: ipAddress,
    port: 9100,
  });

  const encoder = new ReceiptPrinterEncoder({ language: "esc-pos" });

  encoder
    .initialize()
    .codepage("auto")
    .bold(true)
    .align("center")
    .newline()
    .text("NOMBRE EMPRESA") // NOMBRE EMPRESA
    .newline()
    .text("DIRECCION") // DIRECCION
    .newline()
    .text("RTN") // RTN
    .newline();

  const receipt = encoder.encode();

  return new Promise((resolve, reject) => {
    let connectionTimeout = setTimeout(() => {
      // Cerrar la conexión manualmente
      if (printer.socket) {
        printer.socket.destroy(); // Destruye el socket
      }
      reject(
        ValidarRespuestaSp(
          TypeResultErrorNoControlado,
          "Error de conexión con la impresora: Tiempo de espera agotado",
          null
        )
      );
    }, 5000); // Timeout de 5 segundos

    printer.addEventListener("connected", async () => {
      clearTimeout(connectionTimeout);
      console.log("Connected to printer");

      try {
        await printer.print(receipt);
        await printer.disconnect();
        resolve(
          ValidarRespuestaSp(
            TypeResultExitoso,
            "Factura generada e impresa correctamente",
            null
          )
        );
      } catch (error) {
        reject(
          ValidarRespuestaSp(
            TypeResultErrorControlado,
            `Error al imprimir la factura: ${error.message}`,
            null
          )
        );
      }
    });

    printer.addEventListener("disconnected", () => {
      console.log("Disconnected from printer");
    });

    printer.addEventListener("error", (error) => {
      clearTimeout(connectionTimeout);
      reject(
        ValidarRespuestaSp(
          TypeResultErrorNoControlado,
          `Error de conexión con la impresora: ${error.message}, revisar conexión con la impresora`,
          null
        )
      );
    });

    try {
      printer.connect();
    } catch (error) {
      clearTimeout(connectionTimeout);
      reject(
        ValidarRespuestaSp(
          TypeResultErrorNoControlado,
          "Error al intentar conectar con la impresora: " + error.message,
          null
        )
      );
    }
  });
}

export const GestionarImpresora = async (TipoOperacion, datos) => {
  try {
    const {
      Codigo,
      Nombre,
      IP,
      FKCodigoCajaSucursal,
      FKCodigoSucursal,
      FKCodigoTipoImpresion,
      Estado,
      Pagina,
      TamanoPagina,
      Busqueda,
      CodigoUsuario,
    } = datos;

    const Params = {
      pnTipoOperacion: TipoOperacion,
      pnCodigoImpresora: IsNull(Codigo),
      pcNombre: IsNull(Nombre),
      pnCodigoCajaSucursal: IsNull(FKCodigoCajaSucursal),
      pnCodigoSucursal: IsNull(FKCodigoSucursal),
      pnCodigoTipoImpresion: IsNull(FKCodigoTipoImpresion),
      pcIP: IsNull(IP),
      pnEstado: IsNull(Estado),
      pnPagina: IsNull(Pagina),
      pnTamanoPagina: IsNull(TamanoPagina),
      pcBusqueda: IsNull(Busqueda),
      pnCodigoUsuario: IsNull(CodigoUsuario),
    };

    const orderedParams = Object.values(Params);

    // Ejecutar el stored procedure
    await pool.query(
      `CALL ${SpGestionarImpresoras}(?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );

    // Obtener los resultados del SP
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );

    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("GestionarImpresoraService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "GestionarImpresoraService: " + err.message
    );
  }
};
