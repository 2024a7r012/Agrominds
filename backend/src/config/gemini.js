const { GoogleGenAI } = require('@google/genai');
const config = require('./env');
const logger = require('./logger');

let geminiClient = null;

if (config.gemini.isConfigured) {
  try {
    geminiClient = new GoogleGenAI({ apiKey: config.gemini.apiKey });
    logger.info(`Google Gemini API client initialized for model ${config.gemini.model}.`);
  } catch (err) {
    logger.error('Failed to initialize Google Gemini client:', { error: err.message });
  }
} else {
  logger.warn('GEMINI_API_KEY is not configured. AI Assistant will operate in explicitly labelled Mock Development Mode.');
}

module.exports = {
  geminiClient,
  modelName: config.gemini.model,
  isConfigured: config.gemini.isConfigured
};
