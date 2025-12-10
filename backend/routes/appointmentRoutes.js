const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect } = require('../middlewares/authMiddleware');

// Public route for appointment requests (no auth required)
router.post('/request', appointmentController.createAppointmentRequest);

// Apply auth middleware to all other routes
router.use(protect);

// Get upcoming appointments
router.get('/upcoming', appointmentController.getUpcomingAppointments);

// Get all appointments
router.get('/', appointmentController.getAllAppointments);

// Get single appointment
router.get('/:id', appointmentController.getAppointmentById);

// Download iCal file for appointment
router.get('/:id/ical', appointmentController.downloadICal);

// Create appointment
router.post('/', appointmentController.createAppointment);

// Update appointment
router.put('/:id', appointmentController.updateAppointment);

// Delete appointment (Admin only)
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
