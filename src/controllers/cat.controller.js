import { CatchControlador } from "../utils/util.js";
import { ObtenerCatalogo } from "../services/cat.services.js";

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
