const mongoose = require("mongoose");

const CATEGORY = require("../model/categoryModel");

const getAllowedCategoryFields = (source, fields) => {
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return { values: {}, hasInvalidValue: true };
  }

  const values = {};
  let hasInvalidValue = false;

  fields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      if (typeof source[field] !== "string") {
        hasInvalidValue = true;
        return;
      }
      values[field] = source[field].trim();
    }
  });

  return { values, hasInvalidValue };
};

//Get all categories

const allCategories = async (req, res) => {
  try {
    const CAT = await CATEGORY.find({});

    if (!CAT) {
      res.status(404).json({ msg: "unsuccess" });
      return;
    }

    res.status(200).json({ msg: "Success", data: CAT });
  } catch (e) {
    res.status(500).json({ msg: "Server error", error: e.message });
  }
};

//get cat accoding to the parameters

const CATEGORYByParams = async (req, res) => {
  try {
    const { values: filters, hasInvalidValue } = getAllowedCategoryFields(
      req.body,
      ["name", "image"]
    );

    if (
      hasInvalidValue ||
      Object.keys(filters).length === 0 ||
      Object.values(filters).some((value) => value.length === 0)
    ) {
      res.status(400).json({ msg: "Invalid category filters" });
      return;
    }

    const CAT = await CATEGORY.find(filters);

    if (CAT.length <= 0) {
      res.status(404).json({ msg: "Not found!" });
      return;
    }

    res.status(200).json({ msg: "Success", data: CAT });
  } catch (e) {
    res.status(500).json({ msg: "Server error" });
  }
};

//Get a single category

const categoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const CAT = await CATEGORY.findById(id);
    if (!CAT) {
      res.status(404).json({ msg: "Category not found!" });

      return;
    }

    res.status(200).json({ msg: "Success", data: CAT });
  } catch (e) {
    res.status(500).json({ msg: "Server error", error: e.message });
  }
};

//Insert a category

const insertCategory = async (req, res) => {
  try {
    const CAT = await CATEGORY.create(req.body);
    if (!CAT) {
      res.status(404).json({ msg: "Category not created!" });

      return;
    }

    res.status(200).json({ msg: "Success", data: CAT });
  } catch (e) {
    res.status(500).json({ msg: "Server error", error: e.message });
  }
};

//Update category

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { values: updates, hasInvalidValue } = getAllowedCategoryFields(
      req.body,
      ["name", "image"]
    );

    if (
      hasInvalidValue ||
      Object.keys(updates).length === 0 ||
      Object.values(updates).some((value) => value.length === 0)
    ) {
      res.status(400).json({ msg: "Invalid category update" });
      return;
    }

    const CAT = await CATEGORY.findByIdAndUpdate(id, updates, { new: true });
    if (!CAT) {
      res.status(404).json({ msg: "Category not Updated!" });

      return;
    }

    res.status(200).json({ msg: "Update Successful", data: CAT });
  } catch (e) {
    res.status(500).json({ msg: "Server error" });
  }
};

//delete category

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const CAT = await CATEGORY.findByIdAndDelete(id);
    if (!CAT) {
      res.status(404).json({ msg: "Category not Deleted!" });

      return;
    }

    res.status(200).json({ msg: "Delete Successfully!", data: CAT });
  } catch (e) {
    res.status(500).json({ msg: "Server error", error: e.message });
  }
};

module.exports = {
  allCategories,
  categoryById,
  CATEGORYByParams,
  insertCategory,
  deleteCategory,
  updateCategory,
};
