const Project = require('../models/Project');
const Task = require('../models/Task');
const Invoice = require('../models/Invoice');

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;

    // Admin sees all active projects, clients see only their active projects
    if (req.user.role !== 'admin') {
      filter.client = req.user._id;
    }
    // Exclude archived projects by default
    filter.archived = { $ne: true };

    const projects = await Project.find(filter)
      .populate('client', 'name email company address logoUrl phoneNumber')
      .populate('projectLead', 'name email')
      .populate('assignedUsers', 'name email')
      .populate('teams', 'name leader members color department')
      .populate({
        path: 'tasks',
        populate: { path: 'assignedTo', select: 'name email profileImageUrl' }
      })
      .sort({ createdAt: -1 });

    // Mettre à jour automatiquement la progression pour chaque projet
    for (const project of projects) {
      if (project.tasks && project.tasks.length > 0) {
        const totalTasks = project.tasks.length;
        const completedTasks = project.tasks.filter(task => task.status === 'Completed').length;
        const calculatedCompletion = Math.round((completedTasks / totalTasks) * 100);

        if (project.completion !== calculatedCompletion) {
          project.completion = calculatedCompletion;
          await project.save();
        }
      } else if (project.completion !== 0) {
        project.completion = 0;
        await project.save();
      }
    }

    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get single project
exports.getProjectById = async (req, res) => {
  try {
    // Mettre à jour automatiquement les factures en retard avant de récupérer le projet
    const now = new Date();
    await Invoice.updateMany(
      {
        project: req.params.id,
        dueDate: { $lt: now },
        status: { $in: ['en attente', 'partiellement payée'] }
      },
      {
        $set: { status: 'non payée' }
      }
    );

    const project = await Project.findById(req.params.id)
      .populate('client', 'name email company address logoUrl phoneNumber')
      .populate('projectLead', 'name email')
      .populate('assignedUsers', 'name email')
      .populate({
        path: 'teams',
        populate: [
          { path: 'leader', select: 'name email' },
          { path: 'members', select: 'name email' }
        ]
      })
      .populate({
        path: 'tasks',
        populate: { path: 'assignedTo', select: 'name email profileImageUrl' }
      })
      .populate('documents')
      .populate('invoices')
      .populate('weeklyUpdates')
      .populate({
        path: 'messages',
        populate: { path: 'sender receiver', select: 'name email profileImageUrl' }
      });

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    // Calculer automatiquement la progression basée sur les tâches terminées
    if (project.tasks && project.tasks.length > 0) {
      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter(task => task.status === 'Completed').length;
      const calculatedCompletion = Math.round((completedTasks / totalTasks) * 100);

      // Mettre à jour la progression si elle a changé
      if (project.completion !== calculatedCompletion) {
        project.completion = calculatedCompletion;
        await project.save();
      }
    } else if (project.completion !== 0) {
      // Si pas de tâches, la progression devrait être 0
      project.completion = 0;
      await project.save();
    }

    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Create project (Admin only)
exports.createProject = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    const project = new Project(req.body);
    await project.save();

    res.status(201).json({ message: 'Projet créé avec succès', project });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création', error: error.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    // Clients can only update completion percentage
    if (req.user.role !== 'admin') {
      const allowedFields = ['completion'];
      Object.keys(req.body).forEach(key => {
        if (!allowedFields.includes(key)) {
          delete req.body[key];
        }
      });
    }

    Object.assign(project, req.body);
    await project.save();

    res.json({ message: 'Projet mis à jour', project });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
};

// Archive project (Admin only)
exports.deleteProject = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        archived: true,
        archivedAt: new Date()
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    res.json({ message: 'Projet archivé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'archivage', error: error.message });
  }
};

// Get archived projects (Admin only)
exports.getArchivedProjects = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    const projects = await Project.find({ archived: true })
      .populate('client', 'name email')
      .populate('projectLead', 'name email')
      .populate('assignedUsers', 'name email')
      .sort({ archivedAt: -1 });

    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Restore archived project (Admin only)
exports.restoreProject = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        archived: false,
        $unset: { archivedAt: 1 }
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    res.json({ message: 'Projet restauré avec succès', project });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la restauration', error: error.message });
  }
};

// Get project statistics
exports.getProjectStats = async (req, res) => {
  try {
    const filter = req.user.role !== 'admin' ? { client: req.user._id } : {};
    // Exclude archived projects from stats
    filter.archived = { $ne: true };

    const stats = await Project.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Project.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ statusStats: stats, categoryStats });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
