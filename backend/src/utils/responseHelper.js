/**
 * Standardized API response formatters
 */
function sendSuccess(res, data = {}, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
}

function sendError(res, message = 'Internal Server Error', statusCode = 500, errors = null) {
  const payload = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (errors) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
}

module.exports = {
  sendSuccess,
  sendError
};
