import { TransactionType } from "@prisma/client";
import { prisma } from "../../config/prisma.js";

const sCategory = {
  getAll: async (userId) => {
    return await prisma.category.findMany({
      where: { userId },
    });
  },

  getOne: async (id, userId) => {
    return await prisma.category.findFirst({ where: { id, userId } });
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
      const newCategory = await prisma.category.create({
        data: {
          name,
          type: normalizedType,
          userId,
        },
      });

      return newCategory;
    } catch (error) {
      throw new Error("Error al crear la categoría");
    }
  },

  update: async (id, userId, data) => {
    const category = await prisma.category.findFirst({ where: { id, userId } });

    if (!category) return null;

    delete data.userId;
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;

    try {
      const updatedCategory = await prisma.category.update({
        where: { id },
        data,
      });
      return updatedCategory;
    } catch (error) {
      throw new Error({ error: "Error al actualizar la categoria" });
    }
  },

  delete: async (id, userId) => {
    const category = await prisma.category.findFirst({ where: { id, userId } });
    if (!category) return null;
    try {
      const deleteCategory = await prisma.category.delete({ where: id });
      return deleteCategory;
    } catch (err) {
      throw new Error("Error al eliminar la categoria");
    }
  },
};

export default sCategory;
