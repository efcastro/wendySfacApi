import { pool } from "../db.js";
import { IsNull, ValidarRespuestaSp } from "../utils/util.js";
import {
  TypeResultErrorNoControlado,
  SpObtenerCatalogo,
  SpGestionarCategorias,
  SpGestionarUbicaciones,
  TipoOperacionCrear,
  TipoOperacionEditar,
  TipoOperacionEliminar,
  TipoOperacionObtener,
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

// ==========================================
// SERVICIOS DE CATEGORÍAS
// ==========================================

/**
 * Obtener categorías (todas o una específica)
 */
export const ObtenerCategorias = async (datos) => {
  try {
    const { CodigoCategoria, CodigoUsuario } = datos;
    const Params = {
      pnTipoOperacion: TipoOperacionObtener,
      pnCodigoCategoria: IsNull(CodigoCategoria),
      pcNombre: null,
      pcColor: null,
      pnCodigoUsuario: IsNull(CodigoUsuario),
    };
    const orderedParams = Object.values(Params);
    await pool.query(
      `CALL ${SpGestionarCategorias}(?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("ObtenerCategoriasService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "ObtenerCategoriasService: " + err
    );
  }
};

/**
 * Crear categoría
 */
export const CrearCategoria = async (datos) => {
  try {
    const { Nombre, Color, CodigoUsuario } = datos;
    const Params = {
      pnTipoOperacion: TipoOperacionCrear,
      pnCodigoCategoria: null,
      pcNombre: IsNull(Nombre),
      pcColor: IsNull(Color),
      pnCodigoUsuario: IsNull(CodigoUsuario),
    };
    const orderedParams = Object.values(Params);
    await pool.query(
      `CALL ${SpGestionarCategorias}(?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("CrearCategoriaService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "CrearCategoriaService: " + err
    );
  }
};

/**
 * Editar categoría
 */
export const EditarCategoria = async (datos) => {
  try {
    const { CodigoCategoria, Nombre, Color, CodigoUsuario } = datos;
    const Params = {
      pnTipoOperacion: TipoOperacionEditar,
      pnCodigoCategoria: IsNull(CodigoCategoria),
      pcNombre: IsNull(Nombre),
      pcColor: IsNull(Color),
      pnCodigoUsuario: IsNull(CodigoUsuario),
    };
    const orderedParams = Object.values(Params);
    await pool.query(
      `CALL ${SpGestionarCategorias}(?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("EditarCategoriaService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "EditarCategoriaService: " + err
    );
  }
};

/**
 * Eliminar categoría
 */
export const EliminarCategoria = async (datos) => {
  try {
    const { CodigoCategoria, CodigoUsuario } = datos;
    const Params = {
      pnTipoOperacion: TipoOperacionEliminar,
      pnCodigoCategoria: IsNull(CodigoCategoria),
      pcNombre: null,
      pcColor: null,
      pnCodigoUsuario: IsNull(CodigoUsuario),
    };
    const orderedParams = Object.values(Params);
    await pool.query(
      `CALL ${SpGestionarCategorias}(?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("EliminarCategoriaService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "EliminarCategoriaService: " + err
    );
  }
};

// ==========================================
// SERVICIOS DE UBICACIONES
// ==========================================

/**
 * Obtener ubicaciones (todas o una específica)
 */
export const ObtenerUbicaciones = async (datos) => {
  try {
    const { CodigoUbicacion, CodigoUsuario } = datos;
    const Params = {
      pnTipoOperacion: TipoOperacionObtener,
      pnCodigoUbicacion: IsNull(CodigoUbicacion),
      pcNombre: null,
      pnCodigoUsuario: IsNull(CodigoUsuario),
    };
    const orderedParams = Object.values(Params);
    await pool.query(
      `CALL ${SpGestionarUbicaciones}(?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("ObtenerUbicacionesService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "ObtenerUbicacionesService: " + err
    );
  }
};

/**
 * Crear ubicación
 */
export const CrearUbicacion = async (datos) => {
  try {
    const { Nombre, CodigoUsuario } = datos;
    const Params = {
      pnTipoOperacion: TipoOperacionCrear,
      pnCodigoUbicacion: null,
      pcNombre: IsNull(Nombre),
      pnCodigoUsuario: IsNull(CodigoUsuario),
    };
    const orderedParams = Object.values(Params);
    await pool.query(
      `CALL ${SpGestionarUbicaciones}(?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("CrearUbicacionService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "CrearUbicacionService: " + err
    );
  }
};

/**
 * Editar ubicación
 */
export const EditarUbicacion = async (datos) => {
  try {
    const { CodigoUbicacion, Nombre, CodigoUsuario } = datos;
    const Params = {
      pnTipoOperacion: TipoOperacionEditar,
      pnCodigoUbicacion: IsNull(CodigoUbicacion),
      pcNombre: IsNull(Nombre),
      pnCodigoUsuario: IsNull(CodigoUsuario),
    };
    const orderedParams = Object.values(Params);
    await pool.query(
      `CALL ${SpGestionarUbicaciones}(?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("EditarUbicacionService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "EditarUbicacionService: " + err
    );
  }
};

/**
 * Eliminar ubicación
 */
export const EliminarUbicacion = async (datos) => {
  try {
    const { CodigoUbicacion, CodigoUsuario } = datos;
    const Params = {
      pnTipoOperacion: TipoOperacionEliminar,
      pnCodigoUbicacion: IsNull(CodigoUbicacion),
      pcNombre: null,
      pnCodigoUsuario: IsNull(CodigoUsuario),
    };
    const orderedParams = Object.values(Params);
    await pool.query(
      `CALL ${SpGestionarUbicaciones}(?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("EliminarUbicacionService", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "EliminarUbicacionService: " + err
    );
  }
};
