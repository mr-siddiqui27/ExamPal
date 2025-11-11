# ExamPal Backend Setup Guide

## Prerequisites

- Node.js (version 18.0.0 or higher)
- npm (comes with Node.js)
- MongoDB (optional for development, required for production)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (optional for development)
MONGODB_URI=mongodb://localhost:27017/exampal_dev
MONGODB_URI_PROD=mongodb://localhost:27017/exampal_prod

# Google AI (Gemini) Configuration - REQUIRED
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
GEMINI_MAX_TOKENS=1000
GEMINI_TEMPERATURE=0.7

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=30d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads/

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000

# Logging
LOG_LEVEL=info
```

### 3. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key and paste it in your `.env` file

### 4. Start the Server

#### Development Mode (with auto-restart)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

## MongoDB Setup (Optional for Development)

### Install MongoDB Community Edition

#### Windows
1. Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Start MongoDB service

#### macOS
```bash
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu)
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Start MongoDB Service
```bash
# Windows (in Command Prompt as Administrator)
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

## Testing the Setup

### 1. Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "ExamPal Backend is running",
  "timestamp": "2025-02-09T...",
  "environment": "development",
  "version": "1.0.0"
}
```

### 2. Test AI Endpoint (requires Gemini API key)
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how can you help me with exam preparation?",
    "subject": "Computer Science"
  }'
```

## Project Structure

```
ExamPal/
├── config/              # Configuration files
├── middleware/          # Custom middleware
├── models/              # Database models
├── routes/              # API route handlers
├── uploads/             # File upload directory
├── config.js            # Configuration defaults
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
├── .env                 # Environment variables (create this)
├── .env_example         # Environment template
└── README.md            # Project documentation
```

## Features

### ✅ Implemented
- Express.js server with security middleware
- CORS configuration
- Rate limiting
- JWT authentication
- User management
- AI integration with Gemini
- Exam management (mock data)
- Resource management (mock data)
- Progress tracking (mock data)
- Error handling
- Logging
- File upload support

### 🔄 Development Mode
- Runs without MongoDB (uses mock data)
- Graceful fallback for database features
- Development-friendly error messages

### 🚀 Production Mode
- Requires MongoDB connection
- Stricter error handling
- Production logging

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <process_id> /F
```

#### 2. Gemini API Key Error
- Ensure your `.env` file has the correct `GEMINI_API_KEY`
- Verify the API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)

#### 3. MongoDB Connection Issues
- Check if MongoDB service is running
- Verify connection string in `.env`
- Check firewall settings

#### 4. Module Not Found Errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Frontend Development**: Create a React/Vue.js frontend
2. **Database Integration**: Replace mock data with real database operations
3. **Testing**: Add unit and integration tests
4. **Deployment**: Deploy to cloud platform (Heroku, AWS, etc.)
5. **Monitoring**: Add application monitoring and logging

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the error logs in the console
3. Verify your environment configuration
4. Check the [README.md](README.md) for detailed API documentation

## License

This project is licensed under the MIT License.
