import { pool } from "../db.js";
import { IsNull, ValidarRespuestaSp } from "../utils/util.js";
import {
  TypeResultErrorNoControlado,
  SpObtenerCatalogo,
} from "../utils/constantes.js";

export const ObtenerCatalogo = async (datos) => {
  try {
    const { NombreTabla, Tipo, Pagina, TamanoPagina, CodigoUsuario } = datos;
    // Extraer los parámetros en el orden correcto
    const Params = {
      pcNombreTabla: IsNull(NombreTabla),
      pcTipo: IsNull(Tipo),
      pnPagina: IsNull(Pagina),
      pnTamanoPagina: IsNull(TamanoPagina),
      pnCodigoUsuario: IsNull(CodigoUsuario),
    };
    const orderedParams = Object.values(Params);
    // Ejecutar el procedimiento almacenado
    await pool.query(
      `CALL ${SpObtenerCatalogo}(?, ?, ?, ?,?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];
    
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("ObtenerCatalogoService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "ObtenerCatalogoService: " + err
    );
  }
};
