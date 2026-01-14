import express from "express";
import {
    ObtenerFacturasComprasController,
    ObtenerFacturaCompraPorCodigoController,
    CrearFacturaCompraController,
    EditarFacturaCompraController,
    EliminarFacturaCompraController,
    ObtenerTotalFacturasComprasController,
    ObtenerDetalleFacturaCompraController,
    CrearDetalleFacturaCompraController,
    EditarDetalleFacturaCompraController,
    EliminarDetalleFacturaCompraController,
    RecalcularTotalesFacturaCompraController,
} from "../controllers/compras.controller.js";
import { uploadImageCompraHandler, deleteImageCompraHandler } from "../controllers/upload.controller.js";
import uploadCompras from "../uploadCompras.js";

import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Compras
 *   description: Servicios para la gestión de facturas de compras
 */

// ==========================================
// RUTAS DE FACTURAS DE COMPRAS
// ==========================================

/**
 * @swagger
 * /Compras/totalFacturasCompras:
 *   get:
 *     summary: Obtener total de facturas de compras
 *     tags: [Compras]
 */
router.get("/totalFacturasCompras", authMiddleware, ObtenerTotalFacturasComprasController);

/**
 * @swagger
 * /Compras/ObtenerFacturasCompras:
 *   get:
 *     summary: Obtener listado de facturas de compras (con paginación)
 *     tags: [Compras]
 */
router.get("/ObtenerFacturasCompras", authMiddleware, ObtenerFacturasComprasController);

/**
 * @swagger
 * /Compras/ObtenerFacturaCompraPorCodigo:
 *   get:
 *     summary: Obtener una factura de compra por su código
 *     tags: [Compras]
 */
router.get("/ObtenerFacturaCompraPorCodigo", authMiddleware, ObtenerFacturaCompraPorCodigoController);

/**
 * @swagger
 * /Compras/CrearFacturaCompra:
 *   post:
 *     summary: Crear una nueva factura de compra
 *     tags: [Compras]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NumeroFactura:
 *                 type: string
 *                 description: Número de factura (opcional, se genera automáticamente si no se envía)
 *               CodigoProveedor:
 *                 type: integer
 *                 description: Código del proveedor
 *               FechaCreacion:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de creación (opcional, por defecto fecha actual)
 *               Observaciones:
 *                 type: string
 *                 description: Observaciones de la factura
 *               CodigoEstado:
 *                 type: integer
 *                 description: Código del estado (opcional, por defecto BORRADOR)
 *               CodigoMetodoPago:
 *                 type: integer
 *                 description: Código del método de pago
 *     responses:
 *       200:
 *         description: Factura creada correctamente
 *       400:
 *         description: Error en validación de datos
 */
router.post("/CrearFacturaCompra", authMiddleware, CrearFacturaCompraController);

/**
 * @swagger
 * /Compras/EditarFacturaCompra:
 *   put:
 *     summary: Editar una factura de compra existente
 *     description: |
 *       Permite editar una factura de compra. Incluye soporte para descuento global (monto fijo).
 *       Al cambiar el estado a CERRADA se suma el inventario automáticamente.
 *       Al cambiar el estado a ANULADA (desde CERRADA) se resta el inventario.
 *     tags: [Compras]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CodigoFactura
 *             properties:
 *               CodigoFactura:
 *                 type: integer
 *                 description: Código de la factura a editar (requerido)
 *               NumeroFactura:
 *                 type: string
 *                 description: Número de factura
 *               CodigoProveedor:
 *                 type: integer
 *                 description: Código del proveedor
 *               Observaciones:
 *                 type: string
 *                 description: Observaciones de la factura
 *               CodigoEstado:
 *                 type: integer
 *                 description: Código del estado
 *               CodigoMetodoPago:
 *                 type: integer
 *                 description: Código del método de pago
 *               DescuentoGlobalMonto:
 *                 type: number
 *                 format: decimal
 *                 description: Monto fijo del descuento global aplicado a la factura
 *     responses:
 *       200:
 *         description: Factura actualizada correctamente
 *       400:
 *         description: Error en validación de datos
 *       404:
 *         description: Factura no encontrada
 */
router.put("/EditarFacturaCompra", authMiddleware, EditarFacturaCompraController);

/**
 * @swagger
 * /Compras/EliminarFacturaCompra:
 *   delete:
 *     summary: Eliminar una factura de compra
 *     tags: [Compras]
 */
router.delete("/EliminarFacturaCompra", authMiddleware, EliminarFacturaCompraController);

/**
 * @swagger
 * /Compras/ObtenerTotalFacturasCompras:
 *   get:
 *     summary: Obtener total de facturas de compras
 *     tags: [Compras]
 */
router.get("/ObtenerTotalFacturasCompras", authMiddleware, ObtenerTotalFacturasComprasController);

// ==========================================
// RUTAS DE DETALLE FACTURAS DE COMPRAS
// ==========================================

/**
 * @swagger
 * /Compras/ObtenerDetalleFacturaCompra:
 *   get:
 *     summary: Obtener detalles de una factura de compra
 *     tags: [Compras]
 */
router.get("/ObtenerDetalleFacturaCompra", authMiddleware, ObtenerDetalleFacturaCompraController);

/**
 * @swagger
 * /Compras/CrearDetalleFacturaCompra:
 *   post:
 *     summary: Crear un detalle en la factura de compra
 *     description: |
 *       Agrega un nuevo producto/detalle a una factura de compra.
 *       Soporta descuentos por ítem (monto fijo).
 *       Recalcula automáticamente los totales de la factura.
 *     tags: [Compras]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CodigoFactura
 *               - CodigoInventario
 *               - Cantidad
 *             properties:
 *               CodigoFactura:
 *                 type: integer
 *                 description: Código de la factura de compra (requerido)
 *               CodigoInventario:
 *                 type: integer
 *                 description: Código del producto en inventario (requerido)
 *               Cantidad:
 *                 type: integer
 *                 description: Cantidad a comprar (requerido, mayor a 0)
 *               PrecioCompra:
 *                 type: number
 *                 format: decimal
 *                 description: Precio de compra unitario
 *               CodigoTipoImpuesto:
 *                 type: integer
 *                 description: Código del tipo de impuesto (opcional, por defecto 1)
 *               CodigoEmpaquetado:
 *                 type: integer
 *                 description: Código del empaquetado (null = unidades sueltas)
 *               DescuentoMonto:
 *                 type: number
 *                 format: decimal
 *                 description: Monto fijo del descuento aplicado al ítem
 *     responses:
 *       200:
 *         description: Detalle creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 CodigoDetalle:
 *                   type: integer
 *                 Subtotal:
 *                   type: number
 *                 MontoImpuesto:
 *                   type: number
 *                 TotalFactura:
 *                   type: number
 *       400:
 *         description: Error en validación de datos
 */
router.post("/CrearDetalleFacturaCompra", authMiddleware, CrearDetalleFacturaCompraController);

/**
 * @swagger
 * /Compras/EditarDetalleFacturaCompra:
 *   put:
 *     summary: Editar un detalle de la factura de compra
 *     description: |
 *       Edita un detalle existente de una factura de compra.
 *       Soporta actualización de descuentos por ítem (monto fijo).
 *       Recalcula automáticamente los totales de la factura.
 *     tags: [Compras]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CodigoDetalle
 *             properties:
 *               CodigoDetalle:
 *                 type: integer
 *                 description: Código del detalle a editar (requerido)
 *               CodigoFactura:
 *                 type: integer
 *                 description: Código de la factura (opcional, se obtiene del detalle)
 *               CodigoInventario:
 *                 type: integer
 *                 description: Código del producto en inventario
 *               Cantidad:
 *                 type: integer
 *                 description: Nueva cantidad
 *               PrecioCompra:
 *                 type: number
 *                 format: decimal
 *                 description: Nuevo precio de compra unitario
 *               CodigoTipoImpuesto:
 *                 type: integer
 *                 description: Código del tipo de impuesto
 *               CodigoEmpaquetado:
 *                 type: integer
 *                 description: Código del empaquetado
 *               DescuentoMonto:
 *                 type: number
 *                 format: decimal
 *                 description: Monto fijo del descuento aplicado al ítem
 *     responses:
 *       200:
 *         description: Detalle actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 CodigoDetalle:
 *                   type: integer
 *                 TotalFactura:
 *                   type: number
 *       400:
 *         description: Error en validación de datos
 *       404:
 *         description: Detalle no encontrado
 */
router.put("/EditarDetalleFacturaCompra", authMiddleware, EditarDetalleFacturaCompraController);

/**
 * @swagger
 * /Compras/EliminarDetalleFacturaCompra:
 *   delete:
 *     summary: Eliminar un detalle de la factura de compra
 *     tags: [Compras]
 */
router.delete("/EliminarDetalleFacturaCompra", authMiddleware, EliminarDetalleFacturaCompraController);

// ==========================================
// RUTAS DE IMÁGENES DE FACTURAS DE COMPRAS
// ==========================================

/**
 * @swagger
 * /Compras/SubirImagenFactura:
 *   post:
 *     summary: Subir una imagen o PDF de factura de compra
 *     description: |
 *       Sube un archivo de imagen o PDF para una factura de compra.
 *       El archivo se guarda con nombre estándar: Compra_<codigoFactura>.jpg/pdf
 *       La ruta siempre será predecible: /uploads/compras/Compra_<codigoFactura>.jpg
 *     tags: [Compras]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen (jpg, png) o PDF
 *               codigoFactura:
 *                 type: integer
 *                 description: Código de la factura de compra
 *             required:
 *               - file
 *               - codigoFactura
 *     responses:
 *       200:
 *         description: Imagen subida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 typeResult:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 result:
 *                   type: string
 *                   description: Ruta de la imagen (ej. /uploads/compras/Compra_5.jpg)
 *       400:
 *         description: Error - No se subió archivo o falta codigoFactura
 *       500:
 *         description: Error del servidor
 */
router.post("/SubirImagenFactura", authMiddleware, uploadCompras.single("file"), uploadImageCompraHandler);

/**
 * @swagger
 * /Compras/EliminarImagenFactura:
 *   delete:
 *     summary: Eliminar una imagen de factura de compra
 *     description: |
 *       Elimina la imagen asociada a una factura de compra.
 *       Se recomienda usar codigoFactura, que eliminará automáticamente tanto .jpg como .pdf
 *     tags: [Compras]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigoFactura:
 *                 type: integer
 *                 description: Código de la factura (recomendado)
 *               rutaImagen:
 *                 type: string
 *                 description: Ruta del archivo (alternativa)
 *     responses:
 *       200:
 *         description: Imagen eliminada correctamente
 *       400:
 *         description: Error - Falta codigoFactura o rutaImagen
 *       500:
 *         description: Error del servidor
 */
router.delete("/EliminarImagenFactura", authMiddleware, deleteImageCompraHandler);

// ==========================================
// RUTA PARA RECALCULAR TOTALES
// ==========================================

/**
 * @swagger
 * /Compras/RecalcularTotalesFactura:
 *   post:
 *     summary: Recalcular totales de una factura de compra
 *     description: |
 *       Recalcula los totales de una factura de compra basándose en sus detalles.
 *       Útil para sincronizar los montos después de modificaciones manuales.
 *       Actualiza: SubtotalBruto, TotalDescuentoItems, SubTotal, BaseISV, TotalImpuesto y Total.
 *     tags: [Compras]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CodigoFactura
 *             properties:
 *               CodigoFactura:
 *                 type: integer
 *                 description: Código de la factura a recalcular (requerido)
 *     responses:
 *       200:
 *         description: Totales recalculados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 CodigoFactura:
 *                   type: integer
 *                 SubtotalBruto:
 *                   type: number
 *                 TotalDescuentoItems:
 *                   type: number
 *                 SubTotal:
 *                   type: number
 *                 TotalImpuesto:
 *                   type: number
 *                 Total:
 *                   type: number
 *       400:
 *         description: Error - Falta CodigoFactura
 *       404:
 *         description: Factura no encontrada
 */
router.post("/RecalcularTotalesFactura", authMiddleware, RecalcularTotalesFacturaCompraController);

export default router;
