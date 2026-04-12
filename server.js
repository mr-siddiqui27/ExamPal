const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
// Load env from project root so GEMINI_API_KEY is set regardless of cwd
const envPath = path.join(__dirname, 'config.env');
require('dotenv').config({ path: path.join(__dirname, '.env') }); // load .env first (optional)
const envResult = require('dotenv').config({ path: envPath });    // then config.env (overrides)
if (envResult.error && !process.env.GEMINI_API_KEY && process.env.NODE_ENV !== 'production') {
  console.warn('⚠️  Could not load config.env:', envResult.error.message, '| Expected at:', envPath);
}

// Import middleware
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const examRoutes = require('./routes/exams');
const aiRoutes = require('./routes/ai');
const aiExtendedRoutes = require('./routes/ai.extended');
const resourceRoutes = require('./routes/resources');
const progressRoutes = require('./routes/progress');
const progressQuizRoutes = require('./routes/progress.quiz');
const academicsRoutes = require('./routes/academics');
const analyticsRoutes = require('./routes/analytics');
const feedbackRoutes = require('./routes/feedback');

const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_PATH || 'uploads/')));

// Serve index.html for /web route
app.get('/web', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Serve static files from /web path (for CSS, JS, etc.)
app.use('/web', express.static(path.join(__dirname, 'client'), {
  redirect: false  // Disable automatic redirects
}));

// Serve test.html for /test route
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'test.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'ExamPal Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to ExamPal Backend API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/health',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      exams: '/api/exams',
      ai: '/api/ai',
      resources: '/api/resources',
      progress: '/api/progress'
    }
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/ai', aiExtendedRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api', progressQuizRoutes);
app.use('/api', academicsRoutes);
app.use('/api', analyticsRoutes);
app.use('/api', feedbackRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Database connection (optional for development)
let isConnected = false;

const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      // In production, MongoDB connection is required
      const { connectDB: dbConnect } = require('./config/database');
      await dbConnect();
      isConnected = true;
      console.log('✅ MongoDB connected successfully');
    } else {
      // In development, MongoDB is optional
      try {
        const { connectDB: dbConnect } = require('./config/database');
        await dbConnect();
        isConnected = true;
        console.log('✅ MongoDB connected successfully');
      } catch (error) {
        console.log('⚠️  MongoDB not available - running in development mode without database');
        console.log('   To enable database features, install and start MongoDB');
        isConnected = false;
      }
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, async () => {
  console.log(`🚀 ExamPal Backend server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Server URL: http://localhost:${PORT}`);
  
  // Try to connect to database
  await connectDB();
  
  if (isConnected) {
    console.log('📊 Database features enabled');
  } else {
    console.log('📊 Database features disabled - using mock data');
  }
  const key = process.env.GEMINI_API_KEY;
  console.log(key ? '🤖 Gemini API key loaded (AI chatbot enabled)' : '⚠️  GEMINI_API_KEY not set - set it in config.env for AI features');
  console.log('✨ Ready to serve requests!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
