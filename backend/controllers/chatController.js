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
      
      // Vérifier les permissions pour les membres : ils ne peuvent parler qu'avec l'admin ou les collaborateurs de leurs projets
      if (req.user.role === 'member') {
        const Project = require('../models/Project');
        const Team = require('../models/Team');

        // Récupérer les projets où le membre est assigné (directement ou via son équipe)
        const memberProjects = await Project.find({
          $or: [
            { assignedUsers: req.user._id },
            { assignedTeams: { $in: await Team.find({ members: req.user._id }).select('_id') } }
          ]
        }).select('assignedUsers assignedTeams');

        // Récupérer tous les collaborateurs de ces projets
        const projectCollaborators = new Set();
        for (const project of memberProjects) {
          // Ajouter les utilisateurs assignés directement
          project.assignedUsers.forEach(userId => projectCollaborators.add(userId.toString()));

          // Ajouter les membres des équipes assignées
          for (const teamId of project.assignedTeams) {
            const team = await Team.findById(teamId).populate('members', 'role');
            team.members.forEach(member => {
              if (member.role === 'collaborator') {
                projectCollaborators.add(member._id.toString());
              }
            });
          }
        }

        // Vérifier que chaque participant est soit l'admin, soit un collaborateur autorisé
        for (const participantId of participants) {
          const participant = participantUsers.find(u => u._id.toString() === participantId);
          if (!participant) continue;

          const isAdmin = participant.role === 'admin';
          const isAuthorizedCollaborator = participant.role === 'collaborator' && projectCollaborators.has(participantId);

          if (!isAdmin && !isAuthorizedCollaborator) {
            console.log('❌ Member cannot create conversation with this participant:', {
              participantId,
              participantRole: participant.role,
              isAuthorizedCollaborator
            });
            return res.status(403).json({
              message: 'En tant que membre, vous ne pouvez discuter qu\'avec l\'administrateur ou les collaborateurs de vos projets'
            });
          }
        }
      }

      // Vérifier les permissions pour les partenaires : ils ne parlent qu'avec l'admin
      if (req.user.role === 'partner') {
        for (const participantId of participants) {
          const participant = participantUsers.find(u => u._id.toString() === participantId);
          if (!participant) continue;

          if (participant.role !== 'admin') {
            console.log('❌ Partner cannot create conversation with this participant:', {
              participantId,
              participantRole: participant.role
            });
            return res.status(403).json({
              message: 'En tant que partenaire, vous ne pouvez discuter qu\'avec l\'administrateur'
            });
          }
        }
      }

      // Vérifier les permissions pour les collaborateurs : ils parlent avec l'admin et les partenaires
      if (req.user.role === 'collaborator') {
        for (const participantId of participants) {
          const participant = participantUsers.find(u => u._id.toString() === participantId);
          if (!participant) continue;

          const isAllowed = participant.role === 'admin' || participant.role === 'partner';

          if (!isAllowed) {
            console.log('❌ Collaborator cannot create conversation with this participant:', {
              participantId,
              participantRole: participant.role
            });
            return res.status(403).json({
              message: 'En tant que collaborateur, vous ne pouvez discuter qu\'avec l\'administrateur ou les partenaires'
            });
          }
        }
      }

      // Vérifier les permissions pour les clients : ils parlent avec l'admin et les collaborateurs
      if (req.user.role === 'client') {
        for (const participantId of participants) {
          const participant = participantUsers.find(u => u._id.toString() === participantId);
          if (!participant) continue;

          const isAllowed = participant.role === 'admin' || participant.role === 'collaborator';

          if (!isAllowed) {
            console.log('❌ Client cannot create conversation with this participant:', {
              participantId,
              participantRole: participant.role
            });
            return res.status(403).json({
              message: 'En tant que client, vous ne pouvez discuter qu\'avec l\'administrateur ou les collaborateurs'
            });
          }
        }
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
      name: { $ne: 'Général' } // Exclure la conversation "Général" pour tous les rôles
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
    // Filtrer les conversations pour les partenaires : ne pas voir les conversations avec des Clients
    // Filtrer les conversations pour les collaborateurs : ne pas voir les conversations avec des Partenaires
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
    } else if (userRole === 'collaborator') {
      conversations = conversations.filter(conv => {
        // Vérifier si la conversation contient un partenaire
        const hasPartner = conv.participants.some(p => 
          p.user && p.user.role === 'partner'
        );
        // Ne garder que les conversations sans partenaire
        return !hasPartner;
      });
      console.log('🔒 Collaborator conversations filtered. Removed conversations with partners.');
    } else if (userRole === 'partner') {
      conversations = conversations.filter(conv => {
        // Vérifier si la conversation contient un client
        const hasClient = conv.participants.some(p => 
          p.user && p.user.role === 'client'
        );
        // Ne garder que les conversations sans client
        return !hasClient;
      });
      console.log('🔒 Partner conversations filtered. Removed conversations with clients.');
    }

    // Récupérer la date de création de l'utilisateur pour filtrer les messages
    const currentUser = await User.findById(req.user._id);
    const userCreatedAt = currentUser.createdAt;

    // Ajouter le compteur de messages non lus pour chaque conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        // Construire la requête de comptage
        const countQuery = {
          conversation: conv._id,
          sender: { $ne: req.user._id },
          'readBy.user': { $ne: req.user._id }
        };

        // Pour les conversations de groupe, ne compter que les messages postérieurs à l'inscription
        if (conv.type === 'group' || conv.type === 'support') {
          countQuery.createdAt = { $gte: userCreatedAt };
        }

        const unreadCount = await Message.countDocuments(countQuery);

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

    // Récupérer l'utilisateur pour obtenir sa date de création
    const user = await User.findById(req.user._id);
    const userCreatedAt = user.createdAt;

    // Construire la requête de filtrage
    const messageQuery = { 
      conversation: conversationId
    };

    // Pour les conversations de groupe (comme "Général"), ne montrer que les messages postérieurs à l'inscription
    if (conversation.type === 'group' || conversation.type === 'support') {
      messageQuery.createdAt = { $gte: userCreatedAt };
    }

    const messages = await Message.find(messageQuery)
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
      'participants.user': req.user._id,
      name: { $ne: 'Général' } // Exclure la conversation "Général"
    })
      .populate('participants.user', 'name email profileImageUrl role')
      .populate('project', 'name')
      .populate('lastMessage');

    // Pour les membres, précharger les données des projets pour filtrer correctement
    let authorizedCollaboratorIds = new Set();
    if (req.user.role === 'member') {
      const Project = require('../models/Project');
      const Team = require('../models/Team');

      const memberProjects = await Project.find({
        $or: [
          { assignedUsers: req.user._id },
          { assignedTeams: { $in: await Team.find({ members: req.user._id }).select('_id') } }
        ]
      }).select('assignedUsers assignedTeams');

      for (const project of memberProjects) {
        // Ajouter les collaborateurs assignés directement
        for (const userId of project.assignedUsers) {
          const user = await User.findById(userId).select('role');
          if (user && user.role === 'collaborator') {
            authorizedCollaboratorIds.add(userId.toString());
          }
        }

        // Ajouter les collaborateurs des équipes assignées
        for (const teamId of project.assignedTeams) {
          const team = await Team.findById(teamId).populate('members', 'role _id');
          for (const member of team.members) {
            if (member.role === 'collaborator') {
              authorizedCollaboratorIds.add(member._id.toString());
            }
          }
        }
      }
    }

    // Filtrer les conversations selon les permissions de chaque rôle
    if (req.user.role === 'client') {
      conversations = conversations.filter(conv => {
        // Les clients ne voient que les conversations avec l'admin ou les collaborateurs
        return conv.participants.every(p =>
          !p.user || p.user.role === 'admin' || p.user.role === 'collaborator' || p.user._id.toString() === req.user._id.toString()
        );
      });
    } else if (req.user.role === 'partner') {
      conversations = conversations.filter(conv => {
        // Les partenaires ne voient que les conversations avec l'admin
        return conv.participants.every(p =>
          !p.user || p.user.role === 'admin' || p.user._id.toString() === req.user._id.toString()
        );
      });
    } else if (req.user.role === 'collaborator') {
      conversations = conversations.filter(conv => {
        // Les collaborateurs ne voient que les conversations avec l'admin ou les partenaires
        return conv.participants.every(p =>
          !p.user || p.user.role === 'admin' || p.user.role === 'partner' || p.user._id.toString() === req.user._id.toString()
        );
      });
    } else if (req.user.role === 'member') {
      // Pour les membres, vérifier que tous les autres participants sont autorisés
      conversations = conversations.filter(conv => {
        return conv.participants.every(p => {
          if (!p.user || p.user._id.toString() === req.user._id.toString()) return true;

          // L'admin est toujours autorisé
          if (p.user.role === 'admin') return true;

          // Les collaborateurs autorisés sont autorisés
          if (p.user.role === 'collaborator' && authorizedCollaboratorIds.has(p.user._id.toString())) {
            return true;
          }

          // Tout autre participant n'est pas autorisé
          return false;
        });
      });
    }

    // Récupérer la date de création de l'utilisateur pour filtrer les messages
    const currentUser = await User.findById(req.user._id);
    const userCreatedAt = currentUser.createdAt;

    // Ajouter le compteur de messages non lus pour chaque conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const Message = require('../models/Message');
        
        // Construire la requête de comptage
        const countQuery = {
          conversation: conv._id,
          sender: { $ne: req.user._id },
          'readBy.user': { $ne: req.user._id }
        };

        // Pour les conversations de groupe, ne compter que les messages postérieurs à l'inscription
        if (conv.type === 'group' || conv.type === 'support') {
          countQuery.createdAt = { $gte: userCreatedAt };
        }

        const unreadCount = await Message.countDocuments(countQuery);

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
      return true; // Admin peut créer tous types de conversations
    case 'collaborator':
    case 'client':
    case 'partner':
    case 'member':
      // Seuls les admins peuvent créer des groupes, les autres ne peuvent créer que des conversations privées
      return conversationType === 'private';
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

  // Les collaborateurs voient les conversations de projet, privées et de groupe SANS partenaires
  // Pour les conversations privées, ils doivent être participants
  if (['collaborator', 'user', 'member'].includes(userRole)) {
    const isParticipant = conversation.participants.some(p =>
      p.user.toString() === userId.toString()
    );
    const allowedType = ['private', 'project', 'group'].includes(conversation.type);
    
    // Pour les collaborateurs, vérifier qu'il n'y a pas de partenaire dans la conversation
    if (userRole === 'collaborator') {
      const hasPartner = conversation.participants.some(p => 
        p.user && (p.user.role === 'partner' || (typeof p.user === 'object' && p.user.role === 'partner'))
      );
      
      if (hasPartner) {
        console.log('👷 Collaborator - Has partner in conversation, access denied');
        return false;
      }
    }
    
    // Pour les conversations privées, vérifier qu'ils sont participants
    if (conversation.type === 'private' && !isParticipant) {
      console.log('👷 Collaborator/User/Member - Private conversation but not participant:', { isParticipant });
      return false;
    }
    
    console.log('👷 User/Collaborator/Member check:', { allowed: allowedType, conversationType: conversation.type, isParticipant });
    return allowedType;
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

  // Les partenaires voient seulement leurs conversations privées, SANS clients
  if (userRole === 'partner') {
    const isParticipant = conversation.participants.some(p =>
      p.user.toString() === userId.toString()
    );
    const allowedType = ['private', 'group', 'support'].includes(conversation.type);
    
    // Vérifier qu'il n'y a pas de client dans la conversation
    const hasClient = conversation.participants.some(p => 
      p.user && (p.user.role === 'client' || (typeof p.user === 'object' && p.user.role === 'client'))
    );
    
    const result = isParticipant && allowedType && !hasClient;
    console.log('🤝 Partner check:', { isParticipant, allowedType, hasClient, result });
    return result;
  }

  console.log('❌ No matching role, access denied');
  return false;
}

// @desc    Clean up invalid conversations after permission changes (Admin only)
// @route   DELETE /api/chat/cleanup
// @access  Private (Admin)
exports.cleanupInvalidConversations = async (req, res) => {
  try {
    // Vérifier que c'est un admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    // Supprimer TOUTES les conversations privées et de groupe (car la logique a changé)
    const result = await Conversation.deleteMany({
      type: { $in: ['private', 'group', 'project'] }
    });

    // Supprimer tous les messages associés
    await Message.deleteMany({
      conversation: {
        $nin: await Conversation.find({
          type: { $nin: ['private', 'group', 'project'] }
        }).distinct('_id')
      }
    });

    console.log(`🧹 Cleanup: ${result.deletedCount} conversations supprimées`);

    res.json({
      message: 'Conversations nettoyées avec succès',
      deletedConversations: result.deletedCount,
      message: 'Toutes les conversations privées et groupes ont été supprimées car la logique de permissions a changé'
    });
  } catch (error) {
    console.error('Erreur lors du nettoyage des conversations:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Helper references for exports
const _initializeDefaultConversations = exports.initializeDefaultConversations;
const _getConversations = exports.getConversations;
const _getConversationMessages = exports.getConversationMessages;
const _sendMessage = exports.sendMessage;
const _createConversation = exports.createConversation;
const _addParticipant = exports.addParticipant;
const _removeParticipant = exports.removeParticipant;
const _cleanupInvalidConversations = exports.cleanupInvalidConversations;
const _canCreateConversation = exports.canCreateConversation;
const _canAccessConversation = exports.canAccessConversation;

module.exports = {
  initializeDefaultConversations: _initializeDefaultConversations,
  getConversations: _getConversations,
  getConversationMessages: _getConversationMessages,
  sendMessage: _sendMessage,
  createConversation: _createConversation,
  addParticipant: _addParticipant,
  removeParticipant: _removeParticipant,
  cleanupInvalidConversations: _cleanupInvalidConversations,
  canCreateConversation: _canCreateConversation,
  canAccessConversation: _canAccessConversation
};
