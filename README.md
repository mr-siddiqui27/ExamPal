# ExamPal - AI-Powered Exam Preparation Platform

A comprehensive exam preparation platform that uses AI (Gemini API) to provide personalized study assistance for B.Tech Computer Science students.

## ✨ Features

### 🎓 College-Specific AI Section
- **Dynamic Syllabus Integration**: Automatically loads subjects, modules, and topics from JSON data
- **Smart Dropdowns**: Module dropdown populates based on selected subject, topic suggestions appear as you type
- **AI-Powered Responses**: Uses Google's Gemini API to generate comprehensive, exam-focused content
- **Multiple Action Types**: Explanation, Quiz, Important Questions, Previous Year Questions, Sample Papers

### 🤖 SmartPrep Assistant
- **Chat Interface**: Interactive AI chat for general exam preparation questions
- **File Upload Support**: Attach documents to get context-aware responses
- **Real-time Responses**: Instant AI-generated answers to your queries

### 📝 Notes & Summaries
- **Text Input**: Paste or type your notes directly
- **File Upload**: Support for .txt, .doc, .docx, .pdf files
- **AI Summarization**: Get concise summaries of your study materials

## 🚀 Technology Stack

### Frontend
- **HTML5**: Semantic markup and modern structure
- **CSS3**: Custom properties, Flexbox, Grid, responsive design
- **Vanilla JavaScript**: ES6+ classes, async/await, modern APIs

### Backend
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **Google Gemini AI**: Advanced AI model for content generation

## 📁 Project Structure

```
ExamPal/
├── index.html              # Main frontend file
├── css/
│   └── styles.css         # All styling and responsive design
├── js/
│   └── app.js            # Frontend JavaScript logic
├── data/
│   └── syllabus.json     # Subject, module, and topic data
├── server.js             # Node.js backend server
├── package.json          # Node.js dependencies
└── README.md            # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

### 1. Clone and Install Dependencies
```bash
# Install backend dependencies
npm install

# Or if using yarn
yarn install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
# Gemini API Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5500
```

### 3. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

### 4. Start the Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The backend will start on `http://localhost:3000`

### 5. Start the Frontend
You can use any local server. For example:

**Using Python:**
```bash
# Python 3
python -m http.server 5500

# Python 2
python -m SimpleHTTPServer 5500
```

**Using Node.js:**
```bash
npx http-server -p 5500
```

**Using Live Server (VS Code extension):**
- Install Live Server extension
- Right-click on `index.html` → "Open with Live Server"

The frontend will be available at `http://localhost:5500`

## 🔧 API Endpoints

### Backend API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Server health check |
| `/api/syllabus` | GET | Get complete syllabus data |
| `/api/subjects/:subject/modules` | GET | Get modules for a subject |
| `/api/subjects/:subject/modules/:module/topics` | GET | Get topics for a module |
| `/api/subject-request` | POST | Submit AI request (main endpoint) |

### API Request Format
```json
{
  "college": "bbd-university",
  "subject": "dbms",
  "module": "Module 2",
  "topic": "Normalization",
  "action": "explanation"
}
```

### API Response Format
```json
{
  "success": true,
  "response": "AI-generated content...",
  "request": {
    "subject": "dbms",
    "module": "Module 2",
    "topic": "Normalization",
    "action": "explanation",
    "college": "bbd-university"
  }
}
```

## 📚 Syllabus Data Structure

The `data/syllabus.json` file contains a hierarchical structure:

```json
{
  "subject-key": {
    "Module 1": ["Topic 1", "Topic 2", "Topic 3"],
    "Module 2": ["Topic 4", "Topic 5", "Topic 6"]
  }
}
```

### Available Subjects
- C Programming
- Data Structures
- Algorithms
- Operating Systems
- Database Management System (DBMS)
- Computer Networks
- Software Engineering
- Artificial Intelligence
- Machine Learning
- Compiler Design
- Web Development
- Java Programming
- Python Programming
- Theory of Computation
- Computer Organization & Architecture
- Cyber Security
- Cloud Computing
- Data Science
- Discrete Mathematics
- Probability & Statistics
- Linear Algebra
- Communication Skills
- Professional English

## 🎨 Customization

### Adding New Subjects
1. Edit `data/syllabus.json`
2. Add your subject with modules and topics
3. The frontend will automatically detect and display new subjects

### Modifying AI Prompts
Edit the prompt template in `server.js` around line 80:

```javascript
const prompt = `Your custom prompt template here...`;
```

### Styling Changes
- Modify `css/styles.css` for visual changes
- Use CSS custom properties for theme customization
- Responsive breakpoints are defined for mobile, tablet, and desktop

## 🌐 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Features**: ES6 modules, async/await, CSS Grid, Flexbox
- **Fallbacks**: Graceful degradation for older browsers

## 🔒 Security Features

- CORS protection
- Input validation
- Error handling
- Environment variable protection
- Rate limiting (can be added)

## 🚧 Development Notes

### Frontend Development
- The app uses a class-based architecture (`ExamPal` class)
- Event-driven programming with proper cleanup
- Responsive design with mobile-first approach
- Dark mode support with localStorage persistence

### Backend Development
- RESTful API design
- Proper error handling and logging
- Environment-based configuration
- CORS enabled for development

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check if port 3000 is available
- Verify `.env` file exists with correct API key
- Ensure all dependencies are installed

**Frontend can't connect to backend:**
- Verify backend is running on port 3000
- Check CORS configuration in `.env`
- Ensure frontend is running on port 5500

**Gemini API errors:**
- Verify API key is correct
- Check API quota and limits
- Ensure internet connection is stable

**Module/Topic dropdowns not working:**
- Check browser console for errors
- Verify `syllabus.json` is properly formatted
- Ensure backend `/api/syllabus` endpoint is accessible

## 📈 Future Enhancements

- [ ] User authentication and profiles
- [ ] Progress tracking and analytics
- [ ] Offline mode support
- [ ] Multiple AI model support
- [ ] Study schedule planning
- [ ] Collaborative study groups
- [ ] Mobile app development
- [ ] Advanced analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Developer

**Mojammil Husain**
- Project: ExamPal
- Version: 2.0.0
- Last Updated: 2025

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the API documentation

---

**Happy Studying! 🎓✨**
