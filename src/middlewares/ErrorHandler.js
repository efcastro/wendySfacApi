import { TypeResultErrorNoControlado } from "../utils/constantes.js";
import { response } from "./Response.js";

export const errorhandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.code === "ETIMEDOUT") {
    return res.status(504).json(
      response(null, TypeResultErrorNoControlado, "Timeout de conexión con la impresora")
    );
  }

  res.status(500).json(
    response(null, TypeResultErrorNoControlado, "Error en el servidor")
  );
};