const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  category: {
    type: String,
    enum: [
      'Création entreprise onshore',
      'Création entreprise offshore',
      'Ouverture compte bancaire onshore',
      'Ouverture compte bancaire offshore',
      'Domiciliation',
      'Réception courrier',
      'Proposition structuration patrimoniale',
      'Proposition structuration patrimoniale:Reviewed',
      'Exécution structuration patrimoniale',
      'Proposition stratégie fiscale',
      'Proposition stratégie fiscale:Reviewed'
    ],
    required: true
  },
  status: {
    type: String,
    enum: ['in progress', 'in review', 'done'],
    default: 'in progress'
  },
  completion: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 100 
  },
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  assignedUsers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  startDate: { 
    type: Date, 
    default: Date.now 
  },
  endDate: Date,
  description: String,
  tasks: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task' 
  }],
  documents: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Document' 
  }],
  invoices: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Invoice' 
  }],
  weeklyUpdates: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'WeeklyUpdate' 
  }],
  messages: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Message' 
  }]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
