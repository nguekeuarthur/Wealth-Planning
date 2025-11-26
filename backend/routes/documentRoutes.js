const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { protect } = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Get all documents
router.get('/', documentController.getAllDocuments);

// Get single document
router.get('/:id', documentController.getDocumentById);

// Upload document
router.post('/', uploadMiddleware.single('file'), documentController.uploadDocument);

// Update document version
router.put('/:id/version', uploadMiddleware.single('file'), documentController.updateDocumentVersion);

// Download document
router.get('/:id/download', documentController.downloadDocument);

// Delete document (Admin only)
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
