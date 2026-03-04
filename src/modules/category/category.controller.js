import sCategory from "./category.service.js";

export const getCategories = async (req, res) => {
  try {
    const { type } = req.query;

    const categories = await sCategory.getAll(req.user.id, { type });

    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getOneCategory = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Id is required" });
  }

  try {
    const category = await sCategory.getOne(id, req.user.id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({ category });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    if (!req.body.name || !req.body.type) {
      return res.status(400).json({
        error: "Faltan campos obligatorios",
      });
    }

    const newCategory = await sCategory.create(req.body, req.user.id);

    return res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedCategory = await sCategory.update(id, req.user.id, req.body);

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await sCategory.delete(id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
