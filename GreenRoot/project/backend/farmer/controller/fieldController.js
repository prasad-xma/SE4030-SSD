const mongoose = require("mongoose");

const FIELD = require("../model/fieldModel");

const getAllowedFieldFields = (source, fields) => {
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return { values: {}, hasInvalidValue: true };
  }

  const values = {};
  let hasInvalidValue = false;

  fields.forEach(([field, type]) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      const value = source[field];
      if (
        (type === "string" && typeof value !== "string") ||
        (type === "number" &&
          (typeof value !== "number" || !Number.isFinite(value)))
      ) {
        hasInvalidValue = true;
        return;
      }
      values[field] = type === "string" ? value.trim() : value;
    }
  });

  return { values, hasInvalidValue };
};

//Get all fields

const allFields = async (req, res) => {
  try {
    const field = await FIELD.find({});

    if (!field) {
      res.status(404).json({ msg: "unsuccess" });
      return;
    }

    res.status(200).json({ msg: "Success", data: field });
  } catch (e) {
    res.status(500).json({ msg: "Server error", error: e.message });
  }
};

//get fields accoding to the parameters

const fieldsByParams = async (req, res) => {
  try {
    const { values: filters, hasInvalidValue } = getAllowedFieldFields(
      req.body,
      [
        ["xcordinate", "number"],
        ["ycordinate", "number"],
        ["city", "string"],
        ["farmerID", "string"],
      ]
    );

    if (
      hasInvalidValue ||
      Object.keys(filters).length === 0 ||
      Object.entries(filters).some(
        ([field, value]) => typeof value === "string" && value.length === 0
      )
    ) {
      res.status(400).json({ msg: "Invalid field filters" });
      return;
    }

    const fields = await FIELD.find(filters);

    if (fields.length <= 0) {
      res.status(404).json({ msg: "Not found!" });
      return;
    }

    res.status(200).json({ msg: "Success", data: fields });
  } catch (e) {
    res.status(500).json({ msg: "Server error" });
  }
};

//Get a field By ID

const fieldbyId = async (req, res) => {
  const { id } = req.params;

  try {
    const fields = await FIELD.findById(id);
    if (!fields) {
      res.status(404).json({ msg: "Field not found!" });

      return;
    }

    res.status(200).json({ msg: "Success", data: fields });
  } catch (e) {
    res.status(500).json({ msg: "Server error", error: e.message });
  }
};

//Insert a field

const insertfield = async (req, res) => {
  try {
    const fields = await FIELD.create(req.body);
    if (!fields) {
      res.status(404).json({ msg: "field not created!" });

      return;
    }

    res.status(200).json({ msg: "Success", data: fields });
  } catch (e) {
    res.status(500).json({ msg: "Server error", error: e.message });
  }
};

//Update field

const updateField = async (req, res) => {
  try {
    const { id } = req.params;
    const { values: updates, hasInvalidValue } = getAllowedFieldFields(
      req.body,
      [
        ["xcordinate", "number"],
        ["ycordinate", "number"],
        ["city", "string"],
      ]
    );

    if (
      hasInvalidValue ||
      Object.keys(updates).length === 0 ||
      Object.values(updates).some(
        (value) => typeof value === "string" && value.length === 0
      )
    ) {
      res.status(400).json({ msg: "Invalid field update" });
      return;
    }

    const fields = await FIELD.findByIdAndUpdate(id, updates, { new: true });
    if (!fields) {
      res.status(404).json({ msg: "field not Updated!" });

      return;
    }

    res.status(200).json({ msg: "Update Successful", data: fields });
  } catch (e) {
    res.status(500).json({ msg: "Server error" });
  }
};

//delete field

const deleteField = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = await FIELD.findByIdAndDelete(id);
    if (!fields) {
      res.status(404).json({ msg: "field not Deleted!" });

      return;
    }

    res.status(200).json({ msg: "Delete Successfully!", data: fields });
  } catch (e) {
    res.status(500).json({ msg: "Server error", error: e.message });
  }
};

module.exports = {
  allFields,
  fieldbyId,
  insertfield,
  updateField,
  deleteField,
  fieldsByParams,
};
