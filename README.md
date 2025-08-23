# ExamPal - AI-Powered Exam Companion

A modern, responsive web application designed to provide AI-powered assistance for exam preparation. Built with HTML, CSS, and JavaScript, featuring a clean interface that's ready for backend API integration.

## 🚀 Features

### 1. College-Specific AI
- **Smart Selection**: Choose from College, Subject, Module, and Topic dropdowns
- **Multiple Options**: Get AI assistance for:
  - 📚 Explanations
  - 🧠 Quizzes
  - ⭐ Important Questions/Topics
  - 📜 Previous Year Questions
  - 📄 Sample Papers
- **Personalized Responses**: Tailored content based on your selections

### 2. SmartPrep Assistant
- **AI Chatbot**: Interactive chat interface for exam-related questions
- **Real-time Responses**: Get instant help with your study queries
- **Chat History**: Track your conversation history
- **Smart Suggestions**: Context-aware responses based on your questions

### 3. Notes & Summaries
- **Text Input**: Paste or type your notes directly
- **File Upload**: Support for various file formats (.txt, .doc, .docx, .pdf)
- **AI Summarization**: Get concise summaries of your study materials
- **Character Counter**: Track your input length

### 4. Additional Features
- **Dark Mode Toggle**: Switch between light and dark themes
- **Responsive Design**: Works seamlessly on all device sizes
- **Modern UI**: Clean, card-based design with smooth animations
- **Navigation**: Easy switching between different sections

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Icons**: Font Awesome 6.0
- **Styling**: CSS Custom Properties (CSS Variables)
- **Responsiveness**: Mobile-first CSS Grid and Flexbox
- **Theme**: Light/Dark mode with localStorage persistence

## 📁 Project Structure

```
ExamPal/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # Main stylesheet
├── js/
│   └── app.js            # Main JavaScript application
├── assets/
│   └── README.md         # Assets documentation
└── README.md             # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Start exploring the different sections!

### Local Development
For development purposes, you can use any local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## 🎨 Customization

### Colors and Themes
The application uses CSS custom properties for easy theming. Modify the `:root` section in `css/styles.css` to change colors:

```css
:root {
    --primary-color: #6366f1;    /* Main brand color */
    --bg-primary: #ffffff;       /* Background color */
    --text-primary: #1e293b;     /* Text color */
    /* ... more variables */
}
```

### Adding New Features
The JavaScript is structured in a class-based architecture, making it easy to extend:

```javascript
class ExamPal {
    // Add new methods here
    newFeature() {
        // Your new functionality
    }
}
```

## 🔌 Backend Integration Ready

The frontend is designed to easily connect with backend APIs:

### API Endpoints Structure
- **College AI**: `/api/college-ai` - POST with college, subject, module, topic, option
- **Chat**: `/api/chat` - POST with message, GET for history
- **Notes**: `/api/summarize` - POST with notes text or file

### Data Flow
1. User selects options in the frontend
2. Frontend validates input
3. Frontend makes API calls to backend
4. Backend processes with AI models
5. Frontend displays results

## 📱 Responsive Design

The application is fully responsive with breakpoints at:
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: 480px - 767px
- **Small Mobile**: Below 480px

## 🌙 Dark Mode

- Toggle between light and dark themes
- Theme preference is saved in localStorage
- Automatic theme switching with smooth transitions

## 🔒 Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Features Used**: CSS Grid, Flexbox, CSS Variables, ES6 Classes
- **Fallbacks**: Graceful degradation for older browsers

## 🚧 Current Status

### ✅ Completed
- Complete frontend UI implementation
- Responsive design for all screen sizes
- Dark mode toggle with persistence
- Interactive form handling
- Chat interface with placeholder responses
- Notes summarization interface
- File upload interface
- Navigation between sections
- Form validation
- Notification system

### 🔄 Placeholder Content
- AI responses are currently placeholder text
- Chat responses are simulated
- Notes summarization shows sample output
- File processing is simulated

### 🚀 Next Steps
- Connect to backend AI services
- Implement real API calls
- Add user authentication
- Database integration for chat history
- File processing and storage
- Real-time chat capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:
1. Check the browser console for errors
2. Ensure all files are in the correct directory structure
3. Verify that your browser supports the required features

## 🔮 Future Enhancements

- **User Accounts**: Login/signup system
- **Progress Tracking**: Study progress and analytics
- **Collaborative Features**: Study groups and sharing
- **Offline Support**: Service worker for offline functionality
- **Mobile App**: React Native or PWA version
- **AI Models**: Integration with GPT, Claude, or custom models
- **Analytics**: User behavior and performance tracking

---

**Built with ❤️ for students and educators worldwide**
