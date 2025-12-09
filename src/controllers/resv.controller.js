import {
  TipoOperacionCrear,
  TipoOperacionEditar,
  TipoOperacionObtener,
  TipoOperacionEliminar,
  TipoOperacionObtenerTodos,
  TipoOperacionAsignarMesa,
  TipoOperacionConfirmar,
  TipoOperacionCancelar,
} from "../utils/constantes.js";
import { CatchControlador } from "../utils/util.js";
import {
  GestionarReservas,
  ObtenerTotalReservas,
  GuardarLayoutService,
  ObtenerLayoutService,
  GestionarMesas,
  ObtenerTotalMesas,
  GestionarSolicitudesEventos,
  GestionarSolicitudesMenuDegustacion,
  ObtenerTotalEventos,
  ObtenerTotalMenuDegustaciones,
} from "../services/resv.services.js";

export const ObtenerReservasController = async (req, res) => {
  try {
    const result = await GestionarReservas(TipoOperacionObtener, {
      ...req.query,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerReservasController:", err);
    CatchControlador(res, err);
  }
};

export const ObtenerReservasControllerWEB = async (req, res) => {
  try {
    const result = await GestionarReservas(TipoOperacionObtener, {
      ...req.query,
      //CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerReservasControllerWEB:", err);
    CatchControlador(res, err);
  }
};

export const CrearReservaController = async (req, res) => {
  try {
    const result = await GestionarReservas(TipoOperacionCrear, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearReservaController:", err);
    CatchControlador(res, err);
  }
};

export const CrearReservaControllerWEB = async (req, res) => {
  try {
    const result = await GestionarReservas(TipoOperacionCrear, {
      ...req.body,
      // CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearReservaControllerWEB:", err);
    CatchControlador(res, err);
  }
};

export const EditarReservaController = async (req, res) => {
  try {
    const result = await GestionarReservas(TipoOperacionEditar, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EditarReservaController:", err);
    CatchControlador(res, err);
  }
};

export const AsignarMesaController = async (req, res) => {
  try {
    const result = await GestionarReservas(TipoOperacionAsignarMesa, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("AsignarMesaController:", err);
    CatchControlador(res, err);
  }
};

export const ObtenerTotalReservasController = async (req, res) => {
  try {
    const result = await ObtenerTotalReservas();
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerTotalProductosController:", err);
    CatchControlador(res, err);
  }
};

export const ObtenerLayoutController = async (req, res) => {
  try {
    const { ubicacionId } = req.params;
    console.log("ubicacionId", ubicacionId);

    const result = await ObtenerLayoutService(ubicacionId);
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerLayoutController:", err);
    CatchControlador(res, err);
  }
};

export const GuardarLayoutController = async (req, res) => {
  try {
    const { ubicacionId, layout, backgroundImage } = req.body;
    console.log(
      " ubicacionId, layout, backgroundImage",
      ubicacionId,
      layout,
      backgroundImage
    );

    const result = await GuardarLayoutService(
      ubicacionId,
      layout,
      backgroundImage
    );
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("GuardarLayoutController:", err);
    CatchControlador(res, err);
  }
};

export const ObtenerMesasController = async (req, res) => {
  try {
    const result = await GestionarMesas(TipoOperacionObtener, {
      ...req.query,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerMesasController:", err);
    CatchControlador(res, err);
  }
};

export const CrearMesaController = async (req, res) => {
  try {
    const result = await GestionarMesas(TipoOperacionCrear, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearMesaController:", err);
    CatchControlador(res, err);
  }
};

export const EditarMesaController = async (req, res) => {
  try {
    const result = await GestionarMesas(TipoOperacionEditar, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EditarMesaController:", err);
    CatchControlador(res, err);
  }
};

export const EliminarMesaController = async (req, res) => {
  try {
    const result = await GestionarMesas(TipoOperacionEliminar, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EliminarMesaController:", err);
    CatchControlador(res, err);
  }
};

export const ObtenerTotalMesasController = async (req, res) => {
  try {
    const result = await ObtenerTotalMesas();
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerTotalMesasController:", err);
    CatchControlador(res, err);
  }
};

// SOLICITUDES RESERVAS
export const ObtenerSolicitudesEventosController = async (req, res) => {
  try {
    const result = await GestionarSolicitudesEventos(TipoOperacionObtener, {
      ...req.query,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerSolicitudesEventosController:", err);
    CatchControlador(res, err);
  }
};

export const ObtenerTotalEventosController = async (req, res) => {
  try {
    const result = await ObtenerTotalEventos();
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerTotalEventosController:", err);
    CatchControlador(res, err);
  }
};

export const CrearSolicitudEventoController = async (req, res) => {
  try {
    const result = await GestionarSolicitudesEventos(TipoOperacionCrear, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearSolicitudEventoController:", err);
    CatchControlador(res, err);
  }
};

export const CrearSolicitudEventoControllerWEB = async (req, res) => {
  try {
    const result = await GestionarSolicitudesEventos(TipoOperacionCrear, {
      ...req.body,
      // CodigoUsuario: req.user?.CodigoUsuario, // Para WEB podría no tener usuario autenticado
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearSolicitudEventoControllerWEB:", err);
    CatchControlador(res, err);
  }
};

export const EditarSolicitudEventoController = async (req, res) => {
  try {
    const result = await GestionarSolicitudesEventos(TipoOperacionEditar, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EditarSolicitudEventoController:", err);
    CatchControlador(res, err);
  }
};

export const CancelarSolicitudEventoController = async (req, res) => {
  try {
    const result = await GestionarSolicitudesEventos(TipoOperacionCancelar, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CancelarSolicitudEventoController:", err);
    CatchControlador(res, err);
  }
};

export const ConfirmarSolicitudEventoController = async (req, res) => {
  try {
    console.log("ConfirmarSolicitudEventoController - req.query:", req.query);

    const result = await GestionarSolicitudesEventos(TipoOperacionConfirmar, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ConfirmarSolicitudEventoController:", err);
    CatchControlador(res, err);
  }
};

//SOLICITUDES MENU DEGUSTACION
export const ObtenerSolicitudesMenuDegustacionController = async (req, res) => {
  try {
    const result = await GestionarSolicitudesMenuDegustacion(
      TipoOperacionObtener,
      {
        ...req.query,
        CodigoUsuario: req.user?.CodigoUsuario,
      }
    );
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerSolicitudesMenuDegustacionController:", err);
    CatchControlador(res, err);
  }
};

export const CrearSolicitudMenuDegustacionController = async (req, res) => {
  try {
    const result = await GestionarSolicitudesMenuDegustacion(
      TipoOperacionCrear,
      {
        ...req.body,
        CodigoUsuario: req.user?.CodigoUsuario,
      }
    );
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearSolicitudMenuDegustacionController:", err);
    CatchControlador(res, err);
  }
};

export const CrearSolicitudMenuDegustacionControllerWEB = async (req, res) => {
  try {
    const result = await GestionarSolicitudesMenuDegustacion(
      TipoOperacionCrear,
      {
        ...req.body,
        // CodigoUsuario: req.user?.CodigoUsuario, // Para WEB podría no tener usuario autenticado
      }
    );
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearSolicitudMenuDegustacionControllerWEB:", err);
    CatchControlador(res, err);
  }
};

export const EditarSolicitudMenuDegustacionController = async (req, res) => {
  try {
    const result = await GestionarSolicitudesMenuDegustacion(
      TipoOperacionEditar,
      {
        ...req.body,
        CodigoUsuario: req.user?.CodigoUsuario,
      }
    );
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EditarSolicitudMenuDegustacionController:", err);
    CatchControlador(res, err);
  }
};

export const CancelarSolicitudMenuDegustacionController = async (req, res) => {
  try {
    const result = await GestionarSolicitudesMenuDegustacion(
      TipoOperacionCancelar,
      {
        ...req.body,
        CodigoUsuario: req.user?.CodigoUsuario,
      }
    );
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CancelarSolicitudMenuDegustacionController:", err);
    CatchControlador(res, err);
  }
};

export const ConfirmarSolicitudMenuDegustacionController = async (req, res) => {
  try {
    const result = await GestionarSolicitudesMenuDegustacion(
      TipoOperacionConfirmar,
      {
        ...req.body,
        CodigoUsuario: req.user?.CodigoUsuario,
      }
    );
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ConfirmarSolicitudMenuDegustacionController:", err);
    CatchControlador(res, err);
  }
};

export const ObtenerTotalMenuDegustacionesController = async (req, res) => {
  try {
    const result = await ObtenerTotalMenuDegustaciones();
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerTotalMenuDegustacionesController:", err);
    CatchControlador(res, err);
  }
};
