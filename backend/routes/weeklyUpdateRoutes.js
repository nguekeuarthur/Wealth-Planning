const express = require('express');
const router = express.Router();
const weeklyUpdateController = require('../controllers/weeklyUpdateController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Get updates for a project (Admin only)
router.get('/project/:projectId', adminOnly, weeklyUpdateController.getProjectUpdates);

// Get all weekly updates (Admin only)
router.get('/', adminOnly, weeklyUpdateController.getAllWeeklyUpdates);

// Create weekly update (Admin only)
router.post('/', adminOnly, weeklyUpdateController.createWeeklyUpdate);

// Update weekly update (Admin only)
router.put('/:id', adminOnly, weeklyUpdateController.updateWeeklyUpdate);

// Delete weekly update (Admin only)
router.delete('/:id', adminOnly, weeklyUpdateController.deleteWeeklyUpdate);

module.exports = router;
