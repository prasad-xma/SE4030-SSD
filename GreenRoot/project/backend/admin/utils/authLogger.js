const AuthLog = require("../model/authLogModel.js");

const clean = (value, maxLength) => (typeof value === "string" ? value.slice(0, maxLength) : "");

const logAuthEvent = (req, { event, success, reason = "", email = "", userId = null }) => {
    AuthLog.create({
        event,
        success,
        reason: clean(reason, 100),
        email: clean(email, 254).toLowerCase(),
        userId,
        ip: clean(req.ip, 64),
        userAgent: clean(req.get("user-agent"), 200),
    }).catch((error) => console.error("Auth log error:", error.message));
};

module.exports = { logAuthEvent };
