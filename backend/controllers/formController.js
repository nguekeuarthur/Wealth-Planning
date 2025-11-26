const Form = require('../models/Form');

// Get all forms
exports.getAllForms = async (req, res) => {
  try {
    const { formType, isCompleted } = req.query;
    const filter = {};

    if (formType) filter.formType = formType;
    if (isCompleted !== undefined) filter.isCompleted = isCompleted === 'true';

    // Clients see only their forms
    if (req.user.role !== 'admin') {
      filter.client = req.user._id;
    }

    const forms = await Form.find(filter)
      .populate('client', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({ forms });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get single form
exports.getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id)
      .populate('client', 'fullName email profilePic');

    if (!form) {
      return res.status(404).json({ message: 'Formulaire non trouvé' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && form.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.json({ form });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Create form
exports.createForm = async (req, res) => {
  try {
    const { formType, client } = req.body;

    // If not admin, set client to current user
    const formData = {
      formType,
      client: req.user.role === 'admin' ? client : req.user._id,
      responses: new Map()
    };

    const form = new Form(formData);
    await form.save();

    res.status(201).json({ message: 'Formulaire créé avec succès', form });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création', error: error.message });
  }
};

// Update form responses
exports.updateFormResponses = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Formulaire non trouvé' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && form.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { responses, completionPercentage, isCompleted } = req.body;

    if (responses) {
      // Merge new responses with existing ones
      Object.entries(responses).forEach(([key, value]) => {
        form.responses.set(key, value);
      });
    }

    if (completionPercentage !== undefined) {
      form.completionPercentage = completionPercentage;
    }

    if (isCompleted !== undefined) {
      form.isCompleted = isCompleted;
    }

    await form.save();

    res.json({ message: 'Formulaire mis à jour', form });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
};

// Delete form (Admin only)
exports.deleteForm = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    const form = await Form.findByIdAndDelete(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Formulaire non trouvé' });
    }

    res.json({ message: 'Formulaire supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
};

// Get form statistics
exports.getFormStats = async (req, res) => {
  try {
    const filter = req.user.role !== 'admin' ? { client: req.user._id } : {};

    const stats = await Form.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$formType',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: ['$isCompleted', 1, 0] }
          },
          avgCompletion: { $avg: '$completionPercentage' }
        }
      }
    ]);

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
