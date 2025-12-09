import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { CrearPersonaController, EditarPersonaController, ObtenerPersonasController } from "../controllers/gral.controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Personas:
 *       type: object
 *       required:
 *         - CodigoPersona
 *         - CodigoTipoPersona
 *         - CodigoEstado
 *       properties:
 *         CodigoPersona:
 *           type: number
 *           description: Código de la persona
 *         CodigoTipoPersona:
 *           type: number
 *           description: Código del tipo de persona
 *         IdentidadRtn:
 *           type: string
 *           description: Número de identidad o RTN de la persona
 *         Nombres:
 *           type: string
 *           description: Nombres de la persona
 *         Apellidos:
 *           type: string
 *           description: Apellidos de la persona
 *         Correo:
 *           type: string
 *           description: Correo de la persona
 *         Telefono:
 *           type: string
 *           description: Teléfono de la persona
 *         Domicilio:
 *           type: string
 *           description: Domicilio de la persona
 *         CodigoEstado:
 *           type: number
 *           description: Código del estado de la persona
 *       example:
 *         CodigoPersona: 12
 *         CodigoTipoPersona: 2
 *         IdentidadRtn: "9999-9999-99999"
 *         Nombres: "CONSUMIDOR"
 *         Apellidos: "FINAL"
 *         Correo: ""
 *         Telefono: "99999999"
 *         Domicilio: ""
 *         CodigoEstado: 1
 */


/**
 * @swagger
 * tags:
 *   name: GRAL
 *   description: Servicios para la gestión entidades generales
 */

/**
 * @swagger
 * /GRAL/ObtenerPersonas:
 *   get:
 *     summary: Servicio para obtener un listado de personas o una en específico
 *     tags: [GRAL]
 *     parameters:
 *       - in: query
 *         name: CodigoPersona
 *         schema:
 *           type: integer
 *         required: false
 *         description: El código del cliente a obtener, no se envía para obtener más de un cliente
 *         example: 1
 *       - in: query
 *         name: Busqueda
 *         schema:
 *           type: string
 *         required: false
 *         description: Campo utilizado para realizar búsquedas por Nombres, Apellidos o IdentidadRtn
 *         example: Juan, Pérez, 03189022396512
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
 * /GRAL/CrearPersona:
 *   post:
 *     summary: Servicio para crear una persona
 *     tags: [GRAL]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Personas'
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
 * /GRAL/EditarPersona:
 *   put:
 *     summary: Servicio para editar una persona
 *     tags: [GRAL]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Personas'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/StandardResponse200'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

router.get("/ObtenerPersonas", authMiddleware, ObtenerPersonasController);
router.post("/CrearPersona", authMiddleware, CrearPersonaController);
router.put("/EditarPersona", authMiddleware, EditarPersonaController);


export default router;
