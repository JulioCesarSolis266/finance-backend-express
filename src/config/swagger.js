import swaggerUi from "swagger-ui-express";
import { schemas } from "./swagger.schemas.js";
import { paths } from "./swagger.paths.js";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Finance API",
    version: "1.0.0",
    description: "API de gestión financiera con Node y Prisma",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas,
  },
  paths,
};

export const setupSwagger = (app) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
