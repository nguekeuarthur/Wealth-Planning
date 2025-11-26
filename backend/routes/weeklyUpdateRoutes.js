const express = require('express');
const router = express.Router();
const weeklyUpdateController = require('../controllers/weeklyUpdateController');
const { protect } = require('../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Get updates for a project
router.get('/project/:projectId', weeklyUpdateController.getProjectUpdates);

// Get all weekly updates
router.get('/', weeklyUpdateController.getAllWeeklyUpdates);

// Create weekly update (Admin only)
router.post('/', weeklyUpdateController.createWeeklyUpdate);

// Update weekly update (Admin only)
router.put('/:id', weeklyUpdateController.updateWeeklyUpdate);

// Delete weekly update (Admin only)
router.delete('/:id', weeklyUpdateController.deleteWeeklyUpdate);

module.exports = router;
