const AuthLog = require("../model/authLogModel.js");

const EVENTS = ["password_login", "google_login"];

const getAuthLogs = async (req, res) => {
    const filter = {};

    if (EVENTS.includes(req.query.event)) {
        filter.event = req.query.event;
    }
    if (req.query.success === "true" || req.query.success === "false") {
        filter.success = req.query.success === "true";
    }

    try {
        const logs = await AuthLog.find(filter).sort({ createdAt: -1 }).limit(50).lean();
        res.status(200).json({ data: logs });
    } catch (error) {
        console.error("Auth log read error:", error.message);
        res.status(500).json({ err: "Failed to load authentication logs" });
    }
};

module.exports = { getAuthLogs };
