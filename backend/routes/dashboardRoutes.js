const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Get dashboard statistics
router.get('/stats', dashboardController.getDashboardStats);

// Get admin-specific statistics
router.get('/admin/stats', dashboardController.getAdminStats);

module.exports = router;
