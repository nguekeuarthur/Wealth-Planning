const AuthLog = require("../models/AuthLog");

const logAuthEvent = async ({
  user = null,
  email = null,
  event,
  ipAddress,
  userAgent,
  metadata = {},
}) => {
  try {
    await AuthLog.create({
      user,
      email,
      event,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      metadata,
    });
  } catch (error) {
    console.error("[auditLogger] Failed to persist auth log", error.message);
  }
};

module.exports = { logAuthEvent };

