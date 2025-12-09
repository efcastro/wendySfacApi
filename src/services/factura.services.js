// src/services/facturaService.js
import { pool } from "../db.js";
import ReceiptPrinterEncoder from "@point-of-sale/receipt-printer-encoder";
import NetworkPrinter from "@point-of-sale/network-receipt-printer";
import {
  TypeResultExitoso,
  TypeResultErrorControlado,
  TypeResultErrorNoControlado,
  SpObtenerInformacionFactura,
} from "../utils/constantes.js";
import { ValidarRespuestaSp, IsNull } from "../utils/util.js";

export const generarFactura = async (facturaData) => {
  try {
    if (!facturaData || Object.keys(facturaData).length === 0) {
      return ValidarRespuestaSp(
        TypeResultErrorControlado,
        "Error: facturaData está vacío",
        null
      );
    }

    const printer = new NetworkPrinter({
      host: facturaData?.ip,
      port: 9100,
    });

    const encoder = new ReceiptPrinterEncoder({ language: "esc-pos" });

    encoder
      .initialize()
      .codepage("auto")
      .bold(true)
      .align("center")
      .newline()
      .text(facturaData?.empresa?.nombre?.toUpperCase() || "NOMBRE EMPRESA") // NOMBRE EMPRESA
      .newline()
      .text(facturaData?.sucursal?.direccion?.toUpperCase() || "") // DIRECCION
      // .newline()
      // .text("esquina opuesta Banco del Pais".toUpperCase()) // DIRECCION
      .newline()
      .text(facturaData?.empresa?.rtn) // RTN
      // .newline()
      // .text("Casa Matriz: La Ceiba, Atlantida, La Ceiba,".toUpperCase())
      // .newline()
      // .text("Avenida San Isidro, Calle 10, esquina opuesta Banco del Pais".toUpperCase())
      .newline()
      .text(facturaData?.sucursal?.telefono || 99999999) // TELEFONO
      .newline()
      .text(facturaData?.empresa?.correo?.toUpperCase() || "") // CORREO
      .newline()
      .newline()
      .text(`FACTURA: ${facturaData?.numeroFactura}`.toUpperCase())
      .bold(false)
      .newline()
      .newline()
      .align("left")
      .text(
        `Fecha Límite de Emisión: ${facturaData?.fechaLimiteEmision}`.toUpperCase()
      )
      .newline()
      .text(`Rango Autorizado: ${facturaData?.rangoAutorizado}`.toUpperCase())
      .newline()
      .text(`CAI: ${facturaData?.cai}`.toUpperCase())
      .newline()
      .newline()
      .text(`Fecha: ${facturaData?.fecha}`.toUpperCase())
      .newline()
      .text(`HORA: ${facturaData?.hora}`.toUpperCase())
      .newline()
      .text(`CAJERO(A): ${facturaData?.cajero}`.toUpperCase())
      .newline()
      .text(`ARTICULOS: ${facturaData?.articulos?.length}`.toUpperCase())
      .newline()
      .text(`CAJA #: ${facturaData?.caja}`.toUpperCase())
      .newline()
      .text(`ORDEN NO.: ${facturaData?.orden}`.toUpperCase())
      .newline()
      .text(`RTN: ${facturaData?.rtnCliente}`.toUpperCase())
      .newline()
      .text(facturaData?.cliente.toUpperCase())
      .newline()
      .newline();
    // Generar la tabla de artículos
    encoder
      .rule()
      .table(
        [
          { width: 8, align: "left" },
          { width: 22, align: "left" },
          { width: 12, align: "right" },
        ],
        [
          [
            (encoder) => encoder.bold(true).text("CANT.").bold(false),
            (encoder) => encoder.bold(true).text("DESCRIPCIÓN").bold(false),
            (encoder) => encoder.bold(true).text("IMPORTE").bold(false),
          ],
        ]
      )
      .rule();

    // Agregar los productos a la tabla
    facturaData.articulos.forEach((item) => {
      encoder.table(
        [
          { width: 8, align: "left" },
          { width: 22, align: "left" },
          { width: 12, align: "right" },
        ],
        [
          [
            item.cantidad.toString(),
            item.descripcion?.toUpperCase(),
            `L. ${item.importe?.toFixed(2)}`,
          ],
        ]
      );
    });

    encoder.rule();

    encoder
      .newline()
      .table(
        [
          { width: 30, align: "left" },
          { width: 12, align: "right" },
        ],
        [
          [
            "IMPORTE EXONERADO",
            `L ${facturaData?.importeExonerado?.toFixed(2)}`,
          ],
          ["DESCUENTOS Y REBAJAS", `L ${facturaData?.descuentos?.toFixed(2)}`],
          ["TOTAL EVENTO", `L ${facturaData?.totalEvento?.toFixed(2)}`],
          ["GRAVADO 15%", `L ${facturaData?.gravado15?.toFixed(2)}`],
          ["GRAVADO 18%", `L ${facturaData?.gravado18?.toFixed(2)}`],
          ["IMPT 15%", `L ${facturaData?.impuesto15?.toFixed(2)}`],
          ["IMPT 18%", `L ${facturaData?.impuesto18?.toFixed(2)}`],
          [
            (encoder) => encoder.bold(true).text("Gran Total").bold(false),
            (encoder) =>
              encoder
                .bold(true)
                .text(`L ${facturaData?.granTotal?.toFixed(2)}`)
                .bold(false),
          ],
          ...facturaData.metodosPago.map((pago) => [
            `${pago.formaPago?.toUpperCase()}`,
            `L ${pago.montoRecibido?.toFixed(2)}`,
          ]),
          // [
          //   "Efectivo Recibido",
          //   `L ${facturaData?.efectivoRecibido?.toFixed(2) || 0}`,
          // ],
          // ["Cambio Efectivo", `L ${facturaData?.cambioEfectivo?.toFixed(2) || 0}` ],
        ]
      )
      .newline()
      .align("center")
      .text("ORIGINAL - CLIENTE".toUpperCase())
      .newline()
      .text("COPIA - CONTRIBUYENTE EMISOR".toUpperCase())
      .newline()
      .text(facturaData?.letras)
      .newline()
      .newline()
      .align("left")
      .text("CONST. DE REG DE EXONERADOS_______________".toUpperCase())
      .newline()
      .text("ORDEN DE COMPRA EXENTA____________________".toUpperCase())
      .newline()
      .text("NO DE REG S.A.G___________________________".toUpperCase())
      .newline()
      .align("center")
      .newline()
      .text("GRACIAS POR SU COMPRA".toUpperCase())
      .newline()
      .text("PARA RECLAMOS PRESTAR FACTURA".toUpperCase())
      .newline()
      .text("LO ESPERAMOS PRONTO!".toUpperCase())
      .newline()
      .text(facturaData?.sucursal?.telefono || 99999999)
      .newline()
      // .newline()
      // .text("Gracias por participar!")
      .newline()
      .bold(true)
      .text("© 2025 - SFAC V1.0.1")
      .bold(false)
      .newline()
      .newline(5)
      .cut();

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
  } catch (error) {
    console.error("Error al generar la factura:", error);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "Error al generar la factura: " + error.message
    );
  }
};

export const obtenerInformacionFactura = async (NumeroFactura) => {
  try {

    // Extraer los parámetros en el orden correcto
    const Params = {
      pnNumeroFactura: IsNull(NumeroFactura),
    };

    // Convertir los parámetros a un array ordenado
    const orderedParams = Object.values(Params);

    // Ejecutar el procedimiento almacenado
    await pool.query(
      `CALL ${SpObtenerInformacionFactura}(?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );

    // Obtener los resultados del procedimiento almacenado
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );

    const { typeResult, result, message } = output[0];

    // Validar y retornar la respuesta
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("obtenerInformacionFacturaService:", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "obtenerInformacionFacturaService: " + err.message
    );
  }
};
