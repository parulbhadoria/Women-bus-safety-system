const errorHandler = (error, _req, res, _next) => {
  console.error(error);
  const status = error.status || 500;
  const message = status === 500 ? "Something went wrong on server" : error.message;
  res.status(status).json({ error: message });
};

module.exports = errorHandler;
