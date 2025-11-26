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

    const messages = await Message.find(filter)
      .populate('sender', 'fullName email profilePic')
      .populate('receiver', 'fullName email profilePic')
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get messages for a project
exports.getProjectMessages = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const messages = await Message.find({ project: projectId })
      .populate('sender', 'fullName email profilePic')
      .populate('receiver', 'fullName email profilePic')
      .sort({ createdAt: 1 });

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

    const messages = await Message.find(filter)
      .populate('sender', 'fullName email profilePic')
      .populate('receiver', 'fullName email profilePic')
      .populate('project', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

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
      .populate('sender', 'fullName email profilePic')
      .populate('receiver', 'fullName email profilePic')
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
    const count = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
