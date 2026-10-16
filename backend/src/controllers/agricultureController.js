const agricultureService = require('../services/agricultureService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const getCategories = (req, res) => {
  const categories = agricultureService.getCategories();
  return sendSuccess(res, categories, 'Agricultural categories retrieved');
};

const getRecords = (req, res) => {
  const { category, search, tag, limit, offset } = req.query;
  const result = agricultureService.getRecords({
    category,
    search,
    tag,
    limit: limit ? parseInt(limit, 10) : 50,
    offset: offset ? parseInt(offset, 10) : 0
  });

  return sendSuccess(res, result, 'Agricultural records retrieved');
};

const getRecordBySlug = (req, res) => {
  const { slug } = req.params;
  const record = agricultureService.getRecordBySlug(slug);

  if (!record) {
    return sendError(res, `Agricultural record with slug '${slug}' not found`, 404);
  }

  return sendSuccess(res, record, 'Agricultural record details retrieved');
};

module.exports = {
  getCategories,
  getRecords,
  getRecordBySlug
};
