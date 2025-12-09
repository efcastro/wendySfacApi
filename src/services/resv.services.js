import { pool } from "../db.js";
import { IsNull, ValidarRespuestaSp } from "../utils/util.js";
import {
  TypeResultErrorNoControlado,
  SpGestionarReservas,
  SpGestionarMesas,
  SpGestionarSolicitudesEventos,
  SpGestionarSolicitudesMenuDegustacion
} from "../utils/constantes.js";

export const GestionarReservas = async (TipoOperacion, datos) => {
  try {
    const {
      CodigoReserva,
      CodigoPersona,
      CodigoMesa,
      NumeroPersonas,
      CodigoEstado,
      FechaReserva,
      CodigoUsuario,
      Busqueda,
      Pagina,
      TamanoPagina,
      Nombre,
      Correo,
      Telefono,
      Notas
    } = datos;
    
    // Extraer los parámetros en el orden correcto
    const Params = {
      pnTipoOperacion: TipoOperacion,
      pnCodigoReserva: IsNull(CodigoReserva),
      pnCodigoPersona: IsNull(CodigoPersona),
      pnCodigoMesa: IsNull(CodigoMesa),
      pnNumeroPersonas: IsNull(NumeroPersonas),
      pnCodigoEstado: IsNull(CodigoEstado),
      pdFechaReserva: IsNull(FechaReserva),
      pnCodigoUsuario: IsNull(CodigoUsuario),
      pcBusqueda: IsNull(Busqueda),
      pnPagina: IsNull(Pagina),
      pnTamanoPagina: IsNull(TamanoPagina),
      pcNombres: IsNull(Nombre),
      pcCorreo: IsNull(Correo),
      pcTelefono: IsNull(Telefono),
      pcNotas: IsNull(Notas),
    };
    const orderedParams = Object.values(Params);
    
    //Ejecutar el procedimiento almacenado
    await pool.query(
      `CALL ${SpGestionarReservas}(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,? , @pnTypeResult, @pcResult, @pcMessage);`,
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

export const ObtenerTotalReservas = async () => {
  try {
    const query = "SELECT COUNT(*) AS totalReservas FROM resv_Reservas";
    const [result] = await pool.query(query);

    // Retornar el resultado
    return {
      status: 200,
      response: {
        result: result[0].totalReservas,
        typeResult: 0,
        message: "Se obtuvieron todos las reservas",
      },
    };
  } catch (err) {
    console.error("ObtenerTotalReservasService:", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "ObtenerTotalReservasService: " + err
    );
  }
};

export const ObtenerLayoutService = async (ubicacionId) => {
  try {
    const query =
      "SELECT layout_json, background_image FROM resv_MesasLayout WHERE ubicacion_id = ?";
    const [rows] = await pool.query(query, [ubicacionId]);

    return {
      status: 200,
      response: {
        result: rows[0] || {},
        typeResult: 0,
        message: "Layout obtenido correctamente",
      },
    };
  } catch (err) {
    console.error("ObtenerLayoutService:", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "ObtenerLayoutService: " + err
    );
  }
};

export const GuardarLayoutService = async (
  ubicacionId,
  layout,
  backgroundImage
) => {
  try {
    const query = `
  INSERT INTO resv_MesasLayout (ubicacion_id, layout_json, background_image)
  VALUES (?, ?, ?)
  ON DUPLICATE KEY UPDATE 
    layout_json = VALUES(layout_json), 
    background_image = VALUES(background_image)
`;

    await pool.query(query, [
      ubicacionId,
      JSON.stringify(layout),
      backgroundImage,
    ]);

    return {
      status: 200,
      response: {
        result: null,
        typeResult: 0,
        message: "Layout guardado correctamente",
      },
    };
  } catch (err) {
    console.error("GuardarLayoutService:", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "GuardarLayoutService: " + err
    );
  }
};



export const GestionarMesas = async (TipoOperacion, datos) => {
  try {
    const {
      Codigo,
      Nombre,
      Capacidad,
      FKCodigoUbicacionMesa,
      FKEstado,
      CodigoUsuario,
      Busqueda,
      Pagina,
      TamanoPagina,
    } = datos;
    
    
    // Extraer los parámetros en el orden correcto
    const Params = {
      pnTipoOperacion: TipoOperacion,
      pnCodigoMesa: IsNull(Codigo),
      pcNombre: IsNull(Nombre),
      pnCapacidad: IsNull(Capacidad),
      pnFKCodigoUbicacionMesa: IsNull(FKCodigoUbicacionMesa),
      pnFKEstado: IsNull(FKEstado),
      pnCodigoUsuario: IsNull(CodigoUsuario),
      pcBusqueda: IsNull(Busqueda),
      pnPagina: IsNull(Pagina),
      pnTamanoPagina: IsNull(TamanoPagina),
    };

    const orderedParams = Object.values(Params);
    
    //Ejecutar el procedimiento almacenado
    await pool.query(
      `CALL ${SpGestionarMesas}(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
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

export const ObtenerTotalMesas = async () => {
  try {
    const query = "SELECT COUNT(*) AS totalMesas FROM resv_Mesas";
    const [result] = await pool.query(query);

    // Retornar el resultado
    return {
      status: 200,
      response: {
        result: result[0].totalMesas,
        typeResult: 0,
        message: "Se obtuvieron todas las Mesas",
      },
    };
  } catch (err) {
    console.error("ObtenerTotalMesasService:", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "ObtenerTotalMesasService: " + err
    );
  }
};


export const GestionarSolicitudesEventos = async (TipoOperacion, datos) => {
  try {
    const {
      CodigoSolicitud,
      FechaEvento,
      CodigoTipoEvento,
      TipoEvento,
      CodigoPersona,
      NumeroInvitados,
      CodigoEstado,
      CodigoUsuario,
      Busqueda,
      Pagina,
      TamanoPagina,
      Nombre,
      Correo,
      Telefono,
      Notas
    } = datos;

    // Extraer los parámetros en el orden correcto
    const Params = {
      pnTipoOperacion: TipoOperacion,
      pnCodigoSolicitud: IsNull(CodigoSolicitud),
      pdFechaEvento: IsNull(FechaEvento),
      pnCodigoTipoEvento: IsNull(TipoEvento),
      pnCodigoPersona: IsNull(CodigoPersona),
      pnNumeroInvitados: IsNull(NumeroInvitados),
      pnCodigoEstado: IsNull(CodigoEstado),
      pnCodigoUsuario: IsNull(CodigoUsuario),
      pcBusqueda: IsNull(Busqueda),
      pnPagina: IsNull(Pagina),
      pnTamanoPagina: IsNull(TamanoPagina),
      pcNombres: IsNull(Nombre),
      pcCorreo: IsNull(Correo),
      pcTelefono: IsNull(Telefono),
      pcNotas: IsNull(Notas),
    };
    const orderedParams = Object.values(Params);
    
    // Ejecutar el procedimiento almacenado
    await pool.query(
      `CALL ${SpGestionarSolicitudesEventos}(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );

    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("GestionarSolicitudesEventos:", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "GestionarSolicitudesEventos: " + err.message
    );
  }
};

export const GestionarSolicitudesMenuDegustacion = async (TipoOperacion, datos) => {
  try {
    const {
      CodigoSolicitud,
      CodigoPersona,
      NumeroPersonas,
      CodigoEstado,
      CodigoUsuario,
      Busqueda,
      Pagina,
      TamanoPagina,
      Nombres,
      Correo,
      Telefono,
      Notas
    } = datos;


    // Extraer los parámetros en el orden correcto
    const Params = {
      pnTipoOperacion: TipoOperacion,
      pnCodigoSolicitud: IsNull(CodigoSolicitud),
      pnCodigoPersona: IsNull(CodigoPersona),
      pnNumeroPersonas: IsNull(NumeroPersonas),
      pnCodigoEstado: IsNull(CodigoEstado),
      pnCodigoUsuario: IsNull(CodigoUsuario),
      pcBusqueda: IsNull(Busqueda),
      pnPagina: IsNull(Pagina),
      pnTamanoPagina: IsNull(TamanoPagina),
      pcNombres: IsNull(Nombres),
      pcCorreo: IsNull(Correo),
      pcTelefono: IsNull(Telefono),
      pcNotas: IsNull(Notas),
    };

    const orderedParams = Object.values(Params);
    
    // Ejecutar el procedimiento almacenado
    await pool.query(
      `CALL ${SpGestionarSolicitudesMenuDegustacion}(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );
    
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );

    const { typeResult, result, message } = output[0];
    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("GestionarSolicitudesMenuDegustacion:", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "GestionarSolicitudesMenuDegustacion: " + err.message
    );
  }
};

export const ObtenerTotalEventos = async () => {
  try {
    const query = "SELECT COUNT(*) AS totalReservas FROM resv_SolicitudesEventos";
    const [result] = await pool.query(query);

    // Retornar el resultado
    return {
      status: 200,
      response: {
        result: result[0].totalReservas,
        typeResult: 0,
        message: "Se obtuvieron todos los eventos",
      },
    };
  } catch (err) {
    console.error("ObtenerTotalEventosService:", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "ObtenerTotalEventosService: " + err
    );
  }
};
export const ObtenerTotalMenuDegustaciones = async () => {
  try {
    const query = "SELECT COUNT(*) AS totalReservas FROM resv_SolicitudesMenuDegustacion";
    const [result] = await pool.query(query);

    // Retornar el resultado
    return {
      status: 200,
      response: {
        result: result[0].totalReservas,
        typeResult: 0,
        message: "Se obtuvieron todas las solicitudes de menú degustación",
      },
    };
  } catch (err) {
    console.error("ObtenerTotalMenuDegustaciones:", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "ObtenerTotalEventosService: " + err
    );
  }
};