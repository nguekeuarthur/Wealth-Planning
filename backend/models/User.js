const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    birthDate: { type: Date, required: false, default: null },
    nationality: { type: String, required: false, trim: true, default: null },
    profileCompleted: { type: Boolean, default: false },
    teams: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    }],
    company: { type: String, default: null },
    address: { type: String, default: null },
    website: { type: String, default: null },
    logoUrl: { type: String, default: null },
    companySize: { type: String, default: null },
    industry: { 
      type: String, 
      enum: [
        "REAL ESTATE", 
        "LEGAL", 
        "AUTOMOTIVE", 
        "FINANCE", 
        "TECHNOLOGY", 
        "HEALTHCARE", 
        "RETAIL", 
        "MANUFACTURING", 
        "CONSULTING", 
        "OTHER",
        "AUTRES", // French value kept for backward compatibility
        null
      ],
      default: null 
    },
    role: { type: String, enum: ["admin", "member"], default: "member" }, // Role-based access
    language: {
      type: String,
      default: "FR",
      enum: ["FR", "EN", "DE", "IT"],
    },
    isEmailVerified: { type: Boolean, default: false },
    emailVerifiedAt: { type: Date, default: null },
    emailVerificationToken: { type: String, default: null },
    emailVerificationExpires: { type: Date, default: null },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Virtual property for fullName (returns the name field for compatibility)
UserSchema.virtual('fullName').get(function() {
  return this.name;
});

// Ensure virtual fields are serialized when converting to JSON
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
