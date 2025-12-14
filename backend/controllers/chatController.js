const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const Project = require('../models/Project');

// Initialiser des conversations par défaut
exports.initializeDefaultConversations = async () => {
  try {
    const defaultConversations = [
      {
        name: 'Général',
        type: 'group',
        settings: {
          allowFileSharing: true,
          allowVoiceMessages: true,
          isEncrypted: true
        }
      },
      {
        name: 'Support Client',
        type: 'support',
        settings: {
          allowFileSharing: true,
          allowVoiceMessages: false,
          isEncrypted: true
        }
      }
    ];

    for (const convData of defaultConversations) {
      const existing = await Conversation.findOne({
        name: convData.name,
        type: convData.type
      });

      if (!existing) {
        await Conversation.create({
          ...convData,
          participants: [],
          isActive: true
        });
        console.log(`Conversation "${convData.name}" créée`);
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des conversations:', error);
  }
};

// Assigner un utilisateur aux conversations par défaut selon son rôle
exports.assignUserToDefaultConversations = async (userId, userRole) => {
  try {
    const conversationsToAssign = [];

    // Tous les utilisateurs peuvent accéder à "Général"
    const generalConv = await Conversation.findOne({ name: 'Général', type: 'group' });
    if (generalConv && !generalConv.isParticipant(userId)) {
      conversationsToAssign.push(generalConv);
    }

    // Les clients, partenaires, utilisateurs et membres peuvent accéder au support
    if (['client', 'partner', 'user', 'member'].includes(userRole)) {
      const supportConv = await Conversation.findOne({ name: 'Support Client', type: 'support' });
      if (supportConv && !supportConv.isParticipant(userId)) {
        conversationsToAssign.push(supportConv);
      }
    }

    // Assigner l'utilisateur aux conversations
    for (const conversation of conversationsToAssign) {
      const role = userRole === 'admin' ? 'admin' : 'member';
      // Ajouter manuellement sans sauvegarder automatiquement
      if (!conversation.isParticipant(userId)) {
        conversation.participants.push({
          user: userId,
          role: role,
          joinedAt: new Date(),
          lastSeen: new Date()
        });
        await conversation.save();
        console.log(`Utilisateur ${userId} ajouté à la conversation "${conversation.name}"`);
      }
    }

    return conversationsToAssign.length;
  } catch (error) {
    console.error('Erreur lors de l\'assignation aux conversations par défaut:', error);
    return 0;
  }
};

// Créer une nouvelle conversation
exports.createConversation = async (req, res) => {
  try {
    const { name, type, participants, projectId } = req.body;

    console.log('🔍 Create conversation request:', {
      body: req.body,
      user: req.user,
      userId: req.user?._id,
      userRole: req.user?.role
    });

    if (!name || !type) {
      console.log('❌ Missing name or type');
      return res.status(400).json({ message: 'Nom et type requis' });
    }

    // Vérifier les permissions selon les rôles
    const canCreate = canCreateConversation(req.user.role, type);
    console.log('🔐 Permission check:', { userRole: req.user.role, type, canCreate });

    if (!canCreate) {
      console.log('❌ Permission denied');
      return res.status(403).json({ message: 'Permissions insuffisantes' });
    }

    if (type === 'private' && Array.isArray(participants) && participants.length === 1) {
      const otherUserId = participants[0];
      const existingConversation = await Conversation.findOne({
        type: 'private',
        isActive: true,
        'participants.user': { $all: [req.user._id, otherUserId] },
        $expr: { $eq: [{ $size: '$participants' }, 2] }
      })
        .populate('participants.user', 'name email profileImageUrl role')
        .populate('project', 'name')
        .populate('lastMessage');

      if (existingConversation) {
        return res.status(200).json({
          message: 'Conversation existante',
          conversation: existingConversation,
          existed: true
        });
      }
    }

    console.log('🏗️ Creating conversation object...');
    const conversation = new Conversation({
      name,
      type,
      project: projectId,
      participants: [{
        user: req.user._id,
        role: 'admin'
      }]
    });

    console.log('👥 Adding participants...', { participants, participantCount: participants?.length });

    // Ajouter les autres participants (sans sauvegarder à chaque fois)
    if (participants && participants.length > 0) {
      // Vérifier les rôles des participants pour empêcher les conversations Client <-> Partenaire
      const participantUsers = await User.find({ _id: { $in: participants } }).select('role');
      const participantRoles = participantUsers.map(u => u.role);
      const hasClient = req.user.role === 'client' || participantRoles.includes('client');
      const hasPartner = req.user.role === 'partner' || participantRoles.includes('partner');
      
      if (hasClient && hasPartner) {
        console.log('❌ Cannot create conversation: Client and Partner cannot be in the same conversation');
        return res.status(403).json({ 
          message: 'Les clients et les partenaires ne peuvent pas être dans la même conversation' 
        });
      }
      
      for (const participantId of participants) {
        console.log('➕ Adding participant:', participantId);
        if (participantId !== req.user._id.toString()) {
          // Ajouter manuellement sans sauvegarder
          if (!conversation.isParticipant(participantId)) {
            conversation.participants.push({
              user: participantId,
              role: 'member',
              joinedAt: new Date(),
              lastSeen: new Date()
            });
            console.log('✅ Participant added:', participantId);
          } else {
            console.log('⏭️ Already participant:', participantId);
          }
        } else {
          console.log('⏭️ Skipping self:', participantId);
        }
      }
    }

    console.log('💾 Saving conversation...');
    await conversation.save();
    console.log('✅ Conversation saved:', conversation._id);

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('participants.user', 'name email profileImageUrl role')
      .populate('project', 'name')
      .populate('lastMessage');

    console.log('✅ Conversation created successfully:', {
      id: populatedConversation._id,
      name: populatedConversation.name,
      type: populatedConversation.type,
      participantsCount: populatedConversation.participants.length
    });

    res.status(201).json({
      message: 'Conversation créée',
      conversation: populatedConversation
    });
  } catch (error) {
    console.error('💥 Error in createConversation:', error);
    console.error('📋 Error stack:', error.stack);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir les conversations de l'utilisateur
exports.getUserConversations = async (req, res) => {
  try {
    console.log('🔄 getUserConversations called for user:', req.user._id, 'role:', req.user.role);

    // Assigner automatiquement l'utilisateur aux conversations par défaut s'il n'y est pas encore
    await exports.assignUserToDefaultConversations(req.user._id, req.user.role);

    const userRole = req.user.role;
    const userId = req.user._id;

    // Construire le filtre de base
    const filter = {
      'participants.user': userId,
      isActive: true,
    };

    // Ajouter des conditions basées sur le rôle
    if (userRole === 'client') {
      // Les clients peuvent voir les conversations de type private, project, group, et support
      filter.type = { $in: ['private', 'project', 'group', 'support'] };
    } else if (['collaborator', 'user', 'member'].includes(userRole)) {
      // Les collaborateurs, utilisateurs et membres voient les conversations de projet, privées et de groupe
      filter.type = { $in: ['private', 'project', 'group'] };
    } else if (userRole === 'partner') {
      // Les partenaires voient les conversations privées, de groupe et de support
      filter.type = { $in: ['private', 'group', 'support'] };
    }
    // Pour 'admin', aucun filtre de type n'est ajouté, il voit tout.

    console.log('🔍 Filter applied:', filter);

    let conversations = await Conversation.find(filter)
      .populate('participants.user', 'name email profileImageUrl role')
      .populate('project', 'name')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    // Filtrer les conversations pour les clients : ne pas voir les conversations avec des Partenaires
    if (userRole === 'client') {
      conversations = conversations.filter(conv => {
        // Vérifier si la conversation contient un partenaire
        const hasPartner = conv.participants.some(p => 
          p.user && p.user.role === 'partner'
        );
        // Ne garder que les conversations sans partenaire
        return !hasPartner;
      });
      console.log('🔒 Client conversations filtered. Removed conversations with partners.');
    }

    // Ajouter le compteur de messages non lus pour chaque conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversation: conv._id,
          sender: { $ne: req.user._id },
          'readBy.user': { $ne: req.user._id }
        });

        return {
          ...conv.toObject(),
          unreadCount
        };
      })
    );

    console.log('📋 Conversations found:', conversationsWithUnread.length);
    conversationsWithUnread.forEach((conv, index) => {
      console.log(`  ${index + 1}. ${conv.name} (${conv.type}) - Participants: ${conv.participants.length}`);
    });

    res.json({ conversations: conversationsWithUnread });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir les messages d'une conversation
exports.getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    console.log('📨 getConversationMessages called:', {
      conversationId,
      userId: req.user._id,
      userRole: req.user.role
    });

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      console.log('❌ Conversation not found');
      return res.status(404).json({ message: 'Conversation non trouvée' });
    }

    console.log('📋 Conversation found:', {
      name: conversation.name,
      type: conversation.type,
      participantCount: conversation.participants.length,
      isParticipant: conversation.isParticipant(req.user._id)
    });

    if (!conversation.isParticipant(req.user._id)) {
      console.log('❌ User is not participant');
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const canAccess = canAccessConversation(req.user, conversation);
    console.log('🔐 canAccessConversation result:', canAccess, 'for role:', req.user.role, 'type:', conversation.type);

    if (!canAccess) {
      console.log('❌ Access denied by role permissions');
      return res.status(403).json({ message: 'Accès refusé selon votre rôle' });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name email profileImageUrl role')
      .populate('replyTo', 'content sender')
      .populate('readBy.user', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Marquer les messages comme lus
    const unreadMessages = messages.filter(msg =>
      !msg.isReadBy(req.user._id) && msg.sender.toString() !== req.user._id.toString()
    );

    for (const message of unreadMessages) {
      await message.markAsReadBy(req.user._id);
    }

    res.json({
      messages: messages.reverse(), // Remettre dans l'ordre chronologique
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: messages.length === parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Envoyer un message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, content, type = 'text', replyTo, attachments } = req.body;

    if (!conversationId || !content) {
      return res.status(400).json({ message: 'Conversation et contenu requis' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation non trouvée' });
    }

    if (!conversation.isParticipant(req.user._id)) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const message = new Message({
      content,
      type,
      sender: req.user._id,
      conversation: conversationId,
      replyTo,
      attachments: attachments || []
    });

    await message.save();

    // Mettre à jour la dernière activité de la conversation
    conversation.lastMessage = message._id;
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email profileImageUrl role')
      .populate('replyTo', 'content sender')
      .populate('readBy.user', 'name');

    // Émettre via Socket.io
    if (global.io) {
      console.log('📡 Emitting newMessage via Socket.io to conversation:', conversationId);
      console.log('📨 Message data:', populatedMessage);
      global.io.to(conversationId).emit('newMessage', populatedMessage);
      console.log('✅ Message emitted successfully');
    } else {
      console.log('⚠️ Socket.io not available');
    }

    res.status(201).json({
      message: 'Message envoyé',
      data: populatedMessage
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'envoi', error: error.message });
  }
};

// Ajouter un participant à une conversation
exports.addParticipant = async (req, res) => {
  try {
    const { conversationId, userId } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation non trouvée' });
    }

    // Vérifier si l'utilisateur actuel est admin de la conversation
    const currentUserParticipant = conversation.participants.find(
      p => p.user.toString() === req.user._id.toString()
    );

    if (!currentUserParticipant || currentUserParticipant.role !== 'admin') {
      return res.status(403).json({ message: 'Permissions insuffisantes' });
    }

    await conversation.addParticipant(userId);

    const updatedConversation = await Conversation.findById(conversationId)
      .populate('participants.user', 'name email profileImageUrl role');

    res.json({
      message: 'Participant ajouté',
      conversation: updatedConversation
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get conversations with unread counts
exports.getConversations = async (req, res) => {
  try {
    let conversations = await Conversation.find({
      isActive: true,
      'participants.user': req.user._id
    })
      .populate('participants.user', 'name email profileImageUrl role')
      .populate('project', 'name')
      .populate('lastMessage');

    // Filtrer les conversations pour les clients : ne pas voir les conversations avec des Partenaires
    if (req.user.role === 'client') {
      conversations = conversations.filter(conv => {
        // Vérifier si la conversation contient un partenaire
        const hasPartner = conv.participants.some(p => 
          p.user && p.user.role === 'partner'
        );
        // Ne garder que les conversations sans partenaire
        return !hasPartner;
      });
    }

    // Ajouter le compteur de messages non lus pour chaque conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const Message = require('../models/Message');
        const unreadCount = await Message.countDocuments({
          conversation: conv._id,
          sender: { $ne: req.user._id },
          'readBy.user': { $ne: req.user._id }
        });

        return {
          ...conv.toObject(),
          unreadCount
        };
      })
    );

    res.json({ conversations: conversationsWithUnread });
  } catch (error) {
    console.error('Erreur getConversations:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer un participant
exports.removeParticipant = async (req, res) => {
  try {
    const { conversationId, userId } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation non trouvée' });
    }

    // Vérifier les permissions
    const currentUserParticipant = conversation.participants.find(
      p => p.user.toString() === req.user._id.toString()
    );

    if (!currentUserParticipant ||
      (currentUserParticipant.role !== 'admin' && userId !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Permissions insuffisantes' });
    }

    await conversation.removeParticipant(userId);

    res.json({ message: 'Participant supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Fonctions utilitaires pour les permissions
function canCreateConversation(userRole, conversationType) {
  switch (userRole) {
    case 'admin':
      return true;
    case 'collaborator':
    case 'user':
    case 'member': // Les membres/utilisateurs ont les mêmes permissions que les collaborateurs
      return ['private', 'project', 'group'].includes(conversationType);
    case 'client':
      return ['private', 'group'].includes(conversationType);
    case 'partner':
      return ['private', 'group'].includes(conversationType);
    default:
      return false;
  }
}

function canAccessConversation(user, conversation) {
  const userRole = user.role;
  const userId = user._id;

  console.log('🔍 canAccessConversation check:', {
    userRole,
    conversationType: conversation.type,
    conversationName: conversation.name
  });

  // L'admin voit tout
  if (userRole === 'admin') {
    console.log('✅ Admin access granted');
    return true;
  }

  // Les collaborateurs, utilisateurs et membres voient les conversations de projet, privées et de groupe
  if (['collaborator', 'user', 'member'].includes(userRole)) {
    const allowed = ['private', 'project', 'group'].includes(conversation.type);
    console.log('👷 User/Collaborator/Member check:', { allowed, conversationType: conversation.type });
    return allowed;
  }

  // Les clients voient seulement leurs conversations privées et de projet, SANS partenaires
  if (userRole === 'client') {
    const isParticipant = conversation.participants.some(p =>
      p.user.toString() === userId.toString()
    );
    const allowedType = ['private', 'project', 'group', 'support'].includes(conversation.type);
    
    // Vérifier qu'il n'y a pas de partenaire dans la conversation
    const hasPartner = conversation.participants.some(p => 
      p.user && (p.user.role === 'partner' || (typeof p.user === 'object' && p.user.role === 'partner'))
    );
    
    const result = isParticipant && allowedType && !hasPartner;
    console.log('👤 Client check:', { isParticipant, allowedType, hasPartner, result });
    return result;
  }

  // Les partenaires voient seulement leurs conversations privées
  if (userRole === 'partner') {
    const isParticipant = conversation.participants.some(p =>
      p.user.toString() === userId.toString()
    );
    const allowedType = ['private', 'group', 'support'].includes(conversation.type);
    const result = isParticipant && allowedType;
    console.log('🤝 Partner check:', { isParticipant, allowedType, result });
    return result;
  }

  console.log('❌ No matching role, access denied');
  return false;
}
