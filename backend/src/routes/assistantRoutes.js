const express = require('express');
const {
  askAssistant,
  getConversations,
  createConversation,
  getMessages
} = require('../controllers/assistantController');
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');
const { assistantLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Asking can be performed with optional authentication (conversations are persisted if authenticated)
router.post('/ask', assistantLimiter, optionalAuth, askAssistant);

// Protected conversation threads
router.get('/conversations', requireAuth, getConversations);
router.post('/conversations', requireAuth, createConversation);
router.get('/conversations/:id/messages', requireAuth, getMessages);

module.exports = router;
