const razorpayService = require('../services/razorpayService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const getPlans = (req, res) => {
  const plans = razorpayService.getAvailablePlans();
  return sendSuccess(res, plans, 'Payment plan tiers retrieved');
};

const createOrder = async (req, res, next) => {
  try {
    const { planTier, notes } = req.body;

    if (!planTier) {
      return sendError(res, 'planTier is required (e.g., pro_agronomist, expert_soil_kit, enterprise_farm)', 400);
    }

    const userId = req.user?.id || null;
    const order = await razorpayService.createOrder({
      planTier,
      userId,
      notes
    });

    return sendSuccess(res, order, 'Payment order created successfully', 201);
  } catch (err) {
    return sendError(res, err.message, 400);
  }
};

const verifyPayment = (req, res, next) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId) {
      return sendError(res, 'Both orderId and paymentId are required for verification', 400);
    }

    const verificationResult = razorpayService.verifyPaymentSignature({
      orderId,
      paymentId,
      signature
    });

    if (!verificationResult.verified) {
      return sendError(res, verificationResult.error || 'Payment verification failed', 400);
    }

    return sendSuccess(res, verificationResult, 'Payment verified successfully');
  } catch (err) {
    next(err);
  }
};

const getHistory = (req, res) => {
  const userId = req.user?.id;
  const history = razorpayService.getPaymentHistory(userId);
  return sendSuccess(res, history, 'Payment history retrieved');
};

module.exports = {
  getPlans,
  createOrder,
  verifyPayment,
  getHistory
};
