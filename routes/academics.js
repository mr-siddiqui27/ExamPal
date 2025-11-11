const express = require('express');
const { param, query, validationResult } = require('express-validator');
const College = require('../models/College');
const Subject = require('../models/Subject');
const Module = require('../models/Module');
const Topic = require('../models/Topic');

const router = express.Router();

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
}

// GET /api/colleges - return only BBD University and AKTU with AI context
router.get('/colleges', async (req, res) => {
  try {
    const colleges = await College.find({ name: { $in: ['BBD University', 'AKTU'] } })
      .select('name code location availableSubjects geminiPromptTemplates');
    res.json({ success: true, data: colleges });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch colleges' });
  }
});

// GET /api/subjects/:collegeId
router.get('/subjects/:collegeId', [param('collegeId').isMongoId()], async (req, res) => {
  const v = handleValidation(req, res); if (v) return v;
  try {
    const subjects = await Subject.find({ college: req.params.collegeId })
      .select('name code difficultyLevels aiContextKeywords')
      .populate({ path: 'college', select: 'name geminiPromptTemplates' });
    res.json({ success: true, data: subjects });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch subjects' });
  }
});

// GET /api/modules/:subjectId
router.get('/modules/:subjectId', [param('subjectId').isMongoId()], async (req, res) => {
  const v = handleValidation(req, res); if (v) return v;
  try {
    const modules = await Module.find({ subject: req.params.subjectId })
      .select('name number description learningObjectives');
    res.json({ success: true, data: modules });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch modules' });
  }
});

// GET /api/topics/:moduleId
router.get('/topics/:moduleId', [param('moduleId').isMongoId()], async (req, res) => {
  const v = handleValidation(req, res); if (v) return v;
  try {
    const topics = await Topic.find({ module: req.params.moduleId })
      .select('name description keywords difficulty geminiPromptTemplates');
    res.json({ success: true, data: topics });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch topics' });
  }
});

// GET /api/search/suggestions?q=
router.get('/search/suggestions', [query('q').trim().isLength({ min: 1 })], async (req, res) => {
  const v = handleValidation(req, res); if (v) return v;
  try {
    const q = req.query.q;
    const regex = new RegExp(q, 'i');
    const [subjects, topics] = await Promise.all([
      Subject.find({ name: regex }).select('name code').limit(5),
      Topic.find({ name: regex }).select('name').limit(5)
    ]);
    const suggestions = [
      ...subjects.map(s => ({ type: 'subject', id: s._id, name: s.name, code: s.code })),
      ...topics.map(t => ({ type: 'topic', id: t._id, name: t.name }))
    ];
    res.json({ success: true, data: suggestions });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch suggestions' });
  }
});

module.exports = router;
