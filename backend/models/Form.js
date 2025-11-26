const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  formType: { 
    type: String, 
    required: true 
  },
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  responses: { 
    type: Map, 
    of: mongoose.Schema.Types.Mixed 
  },
  completionPercentage: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 100
  },
  isCompleted: { 
    type: Boolean, 
    default: false 
  },
  pdfReport: String
}, { timestamps: true });

module.exports = mongoose.model('Form', formSchema);
