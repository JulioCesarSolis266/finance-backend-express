import { prisma } from "../../config/prisma.js";

const sTransaction = {
  getAll: async (userId) => {
    return await prisma.transaction.findMany({
      where: { userId },
      include: {
        category: true,
        user: true,
      },
    });
  },

  getOne: async (id, userId) => {
    return await prisma.transaction.findFirst({ where: { id, userId } });
  },
  create: async ({ amount, date, description, userId, categoryId }) => {
    if (!amount || !date || !categoryId) {
      throw new Error("Faltan campos obligatorios");
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      throw new Error("El monto debe ser numérico y mayor a 0");
    }

    // Verificar categoría
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
        amount,
        date: new Date(date),
        description,
        userId,
        categoryId,
        type: category.type, // ← consistencia garantizada
      },
    });
  },

  update: async (id, userId, data) => {
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) return null;

    // Eliminar campos protegidos
    delete data.userId;
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    delete data.type; // ← mejor no permitir actualización directa

    const finalCategoryId = data.categoryId ?? transaction.categoryId;
    const finalAmount = data.amount ?? transaction.amount;
    const finalDate = data.date ?? transaction.date;

    // Validar categoría
    const category = await prisma.category.findFirst({
      where: { id: finalCategoryId, userId },
    });

    if (!category) {
      throw new Error("Categoría inválida");
    }

    // Validar monto
    if (data.amount !== undefined) {
      if (isNaN(data.amount) || Number(data.amount) <= 0) {
        throw new Error("El monto debe ser numérico y mayor a 0");
      }
    }

    // Construcción controlada
    return await prisma.transaction.update({
      where: { id },
      data: {
        amount: finalAmount,
        date: new Date(finalDate),
        description:
          data.description !== undefined
            ? data.description
            : transaction.description,
        categoryId: finalCategoryId,
        type: category.type, // ← siempre derivado
      },
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
