const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Vue d'ensemble du patrimoine
router.get('/patrimoine-overview', dashboardController.getPatrimoineOverview);

// Rappels des tâches en attente
router.get('/pending-tasks', dashboardController.getPendingTasks);

// Accès rapide aux dernières discussions et documents
router.get('/recent-discussions-documents', dashboardController.getRecentDiscussionsAndDocuments);

// Get dashboard statistics (ancien endpoint conservé)
router.get('/stats', dashboardController.getDashboardStats);

// Get admin-specific statistics
router.get('/admin/stats', dashboardController.getAdminStats);

module.exports = router;
