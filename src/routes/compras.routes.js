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
} from "../controllers/compras.controller.js";

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
 */
router.post("/CrearFacturaCompra", authMiddleware, CrearFacturaCompraController);

/**
 * @swagger
 * /Compras/EditarFacturaCompra:
 *   put:
 *     summary: Editar una factura de compra existente
 *     tags: [Compras]
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
 *     tags: [Compras]
 */
router.post("/CrearDetalleFacturaCompra", authMiddleware, CrearDetalleFacturaCompraController);

/**
 * @swagger
 * /Compras/EditarDetalleFacturaCompra:
 *   put:
 *     summary: Editar un detalle de la factura de compra
 *     tags: [Compras]
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

export default router;
