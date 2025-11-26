const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { protect } = require('../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Get invoice statistics
router.get('/stats', invoiceController.getInvoiceStats);

// Get all invoices
router.get('/', invoiceController.getAllInvoices);

// Get single invoice
router.get('/:id', invoiceController.getInvoiceById);

// Create invoice (Admin only)
router.post('/', invoiceController.createInvoice);

// Update invoice (Admin only)
router.put('/:id', invoiceController.updateInvoice);

// Delete invoice (Admin only)
router.delete('/:id', invoiceController.deleteInvoice);

module.exports = router;
