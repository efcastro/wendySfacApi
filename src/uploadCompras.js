// config/uploadCompras.js
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadComprasFolder = "uploads/compras/";

// Crear la carpeta si no existe
if (!fs.existsSync(uploadComprasFolder)) {
    fs.mkdirSync(uploadComprasFolder, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadComprasFolder);
    },
    filename: (req, file, cb) => {
        const codigoFactura = req.body.codigoFactura;
        const extension = path.extname(file.originalname).toLowerCase();
        // Formato estándar: Compra_<CodigoFactura>.<ext>
        // La extensión final será .jpg para imágenes (después de procesar) o .pdf
        const nombreArchivo = `Compra_${codigoFactura}${extension}`;
        cb(null, nombreArchivo);
    },
});

const fileFilter = (req, file, cb) => {
    // Permitir imágenes y PDFs para facturas de compras
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetypeAllowed = /image\/jpeg|image\/jpg|image\/png|application\/pdf/.test(file.mimetype);

    if (extname && mimetypeAllowed) {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten imágenes (jpeg, jpg, png) o archivos PDF"), false);
    }
};

const uploadCompras = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // Límite de 10MB para facturas
    },
});

export default uploadCompras;
