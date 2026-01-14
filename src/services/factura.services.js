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

    const encoder = new ReceiptPrinterEncoder({
      language: "esc-pos",
      width: 42, // Ancho estándar para impresoras de 80mm
    });

    // Helper para formatear moneda
    const formatMoney = (value) => `L ${Number(value || 0).toFixed(2)}`;

    // Extraer datos con valores por defecto
    const empresa = facturaData?.empresa || {};
    const sucursal = facturaData?.sucursal || {};
    const articulos = facturaData?.articulos || [];
    const metodosPago = facturaData?.metodosPago || [];
    const propina = Number(facturaData?.propina) || 0;
    const granTotal = Number(facturaData?.granTotal) || 0;
    const totalConPropina = granTotal + propina;

    encoder
      .initialize()
      // Comandos ESC/POS para SAT Q22 - Aumentar densidad de impresión
      .raw([0x1b, 0x45, 0x01]) // ESC E 1 - Activa modo enfatizado
      .raw([0x1b, 0x47, 0x01]) // ESC G 1 - Activa double-strike
      .codepage("auto")

      // ========== ENCABEZADO DE LA EMPRESA ==========
      .bold(true)
      .align("center")
      .newline()
      .text((empresa?.nombre || facturaData?.NombreEmpresa || "EMPRESA").toUpperCase())
      .bold(false)
      .newline();

    // Dirección (si existe)
    if (sucursal?.direccion) {
      encoder.text(sucursal.direccion.toUpperCase()).newline();
    }

    encoder
      .text(`RTN: ${empresa?.rtn || facturaData?.RtnEmpresa || "-"}`)
      .newline();

    // Teléfono (si existe)
    if (sucursal?.telefono) {
      encoder.text(`TEL: ${sucursal.telefono}`).newline();
    }

    // Correo (si existe)
    if (empresa?.correo) {
      encoder.text(empresa.correo.toUpperCase()).newline();
    }

    encoder
      .text("================================")
      .newline()
      .bold(true)
      .text(`FACTURA: ${facturaData?.numeroFactura || "-"}`)
      .bold(false)
      .newline()
      .newline()

      // ========== INFORMACIÓN FISCAL ==========
      .align("left");

    if (facturaData?.fechaLimiteEmision) {
      encoder.text(`FECHA LIMITE EMISION: ${facturaData.fechaLimiteEmision}`).newline();
    }
    if (facturaData?.rangoAutorizado) {
      encoder.text(`RANGO AUTORIZADO: ${facturaData.rangoAutorizado}`).newline();
    }
    if (facturaData?.cai) {
      encoder.text(`CAI: ${facturaData.cai}`).newline();
    }

    // ========== INFORMACIÓN DE LA TRANSACCIÓN ==========
    encoder
      .rule()
      .table(
        [
          { width: 20, align: "left" },
          { width: 22, align: "right" },
        ],
        [
          ["FECHA:", facturaData?.fecha || new Date().toLocaleDateString("es-HN")],
          ["HORA:", facturaData?.hora || new Date().toLocaleTimeString("es-HN", { hour: "2-digit", minute: "2-digit" })],
          ["CAJERO(A):", facturaData?.cajero || "-"],
          ["ARTICULOS:", String(articulos?.length || 0)],
          ["CAJA #:", String(facturaData?.caja || "-")],
          ...(facturaData?.orden ? [["ORDEN NO.:", String(facturaData.orden)]] : []),
          ["RTN:", facturaData?.rtnCliente || "-"],
          ["CLIENTE:", (facturaData?.cliente || "CONSUMIDOR FINAL").toUpperCase()],
        ]
      );

    // ========== DETALLE DE PRODUCTOS ==========
    // Línea superior de la tabla
    encoder
      .text("__________________________________________")
      .newline()
      .table(
        [
          { width: 6, align: "left" },
          { width: 24, align: "left" },
          { width: 12, align: "right" },
        ],
        [
          [
            (encoder) => encoder.bold(true).text("CANT.").bold(false),
            (encoder) => encoder.bold(true).text("DESCRIPCION").bold(false),
            (encoder) => encoder.bold(true).text("IMPORTE").bold(false),
          ],
        ]
      )
      .text("__________________________________________")
      .newline();

    // Agregar los productos a la tabla con líneas horizontales
    articulos.forEach((item) => {
      // Producto principal
      encoder.table(
        [
          { width: 6, align: "left" },
          { width: 24, align: "left" },
          { width: 12, align: "right" },
        ],
        [
          [
            (item.cantidad || 0).toString(),
            (item.descripcion || "-").toUpperCase().substring(0, 22),
            formatMoney(item.importe),
          ],
        ]
      );

      // Mostrar empaquetado si existe (texto condensado más pequeño)
      if (item.nombreEmpaquetado) {
        encoder
          .raw([0x1b, 0x21, 0x01]) // ESC ! 1 - Modo condensado (letra pequeña)
          .text(`       . ${item.nombreEmpaquetado} x ${item.unidadesPorEmpaquetado || "?"}`)
          .newline()
          .raw([0x1b, 0x21, 0x00]); // ESC ! 0 - Modo normal
      }

      // Mostrar opciones de combo si existen (texto condensado)
      let opcionesCombo = item.opcionesCombo;
      if (typeof opcionesCombo === "string") {
        try {
          opcionesCombo = JSON.parse(opcionesCombo);
        } catch (e) {
          opcionesCombo = null;
        }
      }

      if (opcionesCombo && Array.isArray(opcionesCombo) && opcionesCombo.length > 0) {
        encoder.raw([0x1b, 0x21, 0x01]); // Modo condensado
        opcionesCombo.forEach((opcion) => {
          encoder
            .text(`       . ${opcion.NombreProducto || opcion.nombre_variante || "-"} x ${opcion.Cantidad || 1}`)
            .newline();
        });
        encoder.raw([0x1b, 0x21, 0x00]); // Modo normal
      }

      // Línea horizontal después de cada producto
      encoder.text("__________________________________________").newline();
    });

    // ========== TOTALES FISCALES ==========
    encoder
      .newline()
      .table(
        [
          { width: 28, align: "left" },
          { width: 14, align: "right" },
        ],
        [
          ["IMPORTE EXONERADO", formatMoney(facturaData?.importeExonerado)],
          ["DESCUENTOS Y REBAJAS", formatMoney(facturaData?.descuentos)],
          ["TOTAL EVENTO", formatMoney(facturaData?.totalEvento)],
          ["GRAVADO 15%", formatMoney(facturaData?.gravado15)],
          ["GRAVADO 18%", formatMoney(facturaData?.gravado18)],
          ["IMPT 15%", formatMoney(facturaData?.impuesto15)],
          ["IMPT 18%", formatMoney(facturaData?.impuesto18)],
        ]
      );

    // Gran Total (con estilo bold)
    encoder
      .rule()
      .table(
        [
          { width: 28, align: "left" },
          { width: 14, align: "right" },
        ],
        [
          [
            (encoder) => encoder.bold(true).text("GRAN TOTAL").bold(false),
            (encoder) => encoder.bold(true).text(formatMoney(granTotal)).bold(false),
          ],
        ]
      );

    // Propina (solo si existe y es mayor a 0)
    if (propina > 0) {
      encoder
        .newline()
        .table(
          [
            { width: 28, align: "left" },
            { width: 14, align: "right" },
          ],
          [
            ["PROPINA", formatMoney(propina)],
          ]
        )
        .rule()
        .table(
          [
            { width: 28, align: "left" },
            { width: 14, align: "right" },
          ],
          [
            [
              (encoder) => encoder.bold(true).text("TOTAL C/PROPINA").bold(false),
              (encoder) => encoder.bold(true).text(formatMoney(totalConPropina)).bold(false),
            ],
          ]
        );
    }

    // Métodos de pago
    if (metodosPago.length > 0) {
      encoder
        .newline()
        .table(
          [
            { width: 28, align: "left" },
            { width: 14, align: "right" },
          ],
          metodosPago.map((pago) => [
            (pago.formaPago || "-").toUpperCase(),
            formatMoney(pago.montoRecibido),
          ])
        );
    }

    // ========== LETRAS ==========
    if (facturaData?.letras) {
      encoder
        .newline()
        .align("center")
        .text(facturaData.letras)
        .newline();
    }

    // ========== ETIQUETAS DE COPIA ==========
    encoder
      .newline()
      .align("center")
      .text("ORIGINAL - CLIENTE")
      .newline()
      .text("COPIA - CONTRIBUYENTE EMISOR")
      .newline()
      .newline()

      // ========== CAMPOS FISCALES VACÍOS ==========
      .align("left")
      .text("CONST. DE REG DE EXONERADOS_______________")
      .newline()
      .text("ORDEN DE COMPRA EXENTA____________________")
      .newline()
      .text("NO DE REG S.A.G___________________________")
      .newline()
      .newline()

      // ========== PIE DE PÁGINA ==========
      .align("center")
      .text("================================")
      .newline()
      .bold(true)
      .text("GRACIAS POR SU COMPRA")
      .bold(false)
      .newline()
      .text("PARA RECLAMOS PRESENTAR FACTURA")
      .newline()
      .text("LO ESPERAMOS PRONTO!")
      .newline();

    if (sucursal?.telefono) {
      encoder.text(sucursal.telefono).newline();
    }

    encoder
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

/**
 * Genera e imprime un comprobante de Apertura de Caja usando ESC/POS
 * @param {Object} datos - Datos de la apertura
 * @returns {Promise} Resultado de la impresión
 */
export const generarAperturaCaja = async (datos) => {
  try {
    console.log("generarAperturaCaja datos:", datos);
    if (!datos || Object.keys(datos).length === 0) {
      return ValidarRespuestaSp(
        TypeResultErrorControlado,
        "Error: datos de apertura están vacíos",
        null
      );
    }

    if (!datos.ip) {
      return ValidarRespuestaSp(
        TypeResultErrorControlado,
        "Error: IP de impresora no proporcionada",
        null
      );
    }

    const printer = new NetworkPrinter({
      host: datos.ip,
      port: 9100,
    });

    const encoder = new ReceiptPrinterEncoder({
      language: "esc-pos",
      width: 42,
    });

    const formatMoney = (value) => `L ${Number(value || 0).toFixed(2)}`;

    encoder
      .initialize()
      .raw([0x1b, 0x45, 0x01]) // Modo enfatizado
      .raw([0x1b, 0x47, 0x01]) // Double-strike
      .codepage("auto")

      // ========== ENCABEZADO ==========
      .bold(true)
      .align("center")
      .newline()
      .text("APERTURA DE CAJA")
      .bold(false)
      .newline()
      .text("================================")
      .newline()
      .newline()

      // ========== INFORMACIÓN ==========
      .align("left")
      .bold(true)
      .text("INFORMACION")
      .bold(false)
      .newline()
      .rule()
      .table(
        [
          { width: 14, align: "left" },
          { width: 28, align: "right" },
        ],
        [
          ["Cajero:", datos.nombreCajero || "-"],
          ["Caja:", `#${datos.numeroCaja || "-"}`],
          ["Sucursal:", datos.nombreSucursal || "-"],
          ["Fecha/Hora:", datos.fechaHora || "-"],
        ]
      )
      .newline();

    // Talonario (si existe)
    if (datos.rangoTalonario || datos.numeroFacturaInicial) {
      encoder
        .bold(true)
        .text("TALONARIO")
        .bold(false)
        .newline()
        .rule();

      if (datos.rangoTalonario) {
        encoder.table(
          [
            { width: 14, align: "left" },
            { width: 28, align: "right" },
          ],
          [["Rango:", datos.rangoTalonario]]
        );
      }
      if (datos.numeroFacturaInicial) {
        encoder.table(
          [
            { width: 14, align: "left" },
            { width: 28, align: "right" },
          ],
          [["Fact. Inicial:", datos.numeroFacturaInicial]]
        );
      }
      encoder.newline();
    }

    // ========== MONTO INICIAL ==========
    encoder
      .bold(true)
      .text("EFECTIVO INICIAL")
      .bold(false)
      .newline()
      .rule()
      .table(
        [
          { width: 20, align: "left" },
          { width: 22, align: "right" },
        ],
        [
          [
            (encoder) => encoder.bold(true).text("MONTO INICIAL:").bold(false),
            (encoder) => encoder.bold(true).text(formatMoney(datos.montoInicial)).bold(false),
          ],
        ]
      )
      .newline()

      // ========== PIE DE PÁGINA ==========
      .align("center")
      .text("--------------------------------")
      .newline()
      .newline()
      .text("Firma del Cajero")
      .newline()
      .newline()
      .newline()
      .text("________________________________")
      .newline()
      .newline(5)
      .cut();

    const receipt = encoder.encode();

    return new Promise((resolve, reject) => {
      let connectionTimeout = setTimeout(() => {
        if (printer.socket) {
          printer.socket.destroy();
        }
        reject(
          ValidarRespuestaSp(
            TypeResultErrorNoControlado,
            "Error de conexión con la impresora: Tiempo de espera agotado",
            null
          )
        );
      }, 5000);

      printer.addEventListener("connected", async () => {
        clearTimeout(connectionTimeout);
        console.log("Connected to printer for apertura");

        try {
          await printer.print(receipt);
          await printer.disconnect();
          resolve(
            ValidarRespuestaSp(
              TypeResultExitoso,
              "Comprobante de apertura impreso correctamente",
              null
            )
          );
        } catch (error) {
          reject(
            ValidarRespuestaSp(
              TypeResultErrorControlado,
              `Error al imprimir comprobante de apertura: ${error.message}`,
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
            `Error de conexión con la impresora: ${error.message}`,
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
    console.error("Error en generarAperturaCaja:", error);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "Error al generar comprobante de apertura: " + error.message
    );
  }
};

/**
 * Genera e imprime un comprobante de Cierre de Caja usando ESC/POS
 * @param {Object} datos - Datos del cierre
 * @returns {Promise} Resultado de la impresión
 */
export const generarCierreCaja = async (datos) => {
  try {
    console.log("generarCierreCaja datos:", datos);
    if (!datos || Object.keys(datos).length === 0) {
      return ValidarRespuestaSp(
        TypeResultErrorControlado,
        "Error: datos de cierre están vacíos",
        null
      );
    }

    if (!datos.ip) {
      return ValidarRespuestaSp(
        TypeResultErrorControlado,
        "Error: IP de impresora no proporcionada",
        null
      );
    }

    const printer = new NetworkPrinter({
      host: datos.ip,
      port: 9100,
    });

    const encoder = new ReceiptPrinterEncoder({
      language: "esc-pos",
      width: 42,
    });

    const formatMoney = (value) => `L ${Number(value || 0).toFixed(2)}`;
    const resumen = datos.resumen || {};

    encoder
      .initialize()
      .raw([0x1b, 0x45, 0x01])
      .raw([0x1b, 0x47, 0x01])
      .codepage("auto")

      // ========== ENCABEZADO ==========
      .bold(true)
      .align("center")
      .newline()
      .text("CIERRE DE CAJA")
      .bold(false)
      .newline()
      .text("================================")
      .newline()
      .newline()

      // ========== INFORMACIÓN GENERAL ==========
      .align("left")
      .bold(true)
      .text("INFORMACION")
      .bold(false)
      .newline()
      .rule()
      .table(
        [
          { width: 14, align: "left" },
          { width: 28, align: "right" },
        ],
        [
          ["Cajero:", datos.nombreCajero || "-"],
          ["Caja:", `#${datos.numeroCaja || "-"}`],
          ["Sucursal:", datos.nombreSucursal || "-"],
          ["Fecha/Hora:", datos.fechaHora || "-"],
        ]
      )
      .newline();

    // ========== FACTURAS EMITIDAS ==========
    encoder
      .bold(true)
      .text("FACTURAS EMITIDAS")
      .bold(false)
      .newline()
      .rule();

    if (datos.rangoTalonario) {
      encoder.table(
        [
          { width: 14, align: "left" },
          { width: 28, align: "right" },
        ],
        [["Rango Talon.:", datos.rangoTalonario]]
      );
    }

    if ((datos.cantidadFacturas || 0) > 0) {
      encoder.table(
        [
          { width: 14, align: "left" },
          { width: 28, align: "right" },
        ],
        [
          ["Desde:", datos.primeraFactura || "-"],
          ["Hasta:", datos.ultimaFactura || "-"],
        ]
      );
    } else {
      encoder.table(
        [
          { width: 14, align: "left" },
          { width: 28, align: "right" },
        ],
        [["Estado:", "Sin facturas"]]
      );
    }

    encoder.table(
      [
        { width: 14, align: "left" },
        { width: 28, align: "right" },
      ],
      [["Total Fact.:", String(datos.cantidadFacturas || 0)]]
    );

    if (datos.facturasRestantes !== null && datos.facturasRestantes !== undefined) {
      encoder.table(
        [
          { width: 14, align: "left" },
          { width: 28, align: "right" },
        ],
        [["Restantes:", String(datos.facturasRestantes)]]
      );
    }

    encoder.newline();

    // ========== RESUMEN DE VENTAS ==========
    encoder
      .bold(true)
      .text("RESUMEN DE VENTAS")
      .bold(false)
      .newline()
      .rule()
      .table(
        [
          { width: 24, align: "left" },
          { width: 18, align: "right" },
        ],
        [
          ["Monto Inicial:", formatMoney(resumen.montoInicial)],
          ["Ventas Efectivo:", formatMoney(resumen.totalVentasEfectivo)],
          ["Ventas Tarjeta:", formatMoney(resumen.totalVentasTarjeta)],
          ["Transferencias:", formatMoney(resumen.totalVentasTransferencia)],
        ]
      );

    if (resumen.totalVentasOtros > 0) {
      encoder.table(
        [
          { width: 24, align: "left" },
          { width: 18, align: "right" },
        ],
        [["Otros Métodos:", formatMoney(resumen.totalVentasOtros)]]
      );
    }

    encoder.newline();

    // Movimientos
    if (resumen.totalIngresos > 0 || resumen.totalGastos > 0 || resumen.totalRetiros > 0) {
      encoder
        .bold(true)
        .text("MOVIMIENTOS")
        .bold(false)
        .newline()
        .rule();

      if (resumen.totalIngresos > 0) {
        encoder.table(
          [
            { width: 24, align: "left" },
            { width: 18, align: "right" },
          ],
          [["(+) Ingresos:", formatMoney(resumen.totalIngresos)]]
        );
      }
      if (resumen.totalGastos > 0) {
        encoder.table(
          [
            { width: 24, align: "left" },
            { width: 18, align: "right" },
          ],
          [["(-) Gastos:", `-${formatMoney(resumen.totalGastos)}`]]
        );
      }
      if (resumen.totalRetiros > 0) {
        encoder.table(
          [
            { width: 24, align: "left" },
            { width: 18, align: "right" },
          ],
          [["(-) Retiros:", `-${formatMoney(resumen.totalRetiros)}`]]
        );
      }
      encoder.newline();
    }

    // ========== CUADRE DE CAJA ==========
    encoder
      .bold(true)
      .text("CUADRE DE CAJA")
      .bold(false)
      .newline()
      .rule()
      .table(
        [
          { width: 24, align: "left" },
          { width: 18, align: "right" },
        ],
        [
          ["Efectivo Esperado:", formatMoney(resumen.montoEsperado)],
          ["Efectivo Contado:", formatMoney(datos.montoReal)],
        ]
      )
      .rule();

    const diferencia = datos.diferencia || 0;
    const diferenciaTexto = diferencia > 0 ? " (S)" : diferencia < 0 ? " (F)" : " (=)";

    encoder
      .table(
        [
          { width: 24, align: "left" },
          { width: 18, align: "right" },
        ],
        [
          [
            (encoder) => encoder.bold(true).text("DIFERENCIA:").bold(false),
            (encoder) => encoder.bold(true).text(`${formatMoney(diferencia)}${diferenciaTexto}`).bold(false),
          ],
        ]
      )
      .newline();

    // Observaciones
    if (datos.observaciones) {
      encoder
        .bold(true)
        .text("OBSERVACIONES")
        .bold(false)
        .newline()
        .rule()
        .text(datos.observaciones)
        .newline()
        .newline();
    }

    // ========== PIE DE PÁGINA ==========
    encoder
      .align("center")
      .text("S=Sobrante | F=Faltante | ==Cuadrado")
      .newline()
      .newline()
      .text("Firma del Cajero")
      .newline()
      .newline()
      .text("________________________________")
      .newline()
      .newline()
      .text("Firma del Supervisor")
      .newline()
      .newline()
      .text("________________________________")
      .newline()
      .newline(5)
      .cut();

    const receipt = encoder.encode();

    return new Promise((resolve, reject) => {
      let connectionTimeout = setTimeout(() => {
        if (printer.socket) {
          printer.socket.destroy();
        }
        reject(
          ValidarRespuestaSp(
            TypeResultErrorNoControlado,
            "Error de conexión con la impresora: Tiempo de espera agotado",
            null
          )
        );
      }, 5000);

      printer.addEventListener("connected", async () => {
        clearTimeout(connectionTimeout);
        console.log("Connected to printer for cierre");

        try {
          await printer.print(receipt);
          await printer.disconnect();
          resolve(
            ValidarRespuestaSp(
              TypeResultExitoso,
              "Comprobante de cierre impreso correctamente",
              null
            )
          );
        } catch (error) {
          reject(
            ValidarRespuestaSp(
              TypeResultErrorControlado,
              `Error al imprimir comprobante de cierre: ${error.message}`,
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
            `Error de conexión con la impresora: ${error.message}`,
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
    console.error("Error en generarCierreCaja:", error);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "Error al generar comprobante de cierre: " + error.message
    );
  }
};
