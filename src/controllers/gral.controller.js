import {
  TipoOperacionCrear,
  TipoOperacionEditar,
  TipoOperacionObtener,
} from "../utils/constantes.js";
import { CatchControlador } from "../utils/util.js";
import { GestionarPersonas } from "../services/gral.services.js";

export const ObtenerPersonasController = async (req, res) => {
  try {
    const result = await GestionarPersonas(TipoOperacionObtener, {
      ...req.query,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerPersonasController:", err);
    CatchControlador(res, err);
  }
};

export const CrearPersonaController = async (req, res) => {
  try {
    const result = await GestionarPersonas(TipoOperacionCrear, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearPersonaController:", err);
    CatchControlador(res, err);
  }
};

export const EditarPersonaController = async (req, res) => {
  try {
    const result = await GestionarPersonas(TipoOperacionEditar, {
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EditarPersonaController:", err);
    CatchControlador(res, err);
  }
};
