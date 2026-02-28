import dotenv from "dotenv";
dotenv.config();
import pkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const { PrismaClient } = pkg;

const adapter = new PrismaPg({
  //
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({
  adapter,
});

//Lo que hace este archivo es exportar la instancia de PrismaClient con el adapter configurado para trabajar con PostgreSQL.
