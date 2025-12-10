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
    enum: ['payée', 'en attente', 'partiellement payée', 'paiement reçu', 'non payée'],
    default: 'en attente'
  },
  issueDate: { 
    type: Date, 
    default: Date.now 
  },
  dueDate: { 
    type: Date
  },
  paidDate: Date,
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client', 
    required: true 
  },
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project' 
  },
  attachment: {
    path: String,
    originalName: String,
    mimeType: String,
    size: Number
  },
  tags: [{
    type: String,
    enum: ['client', 'partner', 'collaborator', 'admin'],
    default: []
  }]
}, { timestamps: true });

// Middleware pre-save : Mettre automatiquement le statut à "non payée" si la date d'échéance est passée
invoiceSchema.pre('save', function(next) {
  // Si la facture a une date d'échéance et que celle-ci est passée
  if (this.dueDate && new Date(this.dueDate) < new Date()) {
    // Ne changer le statut que si la facture est "en attente" ou "partiellement payée"
    // Les factures déjà payées, avec paiement reçu, ou déjà marquées "non payée" ne doivent pas être modifiées
    if (this.status === 'en attente' || this.status === 'partiellement payée') {
      this.status = 'non payée';
    }
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
