// Configuration file for ExamPal Backend
// Copy this to .env and update with your actual values

module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/exampal_dev',
  MONGODB_URI_PROD: process.env.MONGODB_URI_PROD || 'mongodb://localhost:27017/exampal_prod',
  
  // Google AI (Gemini) Configuration
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'your_gemini_api_key_here',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  GEMINI_MAX_TOKENS: parseInt(process.env.GEMINI_MAX_TOKENS) || 1000,
  GEMINI_TEMPERATURE: parseFloat(process.env.GEMINI_TEMPERATURE) || 0.7,
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  
  // File Upload Configuration
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5242880,
  UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads/',
  
  // CORS Configuration
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:5000'],
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};
