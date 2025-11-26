const mongoose = require("mongoose");

const AuthLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    email: { type: String, required: false },
    event: {
      type: String,
      enum: [
        "register",
        "login_success",
        "login_failure",
        "logout",
        "password_reset_requested",
        "password_reset_success",
        "email_verification_sent",
        "email_verified",
        "profile_updated",
      ],
      required: true,
    },
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuthLog", AuthLogSchema);

