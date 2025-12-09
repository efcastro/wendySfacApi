import express from "express";
import {
  registerUser,
  editUser,
  deleteUser,
  getUser,
  iniciarSesionUsuario,
  getAllUsers,
  enviarCodigoCambioPassword,
  cambiarPassword,
  cambiarPasswordObligatorio
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();
const codeStore = new Map(); 

/**
 * @swagger
 * components:
 *   schemas:
 *     Authentication:
 *       type: object
 *       required:
 *         - Nombres
 *         - Apellidos
 *         - Telefono
 *         - Correo
 *         - FKEstado
 *       properties:
 *         Nombres:
 *           type: string
 *           description: El nombre del usuario
 *         Apellidos:
 *           type: string
 *           description: Los apellidos del usuario
 *         Telefono:
 *           type: string
 *           description: El teléfono del usuario
 *         Correo:
 *           type: string
 *           description: El correo del usuario
 *         FKEstado:
 *           type: integer
 *           description: El estado del usuario
 *       example:
 *         Nombres: Juan
 *         Apellidos: Pérez
 *         Telefono: "123456789"
 *         Correo: juan.perez@example.com
 *         FKEstado: 1
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Servicios para la gestión de usuarios
 */

/**
 * @swagger
 * /Authentication/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Authentication'
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
 * /Authentication/edit:
 *   put:
 *     summary: Editar un usuario existente
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CodigoUsuario:
 *                 type: integer
 *                 description: El código del usuario a editar
 *               Nombres:
 *                 type: string
 *                 description: El nombre del usuario
 *               Apellidos:
 *                 type: string
 *                 description: Los apellidos del usuario
 *               Telefono:
 *                 type: string
 *                 description: El teléfono del usuario
 *               Correo:
 *                 type: string
 *                 description: El correo del usuario
 *               FKEstado:
 *                 type: integer
 *                 description: El estado del usuario
 *           example:
 *             CodigoUsuario: 1
 *             Nombres: "Juan"
 *             Apellidos: "Pérez"
 *             Telefono: "87654321"
 *             Correo: "juan.perez@example.com"
 *             FKEstado: 1
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
 * /Authentication/delete:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CodigoUsuario:
 *                 type: integer
 *                 description: El código del usuario a eliminar
 *           example:
 *             CodigoUsuario: 1
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
 * /Authentication/get:
 *   get:
 *     summary: Obtener información de un usuario
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: CodigoUsuario
 *         schema:
 *           type: integer
 *         required: true
 *         description: El código del usuario a obtener
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
 * /Authentication/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreDeUsuario:
 *                 type: string
 *                 description: El nombre de usuario
 *             example:
 *               nombreDeUsuario: prueba@prueba.com
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
 * /Authentication/getAll:
 *   get:
 *     summary: Obtener todos los usuarios (paginado)
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de registros por página
 *         example: 10
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /Authentication/enviar-codigo:
 *   post:
 *     summary: Enviar código de recuperación de contraseña al correo
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *                 description: Correo del usuario registrado
 *             required:
 *               - correo
 *             example:
 *               correo: "usuario@ejemplo.com"
 *     responses:
 *       200:
 *         description: Código enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Código enviado al correo.
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /Authentication/cambiar-password:
 *   post:
 *     summary: Cambiar contraseña usando código enviado al correo
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *                 description: Correo del usuario
 *               codigo:
 *                 type: string
 *                 description: Código recibido en el correo
 *               nuevaContrasena:
 *                 type: string
 *                 description: Nueva contraseña del usuario
 *             required:
 *               - correo
 *               - codigo
 *               - nuevaContrasena
 *             example:
 *               correo: "usuario@ejemplo.com"
 *               codigo: "123456"
 *               nuevaContrasena: "NuevaPassword123!"
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contraseña actualizada correctamente
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */


router.post("/register", registerUser);
router.put("/edit", authMiddleware, editUser);
router.delete("/delete", authMiddleware, deleteUser);
router.get("/get", authMiddleware, getUser);
router.get("/getAll", authMiddleware, getAllUsers);
router.post("/login", iniciarSesionUsuario);
router.post("/enviar-codigo", enviarCodigoCambioPassword);
router.post("/cambiar-password", cambiarPassword);
router.post("/cambiar-password-obligatorio", cambiarPasswordObligatorio);

export default router;
