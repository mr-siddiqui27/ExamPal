const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5500',
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Initialize Gemini AI
let genAI;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log('✅ Gemini AI initialized successfully');
} else {
  console.error('❌ GEMINI_API_KEY not found in environment variables');
  console.log('Please create a .env file with your Gemini API key');
}

// Load syllabus data
const syllabus = require('./data/syllabus.json');

// Routes

// Get syllabus data
app.get('/api/syllabus', (req, res) => {
  res.json(syllabus);
});

// Get modules for a subject
app.get('/api/subjects/:subject/modules', (req, res) => {
  const { subject } = req.params;
  if (syllabus[subject]) {
    const modules = Object.keys(syllabus[subject]);
    res.json({ modules });
  } else {
    res.status(404).json({ error: 'Subject not found' });
  }
});

// Get topics for a module
app.get('/api/subjects/:subject/modules/:module/topics', (req, res) => {
  const { subject, module } = req.params;
  if (syllabus[subject] && syllabus[subject][module]) {
    const topics = syllabus[subject][module];
    res.json({ topics });
  } else {
    res.status(404).json({ error: 'Module or subject not found' });
  }
});

// Main API endpoint for subject requests
app.post('/api/subject-request', async (req, res) => {
  try {
    const { subject, module, topic, action, college } = req.body;

    console.log('Received request:', { subject, module, topic, action, college });

    // Validate required fields
    if (!subject || !action) {
      console.log('Validation failed: missing subject or action');
      return res.status(400).json({ 
        error: 'Subject and action are required fields' 
      });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return res.status(500).json({ 
        error: 'Gemini API key not configured on server' 
      });
    }

    // Create the prompt for Gemini
    const prompt = `You are an exam preparation assistant for ${college || 'B.Tech Computer Science'} students.

Subject: ${subject}
${module ? `Module: ${module}` : ''}
${topic ? `Topic: ${topic}` : ''}
Request: ${action}

Please provide a comprehensive, exam-focused response that includes:
1. Clear explanations of concepts
2. Key points to remember
3. Common exam questions and their solutions
4. Practical examples
5. Tips for exam preparation

Make the response suitable for B.Tech Computer Science students preparing for their exams.`;

    console.log('Sending prompt to Gemini:', prompt);

    // Generate response using Gemini with fallback models
    const modelNames = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.0-pro", "gemini-pro"];
    let model, result, response, text;
    let lastError;

    for (const modelName of modelNames) {
      try {
        console.log(`Trying model: ${modelName}`);
        model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent(prompt);
        response = await result.response;
        text = response.text();
        
        console.log(`Successfully used model: ${modelName}`);
        break; // Exit loop if successful
      } catch (error) {
        console.log(`Model ${modelName} failed:`, error.message);
        lastError = error;
        continue; // Try next model
      }
    }

    if (!text) {
      throw new Error(`All models failed. Last error: ${lastError?.message}`);
    }

    console.log('Gemini response received, length:', text.length);

    res.json({
      success: true,
      response: text,
      request: {
        subject,
        module: module || 'Not specified',
        topic: topic || 'Not specified',
        action,
        college: college || 'Not specified'
      }
    });

  } catch (error) {
    console.error('Error processing request:', error);
    
    // Check if it's a Gemini API error
    if (error.message.includes('API_KEY_INVALID') || error.message.includes('API key')) {
      return res.status(500).json({ 
        error: 'Invalid Gemini API key. Please check your configuration.',
        details: 'API key validation failed'
      });
    }
    
    if (error.message.includes('quota') || error.message.includes('limit')) {
      return res.status(429).json({ 
        error: 'Gemini API quota exceeded. Please try again later.',
        details: 'API rate limit reached'
      });
    }

    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'ExamPal Backend is running successfully',
    gemini: {
      configured: !!process.env.GEMINI_API_KEY,
      initialized: !!genAI
    }
  });
});

// Debug endpoint to test Gemini API
app.get('/api/test-gemini', async (req, res) => {
  try {
    if (!genAI) {
      return res.status(500).json({ 
        error: 'Gemini AI not initialized',
        details: 'Check your .env file for GEMINI_API_KEY'
      });
    }

    // Try different model names in order of preference
    const modelNames = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.0-pro", "gemini-pro"];
    let model, result, response, text;
    let lastError;

    for (const modelName of modelNames) {
      try {
        console.log(`Trying model: ${modelName}`);
        model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent("Hello! Please respond with 'Gemini API is working correctly' in exactly those words.");
        response = await result.response;
        text = response.text();
        
        console.log(`Successfully used model: ${modelName}`);
        break; // Exit loop if successful
      } catch (error) {
        console.log(`Model ${modelName} failed:`, error.message);
        lastError = error;
        continue; // Try next model
      }
    }

    if (!text) {
      throw new Error(`All models failed. Last error: ${lastError?.message}`);
    }

    res.json({
      success: true,
      response: text,
      message: 'Gemini API test successful',
      modelUsed: model?.model || 'Unknown'
    });

  } catch (error) {
    console.error('Gemini API test failed:', error);
    res.status(500).json({ 
      error: 'Gemini API test failed',
      details: error.message 
    });
  }
});

// List available models endpoint
app.get('/api/list-models', async (req, res) => {
  try {
    if (!genAI) {
      return res.status(500).json({ 
        error: 'Gemini AI not initialized',
        details: 'Check your .env file for GEMINI_API_KEY'
      });
    }

    // Try to get available models
    try {
      const models = await genAI.listModels();
      res.json({
        success: true,
        models: models,
        message: 'Models retrieved successfully'
      });
    } catch (listError) {
      // If listModels fails, try alternative approach
      console.log('listModels failed, trying alternative approach:', listError.message);
      
      // Try to get model info directly
      const testModels = ["gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro", "gemini-1.5-flash"];
      const availableModels = [];
      
      for (const modelName of testModels) {
        try {
          const testModel = genAI.getGenerativeModel({ model: modelName });
          // Just check if we can create the model object
          availableModels.push({
            name: modelName,
            status: 'Available',
            error: null
          });
        } catch (error) {
          availableModels.push({
            name: modelName,
            status: 'Not Available',
            error: error.message
          });
        }
      }
      
      res.json({
        success: true,
        models: availableModels,
        message: 'Model availability checked',
        note: 'This is a fallback check - some models might still fail during actual use'
      });
    }

  } catch (error) {
    console.error('List models failed:', error);
    res.status(500).json({ 
      error: 'Failed to list models',
      details: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ExamPal Backend running on port ${PORT}`);
  console.log(`📚 Loaded ${Object.keys(syllabus).length} subjects`);
  console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5500'}`);
  console.log(`🤖 Gemini AI: ${genAI ? '✅ Initialized' : '❌ Not initialized'}`);
  console.log(`🔑 API Key: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   GET  /api/health - Server health check`);
  console.log(`   GET  /api/list-models - List available Gemini models`);
  console.log(`   GET  /api/test-gemini - Test Gemini API`);
  console.log(`   GET  /api/syllabus - Get syllabus data`);
  console.log(`   POST /api/subject-request - Main AI endpoint`);
});

// Error handling
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
