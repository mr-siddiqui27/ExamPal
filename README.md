# ExamPal - AI-Powered Exam Preparation Platform

ExamPal is a comprehensive exam preparation platform that leverages Google Gemini AI to provide personalized study assistance, practice quizzes, and educational content for college students.

## 🚀 Features

### AI Chatbot
- **Intelligent Conversations**: Chat with Gemini AI for exam preparation help
- **Voice Input**: Speech-to-text functionality for hands-free interaction
- **File Upload**: Upload documents for AI-powered summarization
- **Context-Aware**: Smart suggestions based on conversation history
- **Export Conversations**: Save and share your study sessions

### Quiz Practice
- **Dynamic Quiz Generation**: AI-generated practice questions
- **Multiple Difficulty Levels**: Easy, Medium, Hard questions
- **Subject-Specific**: Customized quizzes for different subjects
- **Instant Scoring**: Real-time feedback and explanations
- **Progress Tracking**: Save quiz results and track improvement

### Academic Integration
- **College Support**: BBD University and AKTU integration
- **Subject Management**: Comprehensive subject and module structure
- **Topic Organization**: Detailed topic breakdowns with learning objectives
- **Search Functionality**: Quick access to academic content

### User Experience
- **Mobile Responsive**: Works seamlessly on all devices
- **Dark Theme**: Eye-friendly interface for extended study sessions
- **Real-time Updates**: Live typing indicators and status updates
- **Error Handling**: Robust error handling with user-friendly messages

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Google Gemini AI** for intelligent responses
- **JWT Authentication** (currently disabled for development)
- **Rate Limiting** and security middleware

### Frontend
- **Vanilla HTML, CSS, JavaScript** (React optional)
- **Web Speech API** for voice input
- **File API** for document uploads
- **Fetch API** for backend communication

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ExamPal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `config.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
AUTH_DISABLED=true

# Database Configuration
MONGODB_URI=your_mongodb_connection_string
MONGODB_URI_PROD=your_production_mongodb_connection_string

# Google AI (Gemini) Configuration
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
GEMINI_MAX_TOKENS=1000
GEMINI_TEMPERATURE=0.7

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
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

### 4. Get Your Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `config.env` file

### 5. Start the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### 6. Access the Application
- **Frontend**: http://localhost:5000/web
- **API Health**: http://localhost:5000/health
- **API Documentation**: http://localhost:5000/

## 📊 Database Setup

### Seed Data
The platform comes with pre-populated academic data:

```bash
# Seed BBD University data
node scripts/seed/bbd.seed.js

# Seed all data (BBD + AKTU)
node scripts/seed/seed.all.js
```

### Database Models
- **Users**: User profiles and preferences
- **Colleges**: Institution information
- **Subjects**: Academic subjects and modules
- **Modules**: Course modules with topics
- **Topics**: Detailed topic information
- **Quizzes**: Practice quiz data
- **AI Interactions**: Chat history and analytics
- **Feedback**: User feedback and ratings

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/guest` - Guest session creation
- `GET /api/auth/me` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### AI Services
- `POST /api/ai/chat` - AI chatbot conversation
- `POST /api/ai/explain` - Concept explanations
- `POST /api/ai/quiz` - Generate practice quizzes
- `POST /api/ai/cheat-sheet` - Create study cheat sheets
- `POST /api/ai/pyq` - Previous year questions
- `POST /api/ai/summarize` - Text summarization
- `POST /api/ai/summarize-file` - File summarization
- `GET /api/ai/suggestions` - Smart query suggestions

### Academic Data
- `GET /api/colleges` - List all colleges
- `GET /api/subjects/:collegeId` - Get subjects by college
- `GET /api/modules/:subjectId` - Get modules by subject
- `GET /api/topics/:moduleId` - Get topics by module
- `GET /api/search/suggestions` - Search suggestions

### Progress & Analytics
- `POST /api/progress/quiz` - Save quiz results
- `GET /api/progress/dashboard` - User progress dashboard
- `POST /api/feedback` - Submit feedback
- `GET /api/analytics/ai-usage` - AI usage analytics

## 🎯 Usage Examples

### AI Chat
```javascript
// Send a message to the AI
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "Explain recursion for exams"
  })
});
```

### Generate Quiz
```javascript
// Generate a practice quiz
const response = await fetch('/api/ai/quiz', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subject: "Computer Science",
    topic: "Data Structures",
    difficulty: "medium",
    count: 5
  })
});
```

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **CORS Protection**: Configurable cross-origin requests
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error messages
- **Helmet Security**: Security headers and protection

## 🚨 Troubleshooting

### Common Issues

1. **Gemini API Errors (503 Service Unavailable)**
   - The platform includes automatic retry mechanism
   - Wait a few minutes and try again
   - Check your API key validity

2. **MongoDB Connection Issues**
   - Ensure MongoDB is running locally or Atlas is accessible
   - Check connection string in `config.env`
   - Platform works without database in development mode

3. **CORS Errors**
   - Update `ALLOWED_ORIGINS` in `config.env`
   - Ensure frontend URL is included

4. **File Upload Issues**
   - Check file size limits (5MB default)
   - Ensure `uploads/` directory exists
   - Verify file type is supported

### Debug Mode
Enable detailed error logging by setting:
```env
NODE_ENV=development
LOG_LEVEL=debug
```

## 📈 Performance Optimization

- **Compression**: Gzip compression for responses
- **Caching**: Static file caching
- **Rate Limiting**: Prevents server overload
- **Connection Pooling**: Efficient database connections
- **Retry Logic**: Automatic retry for failed API calls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review server logs for error details
- Ensure all environment variables are set correctly
- Verify API keys and database connections

## 🎉 Acknowledgments

- Google Gemini AI for intelligent responses
- MongoDB for data storage
- Express.js community for robust backend framework
- All contributors and testers

---

**ExamPal** - Empowering students with AI-driven exam preparation! 🎓✨