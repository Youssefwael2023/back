const { categoryModel } = require("../models/Category");

const getAllCategories = async () => {
  try {
    return await categoryModel.find();
  } catch (error) {
    throw new Error("Error fetching categories: " + error.message);
  }
};

const addCategory = async (name, image) => {
  if (!name || !image) {
    throw new Error("Category name and image are required");
  }

  try {
    const newCategory = new categoryModel({ name, image });
    await newCategory.save();
    return newCategory;
  } catch (error) {
    throw new Error("Error adding category: " + error.message);
  }
};

const updateCategory = async (id, name, image) => {
  if (!id || !name) {
    throw new Error("Category ID and name are required");
  }

  try {
    const updateData = { name };
    if (image) updateData.image = image;

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    return updatedCategory;
  } catch (error) {
    throw new Error("Error updating category: " + error.message);
  }
};

const deleteCategory = async (id) => {
  if (!id) {
    throw new Error("Category ID is required");
  }

  try {
    await categoryModel.findByIdAndDelete(id);
  } catch (error) {
    throw new Error("Error deleting category: " + error.message);
  }
};

module.exports = {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
