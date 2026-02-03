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
conversationSchema.methods._getUserIdString = function(userRef) {
  if (!userRef) return null;
  // If populated document
  if (typeof userRef === 'object' && userRef._id) return String(userRef._id);
  // If it's already an ObjectId or string
  try {
    return String(userRef);
  } catch (e) {
    return null;
  }
};

// Méthode pour vérifier si un utilisateur est participant
conversationSchema.methods.isParticipant = function(userId) {
  const uid = String(userId);
  return this.participants.some(p => {
    const pid = this._getUserIdString(p.user);
    return pid === uid;
  });
};

// Méthode pour ajouter un participant
conversationSchema.methods.addParticipant = function(userId, role = 'member') {
  const uid = String(userId);
  if (!this.isParticipant(uid)) {
    this.participants.push({
      user: uid,
      role: role,
      joinedAt: new Date(),
      lastSeen: new Date()
    });
  }
  return this.save();
};

// Méthode pour retirer un participant
conversationSchema.methods.removeParticipant = function(userId) {
  const uid = String(userId);
  this.participants = this.participants.filter(p => {
    const pid = this._getUserIdString(p.user);
    return pid !== uid;
  });
  return this.save();
};

// Supprimer les doublons de participants (garder la première occurrence)
conversationSchema.methods.dedupeParticipants = function() {
  const seen = new Set();
  const uniq = [];
  for (const p of this.participants) {
    const pid = this._getUserIdString(p.user);
    if (!pid) continue;
    if (!seen.has(pid)) {
      seen.add(pid);
      uniq.push({
        user: pid,
        role: p.role || 'member',
        joinedAt: p.joinedAt || new Date(),
        lastSeen: p.lastSeen || new Date()
      });
    }
  }
  this.participants = uniq;
  return this.save();
};

module.exports = mongoose.model('Conversation', conversationSchema);
