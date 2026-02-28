import { prisma } from "../../config/prisma.js";
import { TransactionType } from "@prisma/client";

const reportService = {
  async getBalance(userId) {
    const income = await prisma.transaction.aggregate({
      where: { userId, type: TransactionType.INCOME },
      _sum: { amount: true },
    });
    const expense = await prisma.transaction.aggregate({
      where: { userId, type: TransactionType.EXPENSE },
      _sum: { amount: true },
    });
    const totalIncome = income._sum.amount ?? 0;
    const totalExpense = expense._sum.amount ?? 0;
    return {
      income: totalIncome,
      expense: totalExpense,
      balance: Number(totalIncome) - Number(totalExpense),
    };
  },

  async getSummaryByCategory(userId) {
    const grouped = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { userId },
      _sum: { amount: true },
    });

    const categoryIds = grouped.map((g) => g.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
    });

    return grouped.map((g) => {
      const category = categories.find((c) => c.id === g.categoryId);

      return {
        category: category || null,
        total: g._sum.amount ?? 0,
      };
    });
  },

  async getMonthlySummary(userId) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
    });
    const grouped = {};

    transactions.forEach((t) => {
      const month = new Date(t.date).toISOString().slice(0, 7);

      if (!grouped[month]) {
        grouped[month] = [];
      }

      grouped[month].push(t);
    });

    return Object.entries(grouped).map(([month, txs]) => ({
      month,
      total: txs.reduce((acc, t) => acc + Number(t.amount), 0),
      transactions: txs,
    }));
  },

  async getByDateRange(userId, start, end) {
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
