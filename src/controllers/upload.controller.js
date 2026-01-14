import { uploadImage, uploadImageCompra, deleteImageCompra } from "../services/upload.services.js";
import { CatchControlador } from "../utils/util.js";

export const uploadImageHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const { codigo, nombre } = req.body;
    const result = await uploadImage(req.file, { codigo, nombre });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in uploadImageHandler:", error);
    CatchControlador(res, error);
  }
};

/**
 * Controlador para subir imágenes de facturas de compras
 * Requiere codigoFactura en el body
 * El archivo se guarda con nombre estándar: Compra_<codigoFactura>.jpg/pdf
 */
export const uploadImageCompraHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No se subió ningún archivo" });
    }
    const { codigoFactura } = req.body;
    if (!codigoFactura) {
      return res.status(400).json({ success: false, message: "El código de factura es requerido" });
    }
    const result = await uploadImageCompra(req.file, { codigoFactura });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in uploadImageCompraHandler:", error);
    CatchControlador(res, error);
  }
};

/**
 * Controlador para eliminar imágenes de facturas de compras
 * Acepta codigoFactura (recomendado) o rutaImagen en el body
 */
export const deleteImageCompraHandler = async (req, res) => {
  try {
    const { codigoFactura, rutaImagen } = req.body;

    // Priorizar codigoFactura, si no viene usar rutaImagen
    const identificador = codigoFactura || rutaImagen;

    if (!identificador) {
      return res.status(400).json({ success: false, message: "Se requiere codigoFactura o rutaImagen" });
    }
    const result = await deleteImageCompra(identificador);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in deleteImageCompraHandler:", error);
    CatchControlador(res, error);
  }
};