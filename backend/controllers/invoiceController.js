const Invoice = require('../models/Invoice');
const Project = require('../models/Project');

// Get all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const { status, project } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (project) filter.project = project;

    // Clients see only their invoices
    if (req.user.role !== 'admin') {
      filter.client = req.user._id;
    }

    const invoices = await Invoice.find(filter)
      .populate('client', 'fullName email')
      .populate('project', 'name category')
      .sort({ issueDate: -1 });

    res.json({ invoices });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get single invoice
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('client', 'fullName email')
      .populate('project', 'name category');

    if (!invoice) {
      return res.status(404).json({ message: 'Facture non trouvée' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && invoice.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.json({ invoice });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Create invoice (Admin only)
exports.createInvoice = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    const invoice = new Invoice(req.body);
    await invoice.save();

    // Add invoice to project
    if (req.body.project) {
      await Project.findByIdAndUpdate(req.body.project, {
        $push: { invoices: invoice._id }
      });
    }

    res.status(201).json({ message: 'Facture créée avec succès', invoice });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création', error: error.message });
  }
};

// Update invoice
exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Facture non trouvée' });
    }

    // Check permissions - Admin only for updates
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    // Update paidDate if status changes to payée
    if (req.body.status === 'payée' && invoice.status !== 'payée') {
      req.body.paidDate = new Date();
    }

    Object.assign(invoice, req.body);
    await invoice.save();

    res.json({ message: 'Facture mise à jour', invoice });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
};

// Delete invoice (Admin only)
exports.deleteInvoice = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Facture non trouvée' });
    }

    res.json({ message: 'Facture supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
};

// Get invoice statistics
exports.getInvoiceStats = async (req, res) => {
  try {
    const filter = req.user.role !== 'admin' ? { client: req.user._id } : {};

    const stats = await Invoice.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const totalRevenue = await Invoice.aggregate([
      { $match: { ...filter, status: 'payée' } },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.json({ 
      statusStats: stats, 
      totalRevenue: totalRevenue[0]?.total || 0 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
