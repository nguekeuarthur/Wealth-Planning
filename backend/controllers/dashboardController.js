const Project = require('../models/Project');
const Invoice = require('../models/Invoice');
const Task = require('../models/Task');
const Message = require('../models/Message');
const Appointment = require('../models/Appointment');
const Form = require('../models/Form');
const Document = require('../models/Document');

// Vue d'ensemble du patrimoine
exports.getPatrimoineOverview = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const userFilter = isAdmin ? {} : { client: req.user._id };

    // Projets actifs (filtre: in progress/in review/done)
    const activeProjects = await Project.find({
      ...userFilter,
      status: { $in: ['in progress', 'in review', 'done'] }
    })
      .populate('client', 'fullName email')
      .select('name status category completion startDate endDate');

    // Graphique résumant le nombre de projets par statut (3 statuts)
    const projectsByStatus = await Project.aggregate([
      { $match: userFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Graphique des factures (6 statuts)
    const invoicesByStatus = await Invoice.aggregate([
      { $match: userFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Par catégories de projets (visualisation en graphique et en liste)
    const projectsByCategory = await Project.aggregate([
      { $match: userFilter },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          projects: {
            $push: {
              id: '$_id',
              name: '$name',
              status: '$status',
              completion: '$completion'
            }
          }
        }
      }
    ]);

    res.json({
      activeProjects,
      charts: {
        projectsByStatus: projectsByStatus.map(item => ({
          status: item._id,
          count: item.count
        })),
        invoicesByStatus: invoicesByStatus.map(item => ({
          status: item._id,
          count: item.count,
          totalAmount: item.totalAmount
        })),
        projectsByCategory: projectsByCategory.map(item => ({
          category: item._id,
          count: item.count,
          projects: item.projects
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Rappels des tâches en attente
exports.getPendingTasks = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const userFilter = isAdmin ? {} : { 
      $or: [
        { client: req.user._id },
        { assignedTo: req.user._id }
      ]
    };

    // Liste des tâches en attente avec toutes les colonnes demandées
    const pendingTasks = await Task.find({
      ...userFilter,
      status: { $in: ['Pending', 'In Progress'] }
    })
      .populate('client', 'fullName email')
      .populate('project', 'name')
      .populate('assignedTo', 'fullName')
      .sort({ dueDate: 1 });

    // Formater les résultats selon les colonnes demandées
    const formattedTasks = pendingTasks.map(task => ({
      taskId: task._id,
      taskName: task.title,
      taskDescription: task.description,
      entryDate: task.createdAt,
      dueDate: task.dueDate,
      clientName: task.client?.fullName || 'N/A',
      projectName: task.project?.name || 'N/A',
      status: task.status,
      priority: task.priority,
      progress: task.progress,
      assignedTo: task.assignedTo?.map(u => u.fullName).join(', ') || 'Non assigné'
    }));

    res.json({
      count: formattedTasks.length,
      tasks: formattedTasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Accès rapide aux dernières discussions et documents
exports.getRecentDiscussionsAndDocuments = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    
    // Messages des dernières 24 heures sur chaque projet
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    let projectMessagesQuery = {
      createdAt: { $gte: last24Hours },
      project: { $exists: true, $ne: null }
    };

    if (!isAdmin) {
      projectMessagesQuery.$or = [
        { sender: req.user._id },
        { receiver: req.user._id }
      ];
    }

    const projectMessages = await Message.find(projectMessagesQuery)
      .populate('sender', 'fullName email')
      .populate('receiver', 'fullName email')
      .populate('project', 'name category')
      .sort({ createdAt: -1 })
      .limit(20);

    // Tous les messages reçus dans la messagerie inbox (non liés à un projet)
    let inboxMessagesQuery = {
      receiver: req.user._id,
      $or: [
        { project: { $exists: false } },
        { project: null }
      ]
    };

    const inboxMessages = await Message.find(inboxMessagesQuery)
      .populate('sender', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(20);

    // Documents récents (dernières 24h)
    let documentsQuery = {
      uploadDate: { $gte: last24Hours }
    };

    if (!isAdmin) {
      documentsQuery.client = req.user._id;
    }

    const recentDocuments = await Document.find(documentsQuery)
      .populate('client', 'fullName email')
      .populate('project', 'name')
      .sort({ uploadDate: -1 })
      .limit(10);

    res.json({
      projectMessages: {
        count: projectMessages.length,
        messages: projectMessages.map(msg => ({
          id: msg._id,
          content: msg.content,
          sender: msg.sender?.fullName,
          receiver: msg.receiver?.fullName,
          projectName: msg.project?.name,
          projectCategory: msg.project?.category,
          sentAt: msg.createdAt,
          isRead: msg.isRead,
          hasAttachments: msg.attachments?.length > 0
        }))
      },
      inboxMessages: {
        count: inboxMessages.length,
        unread: inboxMessages.filter(msg => !msg.isRead).length,
        messages: inboxMessages.map(msg => ({
          id: msg._id,
          content: msg.content,
          sender: msg.sender?.fullName,
          senderEmail: msg.sender?.email,
          sentAt: msg.createdAt,
          isRead: msg.isRead,
          hasAttachments: msg.attachments?.length > 0
        }))
      },
      recentDocuments: {
        count: recentDocuments.length,
        documents: recentDocuments.map(doc => ({
          id: doc._id,
          name: doc.name,
          type: doc.type,
          uploadDate: doc.uploadDate,
          clientName: doc.client?.fullName,
          projectName: doc.project?.name,
          filePath: doc.filePath
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get dashboard statistics (ancien endpoint, conservé pour compatibilité)
exports.getDashboardStats = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const userFilter = isAdmin ? {} : { client: req.user._id };

    // Projects by status
    const projectsByStatus = await Project.aggregate([
      { $match: userFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Projects by category
    const projectsByCategory = await Project.aggregate([
      { $match: userFilter },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Invoices by status
    const invoicesByStatus = await Invoice.aggregate([
      { $match: userFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Total revenue (invoices payées)
    const revenueData = await Invoice.aggregate([
      { $match: { ...userFilter, status: 'payée' } },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Pending tasks
    const pendingTasks = await Task.countDocuments({
      ...userFilter,
      status: { $ne: 'Completed' }
    });

    // Recent messages (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentMessages = await Message.countDocuments({
      createdAt: { $gte: yesterday },
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    });

    // Unread messages count
    const unreadMessages = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false
    });

    // Upcoming appointments
    const upcomingAppointments = await Appointment.find({
      ...userFilter,
      startDate: { $gte: new Date() },
      status: { $in: ['confirmé', 'en attente'] }
    })
      .populate('client', 'fullName email')
      .populate('advisor', 'fullName email')
      .populate('project', 'name')
      .sort({ startDate: 1 })
      .limit(5);

    // Incomplete forms
    const incompleteForms = await Form.countDocuments({
      ...userFilter,
      isCompleted: false
    });

    // Recent projects
    const recentProjects = await Project.find(userFilter)
      .populate('client', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Response
    res.json({
      projects: {
        byStatus: projectsByStatus,
        byCategory: projectsByCategory,
        recent: recentProjects
      },
      invoices: {
        byStatus: invoicesByStatus,
        totalRevenue: revenueData[0]?.total || 0
      },
      tasks: {
        pending: pendingTasks
      },
      messages: {
        recent24h: recentMessages,
        unread: unreadMessages
      },
      appointments: {
        upcoming: upcomingAppointments
      },
      forms: {
        incomplete: incompleteForms
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get admin-specific statistics
exports.getAdminStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    // Total clients
    const User = require('../models/User');
    const totalClients = await User.countDocuments({ role: 'member' });

    // Active projects (in progress)
    const activeProjects = await Project.countDocuments({ status: 'in progress' });

    // Projects in review
    const reviewProjects = await Project.countDocuments({ status: 'in review' });

    // Completed projects
    const completedProjects = await Project.countDocuments({ status: 'done' });

    // Pending invoices
    const pendingInvoices = await Invoice.countDocuments({
      status: { $in: ['en attente', 'à envoyer'] }
    });

    // Overdue invoices
    const overdueInvoices = await Invoice.countDocuments({
      status: { $in: ['en attente', 'non payée'] },
      dueDate: { $lt: new Date() }
    });

    // Monthly revenue trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Invoice.aggregate([
      {
        $match: {
          status: 'payée',
          paidDate: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$paidDate' },
            month: { $month: '$paidDate' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      clients: {
        total: totalClients
      },
      projects: {
        active: activeProjects,
        inReview: reviewProjects,
        completed: completedProjects
      },
      invoices: {
        pending: pendingInvoices,
        overdue: overdueInvoices
      },
      revenue: {
        monthly: monthlyRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
