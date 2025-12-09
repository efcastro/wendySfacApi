import { pool } from "../db.js";
import { IsNull, ValidarRespuestaSp } from "../utils/util.js";
import {
  TypeResultErrorNoControlado,
  SpGestionarPersonas,
} from "../utils/constantes.js";

export const GestionarPersonas = async (TipoOperacion, datos) => {
  try {
    const {
      CodigoPersona,
      CodigoTipoPersona,
      IdentidadRtn,
      Nombres,
      Apellidos,
      Correo,
      Telefono,
      Domicilio,
      CodigoEstado,
      CodigoUsuario,
      Busqueda,
      Pagina,
      TamanoPagina,
    } = datos;
    
    // Extraer los parámetros en el orden correcto
    const Params = {
      pnTipoOperacion: TipoOperacion,
      pnCodigoPersona: IsNull(CodigoPersona),
      pnCodigoTipoPersona: IsNull(CodigoTipoPersona),
      pnIdentidadRtn: IsNull(IdentidadRtn),
      pcNombres: IsNull(Nombres),
      pcApellidos: IsNull(Apellidos),
      pcCorreo: IsNull(Correo),
      pcTelefono: IsNull(Telefono),
      pcDomicilio: IsNull(Domicilio),
      pnCodigoEstado: IsNull(CodigoEstado),
      pcBusqueda: IsNull(Busqueda),
      pnPagina: IsNull(Pagina),
      pnTamanoPagina: IsNull(TamanoPagina),
      pnCodigoUsuario: IsNull(CodigoUsuario)      
    };
    const orderedParams = Object.values(Params);
    
    // Ejecutar el procedimiento almacenado
    await pool.query(
      `CALL ${SpGestionarPersonas}(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("GestionarPersonasService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "GestionarPersonasService: " + err
    );
  }
};
