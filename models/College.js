const mongoose = require('mongoose');

const CollegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  code: {
    type: String,
    trim: true,
    uppercase: true,
    maxlength: 20,
    index: true
  },
  location: {
    type: String,
    trim: true,
    maxlength: 150
  },
  availableSubjects: [{
    type: String,
    trim: true,
    maxlength: 120
  }],
  geminiPromptTemplates: {
    chat: { type: String, default: '' },
    quiz: { type: String, default: '' },
    explain: { type: String, default: '' },
    cheatSheet: { type: String, default: '' }
  }
}, {
  timestamps: true
});

CollegeSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('College', CollegeSchema);
