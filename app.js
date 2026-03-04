import express from "express";
import categoryRoutes from "./src/modules/category/category.routes.js";
import transactionRoutes from "./src/modules/transaction/transaction.routes.js";
import reportRoutes from "./src/modules/reports/report.routes.js";
import authRoutes from "./src/modules/auth/auth.routes.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/config/swagger.js";

import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
); //Esto permite al backend hacer la conexion con el frontend

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/reports", reportRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/transactions", transactionRoutes);

export default app;
