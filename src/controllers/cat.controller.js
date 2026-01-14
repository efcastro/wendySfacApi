import { CatchControlador } from "../utils/util.js";
import {
  ObtenerCatalogo,
  ObtenerCategorias,
  CrearCategoria,
  EditarCategoria,
  EliminarCategoria,
  ObtenerUbicaciones,
  CrearUbicacion,
  EditarUbicacion,
  EliminarUbicacion
} from "../services/cat.services.js";

export const ObtenerCatalogoController = async (req, res) => {
  try {
    const result = await ObtenerCatalogo({
      ...req.query,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerCatalogoController:", err);
    CatchControlador(res, err);
  }
};

export const ObtenerCatalogoControllerWEB = async (req, res) => {
  try {
    const result = await ObtenerCatalogo({
      ...req.query,
      // CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerCatalogoController:", err);
    CatchControlador(res, err);
  }
};

// ==========================================
// CONTROLADORES DE CATEGORÍAS
// ==========================================

export const ObtenerCategoriasController = async (req, res) => {
  try {
    const result = await ObtenerCategorias({
      ...req.query,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerCategoriasController:", err);
    CatchControlador(res, err);
  }
};

export const CrearCategoriaController = async (req, res) => {
  try {
    const result = await CrearCategoria({
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearCategoriaController:", err);
    CatchControlador(res, err);
  }
};

export const EditarCategoriaController = async (req, res) => {
  try {
    const result = await EditarCategoria({
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EditarCategoriaController:", err);
    CatchControlador(res, err);
  }
};

export const EliminarCategoriaController = async (req, res) => {
  try {
    const result = await EliminarCategoria({
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EliminarCategoriaController:", err);
    CatchControlador(res, err);
  }
};

// ==========================================
// CONTROLADORES DE UBICACIONES
// ==========================================

export const ObtenerUbicacionesController = async (req, res) => {
  try {
    const result = await ObtenerUbicaciones({
      ...req.query,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("ObtenerUbicacionesController:", err);
    CatchControlador(res, err);
  }
};

export const CrearUbicacionController = async (req, res) => {
  try {
    const result = await CrearUbicacion({
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("CrearUbicacionController:", err);
    CatchControlador(res, err);
  }
};

export const EditarUbicacionController = async (req, res) => {
  try {
    const result = await EditarUbicacion({
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EditarUbicacionController:", err);
    CatchControlador(res, err);
  }
};

export const EliminarUbicacionController = async (req, res) => {
  try {
    const result = await EliminarUbicacion({
      ...req.body,
      CodigoUsuario: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("EliminarUbicacionController:", err);
    CatchControlador(res, err);
  }
};
