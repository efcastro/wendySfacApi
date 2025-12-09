import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { ObtenerCatalogoController, ObtenerCatalogoControllerWEB } from "../controllers/cat.controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Catálogo:
 *       type: object
 *       required:
 *         - NombreTabla
 *       properties:
 *         NombreTabla:
 *           type: string
 *           description: Nombre de la tabla a consultar, no incluir esquema. Escribir nombre exacto de la tabla.
 *         Tipo:
 *           type: string
 *           description: Tipo de catálogo a filtrar
 *         Pagina:
 *           type: number
 *           description: Número de página que se desea obtener
 *         TamanoPagina:
 *           type: number
 *           description: Cantidad de registros por página
 *       example:
 *         NombreTabla: MONEDAS
 *         Pagina: 2
 *         TamanoPagina: 10
 */


/**
 * @swagger
 * tags:
 *   name: CAT
 *   description: Servicios para la gestión catálogos
 */

/**
 * @swagger
 * /CAT/ObtenerCatalogo:
 *   get:
 *     summary: Servicio para obtener un listado de registros de las tablas de catálogo.
 *     tags: [CAT]
 *     parameters:
 *       - in: query
 *         name: NombreTabla
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de la tabla a consultar, no incluir esquema. Escribir nombre exacto de la tabla.
 *       - in: query
 *         name: Tipo
 *         schema:
 *           type: string
 *         required: true
 *         description: Tipo de catalogo a filtrar.
 *         example: MONEDAS
 *       - in: query
 *         name: Pagina
 *         schema:
 *           type: number
 *         required: false
 *         description: Número de página que se desea obtener
 *         example: 1
 *       - in: query
 *         name: TamanoPagina
 *         schema:
 *           type: number
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

router.get("/ObtenerCatalogo", authMiddleware, ObtenerCatalogoController);
router.get("/ObtenerCatalogoWEB", ObtenerCatalogoControllerWEB);

export default router;
