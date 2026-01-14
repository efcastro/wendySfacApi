import sharp from "sharp";
import fs from "fs";
import path from "path";
import { TypeResultExitoso } from "../utils/constantes.js";

// Use absolute path - always point to uploads folder outside of src/
const __dirname = path.resolve();
const uploadsFolder = path.join(__dirname, "..", "uploads");
const uploadsComprasFolder = path.join(uploadsFolder, "compras");

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

/**
 * Servicio para subir imágenes de facturas de compras
 * El nombre del archivo sigue el formato estándar: Compra_<CodigoFactura>.<ext>
 * De esta forma la ruta es predecible y no necesita guardarse en BD
 * @param {Object} file - Archivo subido por multer
 * @param {Object} body - Datos del body (codigoFactura)
 * @returns {Object} - Resultado con la ruta del archivo
 */
export const uploadImageCompra = async (file, body) => {
  try {
    if (!file) {
      throw new Error("No file uploaded");
    }

    const { codigoFactura } = body;
    const filePath = file.path;
    const extension = path.extname(file.originalname).toLowerCase();

    // Formato estándar: Compra_<CodigoFactura>.jpg o Compra_<CodigoFactura>.pdf
    const nombreArchivo = `Compra_${codigoFactura}${extension === '.pdf' ? '.pdf' : '.jpg'}`;
    const optimizedFilePath = path.join(uploadsComprasFolder, nombreArchivo);

    // Crear carpeta si no existe
    if (!fs.existsSync(uploadsComprasFolder)) {
      fs.mkdirSync(uploadsComprasFolder, { recursive: true });
    }

    // Eliminar archivo anterior si existe (para reemplazarlo)
    const posibleJpg = path.join(uploadsComprasFolder, `Compra_${codigoFactura}.jpg`);
    const posiblePdf = path.join(uploadsComprasFolder, `Compra_${codigoFactura}.pdf`);

    if (fs.existsSync(posibleJpg)) {
      fs.unlinkSync(posibleJpg);
    }
    if (fs.existsSync(posiblePdf)) {
      fs.unlinkSync(posiblePdf);
    }

    // Si es una imagen, optimizarla con sharp
    if (extension !== '.pdf') {
      await sharp(filePath)
        .resize(1200) // Redimensionar para facturas a un ancho mayor
        .jpeg({ quality: 85 }) // Mayor calidad para facturas
        .toFile(optimizedFilePath);

      // Eliminar el archivo original temporal
      fs.unlinkSync(filePath);
    } else {
      // Para PDFs, mover el archivo directamente
      fs.renameSync(filePath, optimizedFilePath);
    }

    return {
      typeResult: TypeResultExitoso,
      message: "Imagen de factura subida correctamente",
      result: `uploads/compras/${nombreArchivo}`,
    };
  } catch (error) {
    console.error("Error in uploadImageCompra service:", error);
    throw new Error("Error processing purchase invoice image");
  }
};

/**
 * Servicio para eliminar una imagen de factura de compra
 * Puede recibir codigoFactura directamente o rutaImagen
 * @param {string|number} codigoFacturaOrRuta - Código de factura o ruta de la imagen
 * @returns {Object} - Resultado de la operación
 */
export const deleteImageCompra = async (codigoFacturaOrRuta) => {
  try {
    if (!codigoFacturaOrRuta) {
      throw new Error("No se proporcionó código de factura o ruta de imagen");
    }

    let archivosEliminados = [];

    // Si es un número, buscar por código de factura (formato estándar)
    if (!isNaN(codigoFacturaOrRuta)) {
      const codigoFactura = codigoFacturaOrRuta;
      const posibleJpg = path.join(uploadsComprasFolder, `Compra_${codigoFactura}.jpg`);
      const posiblePdf = path.join(uploadsComprasFolder, `Compra_${codigoFactura}.pdf`);

      if (fs.existsSync(posibleJpg)) {
        fs.unlinkSync(posibleJpg);
        archivosEliminados.push(`Compra_${codigoFactura}.jpg`);
      }
      if (fs.existsSync(posiblePdf)) {
        fs.unlinkSync(posiblePdf);
        archivosEliminados.push(`Compra_${codigoFactura}.pdf`);
      }
    } else {
      // Si es una ruta, eliminar directamente
      const rutaRelativa = codigoFacturaOrRuta.startsWith('/') ? codigoFacturaOrRuta.substring(1) : codigoFacturaOrRuta;
      const fullPath = path.join(uploadsFolder, "..", rutaRelativa);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        archivosEliminados.push(path.basename(rutaRelativa));
      }
    }

    if (archivosEliminados.length > 0) {
      return {
        typeResult: TypeResultExitoso,
        message: `Imagen(es) eliminada(s): ${archivosEliminados.join(', ')}`,
        result: archivosEliminados,
      };
    } else {
      return {
        typeResult: TypeResultExitoso,
        message: "No se encontraron archivos para eliminar",
        result: null,
      };
    }
  } catch (error) {
    console.error("Error in deleteImageCompra service:", error);
    throw new Error("Error deleting purchase invoice image");
  }
};
