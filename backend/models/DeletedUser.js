const mongoose = require("mongoose");

const DeletedUserSchema = new mongoose.Schema(
  {
    // Informations de l'utilisateur supprimé
    originalUserId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    birthDate: { type: Date, default: null },
    nationality: { type: String, default: null },
    nationality2: { type: String, default: null },
    gender: { type: String, enum: ["male", "female", "other", null], default: null },
    role: { type: String, enum: ["admin", "member", "client", "partner", "collaborator", "user"], default: "member" },
    company: { type: String, default: null },
    address: { type: String, default: null },
    website: { type: String, default: null },
    companySize: { type: String, default: null },
    industry: { type: String, default: null },
    contactName: { type: String, default: null },
    companyEmail: { type: String, default: null },
    companyPhone: { type: String, default: null },
    status: { type: String, enum: ["active", "inactive", "prospect"], default: "active" },
    notes: { type: String, default: null },

    // Champs spécifiques aux partenaires
    organizationName: { type: String, default: null },
    position: { type: String, default: null },
    professionalPhone: { type: String, default: null },
    professionalEmail: { type: String, default: null },
    professionalAddress: { type: String, default: null },
    specialization: { type: String, default: null },
    experience: { type: String, default: null },

    // Métadonnées de suppression
    deletedBy: { type: String, required: true }, // ID de l'admin qui a supprimé
    deletedAt: { type: Date, default: Date.now },
    deletionReason: { type: String, default: "Supprimé par l'administrateur" }
  },
  { timestamps: true }
);

// Index pour optimiser les recherches
DeletedUserSchema.index({ email: 1 });
DeletedUserSchema.index({ originalUserId: 1 });
DeletedUserSchema.index({ deletedAt: -1 });

module.exports = mongoose.model("DeletedUser", DeletedUserSchema);
