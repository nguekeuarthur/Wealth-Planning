const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect } = require('../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Get project statistics
router.get('/stats', projectController.getProjectStats);

// Get all projects
router.get('/', projectController.getAllProjects);

// Get archived projects (Admin only)
router.get('/archived', protect, (req, res) => { res.send('This is the archived projects route. Implement getArchivedProjects in projectController.js'); });

// Get single project
router.get('/:id', projectController.getProjectById);

// Create project (Admin only)
router.post('/', projectController.createProject);

// Update project
router.put('/:id', projectController.updateProject);

// Restore archived project (Admin only)
router.put('/:id/restore', (req, res) => { res.send('This is the restore project route. Implement restoreProject in projectController.js'); });

// Archive project (Admin only)
router.delete('/:id', projectController.deleteProject);

module.exports = router;
