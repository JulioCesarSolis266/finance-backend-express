export const schemas = {
  // ==============================
  // ENTIDADES BASE
  // ==============================

  Category: {
    type: "object",
    properties: {
      id: { type: "string", example: "9db67905-c94e-4753-8b7d-28cc6debfcf0" },
      name: { type: "string", example: "Salary" },
      userId: { type: "string" },
    },
  },

  Transaction: {
    type: "object",
    properties: {
      id: { type: "string" },
      amount: { type: "string", example: "1500.50" },
      type: { type: "string", example: "INCOME" },
      date: { type: "string", format: "date", example: "2026-02-27" },
      userId: { type: "string" },
      categoryId: { type: "string" },
      category: {
        $ref: "#/components/schemas/Category",
      },
    },
  },

  // ==============================
  // RESPUESTAS DE REPORTES
  // ==============================

  BalanceResponse: {
    type: "object",
    properties: {
      income: { type: "number", example: 5000 },
      expense: { type: "number", example: 1200 },
      balance: { type: "number", example: 3800 },
    },
  },

  SummaryByCategoryItem: {
    type: "object",
    properties: {
      category: {
        $ref: "#/components/schemas/Category",
      },
      total: {
        type: "number",
        example: 401500.5,
      },
    },
  },

  SummaryByCategoryResponse: {
    type: "array",
    items: {
      $ref: "#/components/schemas/SummaryByCategoryItem",
    },
  },

  MonthlySummaryItem: {
    type: "object",
    properties: {
      month: {
        type: "string",
        example: "2026-02",
      },
      total: {
        type: "number",
        example: 2500,
      },
      transactions: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Transaction",
        },
      },
    },
  },

  MonthlySummaryResponse: {
    type: "array",
    items: {
      $ref: "#/components/schemas/MonthlySummaryItem",
    },
  },

  DateRangeResponse: {
    type: "object",
    properties: {
      total: {
        type: "number",
        example: 3200,
      },
      transactions: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Transaction",
        },
      },
    },
  },
};
