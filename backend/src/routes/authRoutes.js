const express = require('express');
const { getMe, updateMe, devLogin } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', requireAuth, getMe);
router.put('/me', requireAuth, updateMe);
router.post('/dev-login', devLogin);

module.exports = router;
