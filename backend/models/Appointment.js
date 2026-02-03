const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  type: {
    type: String,
    enum: ['téléphonique', 'vidéo', 'présentiel'],
    required: true
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  advisor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project' 
  },
  location: String,
  meetingLink: String,
  notes: String,
  status: {
    type: String,
    enum: ['confirmé', 'en attente', 'annulé', 'terminé'],
    default: 'en attente'
  },
  reminderSent: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
