const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');

// Appliquer l'authentification à toutes les routes
router.use(protect);

// Routes pour les conversations
router.post('/conversations', chatController.createConversation);
router.get('/conversations', chatController.getUserConversations);

// Routes pour les messages
router.get('/conversations/:conversationId/messages', chatController.getConversationMessages);
router.post('/messages', chatController.sendMessage);

// Routes pour la gestion des participants
router.post('/conversations/participants', chatController.addParticipant);
router.delete('/conversations/participants', chatController.removeParticipant);

module.exports = router;
