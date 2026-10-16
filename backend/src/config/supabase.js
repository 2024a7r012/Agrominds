const { createClient } = require('@supabase/supabase-js');
const config = require('./env');
const logger = require('./logger');

let supabase = null;
let supabaseAdmin = null;

if (config.supabase.isConfigured) {
  try {
    supabase = createClient(config.supabase.url, config.supabase.anonKey, {
      auth: { persistSession: false }
    });

    if (config.supabase.serviceRoleKey) {
      supabaseAdmin = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
        auth: { persistSession: false }
      });
    }

    logger.info('Supabase client initialized successfully.');
  } catch (err) {
    logger.error('Failed to initialize Supabase client:', { error: err.message });
  }
} else {
  logger.warn('Supabase credentials not configured. Backend will use local development memory store.');
}

module.exports = {
  supabase,
  supabaseAdmin,
  isConfigured: config.supabase.isConfigured
};
