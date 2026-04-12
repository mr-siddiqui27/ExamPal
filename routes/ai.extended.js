const path = require('path');
// Ensure env is loaded (in case server was started with different cwd)
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const config = require('../config');
const apiKey = process.env.GEMINI_API_KEY || config.GEMINI_API_KEY;
const hasGeminiConfig = Boolean(apiKey && apiKey !== 'your_gemini_api_key_here');

const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, query, validationResult } = require('express-validator');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { optionalAuth } = require('../middleware/auth');
const AIInteraction = require('../models/AIInteraction');
const multer = require('multer');

const router = express.Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false
});

const modelId = process.env.GEMINI_MODEL || config.GEMINI_MODEL || 'gemini-2.5-flash';
const genAI = hasGeminiConfig ? new GoogleGenerativeAI(apiKey) : null;
if (!hasGeminiConfig) {
  console.warn('⚠️  GEMINI_API_KEY not set. AI extended endpoints will return fallback responses.');
}

const upload = multer({
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 }
});

function vres(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
}

async function callGemini(prompt, opts = {}) {
  if (!genAI) {
    return '[AI unavailable] Configure GEMINI_API_KEY to enable AI generated responses.';
  }
  const fallbacks = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite'];
  const modelIds = [modelId, ...fallbacks].filter((id, i, a) => a.indexOf(id) === i);
  for (const mid of modelIds) {
    try {
      const model = genAI.getGenerativeModel({ model: mid, generationConfig: {
        maxOutputTokens: parseInt(process.env.GEMINI_MAX_TOKENS) || 8000,
        temperature: parseFloat(process.env.GEMINI_TEMPERATURE) || 0.7
      }});
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text || '';
    } catch (err) {
      console.error(`Gemini (${mid}) error:`, err.message);
      if (mid === modelIds[modelIds.length - 1]) {
        console.error('Gemini API connection failed. Check GEMINI_API_KEY and model availability.');
        return '[AI unavailable] Gemini API connection failed. Please check your API key and try again.';
      }
    }
  }
  return '[AI unavailable] Could not reach Gemini API.';
}

// POST /api/ai/explain
router.post('/explain', limiter, optionalAuth, [
  body('concept').trim().isLength({ min: 2 }),
  body('subject').optional().trim(),
  body('college').optional().trim(),
  body('level').optional().isIn(['basic', 'intermediate', 'advanced'])
], async (req, res) => {
  const rv = vres(req, res); if (rv) return rv;
  const { concept, subject, college, level = 'intermediate' } = req.body;
  const prompt = `Explain ${concept} ${subject ? 'in ' + subject : ''} for ${college || 'college'} students at ${level} level. Include definition, key points, examples, misconceptions, related concepts, and study tips.`;
  const text = await callGemini(prompt);
  try { await AIInteraction.create({ user: req.user?._id, sessionId: Date.now().toString(), queryType: 'explain', context: { college, subject }, prompt, response: text }); } catch (e) {}
  res.json({ success: true, data: { explanation: text } });
});

// POST /api/ai/quiz
router.post('/quiz', limiter, optionalAuth, [
  body('subject').trim().isLength({ min: 2 }),
  body('topic').optional().trim(),
  body('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']).default('intermediate'),
  body('count').optional().isInt({ min: 1, max: 10 }).toInt()
], async (req, res) => {
  const rv = vres(req, res); if (rv) return rv;
  const { subject, topic, difficulty = 'intermediate', count = 5 } = req.body;
  const prompt = `Generate ${count} ${difficulty} MCQ questions in ${subject}${topic ? ' on ' + topic : ''}.
Each item: Question, Options A-D, Correct Answer, Explanation. Return as plain text list.`;
  const text = await callGemini(prompt);
  if (typeof text === 'string' && text.startsWith('[AI unavailable]')) {
    return res.status(503).json({ success: false, error: text.replace(/^\[AI unavailable\]\s*/, '').trim() });
  }
  try { await AIInteraction.create({ user: req.user?._id, sessionId: Date.now().toString(), queryType: 'quiz', context: { subject }, prompt, response: text }); } catch (e) {}
  res.json({ success: true, data: { questions: text } });
});

// POST /api/ai/cheat-sheet
router.post('/cheat-sheet', limiter, optionalAuth, [
  body('topic').trim().isLength({ min: 2 }),
  body('subject').optional().trim()
], async (req, res) => {
  const rv = vres(req, res); if (rv) return rv;
  const { topic, subject } = req.body;
  const prompt = `Create a concise cheat-sheet for ${topic}${subject ? ' in ' + subject : ''}. Include key formulas/definitions, common pitfalls, quick tips.`;
  const text = await callGemini(prompt);
  try { await AIInteraction.create({ user: req.user?._id, sessionId: Date.now().toString(), queryType: 'cheat-sheet', context: { subject }, prompt, response: text }); } catch (e) {}
  res.json({ success: true, data: { cheatSheet: text } });
});

// POST /api/ai/pyq
router.post('/pyq', limiter, optionalAuth, [
  body('subject').trim().isLength({ min: 2 }),
  body('topic').optional().trim()
], async (req, res) => {
  const rv = vres(req, res); if (rv) return rv;
  const { subject, topic } = req.body;
  const prompt = `Generate a set of previous-year-style questions for ${subject}${topic ? ' on ' + topic : ''} with detailed solutions. Include exam tips.`;
  const text = await callGemini(prompt);
  try { await AIInteraction.create({ user: req.user?._id, sessionId: Date.now().toString(), queryType: 'quiz', context: { subject, topic }, prompt, response: text }); } catch (e) {}
  res.json({ success: true, data: { pyq: text } });
});

// POST /api/ai/summarize (text input)
router.post('/summarize', limiter, optionalAuth, [
  body('content').trim().isLength({ min: 30 }),
  body('style').optional().isIn(['bullet', 'short', 'detailed'])
], async (req, res) => {
  const rv = vres(req, res); if (rv) return rv;
  const { content, style = 'bullet' } = req.body;
  const prompt = `Summarize the following content in ${style} style suitable for exam revision:\n${content}`;
  const text = await callGemini(prompt);
  try { await AIInteraction.create({ user: req.user?._id, sessionId: Date.now().toString(), queryType: 'explain', context: {}, prompt, response: text }); } catch (e) {}
  res.json({ success: true, data: { summary: text } });
});

// POST /api/ai/summarize-file - summarize uploaded text/pdf (basic text-only parsing)
router.post('/summarize-file', limiter, optionalAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
    const text = req.file.buffer.toString('utf-8'); // basic case for .txt
    if (!text || text.length < 30) return res.status(400).json({ success: false, error: 'File content too short or unsupported format' });

    const prompt = `Summarize the following content into bullet points suitable for exam revision:\n${text.substring(0, 8000)}`;
    const summary = await callGemini(prompt);
    try { await AIInteraction.create({ user: req.user?._id, sessionId: Date.now().toString(), queryType: 'explain', context: {}, prompt, response: summary }); } catch (e) {}
    res.json({ success: true, data: { summary } });
  } catch (err) {
    console.error('Summarize file error:', err);
    res.status(500).json({ success: false, error: 'Failed to summarize file' });
  }
});

// GET /api/ai/suggestions
router.get('/suggestions', limiter, optionalAuth, [
  query('subject').optional().trim(),
  query('topic').optional().trim()
], async (req, res) => {
  try {
    const rv = vres(req, res); if (rv) return rv;
    const { subject, topic } = req.query;
    const prompt = `Suggest 5 next study queries${subject ? ' for subject ' + subject : ''}${topic ? ' focused on ' + topic : ''}. Keep them concise and actionable.`;
    const text = await callGemini(prompt);
    res.json({ success: true, data: { suggestions: text } });
  } catch (err) {
    console.error('Suggestions error:', err);
    // Return default suggestions if AI fails
    const defaults = [
      'Explain more about this topic',
      'Give me practice questions',
      'Create a summary',
      'What are key concepts?',
      'Provide examples'
    ];
    res.json({ success: true, data: { suggestions: defaults.join('\n') } });
  }
});

module.exports = router;
