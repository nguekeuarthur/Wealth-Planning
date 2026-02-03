const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['private', 'group', 'project', 'support'],
    default: 'private'
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    lastSeen: {
      type: Date,
      default: Date.now
    }
  }],
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    allowFileSharing: { type: Boolean, default: true },
    allowVoiceMessages: { type: Boolean, default: true },
    isEncrypted: { type: Boolean, default: true }
  }
}, { timestamps: true });

// Index pour les recherches rapides
conversationSchema.index({ participants: 1 });
conversationSchema.index({ project: 1 });
conversationSchema.index({ updatedAt: -1 });

// Méthode pour vérifier si un utilisateur est participant
conversationSchema.methods.isParticipant = function(userId) {
  return this.participants.some(p => p.user.toString() === userId.toString());
};

// Méthode pour ajouter un participant
conversationSchema.methods.addParticipant = function(userId, role = 'member') {
  if (!this.isParticipant(userId)) {
    this.participants.push({
      user: userId,
      role: role,
      joinedAt: new Date(),
      lastSeen: new Date()
    });
  }
  return this.save();
};

// Méthode pour retirer un participant
conversationSchema.methods.removeParticipant = function(userId) {
  this.participants = this.participants.filter(p => p.user.toString() !== userId.toString());
  return this.save();
};

module.exports = mongoose.model('Conversation', conversationSchema);
