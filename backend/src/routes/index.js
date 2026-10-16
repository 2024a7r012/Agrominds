const express = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const agricultureRoutes = require('./agricultureRoutes');
const assistantRoutes = require('./assistantRoutes');
const paymentRoutes = require('./paymentRoutes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/agriculture', agricultureRoutes);
router.use('/assistant', assistantRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;
