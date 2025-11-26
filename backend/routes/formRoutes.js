const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const { protect } = require('../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Get form statistics
router.get('/stats', formController.getFormStats);

// Get all forms
router.get('/', formController.getAllForms);

// Get single form
router.get('/:id', formController.getFormById);

// Create form
router.post('/', formController.createForm);

// Update form responses
router.put('/:id', formController.updateFormResponses);

// Delete form (Admin only)
router.delete('/:id', formController.deleteForm);

module.exports = router;
