import sTransaction from "./transaction.service.js";

export const getTransactions = async (req, res) => {
  const transactions = await sTransaction.getAll(req.user.id);
  return res.status(200).json({ transactions });
};

export const getOneTransaction = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Id is required" });
  }

  try {
    const transaction = await sTransaction.getOne(id, req.user.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transacción no encontrada" });
    }
    return res.status(200).json({ transaction });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { amount, categoryId, date, description } = req.body;

    if (amount == null || !categoryId || !date) {
      return res.status(400).json({
        error: "Faltan campos obligatorios",
      });
    }

    /*
      Normalizamos la fecha:
      - Convertimos a objeto Date
      - Forzamos hora 00:00:00 en UTC
      - Evitamos desplazamientos por timezone
    */
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    const newTransaction = await sTransaction.create({
      amount,
      date: normalizedDate,
      description,
      userId: req.user.id,
      categoryId,
    });

    return res.status(201).json({
      message: "Transaccion creada con exito",
      transaction: newTransaction,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTransaction = await sTransaction.update(
      id,
      req.user.id,
      req.body,
    );
    if (!updatedTransaction) {
      return res
        .status(404)
        .json({ error: "No se encuentra la trasnsaccion para actualizar" });
    }
    return res.status(200).json({
      message: "Transaccion actualizada con exito",
      transaction: updatedTransaction,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const deleted = await sTransaction.delete(id, req.user.id);

  if (!deleted) {
    return res.status(404).json({ error: "Transaccion no encontrada" });
  }
  return res
    .status(200)
    .json({ message: "La transacción fue eliminada con exito" });
};
