const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  service: { 
    type: String, 
    required: true 
  },
  description: String,
  status: {
    type: String,
    enum: ['payée', 'en attente', 'à envoyer', 'partiellement payée', 'paiement reçu', 'non payée'],
    default: 'à envoyer'
  },
  issueDate: { 
    type: Date, 
    default: Date.now 
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  paidDate: Date,
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project' 
  },
  pdfPath: String
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
