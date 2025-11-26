const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: String,
  type: {
    type: String,
    enum: ['contract', 'livrable', 'personal_data', 'other'],
    required: true
  },
  category: String,
  filePath: { 
    type: String, 
    required: true 
  },
  fileUrl: String,
  fileType: String, // pdf, jpg, png, etc
  fileSize: Number,
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project' 
  },
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  versions: [{
    version: Number,
    filePath: String,
    uploadedAt: Date,
    uploadedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
  }],
  isArchived: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
