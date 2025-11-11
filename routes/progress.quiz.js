const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, optionalAuth } = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const AIInteraction = require('../models/AIInteraction');

const router = express.Router();

router.post('/progress/quiz', protect, [
  body('questions').isArray({ min: 1 }),
  body('userResponses').isArray({ min: 1 }),
  body('score').isFloat({ min: 0, max: 100 }),
  body('timeTakenSeconds').isInt({ min: 0 }),
  body('context').optional().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const { questions, userResponses, score, timeTakenSeconds, context = {}, geminiConversationId } = req.body;
    const quiz = await Quiz.create({
      user: req.user._id,
      subject: context.subject,
      module: context.module,
      topic: context.topic,
      questions,
      userResponses,
      score,
      timeTakenSeconds,
      geminiConversationId,
      completedAt: new Date()
    });
    try { await AIInteraction.create({ user: req.user._id, sessionId: Date.now().toString(), queryType: 'quiz', context, response: `Quiz saved with score ${score}` }); } catch (e) {}
    res.status(201).json({ success: true, data: quiz });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to save quiz' });
  }
});

module.exports = router;
