const crypto = require("crypto");

const generateRandomToken = (size = 40) =>
  crypto.randomBytes(size).toString("hex");

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

module.exports = {
  generateRandomToken,
  hashToken,
};

