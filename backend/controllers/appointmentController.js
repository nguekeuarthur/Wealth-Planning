const Appointment = require('../models/Appointment');
const Project = require('../models/Project');

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const { status, type, startDate, endDate } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (type) filter.type = type;
    
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }

    // Filter by role
    if (req.user.role !== 'admin') {
      filter.client = req.user._id;
    }

    const appointments = await Appointment.find(filter)
      .populate('client', 'fullName email profilePic')
      .populate('advisor', 'fullName email')
      .populate('project', 'name category')
      .sort({ startDate: 1 });

    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get single appointment
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('client', 'fullName email profilePic')
      .populate('advisor', 'fullName email')
      .populate('project', 'name category');

    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && appointment.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Create appointment
exports.createAppointment = async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    
    // Set advisor as current user if admin
    if (req.user.role === 'admin' && !req.body.advisor) {
      appointment.advisor = req.user._id;
    }

    await appointment.save();

    res.status(201).json({ message: 'Rendez-vous créé avec succès', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création', error: error.message });
  }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && appointment.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    // Clients can only update notes and status (cancel/confirm)
    if (req.user.role !== 'admin') {
      const allowedFields = ['notes', 'status'];
      const allowedStatuses = ['confirmé', 'annulé'];
      
      Object.keys(req.body).forEach(key => {
        if (!allowedFields.includes(key)) {
          delete req.body[key];
        }
      });

      if (req.body.status && !allowedStatuses.includes(req.body.status)) {
        delete req.body.status;
      }
    }

    Object.assign(appointment, req.body);
    await appointment.save();

    res.json({ message: 'Rendez-vous mis à jour', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
};

// Delete appointment (Admin only)
exports.deleteAppointment = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    res.json({ message: 'Rendez-vous supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
};

// Get upcoming appointments
exports.getUpcomingAppointments = async (req, res) => {
  try {
    const filter = {
      startDate: { $gte: new Date() },
      status: { $in: ['confirmé', 'en attente'] }
    };

    if (req.user.role !== 'admin') {
      filter.client = req.user._id;
    }

    const appointments = await Appointment.find(filter)
      .populate('client', 'fullName email')
      .populate('advisor', 'fullName email')
      .populate('project', 'name')
      .sort({ startDate: 1 })
      .limit(10);

    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
