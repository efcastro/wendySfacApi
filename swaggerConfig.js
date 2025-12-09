import swaggerJsDoc from "swagger-jsdoc";
import { PORT, isProduction } from "./src/config.js";
import path from "path";
import { fileURLToPath } from "url";
//import packageJson from "./package.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SFAC API",
      version: "1.6.0",
      description: "API para el aplicativo SUNSET",
    },
    components: {
      schemas: {
        StandardResponse: {
          type: "object",
          properties: {
            result: {
              type: "string",
              description: "Respuesta en formato JSON string",
            },
            message: {
              type: "string",
              description: "Mensaje descriptivo del resultado",
            },
            typeResult: {
              type: "number",
              description:
                "Código de resultado (0 = éxito, 1 = error controlado, 2 = error de servidor)",
            },
          },
          example: {
            result: "{}",
            message: "Mensaje de ejemplo",
            typeResult: 0,
          },
        },
      },
      responses: {
        StandardResponse200: {
          description: "Caso exitoso",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/StandardResponse",
              },
              example: {
                result: "[{}] / {}",
                message: "Se obtuvo la información correctamente",
                typeResult: 0,
              },
            },
          },
        },
        StandardResponse400: {
          description: "Error del usuario",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/StandardResponse",
              },
              example: {
                result: null,
                message: "La información enviada es incorrecta",
                typeResult: 1,
              },
            },
          },
        },
        StandardResponse500: {
          description: "Error interno inesperado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/StandardResponse",
              },
              example: {
                result: null,
                message: "Error en el servidor",
                typeResult: 2,
              },
            },
          },
        },
      },
      securitySchemes: {
        Authorization: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: "Access Token de AWS Cognito",
        },
        jwt: {
          type: "apiKey",
          in: "header",
          name: "jwt",
          description: "ID Token de AWS Cognito",
        },
      },
    },
    security: [
      {
        Authorization: [],
        jwt: [],
      },
    ],
    servers: isProduction
      ? [
          {
            url: `https://api.sunsethousehn.com`,
            description: "Servidor de producción",
          },
        ]
      : [
          {
            url: `http://localhost:${PORT}`,
            description: "Servidor de desarrollo",
          },
        ],
  },
  apis: [path.resolve(__dirname, "./src/routes/*.js")],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
export default swaggerSpec;
