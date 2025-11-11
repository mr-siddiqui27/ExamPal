const express = require('express');
const { body, validationResult } = require('express-validator');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Initialize Gemini AI (optional)
const hasGeminiConfig = Boolean(process.env.GEMINI_API_KEY);
let model = null;

if (hasGeminiConfig) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: parseInt(process.env.GEMINI_MAX_TOKENS) || 8000,
        temperature: parseFloat(process.env.GEMINI_TEMPERATURE) || 0.7,
      }
    });
  } catch (initError) {
    console.error('❌ Failed to initialize Gemini model:', initError.message);
    model = null;
  }
} else {
  console.warn('⚠️  GEMINI_API_KEY not set. AI responses will return a fallback message.');
}

function aiUnavailableResponse(res) {
  return res.status(503).json({
    success: false,
    error: 'AI service is not configured. Please set GEMINI_API_KEY in your environment.'
  });
}

function buildFallbackResponse(message = '') {
  const sanitized = (message || '')
    .replace(/\s+/g, ' ')
    .trim();
  const topic = sanitized.length ? sanitized.slice(0, 80) : 'your exam topic';
  const keyPoints = [];

  keyPoints.push(`Define the core concept in simple terms related to "${topic}".`);
  keyPoints.push('List 2-3 key facts, formulas, or steps students must remember.');
  keyPoints.push('Give a quick example or mnemonic that helps during revision.');

  return [
    `⚠️ Live AI response unavailable – serving ExamPal study helper for "${topic}".`,
    '',
    'Quick Revision Plan:',
    keyPoints.map((point, idx) => `${idx + 1}. ${point}`).join('\n'),
    '',
    'Study Tip:',
    '• Practice two short questions on this topic.',
    '• Revisit your notes and create a flashcard with the essentials.',
    '• If time allows, explain the idea aloud to reinforce understanding.'
  ].join('\n');
}

// Test Gemini API connection
async function testGeminiConnection() {
  if (!model) {
    return false;
  }
  try {
    const result = await model.generateContent("Hello");
    const response = await result.response;
    const text = response.text();
    console.log('✅ Gemini API connection successful');
    return true;
  } catch (error) {
    console.error('❌ Gemini API connection failed:', error.message);
    return false;
  }
}

// Test connection on startup
testGeminiConnection();

// AI Chatbot endpoint
router.post('/chat', [
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
  body('context').optional().isString().withMessage('Context must be a string'),
  body('subject').optional().isString().withMessage('Subject must be a string')
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { message, context, subject } = req.body;
    const user = req.user;

    // Build context-aware prompt
    let prompt = `You are ExamPal, an AI-powered exam preparation assistant for college students. `;
    
    if (subject) {
      prompt += `The student is studying ${subject}. `;
    }
    
    if (context) {
      prompt += `Context: ${context}. `;
    }
    
    prompt += `Please provide a helpful, educational response to: "${message}". 
    
    Guidelines:
    - Be concise but informative
    - Use examples when helpful
    - Focus on exam preparation and learning
    - If it's a question, provide a clear answer
    - If it's a concept request, explain it simply
    - Encourage active learning and practice`;

    // Generate response using Gemini with retry logic
    let aiResponse;
    let retries = 3;
    
    if (!model) {
      return aiUnavailableResponse(res);
    }

    while (retries > 0 && model) {
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        aiResponse = response.text();
        break; // Success, exit retry loop
      } catch (geminiError) {
        console.error(`Gemini API attempt ${4-retries} failed:`, geminiError.message);
        retries--;
        
        if (retries === 0) {
          throw geminiError; // Re-throw the last error
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (4-retries)));
      }
    }

    // Save chat interaction if user is authenticated
    if (user) {
      // TODO: Save to database for progress tracking
      console.log(`Chat saved for user ${user._id}`);
    }

    res.json({
      success: true,
      data: {
        message: aiResponse,
        timestamp: new Date(),
        user: user ? { id: user._id, name: user.name } : null
      }
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      status: error.status,
      stack: error.stack
    });
    
    const lowerMsg = (error.message || '').toLowerCase();

    if (lowerMsg.includes('api key')) {
      return res.status(500).json({
        success: false,
        error: 'AI service configuration error. Please verify GEMINI_API_KEY and restart the server.'
      });
    }
    
    if (lowerMsg.includes('quota') || lowerMsg.includes('limit')) {
      return res.status(429).json({
        success: false,
        error: 'AI service rate limit exceeded. Please try again later.'
      });
    }
    
    if (lowerMsg.includes('safety') || lowerMsg.includes('blocked')) {
      return res.status(400).json({
        success: false,
        error: 'Request blocked by AI safety filters. Please rephrase your question.'
      });
    }

    const fallback = buildFallbackResponse(message);
    console.warn('⚠️  Returning fallback AI response due to upstream error.');
    
    return res.json({
      success: true,
      data: {
        message: fallback,
        timestamp: new Date(),
        fallback: true
      },
      warning: error.message
    });
  }
});

// Generate practice questions endpoint
router.post('/generate-questions', [
  body('subject').trim().isLength({ min: 1, max: 100 }).withMessage('Subject is required and must be under 100 characters'),
  body('topic').trim().isLength({ min: 1, max: 200 }).withMessage('Topic is required and must be under 200 characters'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard'),
  body('count').isInt({ min: 1, max: 10 }).withMessage('Question count must be between 1 and 10')
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { subject, topic, difficulty, count } = req.body;

    const prompt = `Generate ${count} ${difficulty} level practice questions for ${subject} - ${topic}.

    Requirements:
    - Each question should be clear and focused
    - Include 4 multiple choice options (A, B, C, D)
    - Provide the correct answer
    - Include a brief explanation
    - Questions should be suitable for college-level students
    - Focus on exam preparation

    Format each question as:
    Question X: [Question text]
    A) [Option A]
    B) [Option B]
    C) [Option C]
    D) [Option D]
    Correct Answer: [Letter]
    Explanation: [Brief explanation]`;

    // Generate questions using Gemini
    if (!model) {
      return aiUnavailableResponse(res);
    }
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const questions = response.text();

    res.json({
      success: true,
      data: {
        subject,
        topic,
        difficulty,
        count,
        questions,
        generatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Question Generation Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate questions. Please try again.'
    });
  }
});

// Explain concept endpoint
router.post('/explain-concept', [
  body('concept').trim().isLength({ min: 1, max: 200 }).withMessage('Concept is required and must be under 200 characters'),
  body('subject').trim().isLength({ min: 1, max: 100 }).withMessage('Subject is required and must be under 100 characters'),
  body('level').isIn(['basic', 'intermediate', 'advanced']).withMessage('Level must be basic, intermediate, or advanced')
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { concept, subject, level } = req.body;

    const prompt = `Explain the concept "${concept}" in ${subject} at a ${level} level.

    Requirements:
    - Provide a clear, structured explanation
    - Use examples when helpful
    - Include key points and definitions
    - Make it suitable for college students
    - Focus on exam preparation
    - Keep it concise but comprehensive
    - If applicable, mention common misconceptions or exam tips

    Structure your response with:
    1. Definition/Overview
    2. Key Concepts
    3. Examples
    4. Exam Tips (if relevant)`;

    // Generate explanation using Gemini
    if (!model) {
      return aiUnavailableResponse(res);
    }
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const explanation = response.text();

    res.json({
      success: true,
      data: {
        concept,
        subject,
        level,
        explanation,
        explainedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Concept Explanation Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to explain concept. Please try again.'
    });
  }
});

module.exports = router;
