import { prisma } from "../../config/prisma.js";
import pkg from "@prisma/client";

const { TransactionType } = pkg;

const reportService = {
  async getBalance(userId, { from, to } = {}) {
    //Este balance permite obtener el balance general, con un filtro opcional por rango de fechas
    const dateFilter = {};

    if (from || to) {
      dateFilter.date = {};
      if (from) dateFilter.date.gte = new Date(from);
      if (to) dateFilter.date.lte = new Date(to);
    }

    const baseWhere = {
      userId,
      ...dateFilter,
    };

    const [income, expense] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...baseWhere, type: TransactionType.INCOME },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { ...baseWhere, type: TransactionType.EXPENSE },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = income._sum.amount ?? 0;
    const totalExpense = expense._sum.amount ?? 0;

    return {
      income: Number(totalIncome),
      expense: Number(totalExpense),
      balance: Number(totalIncome) - Number(totalExpense),
    };
  },

  async getSummaryByCategory(userId, { from, to }) {
    //Este balance permite obtener el balance por categoria, con un filtro opcional por rango de fechas
    const grouped = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        ...(from &&
          to && {
            date: {
              gte: from,
              lte: to,
            },
          }),
      },
      _sum: {
        amount: true,
      },
    });

    const categoryIds = grouped.map((g) => g.categoryId);

    const categories = await prisma.category.findMany({
      where: {
        id: { in: categoryIds },
      },
    });

    return grouped.map((g) => {
      const category = categories.find((c) => c.id === g.categoryId);

      return {
        category: category || null,
        total: g._sum.amount ?? 0,
      };
    });
  },

  async getMonthlySummary(userId, { type } = {}) {
    const where = { userId };
    //Este balance permite obtener el balance mensual, con un filtro opcional por tipo de transacción (ingreso o gasto)

    // Validar y aplicar filtro por tipo
    if (type) {
      if (!Object.values(TransactionType).includes(type)) {
        throw new Error("Invalid transaction type");
      }
      where.type = type;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { date: "asc" },
    });

    const grouped = {};

    for (const t of transactions) {
      const month = new Date(t.date).toISOString().slice(0, 7);

      if (!grouped[month]) {
        grouped[month] = {
          month,
          total: 0,
          transactions: [],
        };
      }

      grouped[month].transactions.push(t);
      grouped[month].total += Number(t.amount);
    }

    return Object.values(grouped);
  },

  async getByDateRange(userId, start, end) {
    //Este balance permite obtener el balance general, con un filtro opcional por rango de fechas
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: new Date(start),
          lte: new Date(end),
        },
      },
      include: { category: true },
    });

    const total = transactions.reduce((acc, t) => acc + Number(t.amount), 0);

    return {
      total,
      transactions,
    };
  },
};

export default reportService;
