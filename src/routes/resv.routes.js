import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  CrearReservaController,
  CrearReservaControllerWEB,
  EditarReservaController,
  ObtenerReservasController,
  ObtenerReservasControllerWEB,
  ObtenerTotalReservasController,
  AsignarMesaController,
  ObtenerLayoutController,
  GuardarLayoutController,
  ObtenerMesasController,
  CrearMesaController,
  EditarMesaController,
  EliminarMesaController,
  ObtenerTotalMesasController,
  //SOLICITID EVENTOS
  ObtenerSolicitudesEventosController,
  CrearSolicitudEventoController,
  CrearSolicitudEventoControllerWEB,
  EditarSolicitudEventoController,
  CancelarSolicitudEventoController,
  ConfirmarSolicitudEventoController,
  ObtenerSolicitudesMenuDegustacionController,
  CrearSolicitudMenuDegustacionControllerWEB,
  CrearSolicitudMenuDegustacionController,
  EditarSolicitudMenuDegustacionController,
  ObtenerTotalEventosController,
  ObtenerTotalMenuDegustacionesController,
  CancelarSolicitudMenuDegustacionController,
  ConfirmarSolicitudMenuDegustacionController
} from "../controllers/resv.controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Reserva:
 *       type: object
 *       required:
 *         - CodigoPersona
 *         - CodigoMesa
 *         - NumeroPersonas
 *         - FechaReserva
 *       properties:
 *         CodigoReserva:
 *           type: number
 *           description: Código único de la reserva (auto-generado)
 *         CodigoPersona:
 *           type: number
 *           description: Código de la persona que hace la reserva
 *         CodigoMesa:
 *           type: number
 *           description: Código de la mesa reservada
 *         NumeroPersonas:
 *           type: number
 *           description: Número de personas para la reserva
 *         CodigoEstado:
 *           type: number
 *           description: Estado de la reserva (1-Activo, 2-Cancelado, etc.)
 *         FechaReserva:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la reserva
 *         CodigoUsuario:
 *           type: number
 *           description: Usuario que registra la reserva
 *       example:
 *         CodigoReserva: 1
 *         CodigoPersona: 12
 *         CodigoMesa: 5
 *         NumeroPersonas: 4
 *         CodigoEstado: 1
 *         FechaReserva: "2023-10-15T19:00:00"
 *         CodigoUsuario: 1
 */

/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Servicios para la gestión de reservas
 */

/**
 * @swagger
 * /RESV/ObtenerReservas:
 *   get:
 *     summary: Obtener listado de reservas o una en específico
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: CodigoReserva
 *         schema:
 *           type: integer
 *         required: false
 *         description: Código de reserva específica a obtener
 *       - in: query
 *         name: CodigoPersona
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filtrar por código de persona
 *       - in: query
 *         name: Busqueda
 *         schema:
 *           type: string
 *         required: false
 *         description: Búsqueda por nombre de persona o detalles
 *       - in: query
 *         name: Pagina
 *         schema:
 *           type: integer
 *         required: false
 *         description: Número de página (paginación)
 *         example: 1
 *       - in: query
 *         name: TamanoPagina
 *         schema:
 *           type: integer
 *         required: false
 *         description: Tamaño de página (paginación)
 *         example: 10
 *     responses:
 *       200:
 *         description: Listado de reservas
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reserva'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /RESV/CrearReserva:
 *   post:
 *     summary: Crear una nueva reserva
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reserva'
 *     responses:
 *       200:
 *         description: Reserva creada exitosamente
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
 *                   $ref: '#/components/schemas/Reserva'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /RESV/EditarReserva:
 *   put:
 *     summary: Editar una reserva existente
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reserva'
 *     responses:
 *       200:
 *         description: Reserva actualizada exitosamente
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
 *                   $ref: '#/components/schemas/Reserva'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

router.get("/ObtenerReservas", authMiddleware, ObtenerReservasController);
router.get("/ObtenerReservas/total-reservas", ObtenerTotalReservasController);
router.get("/ObtenerReservasWEB", ObtenerReservasControllerWEB);
router.post("/CrearReserva", authMiddleware, CrearReservaController);
router.post("/CrearReservaWEB", CrearReservaControllerWEB);
router.put("/EditarReserva", authMiddleware, EditarReservaController);

//Asignar mesa a reserva
/**
 * @swagger
 * /RESV/AsignarMesa:
 *   post:
 *     summary: Asignar una mesa a una reserva existente
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CodigoReserva
 *               - CodigoMesa
 *             properties:
 *               CodigoReserva:
 *                 type: integer
 *                 description: Código único de la reserva a la que se asignará la mesa
 *               CodigoMesa:
 *                 type: integer
 *                 description: Código de la mesa que se asignará a la reserva
 *             example:
 *               CodigoReserva: 12
 *               CodigoMesa: 5
 *     responses:
 *       200:
 *         description: Mesa asignada correctamente a la reserva
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 typeResult:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: "Mesa asignada exitosamente"
 *                 result:
 *                   type: object
 *                   properties:
 *                     CodigoReserva:
 *                       type: integer
 *                       example: 12
 *                     CodigoMesa:
 *                       type: integer
 *                       example: 5
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

router.post("/AsignarMesa", authMiddleware, AsignarMesaController);

//layout
router.get("/mesas/layout/:ubicacionId", ObtenerLayoutController);
router.post("/mesas/layout", GuardarLayoutController);

// ==================== RUTAS DE MESAS ====================

/**
 * @swagger
 * /RESV/ObtenerMesas:
 *   get:
 *     summary: Obtener listado de mesas o una en específico
 *     tags: [Mesas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: CodigoMesa
 *         schema:
 *           type: integer
 *         required: false
 *         description: Código de mesa específica a obtener
 *       - in: query
 *         name: FKCodigoUbicacionMesa
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filtrar por código de ubicación
 *       - in: query
 *         name: FKEstado
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filtrar por estado de mesa
 *     responses:
 *       200:
 *         description: Listado de mesas o mesa específica
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 typeResult:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Mesas obtenidas correctamente"
 *                 result:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/Mesa'
 *                     - type: array
 *                       items:
 *                         $ref: '#/components/schemas/Mesa'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /RESV/CrearMesa:
 *   post:
 *     summary: Crear una nueva mesa
 *     tags: [Mesas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre
 *               - Capacidad
 *               - FKCodigoUbicacionMesa
 *             properties:
 *               Nombre:
 *                 type: string
 *                 description: Nombre o identificador de la mesa
 *                 example: "Mesa 1"
 *               Capacidad:
 *                 type: integer
 *                 description: Número máximo de personas
 *                 example: 4
 *               FKCodigoUbicacionMesa:
 *                 type: integer
 *                 description: Código de ubicación de la mesa
 *                 example: 1
 *               FKEstado:
 *                 type: integer
 *                 description: Estado de la mesa (opcional, por defecto activo)
 *                 example: 1
 *     responses:
 *       200:
 *         description: Mesa creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 typeResult:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Mesa registrada exitosamente"
 *                 result:
 *                   type: object
 *                   properties:
 *                     Codigo:
 *                       type: integer
 *                       example: 15
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /RESV/EditarMesa:
 *   put:
 *     summary: Editar una mesa existente
 *     tags: [Mesas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CodigoMesa
 *             properties:
 *               CodigoMesa:
 *                 type: integer
 *                 description: Código de la mesa a editar
 *                 example: 1
 *               Nombre:
 *                 type: string
 *                 description: Nuevo nombre de la mesa
 *                 example: "Mesa VIP 1"
 *               Capacidad:
 *                 type: integer
 *                 description: Nueva capacidad de la mesa
 *                 example: 6
 *               FKCodigoUbicacionMesa:
 *                 type: integer
 *                 description: Nueva ubicación de la mesa
 *                 example: 2
 *               FKEstado:
 *                 type: integer
 *                 description: Nuevo estado de la mesa
 *                 example: 1
 *     responses:
 *       200:
 *         description: Mesa editada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 typeResult:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Mesa editada correctamente"
 *                 result:
 *                   type: object
 *                   properties:
 *                     Codigo:
 *                       type: integer
 *                       example: 1
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /RESV/EliminarMesa:
 *   delete:
 *     summary: Eliminar (desactivar) una mesa existente
 *     tags: [Mesas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CodigoMesa
 *             properties:
 *               CodigoMesa:
 *                 type: integer
 *                 description: Código de la mesa a eliminar
 *                 example: 1
 *     responses:
 *       200:
 *         description: Mesa eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 typeResult:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Mesa marcada como inactiva correctamente"
 *                 result:
 *                   type: object
 *                   properties:
 *                     Codigo:
 *                       type: integer
 *                       example: 1
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

// Rutas de mesas
router.get("/ObtenerMesas", authMiddleware, ObtenerMesasController);
router.post("/CrearMesa", authMiddleware, CrearMesaController);
router.put("/EditarMesa", authMiddleware, EditarMesaController);
router.delete("/EliminarMesa", authMiddleware, EliminarMesaController);
router.get(
  "/ObtenerMesas/total-mesas",
  authMiddleware,
  ObtenerTotalMesasController
);

/**
 * @swagger
 * components:
 *   schemas:
 *     SolicitudEvento:
 *       type: object
 *       required:
 *         - FechaEvento
 *         - CodigoTipoEvento
 *         - NumeroInvitados
 *       properties:
 *         CodigoSolicitud:
 *           type: number
 *           description: Código único de la solicitud de evento (auto-generado)
 *         FechaEvento:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora del evento
 *         CodigoTipoEvento:
 *           type: number
 *           description: Código del tipo de evento
 *         CodigoPersona:
 *           type: number
 *           description: Código de la persona que solicita el evento
 *         NumeroInvitados:
 *           type: number
 *           description: Número de invitados para el evento
 *         CodigoEstado:
 *           type: number
 *           description: Estado de la solicitud (1-Pendiente, 2-Confirmado, 3-Cancelado, etc.)
 *         Notas:
 *           type: string
 *           description: Notas adicionales sobre el evento
 *         CodigoUsuario:
 *           type: number
 *           description: Usuario que registra la solicitud
 *         Nombres:
 *           type: string
 *           description: Nombres de la persona (solo para creación sin código de persona)
 *         Correo:
 *           type: string
 *           description: Correo de la persona (solo para creación sin código de persona)
 *         Telefono:
 *           type: string
 *           description: Teléfono de la persona (solo para creación sin código de persona)
 *       example:
 *         CodigoSolicitud: 1
 *         FechaEvento: "2023-12-15T19:00:00"
 *         CodigoTipoEvento: 3
 *         CodigoPersona: 12
 *         NumeroInvitados: 50
 *         CodigoEstado: 1
 *         Notas: "Necesitamos equipo de sonido adicional"
 *         CodigoUsuario: 1
 *         Nombres: "Juan"
 *         Correo: "juan@example.com"
 *         Telefono: "12345678"
 */

/**
 * @swagger
 * tags:
 *   name: SolicitudesEventos
 *   description: Servicios para la gestión de solicitudes de eventos
 */

/**
 * @swagger
 * /RESV/ObtenerSolicitudesEventos:
 *   get:
 *     summary: Obtener listado de solicitudes de eventos o una en específico
 *     tags: [SolicitudesEventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: CodigoSolicitud
 *         schema:
 *           type: integer
 *         required: false
 *         description: Código de solicitud específica a obtener
 *       - in: query
 *         name: CodigoEstado
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filtrar por código de estado
 *       - in: query
 *         name: Busqueda
 *         schema:
 *           type: string
 *         required: false
 *         description: Búsqueda por nombre de persona, correo o teléfono
 *       - in: query
 *         name: Pagina
 *     responses:
 *       200:
 *         description: Listado de solicitudes de eventos
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SolicitudEvento'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /RESV/CrearSolicitudEvento:
 *   post:
 *     summary: Crear una nueva solicitud de evento
 *     tags: [SolicitudesEventos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FechaEvento:
 *                 type: string
 *                 format: date-time
 *               CodigoTipoEvento:
 *                 type: integer
 *               CodigoPersona:
 *                 type: integer
 *                 nullable: true
 *               NumeroInvitados:
 *                 type: integer
 *               Notas:
 *                 type: string
 *                 nullable: true
 *               Nombres:
 *                 type: string
 *                 nullable: true
 *               Correo:
 *                 type: string
 *                 nullable: true
 *               Telefono:
 *                 type: string
 *                 nullable: true
 *             required:
 *               - FechaEvento
 *               - CodigoTipoEvento
 *               - NumeroInvitados
 *     responses:
 *       200:
 *         description: Solicitud de evento creada exitosamente
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
 *                   $ref: '#/components/schemas/SolicitudEvento'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /RESV/EditarSolicitudEvento:
 *   put:
 *     summary: Editar una solicitud de evento existente
 *     tags: [SolicitudesEventos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SolicitudEvento'
 *     responses:
 *       200:
 *         description: Solicitud de evento actualizada exitosamente
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
 *                   $ref: '#/components/schemas/SolicitudEvento'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /RESV/CancelarSolicitudEvento:
 *   put:
 *     summary: Cancelar una solicitud de evento
 *     tags: [SolicitudesEventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: CodigoSolicitud
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código de la solicitud a cancelar
 *     responses:
 *       200:
 *         description: Solicitud de evento cancelada exitosamente
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
 *                   $ref: '#/components/schemas/SolicitudEvento'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /RESV/ConfirmarSolicitudEvento:
 *   put:
 *     summary: Confirmar una solicitud de evento
 *     tags: [SolicitudesEventos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: CodigoSolicitud
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código de la solicitud a confirmar
 *     responses:
 *       200:
 *         description: Solicitud de evento confirmada exitosamente
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
 *                   $ref: '#/components/schemas/SolicitudEvento'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

router.get(
  "/ObtenerSolicitudesEventos",
  authMiddleware,
  ObtenerSolicitudesEventosController
);

router.get(
  "/ObtenerSolicitudesEventos/total-eventos",
  authMiddleware,
  ObtenerTotalEventosController
);
router.post(
  "/CrearSolicitudEvento",
  authMiddleware,
  CrearSolicitudEventoController
);
router.post("/CrearSolicitudEventoWEB", CrearSolicitudEventoControllerWEB);
router.put(
  "/EditarSolicitudEvento",
  authMiddleware,
  EditarSolicitudEventoController
);
router.put(
  "/CancelarSolicitudEvento",
  authMiddleware,
  CancelarSolicitudEventoController
);
router.put(
  "/ConfirmarSolicitudEvento",
  authMiddleware,
  ConfirmarSolicitudEventoController
);


//SOLICITUD MENU DEGUSTACION

/**
 * @swagger
 * components:
 *   schemas:
 *     SolicitudMenuDegustacion:
 *       type: object
 *       required:
 *         - NumeroPersonas
 *       properties:
 *         CodigoSolicitud:
 *           type: number
 *           description: Código único de la solicitud de degustación (auto-generado)
 *         CodigoPersona:
 *           type: number
 *           description: Código de la persona que solicita la degustación
 *         NumeroPersonas:
 *           type: number
 *           description: Número de personas para la degustación
 *         CodigoEstado:
 *           type: number
 *           description: Estado de la solicitud (1-Pendiente, 2-Confirmado, 3-Cancelado, etc.)
 *         Notas:
 *           type: string
 *           description: Notas adicionales sobre la degustación
 *         CodigoUsuario:
 *           type: number
 *           description: Usuario que registra la solicitud
 *         Nombres:
 *           type: string
 *           description: Nombres de la persona (solo para creación sin código de persona)
 *         Correo:
 *           type: string
 *           description: Correo de la persona (solo para creación sin código de persona)
 *         Telefono:
 *           type: string
 *           description: Teléfono de la persona (solo para creación sin código de persona)
 *       example:
 *         CodigoSolicitud: 1
 *         CodigoPersona: 12
 *         NumeroPersonas: 4
 *         CodigoEstado: 1
 *         Notas: "Alergia a los mariscos"
 *         CodigoUsuario: 1
 *         Nombres: "Juan"
 *         Correo: "juan@example.com"
 *         Telefono: "12345678"
 */

/**
 * @swagger
 * tags:
 *   name: SolicitudesMenuDegustacion
 *   description: Servicios para la gestión de solicitudes de menú de degustación
 */

/**
 * @swagger
 * /RESV/ObtenerSolicitudesMenuDegustacion:
 *   get:
 *     summary: Obtener listado de solicitudes de degustación o una en específico
 *     tags: [SolicitudesMenuDegustacion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: CodigoSolicitud
 *         schema:
 *           type: integer
 *         required: false
 *         description: Código de solicitud específica a obtener
 *       - in: query
 *         name: CodigoEstado
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filtrar por código de estado
 *       - in: query
 *         name: Busqueda
 *         schema:
 *           type: string
 *         required: false
 *         description: Búsqueda por nombre de persona, correo o teléfono
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
 *         description: Listado de solicitudes de degustación
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SolicitudMenuDegustacion'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /RESV/CrearSolicitudMenuDegustacion:
 *   post:
 *     summary: Crear una nueva solicitud de degustación
 *     tags: [SolicitudesMenuDegustacion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CodigoPersona:
 *                 type: integer
 *                 nullable: true
 *               NumeroPersonas:
 *                 type: integer
 *               Notas:
 *                 type: string
 *                 nullable: true
 *               Nombres:
 *                 type: string
 *                 nullable: true
 *               Correo:
 *                 type: string
 *                 nullable: true
 *               Telefono:
 *                 type: string
 *                 nullable: true
 *             required:
 *               - NumeroPersonas
 *     responses:
 *       200:
 *         description: Solicitud de degustación creada exitosamente
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
 *                   $ref: '#/components/schemas/SolicitudMenuDegustacion'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /RESV/EditarSolicitudMenuDegustacion:
 *   put:
 *     summary: Editar una solicitud de degustación existente
 *     tags: [SolicitudesMenuDegustacion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SolicitudMenuDegustacion'
 *     responses:
 *       200:
 *         description: Solicitud de degustación actualizada exitosamente
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
 *                   $ref: '#/components/schemas/SolicitudMenuDegustacion'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /RESV/CancelarSolicitudMenuDegustacion:
 *   put:
 *     summary: Cancelar una solicitud de degustación
 *     tags: [SolicitudesMenuDegustacion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: CodigoSolicitud
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código de la solicitud a cancelar
 *     responses:
 *       200:
 *         description: Solicitud de degustación cancelada exitosamente
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
 *                   $ref: '#/components/schemas/SolicitudMenuDegustacion'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

/**
 * @swagger
 * /RESV/ConfirmarSolicitudMenuDegustacion:
 *   put:
 *     summary: Confirmar una solicitud de degustación
 *     tags: [SolicitudesMenuDegustacion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: CodigoSolicitud
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código de la solicitud a confirmar
 *     responses:
 *       200:
 *         description: Solicitud de degustación confirmada exitosamente
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
 *                   $ref: '#/components/schemas/SolicitudMenuDegustacion'
 *       400:
 *         $ref: '#/components/responses/StandardResponse400'
 *       500:
 *         $ref: '#/components/responses/StandardResponse500'
 */

router.get(
  "/ObtenerSolicitudesMenuDegustacion",
  authMiddleware,
  ObtenerSolicitudesMenuDegustacionController
);
router.get(
  "/ObtenerSolicitudesMenuDegustacion/total-menu-degustacion",
  authMiddleware,
  ObtenerTotalMenuDegustacionesController
);
router.post(
  "/CrearSolicitudMenuDegustacion",
  authMiddleware,
  CrearSolicitudMenuDegustacionController
);
router.post("/CrearSolicitudMenuDegustacionWEB", CrearSolicitudMenuDegustacionControllerWEB);
router.put(
  "/EditarSolicitudMenuDegustacion",
  authMiddleware,
  EditarSolicitudMenuDegustacionController
);
router.put(
  "/CancelarSolicitudMenuDegustacion",
  authMiddleware,
  CancelarSolicitudMenuDegustacionController
);
router.put(
  "/ConfirmarSolicitudMenuDegustacion",
  authMiddleware,
  ConfirmarSolicitudMenuDegustacionController
);
export default router;
