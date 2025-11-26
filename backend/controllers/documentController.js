const Document = require('../models/Document');
const Project = require('../models/Project');
const path = require('path');
const fs = require('fs').promises;

// Get all documents
exports.getAllDocuments = async (req, res) => {
  try {
    const { project, type, category } = req.query;
    const filter = {};

    if (project) filter.project = project;
    if (type) filter.type = type;
    if (category) filter.category = category;

    // Clients see only their documents
    if (req.user.role !== 'admin') {
      const userProjects = await Project.find({ client: req.user._id }).select('_id');
      filter.project = { $in: userProjects.map(p => p._id) };
    }

    const documents = await Document.find(filter)
      .populate('uploadedBy', 'fullName email')
      .populate('project', 'name category')
      .sort({ createdAt: -1 });

    res.json({ documents });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get single document
exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('uploadedBy', 'fullName email')
      .populate('project', 'name category client');

    if (!document) {
      return res.status(404).json({ message: 'Document non trouvé' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && document.project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.json({ document });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Upload document
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    const { name, description, type, category, project } = req.body;

    // Check project access
    if (project) {
      const projectDoc = await Project.findById(project);
      if (!projectDoc) {
        return res.status(404).json({ message: 'Projet non trouvé' });
      }

      if (req.user.role !== 'admin' && projectDoc.client.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Accès refusé' });
      }
    }

    const document = new Document({
      name: name || req.file.originalname,
      description,
      type,
      category,
      filePath: req.file.path,
      fileUrl: `/uploads/${req.file.filename}`,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      project,
      uploadedBy: req.user._id,
      versions: [{
        version: 1,
        filePath: req.file.path,
        uploadedAt: new Date(),
        uploadedBy: req.user._id
      }]
    });

    await document.save();

    // Add document to project
    if (project) {
      await Project.findByIdAndUpdate(project, {
        $push: { documents: document._id }
      });
    }

    res.status(201).json({ message: 'Document uploadé avec succès', document });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'upload', error: error.message });
  }
};

// Update document version
exports.updateDocumentVersion = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }

    const document = await Document.findById(req.params.id).populate('project');

    if (!document) {
      return res.status(404).json({ message: 'Document non trouvé' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && document.project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const newVersion = document.versions.length + 1;

    document.versions.push({
      version: newVersion,
      filePath: req.file.path,
      uploadedAt: new Date(),
      uploadedBy: req.user._id
    });

    document.filePath = req.file.path;
    document.fileUrl = `/uploads/${req.file.filename}`;
    document.fileType = req.file.mimetype;
    document.fileSize = req.file.size;

    await document.save();

    res.json({ message: 'Nouvelle version ajoutée', document });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
};

// Delete document (Admin only)
exports.deleteDocument = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document non trouvé' });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(document.filePath);
      // Delete all versions
      for (const version of document.versions) {
        await fs.unlink(version.filePath);
      }
    } catch (err) {
      console.error('Erreur lors de la suppression du fichier:', err);
    }

    await document.deleteOne();

    res.json({ message: 'Document supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
};

// Download document
exports.downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate('project');

    if (!document) {
      return res.status(404).json({ message: 'Document non trouvé' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && document.project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.download(document.filePath, document.name);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du téléchargement', error: error.message });
  }
};
