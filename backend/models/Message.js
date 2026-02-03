const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: function() {
      return this.type === 'text' || this.type === 'reply';
    }
  },
  type: {
    type: String,
    enum: ['text', 'file', 'image', 'voice', 'system', 'reply'],
    default: 'text'
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  // Champs legacy pour compatibilité
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  // Nouveau système de lecture
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Ancien champ pour compatibilité
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  // Réponses aux messages
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  // Pièces jointes
  attachments: [{
    name: String,
    filePath: String,
    fileType: String,
    fileSize: Number,
    url: String
  }],
  // Métadonnées
  metadata: {
    edited: { type: Boolean, default: false },
    editedAt: Date,
    deleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  isEncrypted: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Index pour les performances
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ 'readBy.user': 1 });

// Méthode pour marquer comme lu par un utilisateur
messageSchema.methods.markAsReadBy = function(userId) {
  const alreadyRead = this.readBy.some(read => read.user.toString() === userId.toString());
  if (!alreadyRead) {
    this.readBy.push({ user: userId, readAt: new Date() });
  }
  return this.save();
};

// Méthode pour vérifier si lu par un utilisateur
messageSchema.methods.isReadBy = function(userId) {
  return this.readBy.some(read => read.user.toString() === userId.toString());
};

module.exports = mongoose.model('Message', messageSchema);
