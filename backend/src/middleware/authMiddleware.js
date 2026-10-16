const { supabase, isConfigured } = require('../config/supabase');
const { sendError } = require('../utils/responseHelper');
const logger = require('../config/logger');

// Simulated development user for local testing when Supabase credentials are not yet configured
const DEMO_USER = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'farmer.demo@agrominds.org',
  user_metadata: {
    full_name: 'Rajesh Kumar',
    role: 'farmer'
  },
  is_demo: true
};

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. Missing or malformed Bearer token.', 401);
    }

    const token = authHeader.split(' ')[1].trim();

    if (!token) {
      return sendError(res, 'Authentication token cannot be empty.', 401);
    }

    // If Supabase is configured, verify with live Supabase Auth
    if (isConfigured && supabase) {
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data?.user) {
        logger.warn('Supabase token verification failed:', { error: error?.message });
        return sendError(res, 'Invalid or expired session token.', 401);
      }
      req.user = data.user;
      return next();
    }

    // Fallback: Local Development Mode (credentials not configured)
    if (token === 'demo-token' || token.startsWith('demo_') || token.length > 10) {
      req.user = {
        ...DEMO_USER,
        tokenUsed: token
      };
      return next();
    }

    return sendError(res, 'Invalid authentication token in development mode.', 401);
  } catch (err) {
    logger.error('Authentication middleware error:', { error: err.message });
    return sendError(res, 'Authentication error occurred.', 500);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1].trim();
    if (!token) {
      req.user = null;
      return next();
    }

    if (isConfigured && supabase) {
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data?.user) {
        req.user = data.user;
      } else {
        req.user = null;
      }
      return next();
    }

    // Local fallback
    if (token) {
      req.user = DEMO_USER;
    }
    return next();
  } catch (err) {
    req.user = null;
    return next();
  }
};

module.exports = {
  requireAuth,
  optionalAuth,
  DEMO_USER
};
