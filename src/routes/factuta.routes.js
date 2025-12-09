import express from "express";
import { generarFacturaHandler } from "../controllers/factura.controller.js";
import { obtenerInformacionFacturaHandler } from "../controllers/factura.controller.js";

const router = express.Router();

/**
 * @swagger
 * /generar-factura:
 *   post:
 *     summary: Genera una factura y la imprime en una impresora de red.
 *     description: |
 *       Este endpoint recibe los datos de una factura y la imprime en una impresora de red
 *       utilizando el protocolo ESC/POS.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numeroFactura:
 *                 type: string
 *                 description: Número de la factura.
 *                 example: "00115001"
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la factura (formato YYYY-MM-DD).
 *                 example: "2024-02-20"
 *               hora:
 *                 type: string
 *                 description: Hora de la factura (formato HH:MM).
 *                 example: "14:35"
 *               cajero:
 *                 type: string
 *                 description: Nombre del cajero que genera la factura.
 *                 example: "Juan Pérez"
 *               caja:
 *                 type: string
 *                 description: Número de la caja.
 *                 example: "001"
 *               orden:
 *                 type: string
 *                 description: Número de la orden.
 *                 example: "ORD-20240220-001"
 *               rtnCliente:
 *                 type: string
 *                 description: RTN del cliente.
 *                 example: "08011998123456"
 *               articulos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     descripcion:
 *                       type: string
 *                       description: Descripción del artículo.
 *                       example: "WOMAN JEAN 1 x 100.00"
 *                     importe:
 *                       type: number
 *                       format: float
 *                       description: Precio del artículo.
 *                       example: 100.00
 *               importeExonerado:
 *                 type: number
 *                 format: float
 *                 description: Importe exonerado de impuestos.
 *                 example: 0.00
 *               descuentos:
 *                 type: number
 *                 format: float
 *                 description: Descuentos aplicados.
 *                 example: 0.00
 *               totalEvento:
 *                 type: number
 *                 format: float
 *                 description: Total del evento.
 *                 example: 100.00
 *               gravado15:
 *                 type: number
 *                 format: float
 *                 description: Monto gravado al 15%.
 *                 example: 0.00
 *               gravado18:
 *                 type: number
 *                 format: float
 *                 description: Monto gravado al 18%.
 *                 example: 0.00
 *               impuesto15:
 *                 type: number
 *                 format: float
 *                 description: Impuesto calculado al 15%.
 *                 example: 0.00
 *               impuesto18:
 *                 type: number
 *                 format: float
 *                 description: Impuesto calculado al 18%.
 *                 example: 0.00
 *               granTotal:
 *                 type: number
 *                 format: float
 *                 description: Total general de la factura.
 *                 example: 100.00
 *               efectivoRecibido:
 *                 type: number
 *                 format: float
 *                 description: Efectivo recibido.
 *                 example: 100.00
 *               cambioEfectivo:
 *                 type: number
 *                 format: float
 *                 description: Cambio devuelto.
 *                 example: 0.00
 *               letras:
 *                 type: string
 *                 description: Monto total en letras.
 *                 example: "CIEN CON 00/100 CENTAVOS"
 *               fechaLimiteEmision:
 *                 type: string
 *                 format: date
 *                 description: Fecha límite de emisión de la factura (formato YYYY-MM-DD).
 *                 example: "2025-06-20"
 *               rangoAutorizado:
 *                 type: string
 *                 description: Rango autorizado para la factura.
 *                 example: "00115001 Hasta 00145000"
 *               cai:
 *                 type: string
 *                 description: Código de Autorización de Impresión (CAI).
 *                 example: "16D1EF-0329FB-9E4C90-4B58EF128940-85"
 *               ip:
 *                 type: string
 *                 description: Dirección IP de la impresora de red.
 *                 example: "192.168.1.100"
 *     responses:
 *       200:
 *         description: Factura generada e impresa correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                 typeResult:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: "Factura impresa correctamente"
 *       400:
 *         description: Error controlado (por ejemplo, datos inválidos).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: null
 *                 typeResult:
 *                   type: integer
 *                   example: 2
 *                 message:
 *                   type: string
 *                   example: "Error al imprimir la factura"
 *       500:
 *         description: Error no controlado (por ejemplo, fallo de conexión con la impresora).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: null
 *                 typeResult:
 *                   type: integer
 *                   example: 3
 *                 message:
 *                   type: string
 *                   example: "Error de conexión con la impresora"
 */


/**
 * @swagger
 * /ObtenerInformacionFactura:
 *   get:
 *     summary: Obtiene la información completa de una factura.
 *     description: |
 *       Este endpoint obtiene toda la información relacionada con una factura,
 *       incluyendo detalles de la factura, artículos, cajero, caja, etc.
 *     parameters:
 *       - in: query
 *         name: NumeroFactura
 *         required: true
 *         schema:
 *           type: number
 *         description: Número de la factura a consultar.
 *         example: 231
 *     responses:
 *       200:
 *         description: Información de la factura obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     numeroFactura:
 *                       type: string
 *                       example: "00115001"
 *                     fecha:
 *                       type: string
 *                       format: date
 *                       example: "2024-02-20"
 *                     hora:
 *                       type: string
 *                       example: "14:35"
 *                     cajero:
 *                       type: string
 *                       example: "Juan Pérez"
 *                     caja:
 *                       type: string
 *                       example: "001"
 *                     orden:
 *                       type: string
 *                       example: "ORD-20240220-001"
 *                     rtnCliente:
 *                       type: string
 *                       example: "08011998123456"
 *                     articulos:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           descripcion:
 *                             type: string
 *                             example: "WOMAN JEAN 1 x 100.00"
 *                           importe:
 *                             type: number
 *                             format: float
 *                             example: 100.00
 *                     importeExonerado:
 *                       type: number
 *                       format: float
 *                       example: 0.00
 *                     descuentos:
 *                       type: number
 *                       format: float
 *                       example: 0.00
 *                     totalEvento:
 *                       type: number
 *                       format: float
 *                       example: 100.00
 *                     gravado15:
 *                       type: number
 *                       format: float
 *                       example: 0.00
 *                     gravado18:
 *                       type: number
 *                       format: float
 *                       example: 0.00
 *                     impuesto15:
 *                       type: number
 *                       format: float
 *                       example: 0.00
 *                     impuesto18:
 *                       type: number
 *                       format: float
 *                       example: 0.00
 *                     granTotal:
 *                       type: number
 *                       format: float
 *                       example: 100.00
 *                     efectivoRecibido:
 *                       type: number
 *                       format: float
 *                       example: 100.00
 *                     cambioEfectivo:
 *                       type: number
 *                       format: float
 *                       example: 0.00
 *                     letras:
 *                       type: string
 *                       example: "CIEN CON 00/100 CENTAVOS"
 *                     fechaLimiteEmision:
 *                       type: string
 *                       format: date
 *                       example: "2025-06-20"
 *                     rangoAutorizado:
 *                       type: string
 *                       example: "00115001 Hasta 00145000"
 *                     cai:
 *                       type: string
 *                       example: "16D1EF-0329FB-9E4C90-4B58EF128940-85"
 *                     ip:
 *                       type: string
 *                       example: "192.168.1.100"
 *                 typeResult:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Información de la factura obtenida correctamente."
 *       400:
 *         description: Error controlado (por ejemplo, número de factura no proporcionado).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: null
 *                 typeResult:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: "Error: El número de factura es requerido."
 *       500:
 *         description: Error no controlado (por ejemplo, fallo en la base de datos).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: null
 *                 typeResult:
 *                   type: integer
 *                   example: 2
 *                 message:
 *                   type: string
 *                   example: "Error al obtener la información de la factura."
 */


router.post("/generar-factura", generarFacturaHandler);
router.get("/ObtenerInformacionFactura", obtenerInformacionFacturaHandler);

export default router;