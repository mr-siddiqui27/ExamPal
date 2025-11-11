/**
 * 404 Not Found Middleware
 * Handles requests to undefined routes
 */

const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.originalUrl}`,
      statusCode: 404
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    availableRoutes: [
      '/api/auth',
      '/api/users', 
      '/api/exams',
      '/api/ai',
      '/api/resources',
      '/api/progress',
      '/health'
    ]
  });
};

module.exports = notFound;
