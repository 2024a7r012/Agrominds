const express = require('express');
const { getCategories, getRecords, getRecordBySlug } = require('../controllers/agricultureController');

const router = express.Router();

router.get('/categories', getCategories);
router.get('/records', getRecords);
router.get('/records/:slug', getRecordBySlug);

module.exports = router;
