const supabaseService = require('../services/supabaseService');
const { isConfigured } = require('../config/supabase');
const { sendSuccess, sendError } = require('../utils/responseHelper');

/**
 * Get currently authenticated user profile
 */
const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return sendError(res, 'User context not found', 401);
    }

    let profile = await supabaseService.getProfile(user.id);
    if (!profile) {
      profile = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || 'Farmer',
        role: user.user_metadata?.role || 'farmer',
        is_demo: Boolean(user.is_demo)
      };
    }

    return sendSuccess(res, {
      user: {
        id: user.id,
        email: user.email,
        is_demo: Boolean(user.is_demo),
        auth_mode: isConfigured ? 'supabase-auth' : 'local-development-mode'
      },
      profile
    }, 'User profile retrieved successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Update authenticated user profile
 */
const updateMe = async (req, res, next) => {
  try {
    const user = req.user;
    const updated = await supabaseService.updateProfile(user.id, req.body);
    return sendSuccess(res, updated, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Local development authentication helper
 * Useful when Supabase credentials are not configured
 */
const devLogin = async (req, res) => {
  const { email } = req.body;
  const demoEmail = email || 'farmer.demo@agrominds.org';

  return sendSuccess(res, {
    token: `demo_${Buffer.from(demoEmail).toString('base64')}`,
    user: {
      id: '00000000-0000-0000-0000-000000000001',
      email: demoEmail,
      full_name: 'Rajesh Kumar (Demo Farmer)',
      role: 'farmer'
    },
    notice: 'Authenticated in Local Development Mode. To use live Supabase Auth, add credentials to .env.'
  }, 'Development login successful');
};

module.exports = {
  getMe,
  updateMe,
  devLogin
};
