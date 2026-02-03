const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Appliquer l'authentification à toutes les routes
router.use(protect);

// Routes pour les conversations
router.post('/conversations', chatController.createConversation);
router.get('/conversations', chatController.getConversations);
// Get or create a project-level conversation
router.get('/conversations/project/:projectId', chatController.getOrCreateProjectConversation);

// Routes pour les messages
router.get('/conversations/:conversationId/messages', chatController.getConversationMessages);
router.post('/messages', chatController.sendMessage);

// Routes pour la gestion des participants
router.post('/conversations/participants', chatController.addParticipant);
router.delete('/conversations/participants', chatController.removeParticipant);

// Route pour nettoyer les conversations invalides après changement de permissions (Admin uniquement)
router.delete('/cleanup', adminOnly, chatController.cleanupInvalidConversations);

module.exports = router;
