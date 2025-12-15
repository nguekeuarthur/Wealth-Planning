const Document = require('../models/Document');
const Project = require('../models/Project');
const Team = require('../models/Team');
const path = require('path');
const fs = require('fs').promises;

// Get all documents
exports.getAllDocuments = async (req, res) => {
  try {
    const { project, type, category, tags } = req.query;
    const filter = { archived: { $ne: true } };

    if (project) filter.project = project;
    if (type) filter.type = type;
    if (category) filter.category = category;

    // Admin & collaborator: can see all (optionally filter by tags/allowedRoles)
    if (req.user.role === 'admin' || req.user.role === 'collaborator') {
      if (tags) {
        filter.allowedRoles = tags;
      }
    } else {
      // For other roles we build an OR filter: documents targeted to user's role, assigned to the user, assigned to one of user's teams, or belong to user's projects
      const userProjectIds = (await Project.find({ client: req.user._id }).select('_id')).map(p => p._id);
      const userTeamIds = (await Team.find({ members: req.user._id }).select('_id')).map(t => t._id);

      filter.$or = [
        { allowedRoles: req.user.role },
        { assignedUsers: req.user._id },
        { assignedTeams: { $in: userTeamIds } },
        { project: { $in: userProjectIds } }
      ];
    }

    const documents = await Document.find(filter)
      .populate('uploadedBy', 'name email profileImageUrl')
      .populate('project', 'name category')
      .populate('assignedUsers', 'name email role profileImageUrl')
      .populate('assignedTeams', 'name members leader')
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

    // Check permissions selon le rôle and explicit assignments
    let hasAccess = false;
    if (req.user.role === 'admin' || req.user.role === 'collaborator') {
      hasAccess = true;
    } else {
      // Access if document allowedRoles contains user's role OR assignedUsers includes user
      if (document.allowedRoles && document.allowedRoles.includes(req.user.role)) {
        hasAccess = true;
      }

      if (!hasAccess && document.assignedUsers && document.assignedUsers.some(u => u.toString() === req.user._id.toString())) {
        hasAccess = true;
      }

      // Check assigned teams: if any team includes the user
      if (!hasAccess && document.assignedTeams && document.assignedTeams.length) {
        const userTeams = await Team.find({ members: req.user._id }).select('_id');
        const userTeamIds = userTeams.map(t => t._id.toString());
        if (document.assignedTeams.some(tid => userTeamIds.includes(tid.toString()))) {
          hasAccess = true;
        }
      }

      // Fallback: clients can access documents for their projects if project.client matches and allowedRoles contains 'client'
      if (!hasAccess && req.user.role === 'client' && document.project && document.project.client && document.project.client.toString() === req.user._id.toString() && document.allowedRoles && document.allowedRoles.includes('client')) {
        hasAccess = true;
      }
    }

    if (!hasAccess) {
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

    const { name, description, type, category, project, status } = req.body;

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

    const { assignedUserIds, assignedTeamIds, allowedRoles } = req.body;

    const document = new Document({
      name: name || req.file.originalname,
      description,
      type,
      category,
      status,
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

    // Assign users/teams/roles if provided
    if (assignedUserIds) {
      try {
        const parsed = Array.isArray(assignedUserIds) ? assignedUserIds : JSON.parse(assignedUserIds);
        document.assignedUsers = parsed;
      } catch (e) {
        // fallback if it's a single id string
        document.assignedUsers = Array.isArray(assignedUserIds) ? assignedUserIds : [assignedUserIds];
      }
    }

    if (assignedTeamIds) {
      try {
        const parsed = Array.isArray(assignedTeamIds) ? assignedTeamIds : JSON.parse(assignedTeamIds);
        document.assignedTeams = parsed;
      } catch (e) {
        document.assignedTeams = Array.isArray(assignedTeamIds) ? assignedTeamIds : [assignedTeamIds];
      }
    }

    if (allowedRoles) {
      try {
        const parsed = Array.isArray(allowedRoles) ? allowedRoles : JSON.parse(allowedRoles);
        document.allowedRoles = parsed;
      } catch (e) {
        document.allowedRoles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      }
    }

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

// Update document
exports.updateDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate('project');

    if (!document) {
      return res.status(404).json({ message: 'Document non trouvé' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && document.project?.client?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    // Update metadata
    if (req.body.name) document.name = req.body.name;
    if (req.body.description !== undefined) document.description = req.body.description;
    if (req.body.category !== undefined) document.category = req.body.category;
    if (req.body.status !== undefined) document.status = req.body.status;
    if (req.body.type) document.type = req.body.type;

    // If a new file is provided, update it
    if (req.file) {
      document.filePath = req.file.path;
      document.fileUrl = `/uploads/${req.file.filename}`;
      document.fileType = req.file.mimetype;
      document.fileSize = req.file.size;
    }

    await document.save();

    const updatedDocument = await Document.findById(document._id)
      .populate('project', 'name category')
      .populate('uploadedBy', 'name email');

    res.json({ message: 'Document mis à jour', document: updatedDocument });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
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

// Archive document (soft delete - Admin only)
exports.deleteDocument = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document non trouvé' });
    }

    // Soft delete: mark as archived
    document.archived = true;
    document.archivedAt = new Date();
    await document.save();

    res.json({ message: 'Document archivé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'archivage', error: error.message });
  }
};

// Get archived documents (Admin only)
exports.getArchivedDocuments = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    const { type } = req.query;
    const filter = { archived: true };
    
    if (type) filter.type = type;

    const documents = await Document.find(filter)
      .populate('uploadedBy', 'fullName email')
      .populate('project', 'name category')
      .sort({ archivedAt: -1 });

    res.json({ documents });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Restore archived document (Admin only)
exports.restoreDocument = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Admin uniquement' });
    }

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document non trouvé' });
    }

    if (!document.archived) {
      return res.status(400).json({ message: 'Le document n\'est pas archivé' });
    }

    document.archived = false;
    document.archivedAt = undefined;
    await document.save();

    res.json({ message: 'Document restauré avec succès', document });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la restauration', error: error.message });
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

    // Définir le Content-Type basé sur le type de fichier
    if (document.fileType) {
      res.setHeader('Content-Type', document.fileType);
    }
    
    // Définir le Content-Disposition pour forcer le téléchargement avec le bon nom
    const fileName = document.name || 'document';
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);

    res.download(document.filePath, fileName);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du téléchargement', error: error.message });
  }
};
