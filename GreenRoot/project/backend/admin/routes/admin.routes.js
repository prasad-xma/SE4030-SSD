const express = require("express");
const { authorizePermissions, authenticateUser } = require("../middleware/auth.middleware");
const { getAuthLogs } = require("../controller/authLog.controller.js");

const router = express.Router();

router.get("/dashboard", authenticateUser, authorizePermissions("admin"));
router.get("/auth-logs", authenticateUser, authorizePermissions("admin"), getAuthLogs);

module.exports = router;