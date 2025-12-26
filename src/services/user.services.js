import bcrypt from "bcryptjs";
import { pool } from "../db.js";
import {
  TypeResultErrorNoControlado,
  SPGestionarUsuarios,
  TipoOperacionLogin,
  SALT_ROUNDS,
  TipoOperacionCrear,
  TypeResultErrorControlado,
  TipoOperacionCambioContrasena,
  TypeResultExitoso,
} from "../utils/constantes.js";
import { IsNull, ValidarRespuestaSp } from "../utils/util.js";

export const GestionarUsuarios = async (TipoOperacion, datos) => {
  try {
    const {
      CodigoUsuario,
      Nombres,
      Apellidos,
      Telefono,
      Correo,
      Contrasena,
      FKEstado,
      CodigoRol,
      CodigoUsuarioConsumo,
    } = datos;
    
    let contrasenaEncriptada = null;
    // Encriptar contraseña para crear usuario o cambiar contraseña
    if (
      (TipoOperacion === TipoOperacionCrear ||
        TipoOperacion === TipoOperacionCambioContrasena) &&
      Contrasena
    ) {
      const contrasenaAEncriptar = Contrasena;
      contrasenaEncriptada = await bcrypt.hash(
        contrasenaAEncriptar,
        SALT_ROUNDS
      );
    }


    

    const params = {
      pnTipoOperacion: TipoOperacion,
      pnCodigoUsuario: IsNull(CodigoUsuario),
      pcNombres: IsNull(Nombres),
      pcApellidos: IsNull(Apellidos),
      pcTelefono: IsNull(Telefono),
      pcCorreo: IsNull(Correo),
      pcContrasena: IsNull(contrasenaEncriptada),
      pnFKEstado: IsNull(FKEstado),
      pnFKRol: IsNull(CodigoRol),
      pnCodigoUsuarioConsumo: IsNull(CodigoUsuarioConsumo),
    };

    const orderedParams = Object.values(params);

    await pool.query(
      `CALL ${SPGestionarUsuarios}(?, ?, ?, ?, ?, ?, ?, ?, ?,?, @pnTypeResult, @pcResult, @pcMessage);`,
      [...orderedParams]
    );
    const [output] = await pool.query(
      `SELECT @pnTypeResult AS typeResult, @pcResult AS result, @pcMessage AS message;`
    );
    let { typeResult, result, message } = output[0];
    // Procesamiento especial para login
    if (TipoOperacion == TipoOperacionLogin) {
      const userData = JSON.parse(result);

      // Verificar contraseña si existe en los datos
      if (Contrasena) {
        const passwordMatch = await bcrypt.compare(
          Contrasena,
          userData.Contrasena
        );

        if (!passwordMatch) {
          return ValidarRespuestaSp(
            TypeResultErrorControlado,
            "Credenciales inválidas",
            null
          );
        }

        // Eliminar contraseña del objeto antes de devolverlo
        delete userData.Contrasena;
      }

      return ValidarRespuestaSp(typeResult, message, userData);
    }

    // Procesamiento para cambio de contraseña
    if (
      TipoOperacion === TipoOperacionCambioContrasena &&
      typeResult === TypeResultExitoso
    ) {
      return ValidarRespuestaSp(typeResult, message, {
        success: true,
        email: Correo,
      });
    }

    return ValidarRespuestaSp(typeResult, message, result);
  } catch (err) {
    console.error("GestionarUsuariosService:", err);
    return ValidarRespuestaSp(
      TypeResultErrorNoControlado,
      "GestionarUsuariosService:" + err,
      null
    );
  }
};
