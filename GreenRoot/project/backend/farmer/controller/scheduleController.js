const mongoose = require("mongoose");

const SCHEDULE = require("../model/scheduleModel");

const getAllowedScheduleFields = (source, fields) => {
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

const allSCHEDULE = async (req, res) => {
  try {
    const CAT = await SCHEDULE.find({});

    if (!CAT) {
      res.status(404).json({ msg: "unsuccess" });
      return;
    }

    res.status(200).json({ msg: "Success", data: CAT });
  } catch (e) {
    res.status(500).json({ msg: "Server error", error: e.message });
  }
};

//get SCHEDULE accoding to the parameters

const SCHEDULEByParams = async (req, res) => {
  try {
    const { values: filters, hasInvalidValue } = getAllowedScheduleFields(
      req.body,
      ["description", "status", "dueDate", "farmerID"]
    );

    if (
      hasInvalidValue ||
      Object.keys(filters).length === 0 ||
      Object.values(filters).some((value) => value.length === 0)
    ) {
      res.status(400).json({ msg: "Invalid schedule filters" });
      return;
    }

    const CAT = await SCHEDULE.find(filters);

    if (CAT.length <= 0) {
      res.status(404).json({ msg: "Not found!" });
      return;
    }

    res.status(200).json({ msg: "Success", data: CAT });
  } catch (e) {
    res.status(500).json({ msg: "Server error" });
  }
};

//Get a single SCHEDULE

const SCHEDULEById = async (req, res) => {
  const { id } = req.params;

  try {
    const CAT = await SCHEDULE.findById(id);
    if (!CAT) {
      res.status(404).json({ msg: "SCHEDULE not found!" });

      return;
    }

    res.status(200).json({ msg: "Success", data: CAT });
  } catch (e) {
    res.status(500).json({ msg: "Server error", error: e.message });
  }
};

//Insert a SCHEDULE

const insertSCHEDULE = async (req, res) => {
  try {
    const CAT = await SCHEDULE.create(req.body);
    if (!CAT) {
      res.status(404).json({ msg: "SCHEDULE not created!" });

      return;
    }

    res.status(200).json({ msg: "Success", data: CAT });
  } catch (e) {
    res.status(500).json({ msg: "Server error", error: e.message });
  }
};

//Update SCHEDULE

const updateSCHEDULE = async (req, res) => {
  try {
    const { id } = req.params;
    const { values: updates, hasInvalidValue } = getAllowedScheduleFields(
      req.body,
      ["description", "status", "dueDate"]
    );

    if (
      hasInvalidValue ||
      Object.keys(updates).length === 0 ||
      Object.values(updates).some((value) => value.length === 0)
    ) {
      res.status(400).json({ msg: "Invalid schedule update" });
      return;
    }

    const CAT = await SCHEDULE.findByIdAndUpdate(id, updates, { new: true });
    if (!CAT) {
      res.status(404).json({ msg: "SCHEDULE not Updated!" });

      return;
    }

    res.status(200).json({ msg: "Update Successful", data: CAT });
  } catch (e) {
    res.status(500).json({ msg: "Server error" });
  }
};

//delete SCHEDULE

const deleteSCHEDULE = async (req, res) => {
  try {
    const { id } = req.params;
    const CAT = await SCHEDULE.findByIdAndDelete(id);
    if (!CAT) {
      res.status(404).json({ msg: "SCHEDULE not Deleted!" });

      return;
    }

    res.status(200).json({ msg: "Delete Successfully!", data: CAT });
  } catch (e) {
    res.status(500).json({ msg: "Server error", error: e.message });
  }
};

module.exports = {
  allSCHEDULE,
  SCHEDULEById,
  SCHEDULEByParams,
  insertSCHEDULE,
  deleteSCHEDULE,
  updateSCHEDULE,
};
