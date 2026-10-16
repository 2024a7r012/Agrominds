const Razorpay = require('razorpay');
const config = require('./env');
const logger = require('./logger');

let razorpayInstance = null;

if (config.razorpay.isConfigured) {
  try {
    razorpayInstance = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret
    });
    logger.info('Razorpay test mode client initialized.');
  } catch (err) {
    logger.error('Failed to initialize Razorpay client:', { error: err.message });
  }
} else {
  logger.warn('Razorpay keys not configured. Payment module will run in designated simulated test mode.');
}

module.exports = {
  razorpayInstance,
  keyId: config.razorpay.keyId,
  keySecret: config.razorpay.keySecret,
  webhookSecret: config.razorpay.webhookSecret,
  isConfigured: config.razorpay.isConfigured
};
