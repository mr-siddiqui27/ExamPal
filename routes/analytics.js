const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const AIInteraction = require('../models/AIInteraction');

const router = express.Router();

// GET /api/analytics/ai-usage - admin or self (returns aggregated usage)
router.get('/analytics/ai-usage', protect, async (req, res) => {
  try {
    const userFilter = req.user.role === 'admin' && req.query.user ? { user: req.query.user } : { user: req.user._id };

    // Aggregate by queryType
    const byType = await AIInteraction.aggregate([
      { $match: userFilter },
      { $group: { _id: '$queryType', count: { $sum: 1 }, tokens: { $sum: '$tokenUsage.totalTokens' } } },
      { $project: { type: '$_id', _id: 0, count: 1, tokens: 1 } }
    ]);

    const total = await AIInteraction.countDocuments(userFilter);
    const tokensTotal = await AIInteraction.aggregate([
      { $match: userFilter },
      { $group: { _id: null, tokens: { $sum: '$tokenUsage.totalTokens' } } }
    ]);

    // naive cost estimation (example): $0.000002 per token
    const tokenSum = tokensTotal[0]?.tokens || 0;
    const estimatedCost = Number((tokenSum * 0.000002).toFixed(6));

    res.json({ success: true, data: { totalInteractions: total, byType, tokenSum, estimatedCost } });
  } catch (err) {
    console.error('AI usage analytics error:', err);
    res.status(500).json({ success: false, error: 'Failed to compute analytics' });
  }
});

module.exports = router;
