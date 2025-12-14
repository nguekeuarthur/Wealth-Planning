const Message = require('../models/Message');
const Project = require('../models/Project');

// Get all messages
exports.getAllMessages = async (req, res) => {
  try {
    const { project, isRead } = req.query;
    const filter = {};

    if (project) filter.project = project;
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    // Filter by sender or receiver
    filter.$or = [
      { sender: req.user._id },
      { receiver: req.user._id }
    ];

    let messages = await Message.find(filter)
      .populate('sender', 'name email profileImageUrl role')
      .populate('receiver', 'name email profileImageUrl role')
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    // Filtrer selon les règles de rôle
    if (req.user.role === 'client') {
      // Clients : voient seulement les messages avec admin et/ou collaborateur, jamais avec partenaires
      messages = messages.filter(msg => {
        const senderRole = msg.sender?.role;
        const receiverRole = msg.receiver?.role;
        return senderRole !== 'partner' && receiverRole !== 'partner';
      });
    } else if (req.user.role === 'partner') {
      // Partenaires : voient seulement les messages avec admin + collaborateur, jamais avec client
      messages = messages.filter(msg => {
        const senderRole = msg.sender?.role;
        const receiverRole = msg.receiver?.role;
        return senderRole !== 'client' && receiverRole !== 'client';
      });
    } else if (req.user.role === 'collaborator') {
      // Collaborateurs : voient le chat Clients/Admin mais pas le chat Partenaires/Admin
      messages = messages.filter(msg => {
        const senderRole = msg.sender?.role;
        const receiverRole = msg.receiver?.role;
        // Exclure les messages entre partner et admin
        return !(senderRole === 'partner' && receiverRole === 'admin') &&
          !(senderRole === 'admin' && receiverRole === 'partner');
      });
    }

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get messages for a project
exports.getProjectMessages = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId).populate('assignedUsers', 'role');
    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Check permissions - allow admin, client, project lead, and assigned users
    const isAdmin = req.user.role === 'admin';
    const isCollaborator = req.user.role === 'collaborator';
    const isClient = project.client && project.client.toString() === req.user._id.toString();
    const isProjectLead = project.projectLead && project.projectLead.toString() === req.user._id.toString();
    const isAssignedUser = project.assignedUsers && project.assignedUsers.some(
      user => user._id.toString() === req.user._id.toString()
    );

    if (!isAdmin && !isCollaborator && !isClient && !isProjectLead && !isAssignedUser) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    let messages = await Message.find({ project: projectId })
      .populate('sender', 'name email profileImageUrl role')
      .populate('receiver', 'name email profileImageUrl role')
      .sort({ createdAt: -1 });

    // Filtrer selon les règles de rôle
    if (req.user.role === 'client') {
      // Clients : voient seulement les messages avec admin et/ou collaborateur, jamais avec partenaires
      messages = messages.filter(msg => {
        const senderRole = msg.sender?.role;
        const receiverRole = msg.receiver?.role;
        return senderRole !== 'partner' && receiverRole !== 'partner';
      });
    } else if (req.user.role === 'partner') {
      // Partenaires : voient seulement les messages avec admin + collaborateur, jamais avec client
      messages = messages.filter(msg => {
        const senderRole = msg.sender?.role;
        const receiverRole = msg.receiver?.role;
        return senderRole !== 'client' && receiverRole !== 'client';
      });
    } else if (req.user.role === 'collaborator') {
      // Collaborateurs : voient le chat Clients/Admin mais pas le chat Partenaires/Admin
      messages = messages.filter(msg => {
        const senderRole = msg.sender?.role;
        const receiverRole = msg.receiver?.role;
        // Exclure les messages entre partner et admin
        return !(senderRole === 'partner' && receiverRole === 'admin') &&
          !(senderRole === 'admin' && receiverRole === 'partner');
      });
    }

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get recent messages (last 15-24 hours)
exports.getRecentMessages = async (req, res) => {
  try {
    const hoursAgo = req.query.hours || 24;
    const since = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

    const filter = {
      createdAt: { $gte: since },
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    };

    let messages = await Message.find(filter)
      .populate('sender', 'fullName email profilePic role')
      .populate('receiver', 'fullName email profilePic role')
      .populate('project', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    // Filtrer selon les règles de rôle
    if (req.user.role === 'client') {
      // Clients : voient seulement les messages avec admin et/ou collaborateur, jamais avec partenaires
      messages = messages.filter(msg => {
        const senderRole = msg.sender?.role;
        const receiverRole = msg.receiver?.role;
        return senderRole !== 'partner' && receiverRole !== 'partner';
      });
    } else if (req.user.role === 'partner') {
      // Partenaires : voient seulement les messages avec admin + collaborateur, jamais avec client
      messages = messages.filter(msg => {
        const senderRole = msg.sender?.role;
        const receiverRole = msg.receiver?.role;
        return senderRole !== 'client' && receiverRole !== 'client';
      });
    } else if (req.user.role === 'collaborator') {
      // Collaborateurs : voient le chat Clients/Admin mais pas le chat Partenaires/Admin
      messages = messages.filter(msg => {
        const senderRole = msg.sender?.role;
        const receiverRole = msg.receiver?.role;
        // Exclure les messages entre partner et admin
        return !(senderRole === 'partner' && receiverRole === 'admin') &&
          !(senderRole === 'admin' && receiverRole === 'partner');
      });
    }

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get messages for partner (specific endpoint)
exports.getPartnerMessages = async (req, res) => {
  try {
    if (req.user.role !== 'partner') {
      return res.status(403).json({ message: 'Accès refusé - Partenaire uniquement' });
    }

    const filter = {
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    };

    let messages = await Message.find(filter)
      .populate('sender', 'name email profileImageUrl role')
      .populate('receiver', 'name email profileImageUrl role')
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    // Partenaires : voient seulement les messages avec admin + collaborateur, jamais avec client
    messages = messages.filter(msg => {
      const senderRole = msg.sender?.role;
      const receiverRole = msg.receiver?.role;
      return senderRole !== 'client' && receiverRole !== 'client';
    });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get messages for collaborator (specific endpoint)
exports.getCollaboratorMessages = async (req, res) => {
  try {
    if (req.user.role !== 'collaborator') {
      return res.status(403).json({ message: 'Accès refusé - Collaborateur uniquement' });
    }

    const filter = {
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    };

    let messages = await Message.find(filter)
      .populate('sender', 'name email profileImageUrl role')
      .populate('receiver', 'name email profileImageUrl role')
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    // Collaborateurs : voient le chat Clients/Admin mais pas le chat Partenaires/Admin
    messages = messages.filter(msg => {
      const senderRole = msg.sender?.role;
      const receiverRole = msg.receiver?.role;
      // Exclure les messages entre partner et admin
      return !(senderRole === 'partner' && receiverRole === 'admin') &&
        !(senderRole === 'admin' && receiverRole === 'partner');
    });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { content, receiver, project, attachments } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Le message ne peut pas être vide' });
    }

    const message = new Message({
      content,
      sender: req.user._id,
      receiver,
      project,
      attachments: attachments || []
    });

    await message.save();

    // Add message to project
    if (project) {
      await Project.findByIdAndUpdate(project, {
        $push: { messages: message._id }
      });
    }

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email profileImageUrl')
      .populate('receiver', 'name email profileImageUrl')
      .populate('project', 'name');

    res.status(201).json({ message: 'Message envoyé', data: populatedMessage });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'envoi', error: error.message });
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    // Only receiver can mark as read
    if (message.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.json({ message: 'Message marqué comme lu' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    // Only sender or admin can delete
    if (req.user.role !== 'admin' && message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    await message.deleteOne();

    res.json({ message: 'Message supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    // Compter les messages de conversation où l'utilisateur n'est pas l'expéditeur
    // et qui ne sont pas marqués comme lus par l'utilisateur
    const count = await Message.countDocuments({
      sender: { $ne: req.user._id },
      'readBy.user': { $ne: req.user._id }
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mark all messages as read
exports.markAllAsRead = async (req, res) => {
  try {
    // Mettre à jour tous les messages où l'utilisateur n'est pas l'expéditeur
    // et qui ne sont pas encore marqués comme lus par l'utilisateur
    const result = await Message.updateMany(
      {
        sender: { $ne: req.user._id },
        'readBy.user': { $ne: req.user._id }
      },
      {
        $push: {
          readBy: {
            user: req.user._id,
            readAt: new Date()
          }
        }
      }
    );

    res.json({
      message: 'Tous les messages marqués comme lus',
      count: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
