const Invoice = require('../models/Invoice');
const Project = require('../models/Project');
const path = require('path');
const fs = require('fs');

const buildAttachmentPayload = (file) => {
  if (!file) return undefined;
  return {
    path: `/uploads/${file.filename}`,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size
  };
};

const deleteAttachmentFile = (attachment) => {
  if (!attachment?.path) return;
  const absolutePath = path.join(__dirname, '..', attachment.path.replace(/^\//, ''));
  if (fs.existsSync(absolutePath)) {
    fs.unlink(absolutePath, (err) => {
      if (err) {
        console.error('Failed to delete attachment file:', err);
      }
    });
  }
};

// Get all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const { status, project } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (project) filter.project = project;

    // Permissions selon le rôle
    if (req.user.role === 'admin') {
      // Admin voit toutes les factures
      // Pas de filtre client
    } else if (req.user.role === 'collaborator') {
      // Collaborateur voit UNIQUEMENT les factures des projets où il est assigné
      const userProjectIds = (await Project.find({ assignedUsers: req.user._id }).select('_id')).map(p => p._id);
      
      if (userProjectIds.length === 0) {
        // Aucun projet assigné = aucune facture
        return res.json({ invoices: [] });
      }
      
      filter.project = { $in: userProjectIds };
    } else if (req.user.role === 'client') {
      // Clients voient seulement leurs factures
      filter.client = req.user._id;
    } else if (req.user.role === 'partner') {
      // Partenaires n'ont AUCUN accès aux factures
      // Retourner un tableau vide
      return res.json({ invoices: [] });
    } else {
      // Autres rôles : voir seulement leurs factures
      filter.client = req.user._id;
    }

    // Mettre à jour automatiquement les factures en retard
    const now = new Date();
    await Invoice.updateMany(
      {
        dueDate: { $lt: now },
        status: { $in: ['en attente', 'partiellement payée'] }
      },
      {
        $set: { status: 'non payée' }
      }
    );

    let invoices = await Invoice.find(filter)
      .populate('client', 'companyName contactName email industry')
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
    let invoice = await Invoice.findById(req.params.id)
      .populate('client', 'companyName contactName email industry')
      .populate('project', 'name category');

    if (!invoice) {
      return res.status(404).json({ message: 'Facture non trouvée' });
    }

    // Vérifier et mettre à jour automatiquement si la date d'échéance est passée
    if (invoice.dueDate &&
      new Date(invoice.dueDate) < new Date() &&
      (invoice.status === 'en attente' || invoice.status === 'partiellement payée')) {
      invoice.status = 'non payée';
      await invoice.save();
      // Recharger pour avoir les données à jour
      invoice = await Invoice.findById(req.params.id)
        .populate('client', 'companyName contactName email industry')
        .populate('project', 'name category');
    }

    // Check permissions selon le rôle
    let hasAccess = false;
    if (req.user.role === 'admin' || req.user.role === 'collaborator') {
      // Admin et Collaborateur ont accès à toutes les factures
      hasAccess = true;
    } else if (req.user.role === 'client') {
      hasAccess = invoice.client && invoice.client.toString() === req.user._id.toString();
    } else if (req.user.role === 'partner') {
      // Partenaires n'ont AUCUN accès aux factures
      return res.status(403).json({ message: 'Accès refusé - Les partenaires n\'ont pas accès aux factures' });
    }

    if (!hasAccess) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.json({ invoice });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Fonction pour générer un numéro de facture unique
const generateUniqueInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');

  // Chercher le dernier numéro de facture de ce mois
  const lastInvoice = await Invoice.findOne({
    invoiceNumber: new RegExp(`^INV-${year}${month}-`)
  }).sort({ invoiceNumber: -1 });

  let sequence = 1;
  if (lastInvoice) {
    // Extraire le numéro de séquence du dernier numéro
    const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[2]) || 0;
    sequence = lastSequence + 1;
  }

  // Formater avec 4 chiffres (0001, 0002, etc.)
  const sequenceStr = String(sequence).padStart(4, '0');
  const invoiceNumber = `INV-${year}${month}-${sequenceStr}`;

  // Vérifier que le numéro est vraiment unique (au cas où)
  const exists = await Invoice.findOne({ invoiceNumber });
  if (exists) {
    // Si le numéro existe déjà, incrémenter
    return generateUniqueInvoiceNumber();
  }

  return invoiceNumber;
};

// Create invoice (Admin only)
exports.createInvoice = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    // Générer automatiquement un numéro de facture unique si non fourni
    if (!req.body.invoiceNumber) {
      req.body.invoiceNumber = await generateUniqueInvoiceNumber();
    } else {
      // Vérifier que le numéro fourni est unique
      const existingInvoice = await Invoice.findOne({ invoiceNumber: req.body.invoiceNumber });
      if (existingInvoice) {
        return res.status(400).json({ message: 'Ce numéro de facture existe déjà' });
      }
    }

    const invoiceData = { ...req.body };
    if (typeof invoiceData.amount !== 'undefined') {
      invoiceData.amount = parseFloat(invoiceData.amount);
    }
    if (invoiceData.dueDate === '' || invoiceData.dueDate === null) {
      delete invoiceData.dueDate;
    }
    if (invoiceData.issueDate === '' || invoiceData.issueDate === null) {
      delete invoiceData.issueDate;
    }
    if (req.file) {
      invoiceData.attachment = buildAttachmentPayload(req.file);
    }

    const invoice = new Invoice(invoiceData);
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

    // Check permissions - Admin only for updates (Collaborateur ne peut pas modifier)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    // Ne pas permettre la modification du numéro de facture
    delete req.body.invoiceNumber;

    // Update paidDate if status changes to payée
    if (req.body.status === 'payée' && invoice.status !== 'payée') {
      req.body.paidDate = new Date();
    }

    if (typeof req.body.amount !== 'undefined') {
      req.body.amount = parseFloat(req.body.amount);
    }
    if (req.body.dueDate === '' || req.body.dueDate === null) {
      req.body.dueDate = undefined;
    }
    if (req.body.issueDate === '' || req.body.issueDate === null) {
      req.body.issueDate = undefined;
    }

    const previousAttachment = invoice.attachment;
    Object.assign(invoice, req.body);

    if (req.file) {
      deleteAttachmentFile(previousAttachment);
      invoice.attachment = buildAttachmentPayload(req.file);
    }
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

    deleteAttachmentFile(invoice.attachment);

    res.json({ message: 'Facture supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
};

// Get invoice statistics
exports.getInvoiceStats = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'admin' || req.user.role === 'collaborator') {
      // Pas de filtre
    } else if (req.user.role === 'client') {
      filter.client = req.user._id;
    } else if (req.user.role === 'partner') {
      // Partenaires : exclure les factures taguées "client"
      filter.tags = { $ne: 'client' };
    } else {
      filter.client = req.user._id;
    }

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
