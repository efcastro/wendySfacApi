import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import { errorhandler } from "./middlewares/ErrorHandler.js";
//RUTAS
import userRoutes from "./routes/user.routes.js";
import sfacRoutes from "./routes/sfac.routes.js";
import gralRoutes from "./routes/gral.routes.js";
import catRoutes from "./routes/cat.routes.js";
import facturaRoutes from "./routes/factuta.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import printerRoutes from "./routes/printer.routes.js";
import resvRoutes from "./routes/resv.routes.js";
//SWAGGER
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "../swaggerConfig.js";

import path from "path";
import { getLocalIp } from "./utils/util.js";
import http from "http";
import { Server } from "socket.io";

import { isProduction } from "./config.js";

const app = express();

const allowedOrigins = isProduction
  ? [
      "http://latienditadelrio.digidevelops.com",
      "https://latienditadelrio.digidevelops.com"
    ]
  : [
      "http://latienditadelrio.digidevelops.com",
      "https://latienditadelrio.digidevelops.com",
      "http://localhost:*",
      "http://127.0.0.1:*",
      /http:\/\/192\.168\.\d+\.\d+:\d+/, // Local IPs
      /http:\/\/10\.\d+\.\d+\.\d+:\d+/, // Internal network IPs
    ];

const corsOptions = {
  origin: (origin, callback) => {
    if (!isProduction) {
      return callback(null, true);
    }
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS not allowed"), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "jwt"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const __dirname = path.resolve();
// Fix uploads path to point outside src/
const uploadsPath = path.join(__dirname, "..", "uploads");

app.use(
  "/uploads",
  express.static(uploadsPath, {
    fallthrough: true, // allow next middleware if file doesn't exist
  })
);

// Middleware to serve default image if not found
app.use("/uploads", (req, res) => {
  const defaultImagePath = path.join(uploadsPath, "default.jpg");
  res.sendFile(defaultImagePath);
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
// Redirect root '/' to '/api-docs'
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

app.use("/Authentication", userRoutes);
app.use("/SFAC", sfacRoutes);
app.use("/GRAL", gralRoutes);
app.use("/PRIN", printerRoutes);
app.use("/CAT", catRoutes);
app.use("/RESV", resvRoutes);
// Facturas
app.use(facturaRoutes);
// Upload routes
app.use(uploadRoutes);

// Error handling middleware
app.use(errorhandler);

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

const localIps = getLocalIp();

// Socket.IO integration
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!isProduction) {
        return callback(null, true);
      }
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed"), false);
    },
    methods: ["GET", "POST", "PUT"],
  },
});

app.set("io", io);

// Environment info
/*console.log(`🚀 Ambiente: ${isProduction ? "PRODUCTION" : "DESARROLLO"}`);
console.log(
  `🌐 CORS: ${
    isProduction ? "Dominios restringidos" : "Todos los orígenes permitidos"
  }`
);
console.log("dominiosPermitidos: ", allowedOrigins);
console.log(`🗄️ Conectando a la base de datos en ${DB_HOST} - ${DB_DATABASE}`);*/

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  //console.log(`Accesible localmente en http://${localIps[0]}:${PORT}`);
});
