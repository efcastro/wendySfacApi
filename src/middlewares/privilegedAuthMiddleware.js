import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { GestionarUsuarios } from "../services/user.services.js";
import { TipoOperacionObtener, SALT_ROUNDS } from "../utils/constantes.js";
import { handleDecrypt } from "../utils/util.js";

config();

const SECRET_KEY = process.env.JWT_SECRET;

export const privilegedAuthMiddleware = async (req, res, next) => {
  const encryptedCredentials = req.body.privilegedUser;

  try {
    if (encryptedCredentials) {
      const { Token } = handleDecrypt(encryptedCredentials);
      let decoded;
      if (Token) {
        try {
          decoded = jwt.verify(Token, SECRET_KEY);
        } catch (err) {
          return res.status(403).json({
            typeResult: 2,
            message: "Sesión privilegiada expirada",
            result: null,
          });
        }
      }
      req.privilegedUser = {
        CodigoUsuario: decoded.userId,
      };
    }
    next();
  } catch (error) {
    console.error("Error en privilegedAuthMiddleware:", error);
    return res
      .status(403)
      .json({ message: "Autenticación adicional fallida." });
  }
};
