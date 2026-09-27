const mongoose = require("mongoose");

const CROP = require("../model/cropModel");

const cropStringFields = [
  "name",
  "fertilizer",
  "image",
  "categoryID",
  "farmerID",
  "fieldID",
  "overview",
  "status",
];
const cropNumberFields = ["quantity", "price"];

const getAllowedCropFields = (source) => {

  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return { values: {}, hasInvalidValue: true };


  }

  const values = {};
  let hasInvalidValue = false;

  cropStringFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      if (typeof source[field] !== "string") {
        hasInvalidValue = true;
        return;
      }
      values[field] = source[field];
    }
  });

  cropNumberFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      if (typeof source[field] !== "number" || !Number.isFinite(source[field])) {
        hasInvalidValue = true;
        return;
      }
      values[field] = source[field];
    }

  });


  
  return { values, hasInvalidValue };
};

//Get all crops

const allCrops = async (req, res) => {
  try {
    const crops = await CROP.find({});

    if (!crops) {
      res.status(404).json({ msg: "unsuccess" });
      return;
    }

    res.status(200).json({ msg: "Success", data: crops });
  } catch (e) {
    res.status(500).json({ msg: "Server error", error: e.message });
  }
};

//get crop accoding to the parameters

const cropsByParams = async (req, res) => {
  try {
    const { values: filters, hasInvalidValue } = getAllowedCropFields(req.body);

    if (hasInvalidValue || Object.keys(filters).length === 0) {
      res.status(400).json({ msg: "Invalid crop filters" });
      return;
    }

    const crops = await CROP.find(filters);

    if (crops.length <= 0) {
      res.status(404).json({ msg: "Not found!" });
      return;
    }

    res.status(200).json({ msg: "Success", data: crops });
  } catch (e) {
    res.status(500).json({ msg: "Server error" });
  }
};

//Get a single crop

const findbyId = async (req, res) => {
  const { id } = req.params;

  try {
    const crops = await CROP.findById(id);
    if (!crops) {
      res.status(404).json({ msg: "Crop not found!" });

      return;
    }

    res.status(200).json({ msg: "Success", data: crops });
  } catch (e) {
    res.status(500).json({ msg: "Server error", error: e.message });
  }
};

//Insert a crop

const insertCrop = async (req, res) => {
  try {
    const crops = await CROP.create(req.body);
    if (!crops) {
      res.status(404).json({ msg: "Crop not created!" });

      return;
    }

    res.status(200).json({ msg: "Success", data: crops });
  } catch (e) {
    res.status(500).json({ msg: "Server error", error: e.message });
  }
};

//Update crop

const updateCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const { values: updates, hasInvalidValue } = getAllowedCropFields(req.body);

    if (hasInvalidValue || Object.keys(updates).length === 0) {
      res.status(400).json({ msg: "Invalid crop update" });
      return;
    }

    const crops = await CROP.findByIdAndUpdate(id, updates, { new: true });
    if (!crops) {
      res.status(404).json({ msg: "Crop not Updated!" });

      return;
    }

    res.status(200).json({ msg: "Update Successful", data: crops });
  } catch (e) {
    res.status(500).json({ msg: "Server error" });
  }
};

//delete crops

const deleteCrop = async (req, res) => {
  try {
    const { id } = req.params;
    const crops = await CROP.findByIdAndDelete(id);
    if (!crops) {
      res.status(404).json({ msg: "Crop not Deleted!" });

      return;
    }

    res.status(200).json({ msg: "Delete Successfully!", data: crops });
  } catch (e) {
    res.status(500).json({ msg: "Server error", error: e.message });
  }
};

module.exports = {
  allCrops,
  findbyId,
  insertCrop,
  updateCrop,
  deleteCrop,
  cropsByParams,
};
