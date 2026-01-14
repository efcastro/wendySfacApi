import { CatchControlador } from "../utils/util.js";
import {
  generarFactura,
  obtenerInformacionFactura,
  generarAperturaCaja,
  generarCierreCaja
} from "../services/factura.services.js";


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

export const generarAperturaCajaHandler = async (req, res) => {
  try {
    const result = await generarAperturaCaja(req.body);
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("generarAperturaCajaHandler:", err);
    CatchControlador(res, err);
  }
};

export const generarCierreCajaHandler = async (req, res) => {
  try {
    const result = await generarCierreCaja(req.body);
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("generarCierreCajaHandler:", err);
    CatchControlador(res, err);
  }
};
