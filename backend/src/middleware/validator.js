const { validationResult } = require('express-validator');
const { sendError } = require('../utils/responseHelper');

const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return sendError(
      res,
      'Validation failed for one or more fields',
      400,
      errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg
      }))
    );
  };
};

module.exports = { validate };
