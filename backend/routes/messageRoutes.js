const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Get unread count
router.get('/unread/count', messageController.getUnreadCount);

// Get recent messages (last 15-24 hours)
router.get('/recent', messageController.getRecentMessages);

// Get messages for a project
router.get('/project/:projectId', messageController.getProjectMessages);

// Get all messages
router.get('/', messageController.getAllMessages);

// Send message
router.post('/', messageController.sendMessage);

// Mark message as read
router.put('/:id/read', messageController.markAsRead);

// Delete message
router.delete('/:id', messageController.deleteMessage);

module.exports = router;
