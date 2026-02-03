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
  status: {
    type: String,
    enum: ['pending', 'signed', 'expired'],
    default: 'pending'
  },
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
  // Users the document is explicitly assigned to
  assignedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Teams the document is explicitly assigned to
  assignedTeams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  // Roles that should have access to the document (e.g. 'client','partner','collaborator','admin')
  allowedRoles: [{
    type: String,
    enum: ['client', 'partner', 'collaborator', 'admin', 'member', 'finance']
  }],
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
  },
  archived: {
    type: Boolean,
    default: false
  },
  archivedAt: {
    type: Date
  },
  tags: [{
    type: String,
    enum: ['client', 'partner', 'collaborator', 'admin'],
    default: []
  }]
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
