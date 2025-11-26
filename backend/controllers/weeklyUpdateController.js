const WeeklyUpdate = require('../models/WeeklyUpdate');
const Project = require('../models/Project');

// Get all weekly updates
exports.getAllWeeklyUpdates = async (req, res) => {
  try {
    const { project } = req.query;
    const filter = {};

    if (project) filter.project = project;

    // Clients see only their project updates
    if (req.user.role !== 'admin') {
      const userProjects = await Project.find({ client: req.user._id }).select('_id');
      filter.project = { $in: userProjects.map(p => p._id) };
    }

    const updates = await WeeklyUpdate.find(filter)
      .populate('author', 'fullName email')
      .populate('project', 'name category')
      .sort({ createdAt: -1 });

    res.json({ updates });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get updates for a project
exports.getProjectUpdates = async (req, res) => {
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

    const updates = await WeeklyUpdate.find({ project: projectId })
      .populate('author', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({ updates });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Create weekly update (Admin only)
exports.createWeeklyUpdate = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    const { note, project } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({ message: 'La note ne peut pas être vide' });
    }

    const update = new WeeklyUpdate({
      note,
      project,
      author: req.user._id
    });

    await update.save();

    // Add update to project
    if (project) {
      await Project.findByIdAndUpdate(project, {
        $push: { weeklyUpdates: update._id }
      });
    }

    const populatedUpdate = await WeeklyUpdate.findById(update._id)
      .populate('author', 'fullName email')
      .populate('project', 'name category');

    res.status(201).json({ message: 'Note créée avec succès', update: populatedUpdate });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création', error: error.message });
  }
};

// Update weekly update (Admin only)
exports.updateWeeklyUpdate = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    const update = await WeeklyUpdate.findById(req.params.id);

    if (!update) {
      return res.status(404).json({ message: 'Note non trouvée' });
    }

    if (req.body.note) {
      update.note = req.body.note;
      await update.save();
    }

    res.json({ message: 'Note mise à jour', update });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
};

// Delete weekly update (Admin only)
exports.deleteWeeklyUpdate = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    const update = await WeeklyUpdate.findByIdAndDelete(req.params.id);

    if (!update) {
      return res.status(404).json({ message: 'Note non trouvée' });
    }

    res.json({ message: 'Note supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
};
