const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const Feedback = require('../models/Feedback');

const router = express.Router();

router.post('/feedback', protect, [
  body('aiInteraction').optional().isMongoId(),
  body('sessionType').isIn(['chatbot', 'quiz', 'explanation', 'cheat-sheet']),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comments').optional().isString().isLength({ max: 2000 }),
  body('geminiResponseQuality').optional().isInt({ min: 1, max: 5 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const feedback = await Feedback.create({ user: req.user._id, ...req.body });
    res.status(201).json({ success: true, data: feedback });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to submit feedback' });
  }
});

module.exports = router;
