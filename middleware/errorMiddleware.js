const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  logger.error(err.message);

  res.status(statusCode).json({
    message: err.message,
  });
};

module.exports = errorHandler;