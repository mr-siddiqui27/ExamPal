const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Verifies JWT token and adds user to request object
 */

const getDevUser = () => ({
  _id: '000000000000000000000000',
  name: 'Dev User',
  role: 'student',
  isGuest: false
});

const protect = async (req, res, next) => {
  // Dev bypass
  if (process.env.AUTH_DISABLED === 'true') {
    req.user = getDevUser();
    return next();
  }

  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'User not found',
            statusCode: 401
          }
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        error: {
          message: 'Not authorized, token failed',
          statusCode: 401
        }
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Not authorized, no token',
        statusCode: 401
      }
    });
  }
};

/**
 * Optional Authentication Middleware
 * Adds user to request if token exists, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  // Dev bypass (provide mock user for convenience)
  if (process.env.AUTH_DISABLED === 'true') {
    req.user = getDevUser();
    return next();
  }

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Silently fail for optional auth
      console.log('Optional auth failed:', error.message);
    }
  }

  next();
};

/**
 * Role-based Authorization Middleware
 * Checks if user has required role
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Dev bypass allows all roles
    if (process.env.AUTH_DISABLED === 'true') {
      req.user = req.user || getDevUser();
      return next();
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Not authorized, login required',
          statusCode: 401
        }
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Not authorized, insufficient permissions',
          statusCode: 403
        }
      });
    }

    next();
  };
};

module.exports = {
  protect,
  optionalAuth,
  authorize
};
