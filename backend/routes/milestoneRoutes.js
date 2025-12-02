const express = require('express');
const router = express.Router();
const milestoneController = require('../controllers/milestoneController');
const { protect } = require('../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Get milestones for a project
router.get('/project/:projectId', milestoneController.getProjectMilestones);

// Create milestone (Admin only)
router.post('/', milestoneController.createMilestone);

// Update milestone (Admin only)
router.put('/:id', milestoneController.updateMilestone);

// Delete milestone (Admin only)
router.delete('/:id', milestoneController.deleteMilestone);

module.exports = router;

