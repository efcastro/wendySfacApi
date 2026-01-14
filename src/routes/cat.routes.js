import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
    ObtenerCatalogoController,
    ObtenerCatalogoControllerWEB,
    ObtenerCategoriasController,
    CrearCategoriaController,
    EditarCategoriaController,
    EliminarCategoriaController,
    ObtenerUbicacionesController,
    CrearUbicacionController,
    EditarUbicacionController,
    EliminarUbicacionController
} from "../controllers/cat.controller.js";

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
 *     Categoria:
 *       type: object
 *       properties:
 *         Codigo:
 *           type: integer
 *           description: Código único de la categoría
 *         Nombre:
 *           type: string
 *           description: Nombre de la categoría
 *         Color:
 *           type: string
 *           description: Color en formato hexadecimal (ej. #3498db)
 *       example:
 *         Codigo: 1
 *         Nombre: "Bebidas"
 *         Color: "#3498db"
 *     CrearCategoria:
 *       type: object
 *       required:
 *         - Nombre
 *       properties:
 *         Nombre:
 *           type: string
 *           description: Nombre de la categoría
 *         Color:
 *           type: string
 *           description: Color en formato hexadecimal (ej. #3498db)
 *       example:
 *         Nombre: "Bebidas"
 *         Color: "#3498db"
 *     EditarCategoria:
 *       type: object
 *       required:
 *         - CodigoCategoria
 *       properties:
 *         CodigoCategoria:
 *           type: integer
 *           description: Código de la categoría a editar
 *         Nombre:
 *           type: string
 *           description: Nuevo nombre de la categoría
 *         Color:
 *           type: string
 *           description: Nuevo color en formato hexadecimal
 *       example:
 *         CodigoCategoria: 1
 *         Nombre: "Bebidas Frías"
 *         Color: "#2980b9"
 *     EliminarCategoria:
 *       type: object
 *       required:
 *         - CodigoCategoria
 *       properties:
 *         CodigoCategoria:
 *           type: integer
 *           description: Código de la categoría a eliminar
 *       example:
 *         CodigoCategoria: 1
 *     Ubicacion:
 *       type: object
 *       properties:
 *         Codigo:
 *           type: integer
 *           description: Código único de la ubicación
 *         Nombre:
 *           type: string
 *           description: Nombre de la ubicación
 *       example:
 *         Codigo: 1
 *         Nombre: "Bodega Principal"
 *     CrearUbicacion:
 *       type: object
 *       required:
 *         - Nombre
 *       properties:
 *         Nombre:
 *           type: string
 *           description: Nombre de la ubicación
 *       example:
 *         Nombre: "Bodega Principal"
 *     EditarUbicacion:
 *       type: object
 *       required:
 *         - CodigoUbicacion
 *       properties:
 *         CodigoUbicacion:
 *           type: integer
 *           description: Código de la ubicación a editar
 *         Nombre:
 *           type: string
 *           description: Nuevo nombre de la ubicación
 *       example:
 *         CodigoUbicacion: 1
 *         Nombre: "Bodega Secundaria"
 *     EliminarUbicacion:
 *       type: object
 *       required:
 *         - CodigoUbicacion
 *       properties:
 *         CodigoUbicacion:
 *           type: integer
 *           description: Código de la ubicación a eliminar
 *       example:
 *         CodigoUbicacion: 1
 */


/**
 * @swagger
 * tags:
 *   name: CAT
 *   description: Servicios para la gestión catálogos, categorías y ubicaciones
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

// ==========================================
// RUTAS DE CATEGORÍAS
// ==========================================

/**
 * @swagger
 * /CAT/Categorias:
 *   get:
 *     summary: Obtener todas las categorías o una categoría específica
 *     tags: [CAT]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: CodigoCategoria
 *         schema:
 *           type: integer
 *         required: false
 *         description: Código de la categoría específica a obtener. Si no se envía, retorna todas las categorías activas.
 *         example: 1
 *     responses:
 *       200:
 *         description: Categorías obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Categoria'
 *                 message:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */
router.get("/Categorias", authMiddleware, ObtenerCategoriasController);

/**
 * @swagger
 * /CAT/Categoria:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [CAT]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearCategoria'
 *     responses:
 *       200:
 *         description: Categoría creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   $ref: '#/components/schemas/Categoria'
 *                 message:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */
router.post("/Categoria", authMiddleware, CrearCategoriaController);

/**
 * @swagger
 * /CAT/Categoria:
 *   put:
 *     summary: Editar una categoría existente
 *     tags: [CAT]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditarCategoria'
 *     responses:
 *       200:
 *         description: Categoría actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: object
 *                   properties:
 *                     Codigo:
 *                       type: integer
 *                 message:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */
router.put("/Categoria", authMiddleware, EditarCategoriaController);

/**
 * @swagger
 * /CAT/Categoria:
 *   delete:
 *     summary: Eliminar (desactivar) una categoría
 *     tags: [CAT]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EliminarCategoria'
 *     responses:
 *       200:
 *         description: Categoría eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: object
 *                   properties:
 *                     Codigo:
 *                       type: integer
 *                 message:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */
router.delete("/Categoria", authMiddleware, EliminarCategoriaController);

// ==========================================
// RUTAS DE UBICACIONES
// ==========================================

/**
 * @swagger
 * /CAT/Ubicaciones:
 *   get:
 *     summary: Obtener todas las ubicaciones o una ubicación específica
 *     tags: [CAT]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: CodigoUbicacion
 *         schema:
 *           type: integer
 *         required: false
 *         description: Código de la ubicación específica a obtener. Si no se envía, retorna todas las ubicaciones activas.
 *         example: 1
 *     responses:
 *       200:
 *         description: Ubicaciones obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ubicacion'
 *                 message:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */
router.get("/Ubicaciones", authMiddleware, ObtenerUbicacionesController);

/**
 * @swagger
 * /CAT/Ubicacion:
 *   post:
 *     summary: Crear una nueva ubicación
 *     tags: [CAT]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearUbicacion'
 *     responses:
 *       200:
 *         description: Ubicación creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   $ref: '#/components/schemas/Ubicacion'
 *                 message:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */
router.post("/Ubicacion", authMiddleware, CrearUbicacionController);

/**
 * @swagger
 * /CAT/Ubicacion:
 *   put:
 *     summary: Editar una ubicación existente
 *     tags: [CAT]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditarUbicacion'
 *     responses:
 *       200:
 *         description: Ubicación actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: object
 *                   properties:
 *                     Codigo:
 *                       type: integer
 *                 message:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */
router.put("/Ubicacion", authMiddleware, EditarUbicacionController);

/**
 * @swagger
 * /CAT/Ubicacion:
 *   delete:
 *     summary: Eliminar (desactivar) una ubicación
 *     tags: [CAT]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EliminarUbicacion'
 *     responses:
 *       200:
 *         description: Ubicación eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: object
 *                   properties:
 *                     Codigo:
 *                       type: integer
 *                 message:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */
router.delete("/Ubicacion", authMiddleware, EliminarUbicacionController);

export default router;

