const mongoose = require("mongoose");

const USER = require("../../admin/model/userModel");
const { hashPassword } = require("../../admin/utils/passwordUtils");

const getAllowedUserFilters = (source) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "address",
    "phone",
    "email",
    "role",
    "image",
    "status",
  ];

  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return { values: {}, hasInvalidValue: true };
  }

  const values = {};
  let hasInvalidValue = false;

  allowedFields.forEach((field) => {
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

//get users accoding to the parameters

const userByParams = async (req, res) => {
  try {
    const { values: filters, hasInvalidValue } = getAllowedUserFilters(req.body);

    if (
      hasInvalidValue ||
      Object.keys(filters).length === 0 ||
      Object.values(filters).some((value) => value.length === 0)
    ) {
      res.status(400).json({ msg: "Invalid user filters" });
      return;
    }

    const user = await USER.find(filters);

    if (user.length <= 0) {
      res.status(404).json({ msg: "Not found!" });
      return;
    }

    res.status(200).json({ msg: "Success", data: user });
  } catch (e) {
    res.status(500).json({ msg: "Server error" });
  }
};

//Update password

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (typeof password !== "string" || password.trim().length === 0) {
      res.status(400).json({ msg: "Invalid password" });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const updates = { password: hashedPassword };
    const user = await USER.findByIdAndUpdate(id, updates, { new: true });
    if (!user) {
      res.status(404).json({ msg: "user not Updated!" });

      return;
    }

    res.status(200).json({ msg: "Update Successful", data: user });
  } catch (e) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  userByParams,
  updateUser,
};
