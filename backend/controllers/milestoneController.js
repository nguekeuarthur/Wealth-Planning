const Milestone = require('../models/Milestone');
const Project = require('../models/Project');

// Get all milestones for a project
exports.getProjectMilestones = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Check permissions - Admin et Client du projet ont accès
    if (req.user.role !== 'admin' && 
        req.user.role !== 'client' && 
        project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    
    // Si client, vérifier que c'est bien son projet
    if (req.user.role === 'client' && project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const milestones = await Milestone.find({ project: projectId })
      .populate('createdBy', 'fullName email')
      .sort({ completedAt: -1 });

    res.json({ milestones });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Create milestone (Admin only)
exports.createMilestone = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    const { name, description, completedAt, project } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Le nom du milestone est requis' });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'La description est requise' });
    }

    if (!completedAt) {
      return res.status(400).json({ message: 'La date de complétion est requise' });
    }

    if (!project) {
      return res.status(400).json({ message: 'Le projet est requis' });
    }

    const milestone = new Milestone({
      name: name.trim(),
      description: description.trim(),
      completedAt,
      project,
      createdBy: req.user._id
    });

    await milestone.save();

    // Add milestone to project
    await Project.findByIdAndUpdate(project, {
      $push: { milestones: milestone._id }
    });

    const populatedMilestone = await Milestone.findById(milestone._id)
      .populate('createdBy', 'fullName email')
      .populate('project', 'name category');

    res.status(201).json({ message: 'Milestone créé avec succès', milestone: populatedMilestone });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création', error: error.message });
  }
};

// Update milestone (Admin only)
exports.updateMilestone = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    const milestone = await Milestone.findById(req.params.id);

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone non trouvé' });
    }

    if (req.body.name) milestone.name = req.body.name.trim();
    if (req.body.description) milestone.description = req.body.description.trim();
    if (req.body.completedAt) milestone.completedAt = req.body.completedAt;

    await milestone.save();

    res.json({ message: 'Milestone mis à jour', milestone });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
};

// Delete milestone (Admin only)
exports.deleteMilestone = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    const milestone = await Milestone.findByIdAndDelete(req.params.id);

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone non trouvé' });
    }

    // Remove milestone from project
    await Project.findByIdAndUpdate(milestone.project, {
      $pull: { milestones: milestone._id }
    });

    res.json({ message: 'Milestone supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
};

