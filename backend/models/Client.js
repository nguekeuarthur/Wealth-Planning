const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    companyName: { 
      type: String, 
      required: true 
    },
    contactName: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true,
      unique: true 
    },
    phoneNumber: { 
      type: String, 
      default: null 
    },
    address: { 
      type: String, 
      default: null 
    },
    website: { 
      type: String, 
      default: null 
    },
    logoUrl: { 
      type: String, 
      default: null 
    },
    companySize: { 
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+", null],
      default: null 
    },
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
    // Projects associated with this client
    projects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    }],
    notes: { 
      type: String, 
      default: null 
    },
    status: {
      type: String,
      enum: ["active", "inactive", "prospect"],
      default: "active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", ClientSchema);
