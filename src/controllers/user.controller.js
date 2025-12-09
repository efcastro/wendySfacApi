import bcrypt from 'bcryptjs';
import {
  TipoOperacionCrear,
  TipoOperacionEditar,
  TipoOperacionEliminar,
  TipoOperacionLogin,
  TipoOperacionObtener,
  TipoOperacionObtenerTodos,
  TipoOperacionCambioContrasena
} from "../utils/constantes.js";
import { GestionarUsuarios } from "../services/user.services.js";
import { CatchControlador, IsNull } from "../utils/util.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { SECRET_KEY } from "../config.js";
import { sendVerificationCode } from "../services/mail.services.js";

config();
const codigosVerificacion = new Map(); 

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const registerUser = async (req, res) => {
  try {
    req.body.CodigoUsuarioConsumo = IsNull(req.user?.CodigoUsuario);
    const result = await GestionarUsuarios(TipoOperacionCrear, req.body);
    // Generar token automáticamente después del registro
    if (result?.status === 200 && result?.response?.result) {
      const user = JSON.parse(result.response.result);
      const token = jwt.sign(
        { email: user.Correo, id: user.CodigoUsuario },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      result.response.token = token;
    }
    res.status(result?.status).json(result?.response);
  } catch (err) {
    console.error("registerUser:", err);
    CatchControlador(res, err);
  }
};

export const editUser = async (req, res) => {
  try {
    req.body.CodigoUsuarioConsumo = req.user?.CodigoUsuario;
    const result = await GestionarUsuarios(TipoOperacionEditar, req.body);
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("editUser:", err);
    CatchControlador(res, err);
  }
};

export const deleteUser = async (req, res) => {
  try {
    req.body.CodigoUsuarioConsumo = req.user?.CodigoUsuario;
    const result = await GestionarUsuarios(TipoOperacionEliminar, req.body);
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("deleteUser:", err);
    CatchControlador(res, err);
  }
};

export const getUser = async (req, res) => {
  try {
    const { CodigoUsuario, Correo } = req.query;
    const result = await GestionarUsuarios(TipoOperacionObtener, {
      CodigoUsuario,
      Correo,
      CodigoUsuarioConsumo: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("getUser:", err);
    CatchControlador(res, err);
  }
};

export const iniciarSesionUsuario = async (req, res) => {
  try {
    const { correoElectronico, contrasena } = req.body;

    if (!correoElectronico || !contrasena) {
      return res.status(400).json({
        mensaje: "El correo electrónico y contraseña son requeridos.",
      });
    }
    const result = await GestionarUsuarios(TipoOperacionLogin, {
      Correo: correoElectronico,
      Contrasena: contrasena,
    });

    if (result.status !== 200) {
      return res.status(200).json(result.response);
    }

    // Crear token JWT
    const userData = result.response.result;
    const token = jwt.sign(
      {
        email: userData.Correo,
        userId: userData.CodigoUsuario,
        // otros datos que quieras incluir
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.status(200).json({
      token,
      user: userData,
      typeResult: result?.response?.typeResult,
      message: result?.response?.message,
      SECRET_KEY
    });
  } catch (err) {
    console.error("iniciarSesionUsuario:", err);
    CatchControlador(res, err);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await GestionarUsuarios(TipoOperacionObtenerTodos, {
      Pagina: page,
      Limite: limit,
      CodigoUsuarioConsumo: req.user?.CodigoUsuario,
    });
    res.status(result.status).json(result.response);
  } catch (err) {
    console.error("getAllUsers:", err);
    CatchControlador(res, err);
  }
};


export const enviarCodigoCambioPassword = async (req, res) => {
  const { correo } = req.body;
  const codigo = Math.floor(100000 + Math.random() * 900000).toString();
  codigosVerificacion.set(correo, codigo);

  try {
    await sendVerificationCode(correo, codigo);
    res.json({ message: 'Código enviado al correo.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error enviando correo.' });
  }
};

export const cambiarPassword = async (req, res) => {
  const { correo, codigo, nuevaContrasena } = req.body;

  const codigoGuardado = codigosVerificacion.get(correo);
  if (!codigoGuardado || codigoGuardado !== codigo) {
    return res.status(400).json({ message: 'Código inválido o expirado' });
  }

  try {
    //const hashed = await bcrypt.hash(nuevaContrasena, 10);
    const result = await GestionarUsuarios(TipoOperacionCambioContrasena, {
      Correo: correo,
      Contrasena: nuevaContrasena,
    });

    codigosVerificacion.delete(correo);

    res.status(result.status).json(result.response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al cambiar contraseña' });
  }
};

export const cambiarPasswordObligatorio = async (req, res) => {
  const { correo, nuevaContrasena } = req.body;
  try {
    //const hashed = await bcrypt.hash(nuevaContrasena, 10);
    const result = await GestionarUsuarios(TipoOperacionCambioContrasena, {
      Correo: correo,
      Contrasena: nuevaContrasena,
    });

    res.status(result.status).json(result.response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al cambiar contraseña' });
  }
};