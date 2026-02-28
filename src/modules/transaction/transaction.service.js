import { prisma } from "../../config/prisma.js";
import { TransactionType } from "@prisma/client";

const sTransaction = {
  getAll: async (userId) => {
    return await prisma.transaction.findMany({
      where: { userId },
    });
  },

  getOne: async (id, userId) => {
    return await prisma.transaction.findFirst({ where: { id, userId } });
  },
  create: async ({ amount, type, date, description, userId, categoryId }) => {
    if (!amount || !type || !date || !categoryId) {
      throw new Error("Faltan campos obligatorios");
    }

    if (isNaN(amount)) {
      throw new Error("El monto debe ser numérico");
    }

    if (Number(amount) <= 0) {
      throw new Error("El monto debe ser mayor a 0");
    }

    const normalizedType = type.toUpperCase();

    if (!Object.values(TransactionType).includes(normalizedType)) {
      throw new Error("Tipo inválido");
    }

    // Verificar que la categoría pertenezca al usuario
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!category) {
      throw new Error("Categoría inválida");
    }

    return await prisma.transaction.create({
      data: {
        amount, // string → Prisma Decimal
        type: normalizedType,
        date: new Date(date),
        description,
        userId,
        categoryId,
      },
    });
  },

  update: async (id, userId, data) => {
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) return null;

    // Campos no modificables
    delete data.userId;
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;

    // Determinar estado final
    const finalType = data.type ? data.type.toUpperCase() : transaction.type;

    const finalCategoryId = data.categoryId || transaction.categoryId;

    const finalAmount = data.amount ?? transaction.amount;
    const finalDate = data.date ?? transaction.date;

    // Validaciones
    if (data.amount !== undefined) {
      if (isNaN(data.amount) || Number(data.amount) <= 0) {
        throw new Error("El monto debe ser numérico y mayor a 0");
      }
    }

    if (data.type) {
      if (!Object.values(TransactionType).includes(finalType)) {
        throw new Error("Tipo inválido");
      }
    }

    // Verificar categoría
    const category = await prisma.category.findFirst({
      where: { id: finalCategoryId, userId },
    });

    if (!category) {
      throw new Error("Categoría inválida");
    }

    // Validación crítica de coherencia
    if (category.type !== finalType) {
      throw new Error("El tipo no coincide con la categoría");
    }

    // Construcción controlada del update
    const updateData = {
      ...(data.amount && { amount: data.amount }),
      ...(data.type && { type: finalType }),
      ...(data.date && { date: new Date(finalDate) }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.categoryId && { categoryId: finalCategoryId }),
    };

    return await prisma.transaction.update({
      where: { id },
      data: updateData,
    });
  },

  delete: async (id, userId) => {
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) return null;
    try {
      const deletedTransaction = await prisma.transaction.delete({
        where: { id },
      });
      return deletedTransaction;
    } catch (error) {
      throw new Error("Error al eliminar la transaccion");
    }
  },
};

export default sTransaction;
