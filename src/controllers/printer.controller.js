import {
  buscarImpresorasEnRed,
  enviarPruebaDeImpresion,
  GestionarImpresora,
} from "../services/printer.services.js";
import { CatchControlador } from "../utils/util.js";

import {
  TipoOperacionObtener,
  TipoOperacionCrear,
  TipoOperacionEditar,
  TipoOperacionEliminar,
  TipoOperacionActivar,
} from "../utils/constantes.js";

export const obtenerImpresoras = async (req, res, next) => {
  try {
    const result = await buscarImpresorasEnRed();
    res.status(result.status).json(result.response);
  } catch (error) {
    console.error("obtenerImpresoras:", error);
    CatchControlador(res, error);
  }
};

export const pruebaImpresora = async (req, res, next) => {
  try {
    const { ip } = req.body;
    if (!ip)
      return res.status(200).json({ success: false, message: "Falta IP" });

    const result = await await enviarPruebaDeImpresion(ip);
    res.status(result.status).json(result.response);
  } catch (error) {
    console.error("pruebaImpresora:", error);
    CatchControlador(res, error);
  }
};

// COntroladores para CRUD de impresoras
export const ObtenerImpresorasController = async (req, res) => {
  try {
    const result = await GestionarImpresora(TipoOperacionObtener, {
      ...req.query,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerImpresorasController:", err);
    CatchControlador(res, err);
  }
};

export const CrearImpresoraController = async (req, res) => {
  try {
    const result = await GestionarImpresora(TipoOperacionCrear, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearImpresoraController:", err);
    CatchControlador(res, err);
  }
};

export const EditarImpresoraController = async (req, res) => {
  try {
    const usuarioAutorizado = req.privilegedUser || req.user;
    const result = await GestionarImpresora(TipoOperacionEditar, {
      ...req.body,
      CodigoUsuario: usuarioAutorizado?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EditarImpresoraController:", err);
    CatchControlador(res, err);
  }
};

export const EliminarImpresoraController = async (req, res) => {
  try {
    const usuarioAutorizado = req.privilegedUser || req.user;
    const result = await GestionarImpresora(TipoOperacionEliminar, {
      ...req.body,
      CodigoUsuario: usuarioAutorizado?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EliminarImpresoraController:", err);
    CatchControlador(res, err);
  }
};

export const ActivarImpresoraController = async (req, res) => {
  try {
    const usuarioAutorizado = req.privilegedUser || req.user;
    const result = await GestionarImpresora(TipoOperacionActivar, {
      ...req.body,
      CodigoUsuario: usuarioAutorizado?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ActivarImpresoraController:", err);
    CatchControlador(res, err);
  }
};
