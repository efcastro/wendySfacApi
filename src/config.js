import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Convierte import.meta.url a una ruta de archivo normal
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.resolve(__dirname, "../.env") });

export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_DATABASE = process.env.DB_DATABASE;
//KEYS
export const SECRET_KEY= process.env.SECRET_KEY
export const JWT_SECRET= process.env.JWT_SECRET

export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;

export const PORT = 4241;

export const isProduction = process.env.NODE_ENV === 'production';