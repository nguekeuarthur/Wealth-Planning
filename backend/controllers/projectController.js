const Project = require('../models/Project');
const Task = require('../models/Task');

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = { archived: { $ne: true } }; // Exclure les projets archivés

    if (status) filter.status = status;
    if (category) filter.category = category;

    // Permissions selon le rôle
    if (req.user.role === 'admin' || req.user.role === 'collaborator') {
      // Admin et Collaborateur voient tous les projets
      // Pas de filtre
    } else if (req.user.role === 'client') {
      // Clients voient seulement leurs projets
      filter.client = req.user._id;
    } else if (req.user.role === 'partner') {
      // Partenaires voient les projets où ils sont assignés
      filter.assignedUsers = req.user._id;
    } else if (req.user.role === 'user') {
      // Utilisateurs voient les projets où ils sont client ou assignés
      filter.$or = [
        { client: req.user._id },
        { assignedUsers: req.user._id }
      ];
    } else {
      // Autres rôles (member) : voir les projets où ils sont client ou assignés
      filter.$or = [
        { client: req.user._id },
        { assignedUsers: req.user._id }
      ];
    }

    const projects = await Project.find(filter)
      .populate('client', 'name email role company address profileImageUrl')
      .populate('projectLead', 'name email role profileImageUrl')
      .populate('assignedUsers', 'name email role profileImageUrl')
      .populate('tasks')
      .sort({ createdAt: -1 });

    // Filtrer les membres de projet pour les clients : ne pas voir les Partenaires
    // Filtrer les informations du client pour les partenaires : ne pas voir le Client
    const filteredProjects = projects.map(project => {
      const projectObj = project.toObject();
      
      if (req.user.role === 'client') {
        // Filtrer assignedUsers pour exclure les partenaires
        if (projectObj.assignedUsers) {
          projectObj.assignedUsers = projectObj.assignedUsers.filter(
            user => user.role !== 'partner'
          );
        }
      } else if (req.user.role === 'partner') {
        // Masquer les informations du client
        if (projectObj.client) {
          projectObj.client = null;
        }
      }
      
      return projectObj;
    });

    res.json({ projects: filteredProjects });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get single project
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name email profileImageUrl phoneNumber role company address')
      .populate('projectLead', 'name email role')
      .populate('assignedUsers', 'name email role profileImageUrl')
      .populate('tasks')
      .populate('documents')
      .populate('invoices')
      .populate('weeklyUpdates')
      .populate({
        path: 'messages',
        populate: { path: 'sender receiver', select: 'name email role profileImageUrl' }
      });

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Check permissions selon le rôle
    let hasAccess = false;
    if (req.user.role === 'admin' || req.user.role === 'collaborator') {
      hasAccess = true;
    } else if (req.user.role === 'client') {
      hasAccess = project.client && project.client._id.toString() === req.user._id.toString();
    } else if (req.user.role === 'partner') {
      hasAccess = project.assignedUsers && project.assignedUsers.some(
        user => user._id.toString() === req.user._id.toString()
      );
    } else if (req.user.role === 'user') {
      // Utilisateurs ont accès s'ils sont client ou assignés au projet
      hasAccess = (project.client && project.client._id.toString() === req.user._id.toString()) ||
        (project.assignedUsers && project.assignedUsers.some(
          user => user._id.toString() === req.user._id.toString()
        ));
    } else {
      // Autres rôles (member) ont accès s'ils sont client ou assignés au projet
      hasAccess = (project.client && project.client._id.toString() === req.user._id.toString()) ||
        (project.assignedUsers && project.assignedUsers.some(
          user => user._id.toString() === req.user._id.toString()
        ));
    }

    if (!hasAccess) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    // Filtrer les membres de projet pour les clients : ne pas voir les Partenaires
    // Masquer les informations du client pour les partenaires
    const projectObj = project.toObject();
    
    if (req.user.role === 'client' && projectObj.assignedUsers) {
      projectObj.assignedUsers = projectObj.assignedUsers.filter(
        user => user.role !== 'partner'
      );
    } else if (req.user.role === 'partner') {
      // Masquer les informations du client
      if (projectObj.client) {
        projectObj.client = null;
      }
    }

    res.json({ project: projectObj });
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

// Delete project (Admin only)
exports.deleteProject = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    project.archived = true;
    project.archivedAt = new Date();
    await project.save();

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
      .populate('client', 'fullName email')
      .populate('projectLead', 'fullName email')
      .populate('assignedUsers', 'fullName email')
      .populate('tasks')
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

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    if (!project.archived) {
      return res.status(400).json({ message: 'Le projet n\'est pas archivé' });
    }

    project.archived = false;
    project.archivedAt = undefined;
    await project.save();

    res.json({ message: 'Projet restauré avec succès', project });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la restauration', error: error.message });
  }
};

// Get project statistics
exports.getProjectStats = async (req, res) => {
  try {
    const filter = req.user.role !== 'admin' ? { client: req.user._id } : {};

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
