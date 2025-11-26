const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: { 
    type: String, 
    required: true 
  },
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project' 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  readAt: Date,
  attachments: [{
    name: String,
    filePath: String,
    fileType: String,
    fileSize: Number
  }],
  isEncrypted: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
