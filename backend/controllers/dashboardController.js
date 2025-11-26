const Project = require('../models/Project');
const Invoice = require('../models/Invoice');
const Task = require('../models/Task');
const Message = require('../models/Message');
const Appointment = require('../models/Appointment');
const Form = require('../models/Form');

// Get dashboard statistics
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
      status: { $ne: 'completed' }
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
