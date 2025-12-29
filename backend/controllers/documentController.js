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

    // Non-admin: see their own documents, explicitly assigned documents, and documents from their projects/teams
    if (req.user.role !== 'admin') {
      const userProjectIds = (await Project.find({
        $or: [
          { assignedUsers: req.user._id },
          { client: req.user._id }
        ]
      }).select('_id')).map(p => p._id);

      // For members and collaborators, also include projects where their team is assigned
      if (req.user.role === 'member' || req.user.role === 'collaborator') {
        const userTeams = await Team.find({ members: req.user._id }).select('_id');
        const teamProjectIds = (await Project.find({
          assignedTeams: { $in: userTeams.map(t => t._id) }
        }).select('_id')).map(p => p._id);

        userProjectIds.push(...teamProjectIds);
      }

      filter.$or = [
        { uploadedBy: req.user._id }, // Documents qu'ils ont uploadés eux-mêmes
        { assignedUsers: req.user._id }, // Documents qui leur sont explicitement assignés
        { project: { $in: [...new Set(userProjectIds)] } } // Documents des projets auxquels ils ont accès
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

    // Check permissions: admin sees all, others see documents from their accessible projects
    let hasAccess = false;
    if (req.user.role === 'admin') {
      hasAccess = true;
    } else {
      // Check if user uploaded the document themselves
      if (document.uploadedBy && document.uploadedBy.toString() === req.user._id.toString()) {
        hasAccess = true;
      }

      // Check if document is explicitly assigned to user
      if (!hasAccess && document.assignedUsers && document.assignedUsers.some(u => u.toString() === req.user._id.toString())) {
        hasAccess = true;
      }

      // Check if document is from a project the user has access to
      if (!hasAccess && document.project) {
        const projectAccess = await Project.findOne({
          _id: document.project._id || document.project,
          $or: [
            { assignedUsers: req.user._id },
            { client: req.user._id }
          ]
        });

        if (projectAccess) {
          hasAccess = true;
        }

        // For members and collaborators, also check team access
        if (!hasAccess && (req.user.role === 'member' || req.user.role === 'collaborator')) {
          const userTeams = await Team.find({ members: req.user._id }).select('_id');
          const teamAccess = await Project.findOne({
            _id: document.project._id || document.project,
            assignedTeams: { $in: userTeams.map(t => t._id) }
          });

          if (teamAccess) {
        hasAccess = true;
          }
        }
      }
    }

    if (!hasAccess) {
      return res.status(403).json({ message: 'Accès refusé - vous n\'avez pas accès à ce document' });
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

      // Check if user has access to upload documents to this project
      if (req.user.role !== 'admin') {
        let hasProjectAccess = false;

        // Check if user is directly assigned to project
        if (projectDoc.assignedUsers?.some(user => user.toString() === req.user._id.toString())) {
          hasProjectAccess = true;
        }

        // Check if user is the client of the project
        if (projectDoc.client.toString() === req.user._id.toString()) {
          hasProjectAccess = true;
        }

        // Check if user's team is assigned to the project (for members and collaborators)
        if (!hasProjectAccess && (req.user.role === 'member' || req.user.role === 'collaborator')) {
          const userTeams = await Team.find({ members: req.user._id }).select('_id');
          const userTeamIds = userTeams.map(t => t._id.toString());
          if (projectDoc.assignedTeams?.some(teamId => userTeamIds.includes(teamId.toString()))) {
            hasProjectAccess = true;
          }
        }

        if (!hasProjectAccess) {
          return res.status(403).json({ message: 'Accès refusé - vous n\'avez pas accès à ce projet' });
        }
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

    // Check permissions: admin can update all documents, others only their own
    if (req.user.role !== 'admin' && document.uploadedBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Accès refusé - vous ne pouvez modifier que vos propres documents' });
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
    const document = await Document.findById(req.params.id)
      .populate('project', 'name category client')
      .populate('assignedTeams', '_id');

    if (!document) {
      return res.status(404).json({ message: 'Document non trouvé' });
    }

    // Check permissions: admin can download all files, others can download from their accessible projects
    let hasAccess = false;
    if (req.user.role === 'admin') {
      hasAccess = true;
    } else {
      // Check if user uploaded the document themselves
      if (document.uploadedBy && document.uploadedBy.toString() === req.user._id.toString()) {
        hasAccess = true;
      }

      // Check if document is explicitly assigned to user
      if (!hasAccess && document.assignedUsers && document.assignedUsers.some(u => u.toString() === req.user._id.toString())) {
        hasAccess = true;
      }

      // Check if document is from a project the user has access to
      if (!hasAccess && document.project) {
        const projectAccess = await Project.findOne({
          _id: document.project._id || document.project,
          $or: [
            { assignedUsers: req.user._id },
            { client: req.user._id }
          ]
        });

        if (projectAccess) {
          hasAccess = true;
        }

        // For members and collaborators, also check team access
        if (!hasAccess && (req.user.role === 'member' || req.user.role === 'collaborator')) {
          const userTeams = await Team.find({ members: req.user._id }).select('_id');
          const teamAccess = await Project.findOne({
            _id: document.project._id || document.project,
            assignedTeams: { $in: userTeams.map(t => t._id) }
          });

          if (teamAccess) {
        hasAccess = true;
          }
        }
      }
    }

    if (!hasAccess) {
      return res.status(403).json({ message: 'Accès refusé - vous ne pouvez télécharger que les documents de vos projets' });
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
