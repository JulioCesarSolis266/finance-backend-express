import pkg from "@prisma/client";
import { prisma } from "../../config/prisma.js";

const { TransactionType } = pkg;

const sCategory = {
  getAll: async (userId, options = {}) => {
    const { type } = options;
    const where = { userId };

    if (type) {
      const normalizedType = type.toUpperCase();

      if (!Object.values(TransactionType).includes(normalizedType)) {
        throw new Error("Tipo inválido");
      }

      where.type = normalizedType;
    }

    return await prisma.category.findMany({ where });
  },

  getOne: async (id, userId) => {
    return await prisma.category.findFirst({
      where: { id, userId },
    });
  },

  create: async (data, userId) => {
    const { name, type } = data;

    if (!name || !type) {
      throw new Error("Todos los campos son obligatorios");
    }

    const normalizedType = type.toUpperCase();

    if (!Object.values(TransactionType).includes(normalizedType)) {
      throw new Error("Tipo de transacción inválido");
    }

    try {
      return await prisma.category.create({
        data: {
          name,
          type: normalizedType,
          userId,
        },
      });
    } catch (error) {
      throw new Error("Error al crear la categoría");
    }
  },

  update: async (id, userId, data) => {
    const category = await prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) return null;

    // Campos no modificables
    delete data.userId;
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;

    // Si se intenta actualizar el type, validarlo
    if (data.type) {
      const normalizedType = data.type.toUpperCase();

      if (!Object.values(TransactionType).includes(normalizedType)) {
        throw new Error("Tipo de transacción inválido");
      }

      data.type = normalizedType;
    }

    try {
      return await prisma.category.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error("Error al actualizar la categoria");
    }
  },

  delete: async (id, userId) => {
    const category = await prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) return null;

    try {
      return await prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error("Error al eliminar la categoria");
    }
  },
};

export default sCategory;
