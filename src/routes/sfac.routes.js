import express from "express";
import {
  CrearDescuentoFactura,
  CrearDetalleFacturaController,
  CrearFacturaController,
  CrearInventarioController,
  EditarDescuentoFactura,
  EditarDetalleFacturaController,
  EditarFacturaController,
  EditarInventarioController,
  EliminarDescuentoFactura,
  EliminarDetalleFacturaController,
  EliminarInventarioController,
  ObtenerDescuentoFactura,
  ObtenerDetalleFacturaController,
  ObtenerFacturasController,
  ObtenerInventarioController,
  ObtenerDetalleFormasPagoController,
  CrearDetalleFormasPagoController,
  EditarDetalleFormasPagoController,
  EliminarDetalleFormasPagoController,
  ActivarInventarioController,
  ObtenerTotalProductosController,
  ObtenerTalonariosController,
  CrearTalonarioController,
  EditarTalonarioController,
  EliminarTalonarioController,
  ObtenerDetalleTalonarioController,
  CrearDetalleTalonarioController,
  EditarDetalleTalonarioController,
  EliminarDetalleTalonarioController,
  CrearCajaSucursalController,
  EditarCajaSucursalController,
  EliminarCajaSucursalController,
  ObtenerCajasSucursalController,
  ObtenerTotalFacturasController,
  //productosCombo
  ObtenerProductosComboController,
  ObtenerExtrasProductosController,
  ObtenerVariantesProductosController,

  //Ordenes
  ObtenerOrdenesController,
  CrearOrdenesController,
  EditarOrdenesController,
  ObtenerOrdenesUsuarioController,
  CrearFacturaControllerWEB,
  CrearDetalleFacturaControllerWEB,
  CerrarOrdenesController,
  ObtenerInventarioWEBController,
  ActualizarEstadoOrdenesController,
  AsignarOrdenFacturaController,
} from "../controllers/sfac.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { privilegedAuthMiddleware } from "../middlewares/privilegedAuthMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Facturas:
 *       type: object
 *       required:
 *         - CodigoUsuario
 *       properties:
 *         CodigoFactura:
 *           type: number
 *           description: Código de la factura
 *         CodigoUsuario:
 *           type: number
 *           description: Código del usuario que consume el servicio
 *         CodigoEstado:
 *           type: number
 *           description: Código del estado de la factura
 *         CodigoPersona:
 *           type: number
 *           description: Código del cliente
 *         CodigoMoneda:
 *           type: integer
 *           description: Código de la moneda
 *         NoOrdenCompraExenta:
 *           type: double
 *           description: Número de orden de compra exenta
 *         NoConstanciaRegistroExonerado:
 *           type: integer
 *           description: Número de constancia de registro exonerado
 *         CodigoDescuento:
 *           type: integer
 *           description: Código del descuento
 *         CodigoFormaPago:
 *           type: integer
 *           description: Código de la forma de pago
 *         Pagina:
 *           type: integer
 *           description: Página a consultar
 *         TamanoPagina:
 *           type: integer
 *           description: Cantidad de registros por página
 *       example:
 *        CodigoFactura: 1
 *        CodigoUsuario: 2
 *        CodigoEstado: 3
 *        CodigoPersona: 4
 *        CodigoMoneda: 5
 *        NoOrdenCompraExenta: "1234"
 *        NoConstanciaRegistroExonerado: "5647"
 *        CodigoDescuento: 6
 *        CodigoFormaPago: 7
 *        Pagina: 1
 *        TamanoPagina: 10
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DetalleFactura:
 *       type: object
 *       required:
 *         - CodigoUsuario
 *       properties:
 *         CodigoDetalle:
 *           type: number
 *           description: Código del detalle de la factura
 *         CodigoFactura:
 *           type: number
 *           description: Código de la factura
 *         CodigoInventario:
 *           type: number
 *           description: Código del inventario/artículo
 *         Cantidad:
 *           type: integer
 *           description: Cantidad del inventario/artículo
 *         PrecioVenta:
 *           type: double
 *           description: Precio del inventario/artículo
 *         CodigoUsuario:
 *           type: integer
 *           description: Código del usuario que consume el servicio
 *       example:
 *         CodigoDetalle: 2
 *         CodigoFactura: 1
 *         CodigoInventario: 1
 *         Cantidad: 5
 *         PrecioVenta: 100.01
 *         CodigoUsuario:  1
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Inventario:
 *       type: object
 *       required:
 *         - CodigoInventario
 *       properties:
 *         CodigoInventario:
 *           type: number
 *           description: Código del inventario
 *         Nombre:
 *           type: number
 *           description: Nombre del inventario
 *         FKCodigoTipoInventario:
 *           type: number
 *           description: Código del tipo de inventario
 *         Cantidad:
 *           type: integer
 *           description: Cantidad del inventario
 *         FechaExpiracion:
 *           type: datetime
 *           description: Fecha en que expira el inventario
 *         FKCodigoUbicacion:
 *           type: number
 *           description: Código de la ubicación donde se encuentra el inventario
 *         PrecioUnitario:
 *           type: double
 *           description: Costo de compra por unidad del inventario
 *         PrecioVenta:
 *           type: double
 *           description: Precio del inventario
 *         FKCodigoEstado:
 *           type: number
 *           description: Código del estado del inventario
 *         FKCodigoTipoImpuesto:
 *           type: number
 *           description: Código del tipo de impuesto que aplica para el inventario
 *         CodigoUsuario:
 *           type: integer
 *           description: Código del usuario que consume el servicio
 *       example:
 *         CodigoInventario: 1
 *         Nombre: 'SALSA'
 *         CodigoTipoInventario: 1
 *         Cantidad: 5
 *         FechaExpiracion: '2025-02-19'
 *         FKCodigoUbicacion: 2
 *         PrecioUnitario: 300.25
 *         PrecioVenta: 400.30
 *         FKCodigoEstado: 1
 *         FKCodigoTipoImpuesto: 1
 *         CodigoUsuario:  1
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Descuentos:
 *       type: object
 *       required:
 *         - CodigoUsuario
 *       properties:
 *         CodigoDescuentoFactura:
 *           type: number
 *           description: Código del descuento de la factura
 *         CodigoDescuento:
 *           type: number
 *           description: Código del descuento
 *         CodigoFactura:
 *           type: number
 *           description: Código de la factura
 *         CodigoUsuario:
 *           type: number
 *           description: Código del usuario que consume el servicio
 *       example:
 *         CodigoDescuentoFactura: 1
 *         CodigoDescuento: 1
 *         CodigoFactura: 1
 *         CodigoUsuario: 1
 */

/**
 * @swagger
 * tags:
 *   name: SFAC
 *   description: Servicios para la gestión de las entidades de facturación
 */

/**
 * @swagger
 * /SFAC/ObtenerFacturas:
 *   get:
 *     summary: Servicio para obtener un listado de facturas o una en específico
 *     tags: [SFAC]
 *     parameters:
 *       - in: query
 *         name: CodigoFactura
 *         schema:
 *           type: integer
 *         required: false
 *         description: El código de la factura a obtener, no se envía para obtener más de una factura
 *         example: 1
 *       - in: query
 *         name: Pagina
 *         schema:
 *           type: integer
 *         required: false
 *         description: Número de página a obtener
 *         example: 1
 *       - in: query
 *         name: TamanoPagina
 *         schema:
 *           type: integer
 *         required: false
 *         description: Cantidad de registros por página
 *         example: 10
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */


/**
 * @swagger
 * /SFAC/ObtenerFacturas/totalFacturas:
 *   get:
 *     summary: Servicio obtener el total de las facturas para la paginacion
 *     tags: [SFAC]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */



/**
 * @swagger
 * /SFAC/CrearFacturaWEB:
 *   post:
 *     summary: Servicio para crear el encabezado de una factura desde la app web
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Facturas'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/AsignarOrdenFactura:
 *   put:
 *     summary: Servicio para asignar una orden a una factura
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Facturas'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */


/**
 * @swagger
 * /SFAC/EditarFactura:
 *   put:
 *     summary: Servicio para editar el encabezado de una factura
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Facturas'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/ObtenerDetalleFactura:
 *   get:
 *     summary: Servicio para obtener un listado de artículos de una factura o un artículo en específico
 *     tags: [SFAC]
 *     parameters:
 *       - in: query
 *         name: CodigoFactura
 *         schema:
 *           type: integer
 *         required: false
 *         description: El código de la factura a obtener, no se envía para obtener solo un artículo de la factura
 *         example: 1
 *       - in: query
 *         name: CodigoDetalle
 *         schema:
 *           type: integer
 *         required: false
 *         description: El código del detalle a obtener, no se envía para obtener todos los artículos de la factura
 *         example: 1
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/CrearDetalleFactura:
 *   post:
 *     summary: Servicio para crear el detalle de una factura
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleFactura'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/EditarDetalleFactura:
 *   put:
 *     summary: Servicio para editar el detalle de una factura
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleFactura'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/EliminarDetalleFactura:
 *   delete:
 *     summary: Eliminar el detalle de una factura
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleFactura'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/ObtenerInventario:
 *   get:
 *     summary: Servicio para obtener un listado del inventario o un artículo en específico
 *     tags: [SFAC]
 *     parameters:
 *       - in: query
 *         name: CodigoInventario
 *         schema:
 *           type: integer
 *         required: false
 *         description: El código del inventario a obtener, no se envía para obtener más de un artículo
 *         example: 1
 *       - in: query
 *         name: FKCodigoTipoInventario
 *         schema:
 *           type: integer
 *         required: false
 *         description: El código del tipo de inventario a obtener, no se envía para obtener todos los tipos
 *         example: 1
  *       - in: query
 *         name: FKCodigoCategoriaInventario
 *         schema:
 *           type: integer
 *         required: false
 *         description: El código de la categoria de inventario a obtener, no se envía para obtener todos las categorias
 *         example: 1
 *       - in: query
 *         name: Pagina
 *         schema:
 *           type: integer
 *         required: false
 *         description: Número de página a obtener
 *         example: 1
  *       - in: query
 *         name: Busqueda
 *         schema:
 *           type: string
 *         required: false
 *         description: Busqueda
 *         example: Jugo
 *       - in: query
 *         name: TamanoPagina
 *         schema:
 *           type: integer
 *         required: false
 *         description: Cantidad de registros por página
 *         example: 10
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */


/**
 * @swagger
 * /SFAC/ObtenerInventario/total-productos:
 *   get:
 *     summary: Servicio obtener el total del inventario
 *     tags: [SFAC]
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */


/**
 * @swagger
 * /SFAC/CrearInventario:
 *   post:
 *     summary: Servicio para crear inventario
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventario'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/EditarInventario:
 *   put:
 *     summary: Servicio para editar inventario
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventario'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/EliminarInventario:
 *   delete:
 *     summary: Servicio para eliminar inventario (Eliminación lógica)
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventario'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/ActivarInventario:
 *   delete:
 *     summary: Servicio para activar inventario
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventario'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */


/**
 * @swagger
 * /SFAC/ObtenerDescuentoFactura:
 *   get:
 *     summary: Servicio para obtener un listado de descuentos de una factura
 *     tags: [SFAC]
 *     parameters:
 *       - in: query
 *         name: CodigoDescuentoFactura
 *         schema:
 *           type: number
 *         required: false
 *         description: Código del descuento de la factura, no se envía para obtener todos los descuentos de la factura pero debe enviarse el CódigoFactura
 *         example: 1
 *       - in: query
 *         name: CodigoFactura
 *         schema:
 *           type: integer
 *         required: false
 *         description: Código de la factura
 *         example: 1
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/CrearDescuentoFactura:
 *   post:
 *     summary: Servicio para crear descuentos a una factura
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Descuentos'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/EditarDescuentoFactura:
 *   put:
 *     summary: Servicio para editar los descuentos de una factura
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Descuentos'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/EliminarDescuentoFactura:
 *   delete:
 *     summary: Servicio para eliminar los descuentos de una factura
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Descuentos'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DetalleFormasPago:
 *       type: object
 *       properties:
 *         CodigoDetalle:
 *           type: integer
 *           description: Código del detalle (solo para editar o eliminar)
 *           example: 1
 *         CodigoFactura:
 *           type: integer
 *           description: Código de la factura asociada
 *           example: 123
 *         CodigoFormaPago:
 *           type: integer
 *           description: Código de la forma de pago
 *           example: 456
 *         MontoRecibido:
 *           type: number
 *           format: double
 *           description: Monto recibido en la forma de pago
 *           example: 100.00
 *         Referencia:
 *           type: string
 *           description: Referencia de la forma de pago
 *           example: "Referencia123"
 *         CodigoUsuario:
 *           type: integer
 *           description: Código del usuario que realiza la operación
 *           example: 789
 *       required:
 *         - CodigoFactura
 *         - CodigoFormaPago
 *         - MontoRecibido
 */

/**
 * @swagger
 * components:
 *   responses:
 *     StandardResponse200:
 *       description: Respuesta exitosa
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: true
 *               message:
 *                 type: string
 *                 example: "Operación exitosa"
 *               data:
 *                 type: object
 *     StandardResponse400:
 *       description: Error en la solicitud
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Error en los datos enviados"
 *     StandardResponse500:
 *       description: Error interno del servidor
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Error interno del servidor"
 */

/**
 * @swagger
 * /SFAC/ObtenerDetalleFormasPago:
 *   get:
 *     summary: Servicio para obtener un listado de formas de pago de una factura o una forma de pago en específico
 *     tags: [SFAC]
 *     parameters:
 *       - in: query
 *         name: CodigoFactura
 *         schema:
 *           type: integer
 *         required: false
 *         description: El código de la factura a obtener, no se envía para obtener solo una forma de pago de la factura
 *         example: 1
 *       - in: query
 *         name: CodigoDetalle
 *         schema:
 *           type: integer
 *         required: false
 *         description: El código del detalle a obtener, no se envía para obtener todas las formas de pago de la factura
 *         example: 1
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/CrearDetalleFormasPago:
 *   post:
 *     summary: Servicio para crear el detalle de una forma de pago en una factura
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleFormasPago'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/EditarDetalleFormasPago:
 *   put:
 *     summary: Servicio para editar el detalle de una forma de pago en una factura
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleFormasPago'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/EliminarDetalleFormasPago:
 *   delete:
 *     summary: Servicio para eliminar el detalle de una forma de pago en una factura
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetalleFormasPago'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/ObtenerTalonarios:
 *   get:
 *     summary: Servicio para obtener un listado de talonarios o uno en específico
 *     tags: [SFAC]
 *     parameters:
 *       - in: query
 *         name: CodigoTalonario
 *         schema:
 *           type: integer
 *         required: false
 *         description: Código del talonario a obtener (no se envía para obtener todos los talonarios)
 *         example: 1
 *       - in: query
 *         name: Busqueda
 *         schema:
 *           type: string
 *         required: false
 *         description: Texto de búsqueda para filtrar talonarios
 *         example: "Talonario1"
 *       - in: query
 *         name: Pagina
 *         schema:
 *           type: integer
 *         required: false
 *         description: Número de página a consultar
 *         example: 1
 *       - in: query
 *         name: TamanoPagina
 *         schema:
 *           type: integer
 *         required: false
 *         description: Cantidad de registros por página
 *         example: 10
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/CrearTalonario:
 *   post:
 *     summary: Servicio para crear un talonario
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SFAC'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/EditarTalonario:
 *   put:
 *     summary: Servicio para editar un talonario
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SFAC'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/EliminarTalonario:
 *   delete:
 *     summary: Servicio para eliminar un talonario
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SFAC'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */


/**
 * @swagger
 * /SFAC/ObtenerDetalleTalonario:
 *   get:
 *     summary: Obtener detalles de talonario
 *     tags: [SFAC]
 *     parameters:
 *       - in: query
 *         name: CodigoDetalleTalonario
 *         schema:
 *           type: integer
 *         required: false
 *         description: Código del detalle a obtener (opcional)
 *       - in: query
 *         name: CodigoTalonario
 *         schema:
 *           type: integer
 *         required: false
 *         description: Código del talonario padre (opcional)
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/CrearDetalleTalonario:
 *   post:
 *     summary: Crear nuevo detalle de talonario
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SFAC'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/EditarDetalleTalonario:
 *   put:
 *     summary: Editar detalle de talonario
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SFAC'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/EliminarDetalleTalonario:
 *   delete:
 *     summary: Eliminar detalle de talonario
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SFAC'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/ObtenerCajasSucursal:
 *   get:
 *     summary: Obtener listado de cajas por sucursal o una específica
 *     tags: [SFAC]
 *     parameters:
 *       - in: query
 *         name: CodigoCajaSucursal
 *         schema:
 *           type: integer
 *         required: false
 *         description: Código de la caja a obtener (opcional)
 *       - in: query
 *         name: FKCodigoSucursal
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filtrar por código de sucursal
 *     responses:
 *       200:
 *         description: Listado de cajas por sucursal
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CajaSucursal'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/CrearCajaSucursal:
 *   post:
 *     summary: Crear una nueva caja sucursal
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CajaSucursal'
 *     responses:
 *       201:
 *         description: Caja sucursal creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CajaSucursal'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/EditarCajaSucursal:
 *   put:
 *     summary: Actualizar una caja sucursal existente
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CajaSucursal'
 *     responses:
 *       200:
 *         description: Caja sucursal actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CajaSucursal'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/EliminarCajaSucursal:
 *   delete:
 *     summary: Eliminar una caja sucursal
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CodigoCajaSucursal:
 *                 type: integer
 *                 description: Código de la caja a eliminar
 *             required:
 *               - CodigoCajaSucursal
 *     responses:
 *       200:
 *         description: Caja sucursal eliminada exitosamente
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */


router.get("/ObtenerFacturas", authMiddleware, ObtenerFacturasController);
router.get("/ObtenerFacturas/totalFacturas", ObtenerTotalFacturasController);
router.post("/CrearFactura", authMiddleware, CrearFacturaController);
router.post("/CrearFacturaWEB", CrearFacturaControllerWEB);
router.put(
  "/EditarFactura",
  authMiddleware,
  privilegedAuthMiddleware,
  EditarFacturaController
);
router.put(
  "/AsignarOrdenFactura",
  authMiddleware,
  privilegedAuthMiddleware,
  AsignarOrdenFacturaController
);
router.get(
  "/ObtenerDetalleFactura",
  authMiddleware,
  ObtenerDetalleFacturaController
);
router.post(
  "/CrearDetalleFactura",
  authMiddleware,
  privilegedAuthMiddleware, 
  CrearDetalleFacturaController
);
router.post(
  "/CrearDetalleFacturaWEB",
  CrearDetalleFacturaControllerWEB
);
router.post(
  "/CrearDetalleFactura",
  authMiddleware,
  privilegedAuthMiddleware, 
  CrearDetalleFacturaController
);
router.put(
  "/EditarDetalleFactura",
  authMiddleware,
  privilegedAuthMiddleware,
  EditarDetalleFacturaController
);
router.delete(
  "/EliminarDetalleFactura",
  authMiddleware,
  EliminarDetalleFacturaController
);
router.get("/ObtenerInventario", authMiddleware, ObtenerInventarioController);
router.get("/ObtenerInventarioWeb", ObtenerInventarioWEBController);
router.get("/ObtenerInventario/total-productos", ObtenerTotalProductosController);
router.post("/CrearInventario", authMiddleware, CrearInventarioController);
router.put("/EditarInventario", authMiddleware, EditarInventarioController);
router.delete(
  "/EliminarInventario",
  authMiddleware,
  EliminarInventarioController
);
router.post(
  "/ActivarInventario",
  authMiddleware,
  ActivarInventarioController
);
router.get("/ObtenerDescuentoFactura", authMiddleware, ObtenerDescuentoFactura);
router.post(
  "/CrearDescuentoFactura",
  authMiddleware,
  privilegedAuthMiddleware,
  CrearDescuentoFactura
);
router.put(
  "/EditarDescuentoFactura",
  authMiddleware,
  privilegedAuthMiddleware,
  EditarDescuentoFactura
);
router.delete(
  "/EliminarDescuentoFactura",
  authMiddleware,
  EliminarDescuentoFactura
);

router.get(
  "/ObtenerDetalleFormasPago",
  authMiddleware,
  ObtenerDetalleFormasPagoController
);

router.post(
  "/CrearDetalleFormasPago",
  authMiddleware,
  privilegedAuthMiddleware,
  CrearDetalleFormasPagoController
);

router.put(
  "/EditarDetalleFormasPago",
  authMiddleware,
  privilegedAuthMiddleware, 
  EditarDetalleFormasPagoController
);

router.delete(
  "/EliminarDetalleFormasPago",
  authMiddleware,
  EliminarDetalleFormasPagoController
);

//TALONARIOS

router.get("/ObtenerTalonarios", authMiddleware, ObtenerTalonariosController);
router.post("/CrearTalonario", authMiddleware, CrearTalonarioController);
router.put(
  "/EditarTalonario",
  authMiddleware,
  privilegedAuthMiddleware,
  EditarTalonarioController
);
router.delete(
  "/EliminarTalonario",
  authMiddleware,
  privilegedAuthMiddleware,
  EliminarTalonarioController
);

//DetalleTalonarios
router.get("/ObtenerDetalleTalonario", authMiddleware, ObtenerDetalleTalonarioController);
router.post("/CrearDetalleTalonario", authMiddleware, CrearDetalleTalonarioController);
router.put(
  "/EditarDetalleTalonario",
  authMiddleware,
  privilegedAuthMiddleware,
  EditarDetalleTalonarioController
);
router.delete(
  "/EliminarDetalleTalonario",
  authMiddleware,
  privilegedAuthMiddleware,
  EliminarDetalleTalonarioController
);

//CAJAS
router.get("/ObtenerCajasSucursal", authMiddleware, ObtenerCajasSucursalController);
router.post("/CrearCajaSucursal", authMiddleware, CrearCajaSucursalController);
router.put(
  "/EditarCajaSucursal",
  authMiddleware,
  privilegedAuthMiddleware,
  EditarCajaSucursalController
);
router.delete(
  "/EliminarCajaSucursal",
  authMiddleware,
  privilegedAuthMiddleware,
  EliminarCajaSucursalController
);

//Productos combo
/**
 * @swagger
 * /SFAC/ProductosCombo:
 *   get:
 *     summary: Servicio para obtener un listado de los productos que tiene el combo  
 *     tags: [SFAC]
 *     parameters:
 *       - in: query
 *         name: CodigoInventario
 *         schema:
 *           type: integer
 *         required: true
 *         description: El código del inventario a obtener
 *         example: 20
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

router.get(
  "/ProductosCombo",
  authMiddleware,
  ObtenerProductosComboController
);

//ExtrasProducto
/**
 * @swagger
 * /SFAC/ExtrasProducto:
 *   get:
 *     summary: Servicio para obtener un listado de los extras de un producto
 *     tags: [SFAC]
 *     parameters:
 *       - in: query
 *         name: CodigoInventario
 *         schema:
 *           type: integer
 *         required: true
 *         description: El código del inventario a obtener
 *         example: 20
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

router.get(
  "/ExtrasProducto",
  authMiddleware,
  ObtenerExtrasProductosController
);

//Variantes Producto
/**
 * @swagger
 * /SFAC/VariantesProducto:
 *   get:
 *     summary: Servicio para obtener un listado de las variantes de un producto
 *     tags: [SFAC]
 *     parameters:
 *       - in: query
 *         name: CodigoInventario
 *         schema:
 *           type: integer
 *         required: true
 *         description: El código del inventario a obtener
 *         example: 20
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

router.get(
  "/VariantesProducto",
  authMiddleware,
  ObtenerVariantesProductosController
);


// ORDENES
router.get("/ObtenerOrdenes", authMiddleware, ObtenerOrdenesController);
router.get("/ObtenerOrdenUsuario", authMiddleware, ObtenerOrdenesUsuarioController);
router.post("/CrearOrdenes", authMiddleware, CrearOrdenesController);
router.put("/EditarOrdenes", authMiddleware, EditarOrdenesController);
router.put("/ActualizarEstadoOrdenes", authMiddleware, ActualizarEstadoOrdenesController);
router.put("/CerrarOrden", authMiddleware, CerrarOrdenesController);

/**
 * @swagger
 * /SFAC/ObtenerOrdenes:
 *   get:
 *     summary: Servicio para obtener un listado de órdenes o una en específico
 *     tags: [SFAC]
 *     parameters:
 *       - in: query
 *         name: CodigoOrdenUsuario
 *         schema:
 *           type: integer
 *         required: false
 *         description: El código de la orden a obtener, no se envía para obtener más de una orden
 *         example: 1
 *       - in: query
 *         name: Pagina
 *         schema:
 *           type: integer
 *         required: false
 *         description: Número de página a obtener
 *         example: 1
 *       - in: query
 *         name: TamanoPagina
 *         schema:
 *           type: integer
 *         required: false
 *         description: Cantidad de registros por página
 *         example: 10
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */


/**
 * @swagger
 * /SFAC/ObtenerOrdenes:
 *   get:
 *     summary: Servicio para obtener una orden en específico por usuario
 *     tags: [SFAC]
 *     parameters:
 *       - in: query
 *         name: CodigoUsuario
 *         schema:
 *           type: integer
 *         required: false
 *         description: Codigo de usuario para filtrar las órdenes
 *         example: 1
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/CrearOrdenes:
 *   post:
 *     summary: Servicio para crear una nueva orden
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CodigoUsuario:
 *                 type: integer
 *                 description: ID del usuario que crea la orden
 *                 example: 1
 *             required:
 *               - CodigoUsuario
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/ActualizarEstadoOrdenes:
 *   put:
 *     summary: Servicio para actualizar el estado del detalle de una orden dependiendo del permiso del usuario
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CodigoOrden:
 *                 type: integer
 *                 description: ID de la orden a editar
 *                 example: 1
 *               CodigoEstado:
 *                 type: integer
 *                 description: Nuevo estado de la orden
 *                 example: 2
 *             required:
 *               - CodigoOrden
 *               - CodigoEstado
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /SFAC/EditarOrdenes:
 *   put:
 *     summary: Servicio para editar una orden existente
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CodigoOrden:
 *                 type: integer
 *                 description: ID de la orden a editar
 *                 example: 1
 *               CodigoEstado:
 *                 type: integer
 *                 description: Nuevo estado de la orden
 *                 example: 2
 *               CodigoUsuario:
 *                 type: integer
 *                 description: ID del usuario que edita la orden
 *                 example: 1
 *             required:
 *               - CodigoOrden
 *               - CodigoEstado
 *               - CodigoUsuario
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */


/**
 * @swagger
 * /SFAC/CerrarOrden:
 *   put:
 *     summary: Servicio para cerrar una orden(Actualiza el estado de una orden a preparando)
 *     tags: [SFAC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CodigoOrden:
 *                 type: integer
 *                 description: ID de la orden a editar
 *                 example: 1
 *             required:
 *               - CodigoOrden
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */



export default router;
