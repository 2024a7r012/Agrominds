const geminiService = require('../services/geminiService');
const supabaseService = require('../services/supabaseService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

/**
 * Ask the AgroMinds AI Assistant
 */
const askAssistant = async (req, res, next) => {
  try {
    const { prompt, context = {}, conversationId } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return sendError(res, 'Prompt is required and cannot be empty.', 400);
    }

    if (prompt.trim().length > 1500) {
      return sendError(res, 'Prompt is too long. Please limit to 1500 characters.', 400);
    }

    const user = req.user;
    let activeConversationId = conversationId;
    let history = [];

    // If a conversation ID was provided, fetch its history
    if (activeConversationId) {
      history = await supabaseService.getMessages(activeConversationId);
    }

    // Call Gemini Service
    const advice = await geminiService.generateAdvice({
      prompt: prompt.trim(),
      context,
      conversationHistory: history
    });

    // If authenticated, persist conversation & messages
    if (user) {
      if (!activeConversationId) {
        const title = prompt.trim().substring(0, 45) + (prompt.trim().length > 45 ? '...' : '');
        const newConv = await supabaseService.createConversation(user.id, {
          title,
          crop_context: context.crop,
          soil_context: context.soil,
          location_context: context.location
        });
        activeConversationId = newConv.id;
      }

      // Store user prompt
      await supabaseService.addMessage(activeConversationId, {
        sender: 'user',
        content: prompt.trim()
      });

      // Store AI response
      await supabaseService.addMessage(activeConversationId, {
        sender: 'assistant',
        content: advice.content,
        is_mock: advice.is_mock
      });
    }

    return sendSuccess(res, {
      ...advice,
      conversationId: activeConversationId
    }, 'Advisory generated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * List conversations for authenticated user
 */
const getConversations = async (req, res, next) => {
  try {
    const user = req.user;
    const conversations = await supabaseService.getUserConversations(user.id);
    return sendSuccess(res, conversations, 'Conversations retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new conversation thread
 */
const createConversation = async (req, res, next) => {
  try {
    const user = req.user;
    const { title, crop_context, soil_context, location_context } = req.body;
    const conv = await supabaseService.createConversation(user.id, {
      title,
      crop_context,
      soil_context,
      location_context
    });
    return sendSuccess(res, conv, 'Conversation thread created', 201);
  } catch (err) {
    next(err);
  }
};

/**
 * Get messages in a conversation
 */
const getMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const messages = await supabaseService.getMessages(id);
    return sendSuccess(res, messages, 'Conversation messages retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  askAssistant,
  getConversations,
  createConversation,
  getMessages
};
