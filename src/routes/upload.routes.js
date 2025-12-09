import express from "express";
import upload from "../upload.js";
import { uploadImageHandler } from "../controllers/upload.controller.js";

const router = express.Router();

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Sube una imagen y la optimiza.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagen subida y optimizada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 typeResult:
 *                   type: int
 *                 message:
 *                   type: string
 *                 result:
 *                   type: string
 *       400:
 *         description: Error controlado (por ejemplo, no se subió ningún archivo).
 *       500:
 *         description: Error no controlado (por ejemplo, fallo en el servidor).
 */
router.post("/upload", upload.single("file"), uploadImageHandler);

export default router;