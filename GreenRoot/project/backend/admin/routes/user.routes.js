const express = require("express");
const {
  getUsersByRole,
  createUser,
  updateUser,
  deleteUser,
  getSingleUser,
  getUserCounts,
} = require("../controller/user.controller");

// 1. Import authentication and authorization middleware
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/auth.middleware.js");

const router = express.Router();

// 2. Protect all routes in this file with AuthN and AuthZ (admin only)
router.use(authenticateUser);
router.use(authorizePermissions("admin"));

// User management endpoints
router.get("/allusers", getUserCounts);
router.get("/admins", (req, res) => getUsersByRole(req, res, "admin"));
router.get("/farmers", (req, res) => getUsersByRole(req, res, "farmer"));
router.get("/sellers", (req, res) => getUsersByRole(req, res, "seller"));
router.get("/customers", (req, res) => getUsersByRole(req, res, "customer"));
router.get("/researchers", (req, res) => getUsersByRole(req, res, "researcher"));
router.get("/deliveryPerson", (req, res) => getUsersByRole(req, res, "deliveryPerson"));
router.get("/:id", getSingleUser);
router.post("/create", createUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

module.exports = router;