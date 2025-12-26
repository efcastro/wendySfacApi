import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { GestionarUsuarios } from "../services/user.services.js";
import { TipoOperacionObtener } from "../utils/constantes.js";

config();

const JWT_SECRET = process.env.JWT_SECRET
const JWT_ALGORITHM = process.env.JWT_ALGORITHM 


// Función optimizada para verificar expiración
const isTokenExpired = (token) => {
  try {
    const { exp } = jwt.decode(token);
    if (!exp) return true;
    
    return Date.now() >= exp * 1000; // Compara en milisegundos
  } catch (error) {
    console.error("Error en isTokenExpired:", error);
    return true;
  }
};

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: "No autorizado: Formato de token inválido (se espera 'Bearer token')" 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // 2. Verificar token vacío
    if (!token) {
      return res.status(401).json({ 
        message: "No autorizado: Token no proporcionado" 
      });
    }

    // 3. Verificar expiración
    if (isTokenExpired(token)) {
      return res.status(401).json({ 
        message: "No autorizado: Token expirado" 
      });
    }

    // 4. Verificar firma del token
    const decoded = jwt.verify(token, JWT_SECRET, { 
      algorithms: [JWT_ALGORITHM] 
    });

    // 5. Validar estructura del token decodificado
    if (!decoded?.email) {
      return res.status(403).json({ 
        message: "No autorizado: Estructura de token inválida" 
      });
    }

    // 6. Buscar usuario en base de datos
    const result = await GestionarUsuarios(TipoOperacionObtener, {
      Correo: decoded.email
    });

    if (!result?.response?.result) {
      return res.status(404).json({ 
        message: "Usuario no encontrado" 
      });
    }
    // 7. Adjuntar usuario a la solicitud
    req.user = JSON.parse(result.response.result);
    return next();

  } catch (err) {
    console.error("Error en authMiddleware:", err);
    
    // Manejo específico de errores de JWT
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        message: `No autorizado: ${err.message}` 
      });
    }
    
    // Error de sistema
    return res.status(500).json({ 
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};