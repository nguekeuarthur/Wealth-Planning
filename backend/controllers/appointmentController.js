const Appointment = require('../models/Appointment');
const Project = require('../models/Project');
const { sendEmail, buildEmailTemplate } = require('../services/emailService');

// Generate iCal content for appointment
const generateICalContent = (appointment) => {
  const startDate = new Date(appointment.startDate);
  const endDate = new Date(appointment.endDate);

  const formatDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Geneva Wealth Partners//Appointment//EN
BEGIN:VEVENT
UID:${appointment._id}@genevawealth.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:Consultation - ${appointment.title}
DESCRIPTION:Rendez-vous avec Geneva Wealth Partners\\n\\nService: ${appointment.type}\\n\\n${appointment.notes || ''}
LOCATION:Geneva, Switzerland
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  return icalContent;
};

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

// Generate iCal file for appointment
exports.downloadICal = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('client', 'fullName email')
      .populate('advisor', 'fullName email')
      .populate('project', 'name');

    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && appointment.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const icalContent = generateICalContent(appointment);

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="appointment-${appointment._id}.ics"`);

    res.send(icalContent);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Create appointment request (for public contact form)
exports.createAppointmentRequest = async (req, res) => {
  try {
    const { name, email, phone, service, preferredDate, preferredTime, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !service || !preferredDate || !preferredTime) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }

    // Format the date and time for display
    const formattedDate = new Date(preferredDate).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'contact@genevawealth.com';

    const emailSubject = `Nouvelle demande de rendez-vous - ${name}`;

    const emailHtml = buildEmailTemplate({
      title: "Geneva Wealth Partners",
      greeting: "Nouvelle demande de rendez-vous reçue",
      message: `
        <strong>Détails du demandeur :</strong><br>
        Nom: ${name}<br>
        Email: ${email}<br>
        Téléphone: ${phone}<br><br>

        <strong>Demande de rendez-vous :</strong><br>
        Service souhaité: ${service}<br>
        Date préférée: ${formattedDate}<br>
        Heure préférée: ${preferredTime}<br><br>

        ${message ? `<strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}` : ''}
      `,
      buttonLabel: "Voir dans le tableau de bord",
      buttonUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/appointments`,
      secondaryText: "Un email de confirmation a été envoyé au demandeur.",
      footerText: "© " + new Date().getFullYear() + " Geneva Wealth Partners. Tous droits réservés."
    });

    // Send email to admin
    await sendEmail({
      to: adminEmail,
      subject: emailSubject,
      html: emailHtml
    });

    // Send confirmation email to the requester
    const confirmationHtml = buildEmailTemplate({
      title: "Geneva Wealth Partners",
      greeting: `Bonjour ${name},`,
      message: `
        Nous avons bien reçu votre demande de rendez-vous. Voici un résumé de votre demande :

        <strong>Service souhaité:</strong> ${service}<br>
        <strong>Date préférée:</strong> ${formattedDate}<br>
        <strong>Heure préférée:</strong> ${preferredTime}<br><br>

        Notre équipe vous contactera dans les plus brefs délais (généralement sous 24h) pour confirmer le rendez-vous et vous envoyer une invitation calendrier.

        Cordialement,<br>
        L'équipe Geneva Wealth Partners
      `,
      footerText: "© " + new Date().getFullYear() + " Geneva Wealth Partners. Tous droits réservés."
    });

    await sendEmail({
      to: email,
      subject: "Confirmation de votre demande de rendez-vous - Geneva Wealth Partners",
      html: confirmationHtml
    });

    res.status(201).json({
      message: 'Demande de rendez-vous envoyée avec succès. Vous recevrez une confirmation par email.',
      request: { name, email, phone, service, preferredDate, preferredTime, message }
    });
  } catch (error) {
    console.error('Erreur lors de la création de la demande de rendez-vous:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la demande', error: error.message });
  }
};
