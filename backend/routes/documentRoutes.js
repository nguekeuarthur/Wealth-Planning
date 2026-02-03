const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { protect } = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Get all documents
router.get('/', documentController.getAllDocuments);

// Get archived documents (Admin only)
router.get('/archived', documentController.getArchivedDocuments);

// Get single document
router.get('/:id', documentController.getDocumentById);

// Upload document
router.post('/', uploadMiddleware.single('file'), documentController.uploadDocument);

// Update document (with optional file)
router.put('/:id', uploadMiddleware.single('file'), documentController.updateDocument);

// Update document version
router.put('/:id/version', uploadMiddleware.single('file'), documentController.updateDocumentVersion);

// Download document
router.get('/:id/download', documentController.downloadDocument);

// Restore archived document (Admin only)
router.put('/:id/restore', documentController.restoreDocument);

// Archive document (Admin only)
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
