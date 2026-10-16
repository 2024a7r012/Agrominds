const express = require('express');
const {
  getPlans,
  createOrder,
  verifyPayment,
  getHistory
} = require('../controllers/paymentController');
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');
const { paymentLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/plans', getPlans);
router.post('/create-order', paymentLimiter, optionalAuth, createOrder);
router.post('/verify', optionalAuth, verifyPayment);
router.get('/history', requireAuth, getHistory);

module.exports = router;
