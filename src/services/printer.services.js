import ip from "ip";
import ping from "ping";
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
 */
export async function buscarImpresorasEnRed() {
    const posibles = [];

    const localIp = ip.address();
    const subnetInfo = ip.subnet(localIp, "255.255.255.0");
    const baseIp =
        subnetInfo.networkAddress.split(".").slice(0, 3).join(".") + ".";
    console.log(`Escaneando red: ${baseIp}1 - ${baseIp}254`);
    const promesas = [];

    for (let i = 1; i < 255; i++) {
        const host = `${baseIp}${i}`;
        promesas.push(
            ping.promise.probe(host, { timeout: 1 }).then(async (res) => {
                if (res.alive) {
                    const tienePuerto = await verificarPuerto(res.host);
                    if (tienePuerto) {
                        posibles.push({ ip: res.host });
                    }
                }
            })
        );
    }

    await Promise.all(promesas);

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
