export const paths = {
  // =====================================
  // TRANSACTIONS
  // =====================================

  "/transactions": {
    get: {
      tags: ["Transactions"],
      summary: "Obtener todas las transacciones del usuario",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Lista de transacciones",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Transaction",
                },
              },
            },
          },
        },
      },
    },

    post: {
      tags: ["Transactions"],
      summary: "Crear una nueva transacción",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["amount", "type", "categoryId", "date"],
              properties: {
                amount: { type: "string", example: "1500.50" },
                type: { type: "string", example: "INCOME" },
                categoryId: { type: "string" },
                date: { type: "string", format: "date" },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Transacción creada",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Transaction",
              },
            },
          },
        },
      },
    },
  },

  "/transactions/{id}": {
    get: {
      tags: ["Transactions"],
      summary: "Obtener una transacción por ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Transacción encontrada",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Transaction",
              },
            },
          },
        },
        404: {
          description: "Transacción no encontrada",
        },
      },
    },

    patch: {
      tags: ["Transactions"],
      summary: "Actualizar una transacción por ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                amount: { type: "string", example: "2000.00" },
                type: { type: "string", example: "EXPENSE" },
                categoryId: { type: "string" },
                date: { type: "string", format: "date" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Transacción actualizada",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Transaction",
              },
            },
          },
        },
        404: {
          description: "Transacción no encontrada",
        },
      },
    },

    delete: {
      tags: ["Transactions"],
      summary: "Eliminar una transacción por ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Transacción eliminada correctamente",
        },
        404: {
          description: "Transacción no encontrada",
        },
      },
    },
  },

  // =====================================
  // REPORTS
  // =====================================

  "/reports/balance": {
    get: {
      tags: ["Reports"],
      summary: "Obtener balance total del usuario",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Balance calculado correctamente",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/BalanceResponse",
              },
            },
          },
        },
      },
    },
  },

  "/reports/summary-by-category": {
    get: {
      tags: ["Reports"],
      summary: "Resumen agrupado por categoría",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Resumen por categoría",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SummaryByCategoryResponse",
              },
            },
          },
        },
      },
    },
  },

  "/reports/monthly": {
    get: {
      tags: ["Reports"],
      summary: "Resumen mensual de transacciones",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Resumen mensual",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MonthlySummaryResponse",
              },
            },
          },
        },
      },
    },
  },

  "/reports/date-range": {
    get: {
      tags: ["Reports"],
      summary: "Obtener transacciones dentro de un rango de fechas",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "start",
          in: "query",
          required: true,
          schema: { type: "string", format: "date" },
        },
        {
          name: "end",
          in: "query",
          required: true,
          schema: { type: "string", format: "date" },
        },
      ],
      responses: {
        200: {
          description: "Transacciones dentro del rango",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/DateRangeResponse",
              },
            },
          },
        },
      },
    },
  },

  // =====================================
  // CATEGORIES
  // =====================================

  "/categories": {
    get: {
      tags: ["Categories"],
      summary: "Obtener todas las categorías del usuario",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Lista de categorías",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Category",
                },
              },
            },
          },
        },
      },
    },

    post: {
      tags: ["Categories"],
      summary: "Crear una nueva categoría",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: { type: "string", example: "Food" },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Categoría creada",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Category",
              },
            },
          },
        },
      },
    },
  },

  "/categories/{id}": {
    get: {
      tags: ["Categories"],
      summary: "Obtener una categoría por ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Categoría encontrada",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Category",
              },
            },
          },
        },
        404: {
          description: "Categoría no encontrada",
        },
      },
    },

    patch: {
      tags: ["Categories"],
      summary: "Actualizar una categoría por ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string", example: "Transport" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Categoría actualizada",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Category",
              },
            },
          },
        },
        404: {
          description: "Categoría no encontrada",
        },
      },
    },

    delete: {
      tags: ["Categories"],
      summary: "Eliminar una categoría por ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Categoría eliminada correctamente",
        },
        404: {
          description: "Categoría no encontrada",
        },
      },
    },
  },
};
