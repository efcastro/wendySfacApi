import { Router } from "express";
import {
  obtenerImpresoras,
  pruebaImpresora,
  ObtenerImpresorasController,
  CrearImpresoraController,
  EditarImpresoraController,
  EliminarImpresoraController,
  ActivarImpresoraController,
} from "../controllers/printer.controller.js";

import { authMiddleware } from "../middlewares/auth.js";
import { privilegedAuthMiddleware } from "../middlewares/privilegedAuthMiddleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Impresoras
 *   description: Endpoints para la gestión de impresoras del sistema
 */

/**
 * @swagger
 * /PRIN/BuscarImpresoras:
 *   get:
 *     summary: Buscar impresoras en red
 *     description: Escanea la red local y devuelve una lista de IPs con puerto 9100 abierto (posibles impresoras).
 *     tags: [Impresoras]
 *     responses:
 *       200:
 *         description: Lista de posibles impresoras encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 impresoras:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ip:
 *                         type: string
 *                         example: 192.168.1.15
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /PRIN/impresoras/test:
 *   post:
 *     summary: Enviar prueba de impresión
 *     description: Envía una prueba de impresión a una impresora conectada por red.
 *     tags: [Impresoras]
 *     requestBody:
 *       description: Dirección IP de la impresora
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ip:
 *                 type: string
 *                 example: 192.168.1.15
 *     responses:
 *       200:
 *         description: Impresión enviada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Impresión enviada
 *       400:
 *         description: Error por IP faltante o inválida
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /PRIN/ObtenerImpresoras:
 *   get:
 *     summary: Obtener listado de impresoras registradas
 *     tags: [Impresoras]
 *     parameters:
 *       - in: query
 *         name: CodigoImpresora
 *         schema:
 *           type: integer
 *         required: false
 *         description: Código de la impresora a obtener (opcional)
 *       - in: query
 *         name: Busqueda
 *         schema:
 *           type: string
 *         required: false
 *         description: Texto para buscar por nombre o IP
 *       - in: query
 *         name: Pagina
 *         schema:
 *           type: integer
 *         required: false
 *         description: Número de página para paginación
 *       - in: query
 *         name: TamanoPagina
 *         schema:
 *           type: integer
 *         required: false
 *         description: Tamaño de página para paginación
 *     responses:
 *       200:
 *         description: Listado de impresoras registradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ImpresoraRegistrada'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /PRIN/CrearImpresoras:
 *   post:
 *     summary: Registrar una nueva impresora
 *     tags: [Impresoras]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ImpresoraInput'
 *     responses:
 *       201:
 *         description: Impresora registrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImpresoraRegistrada'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       401:
 *         $ref: '#/components/responses/StandardResponse401'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /PRIN/EditarImpresoras:
 *   put:
 *     summary: Actualizar una impresora registrada
 *     tags: [Impresoras]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ImpresoraInput'
 *     responses:
 *       200:
 *         description: Impresora actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImpresoraRegistrada'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       401:
 *         $ref: '#/components/responses/StandardResponse401'
 *       403:
 *         $ref: '#/components/responses/StandardResponse403'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /PRIN/EliminarImpresoras:
 *   delete:
 *     summary: Desactivar una impresora registrada
 *     tags: [Impresoras]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CodigoImpresora:
 *                 type: integer
 *                 description: Código de la impresora a desactivar
 *             required:
 *               - CodigoImpresora
 *     responses:
 *       200:
 *         description: Impresora desactivada exitosamente
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       401:
 *         $ref: '#/components/responses/StandardResponse401'
 *       403:
 *         $ref: '#/components/responses/StandardResponse403'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /PRIN/ActivarImpresoras:
 *   patch:
 *     summary: Activar una impresora registrada
 *     tags: [Impresoras]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CodigoImpresora:
 *                 type: integer
 *                 description: Código de la impresora a activar
 *             required:
 *               - CodigoImpresora
 *     responses:
 *       200:
 *         description: Impresora activada exitosamente
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       401:
 *         $ref: '#/components/responses/StandardResponse401'
 *       403:
 *         $ref: '#/components/responses/StandardResponse403'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

// Rutas para escaneo y prueba de impresoras
router.get("/BuscarImpresoras", obtenerImpresoras);
router.post("/impresoras/test", pruebaImpresora);

// Rutas para gestión CRUD de impresoras registradas
router.get("/ObtenerImpresoras", authMiddleware, ObtenerImpresorasController);
router.post("/CrearImpresoras", authMiddleware, CrearImpresoraController);
router.put("/EditarImpresoras", authMiddleware, privilegedAuthMiddleware, EditarImpresoraController);
router.delete("/EliminarImpresoras", authMiddleware, privilegedAuthMiddleware, EliminarImpresoraController);
router.patch("/ActivarImpresoras", authMiddleware, privilegedAuthMiddleware, ActivarImpresoraController);

export default router;