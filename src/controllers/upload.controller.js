import { uploadImage } from "../services/upload.services.js";
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