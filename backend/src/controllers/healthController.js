const config = require('../config/env');
const { sendSuccess } = require('../utils/responseHelper');

const getHealth = (req, res) => {
  const healthData = {
    service: 'AgroMinds Smart Agriculture API',
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime_seconds: Math.floor(process.uptime()),
    environment: config.nodeEnv,
    integrations: {
      supabase: {
        configured: config.supabase.isConfigured,
        mode: config.supabase.isConfigured ? 'live-supabase-postgresql' : 'local-development-fallback'
      },
      gemini_ai: {
        configured: config.gemini.isConfigured,
        model: config.gemini.model,
        mode: config.gemini.isConfigured ? 'live-google-gemini' : 'mock-development-engine'
      },
      razorpay: {
        configured: config.razorpay.isConfigured,
        test_mode: true,
        mode: config.razorpay.isConfigured ? 'live-razorpay-test' : 'simulated-development-mode'
      }
    }
  };

  return sendSuccess(res, healthData, 'System is operating normally');
};

module.exports = { getHealth };
