import sharp from "sharp";
import fs from "fs";
import path from "path";
import { TypeResultExitoso } from "../utils/constantes.js";
// Use absolute path - always point to uploads folder outside of src/
const __dirname = path.resolve();
const uploadsFolder = path.join(__dirname, "..", "uploads");

export const uploadImage = async (file, body) => {
  try {
    if (!file) {
      throw new Error("No file uploaded");
    }

    const { codigo, nombre } = body;
    const filePath = file.path;
    // const nombreArchivo = `${codigo}_${nombre}.jpg`;
    const nombreArchivo = `${codigo}.jpg`;
    const optimizedFilePath = path.join(uploadsFolder, nombreArchivo);

    // Optimizar la imagen con sharp
    await sharp(filePath)
      .resize(800) // Redimensionar la imagen a un ancho de 800px
      .jpeg({ quality: 80 }) // Convertir a JPEG con calidad del 80%
      .toFile(optimizedFilePath);

    // Eliminar el archivo original
    fs.unlinkSync(filePath);

    return {
      typeResult: TypeResultExitoso,
      message: "Imagen subida y optimizada",
      result: `/uploads/${nombreArchivo}`,
    };
  } catch (error) {
    console.error("Error in uploadImage service:", error);
    throw new Error("Error processing image");
  }
};
