const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect } = require('../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Add or assign users to a project
router.post('/:id/users', projectController.addUsersToProject);
// Remove a user from a project (Admin only)
router.delete('/:id/users/:userId', projectController.removeUserFromProject);

// Get project statistics
router.get('/stats', projectController.getProjectStats);

// Get all projects
router.get('/', projectController.getAllProjects);

// Get archived projects (Admin only)
router.get('/archived', projectController.getArchivedProjects);

// Get single project
router.get('/:id', projectController.getProjectById);

// Create project (Admin only)
router.post('/', projectController.createProject);

// Update project
router.put('/:id', projectController.updateProject);

// Restore archived project (Admin only)
router.put('/:id/restore', projectController.restoreProject);

// Archive project (Admin only)
router.delete('/:id', projectController.deleteProject);

module.exports = router;
