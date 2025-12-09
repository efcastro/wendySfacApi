// config/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadFolder = "uploads/";

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const codigo = req.body.codigo; 
    const nombre = req.body.nombre; 
    const extension = path.extname(file.originalname); 
    const nombreArchivo = `${codigo}_${nombre}${extension}`; 
    cb(null, nombreArchivo);
  },
});


const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
  
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes (jpeg, jpg, png)"), false);
    }
  };
  
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // Límite de 5MB
    },
  });

export default upload;