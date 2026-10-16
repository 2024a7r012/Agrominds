const crypto = require('crypto');
const { razorpayInstance, keyId, keySecret, webhookSecret, isConfigured } = require('../config/razorpay');
const logger = require('../config/logger');

// Available plans for agriculture consultancy / testing kits
const PLAN_TIERS = {
  pro_agronomist: {
    id: 'pro_agronomist',
    name: 'Pro Agronomist Consultation Pack',
    amount: 49900, // in paise (₹499.00)
    currency: 'INR',
    description: 'Priority AI advisory, custom fertigation charts, and seasonal SMS alerts.'
  },
  expert_soil_kit: {
    id: 'expert_soil_kit',
    name: 'Lab Soil Testing & Health Card Kit',
    amount: 99900, // in paise (₹999.00)
    currency: 'INR',
    description: 'Comprehensive physical soil health card, micronutrient panel, and organic carbon test.'
  },
  enterprise_farm: {
    id: 'enterprise_farm',
    name: 'Commercial Farm Advisory Suite',
    amount: 249900, // in paise (₹2499.00)
    currency: 'INR',
    description: 'Multi-plot mapping, precision weather alerts, and dedicated agronomist review.'
  }
};

// In-memory payment store for local development audit and fallback
const memoryOrders = new Map();

class RazorpayService {
  getAvailablePlans() {
    return Object.values(PLAN_TIERS).map((p) => ({
      ...p,
      displayPrice: `₹${(p.amount / 100).toLocaleString('en-IN')}`
    }));
  }

  /**
   * Create an order on Razorpay or simulated fallback
   */
  async createOrder({ planTier, userId, notes = {} }) {
    const plan = PLAN_TIERS[planTier];
    if (!plan) {
      throw new Error(`Invalid plan tier: ${planTier}. Choose from: ${Object.keys(PLAN_TIERS).join(', ')}`);
    }

    const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    if (isConfigured && razorpayInstance) {
      try {
        const options = {
          amount: plan.amount,
          currency: plan.currency,
          receipt,
          notes: {
            ...notes,
            planTier,
            userId: userId || 'anonymous'
          }
        };

        logger.info('Creating real Razorpay test order...', { planTier, amount: plan.amount });
        const order = await razorpayInstance.orders.create(options);

        // Store order details in audit store
        const record = {
          orderId: order.id,
          userId,
          amount: plan.amount / 100,
          currency: plan.currency,
          status: 'created',
          planTier,
          receipt,
          isSimulated: false,
          createdAt: new Date().toISOString()
        };
        memoryOrders.set(order.id, record);

        return {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: keyId,
          planName: plan.name,
          planTier,
          receipt,
          isSimulated: false
        };
      } catch (err) {
        logger.error('Razorpay API order creation failed:', { error: err.message });
        throw new Error(`Razorpay order creation failed: ${err.message}`);
      }
    }

    // Simulated test order mode
    const simulatedOrderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const record = {
      orderId: simulatedOrderId,
      userId,
      amount: plan.amount / 100,
      currency: plan.currency,
      status: 'created',
      planTier,
      receipt,
      isSimulated: true,
      createdAt: new Date().toISOString()
    };
    memoryOrders.set(simulatedOrderId, record);

    logger.info('Simulated Razorpay test order generated (Keys not configured):', { orderId: simulatedOrderId });

    return {
      orderId: simulatedOrderId,
      amount: plan.amount,
      currency: plan.currency,
      keyId: 'rzp_test_simulated_key',
      planName: plan.name,
      planTier,
      receipt,
      isSimulated: true,
      notice: 'Razorpay keys are unconfigured. This is a local development simulation.'
    };
  }

  /**
   * Verify server-side payment signature HMAC SHA256
   */
  verifyPaymentSignature({ orderId, paymentId, signature }) {
    if (!orderId || !paymentId) {
      return { verified: false, error: 'Missing orderId or paymentId' };
    }

    const orderRecord = memoryOrders.get(orderId);

    // If real Razorpay keys are configured
    if (isConfigured && keySecret) {
      if (!signature) {
        return { verified: false, error: 'Missing payment signature for verification' };
      }

      const body = `${orderId}|${paymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(body.toString())
        .digest('hex');

      const isMatch = expectedSignature === signature;

      if (isMatch) {
        if (orderRecord) {
          orderRecord.status = 'paid';
          orderRecord.paymentId = paymentId;
          orderRecord.signature = signature;
          orderRecord.updatedAt = new Date().toISOString();
        }
        return { verified: true, isSimulated: false, order: orderRecord };
      } else {
        logger.warn('Razorpay signature mismatch rejected:', { orderId, paymentId });
        return { verified: false, error: 'Cryptographic signature mismatch. Payment rejected.' };
      }
    }

    // Simulated Verification Mode
    if (orderId.startsWith('order_sim_')) {
      if (orderRecord) {
        orderRecord.status = 'paid';
        orderRecord.paymentId = paymentId || `pay_sim_${Date.now()}`;
        orderRecord.updatedAt = new Date().toISOString();
      }

      return {
        verified: true,
        isSimulated: true,
        order: orderRecord,
        notice: 'Verified via simulated test mode. No live funds were processed.'
      };
    }

    return { verified: false, error: 'Unknown or unverified order reference.' };
  }

  /**
   * Webhook signature validation
   */
  verifyWebhookSignature(rawBody, signature) {
    if (!webhookSecret) {
      return { verified: false, error: 'RAZORPAY_WEBHOOK_SECRET not configured' };
    }
    const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
    return { verified: expected === signature };
  }

  getPaymentHistory(userId) {
    const list = Array.from(memoryOrders.values());
    if (!userId) return list;
    return list.filter((item) => item.userId === userId);
  }
}

module.exports = new RazorpayService();
