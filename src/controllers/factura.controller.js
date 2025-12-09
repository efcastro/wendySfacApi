import { CatchControlador } from "../utils/util.js";
import { generarFactura } from "../services/factura.services.js";
import { obtenerInformacionFactura } from "../services/factura.services.js";


export const generarFacturaHandler = async (req, res) => {
  try {
    const result = await generarFactura(req.body);
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("generarFacturaHandler:", err);
    CatchControlador(res, err);
  }
};

export const obtenerInformacionFacturaHandler = async (req, res) => {
  try {
    const { NumeroFactura } = req.query;
    const result = await obtenerInformacionFactura(NumeroFactura);
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("obtenerInformacionFacturaHandler:", err);
    CatchControlador(res, err);
  }
};