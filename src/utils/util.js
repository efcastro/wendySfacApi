import { response } from "../middlewares/Response.js";
import {
  TypeResultErrorControlado,
  TypeResultErrorNoControlado,
  TypeResultExitoso,
} from "./constantes.js";
import { config } from "dotenv";
import CryptoJS from "crypto-js";
import os from "os";


config();

const SECRET_KEY = process.env.SECRET_KEY;

export const ValidarRespuestaSp = (typeResult, message, result = null) => {
  try {
    if (typeResult === TypeResultExitoso) {
      return {
        status: 200,
        response: response(result, TypeResultExitoso, message),
      };
    } else if (typeResult === TypeResultErrorControlado) {
      return {
        status: 400,
        response: response(null, TypeResultErrorControlado, message),
      };
    } else {
      return {
        status: 500,
        response: response(null, TypeResultErrorNoControlado, message),
      };
    }
  } catch (err) {
    console.error("ValidarRespuestaSp", err);
    return {
      status: 500,
      response: response(null, TypeResultErrorNoControlado, err),
    };
  }
};

export const CatchControlador = (res, err) => {
  try {
    const errorMessage =
    err?.response?.message ||
    err?.message ||  
    JSON.stringify(err);
    res.status(500).json(
      response(
        null,
        TypeResultErrorNoControlado,
        `Error interno del servidor: ${errorMessage}`
      )
    );
  } catch (error) {
    console.error("CatchControlador", error);
    res.status(500).json(
      response(
        null,
        TypeResultErrorNoControlado,
        `Error interno del servidor: ${error.toString()}`
      )
    );
  }
};

export const IsNull = (valor) => {
  if (
    valor === "" ||
    valor == null ||
    (Array.isArray(valor) && valor.length === 0) ||
    valor === '[]'
  ) {
    return null;
  }
  return valor;
};

export const handleEncrypt = (data) => {
  try {
    if (!SECRET_KEY) throw new Error("SECRET_KEY no definida");
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      SECRET_KEY
    ).toString();
    return encrypted;
  } catch (error) {
    console.error("Error al encriptar:", error);
    throw new Error("Fallo en la encriptación");
  }
};

// Desencripta un objeto o string
export const handleDecrypt = (encryptedData) => {
  
  try {
    if (!SECRET_KEY) throw new Error("SECRET_KEY no definida");
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) throw new Error("Desencriptación fallida");
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Error al desencriptar:", error);
    throw new Error("Fallo en la desencriptación");
  }
};


export function getLocalIp() {
  const networkInterfaces = os.networkInterfaces();
  const addresses = [];

  for (const interfaceName of Object.keys(networkInterfaces)) {
    for (const net of networkInterfaces[interfaceName]) {
      if (net.family === "IPv4" && !net.internal) {
        addresses.push(net.address);
      }
    }
  }

  return addresses;
}

export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};