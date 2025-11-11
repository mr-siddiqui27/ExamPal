const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  code: { type: String, trim: true, uppercase: true, maxlength: 20, index: true },
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: false, index: true },
  modules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  }],
  difficultyLevels: [{ type: String, enum: ['beginner', 'intermediate', 'advanced'] }],
  aiContextKeywords: [{ type: String, trim: true, maxlength: 60 }]
}, { timestamps: true });

SubjectSchema.index({ name: 1, college: 1 }, { unique: false });

module.exports = mongoose.model('Subject', SubjectSchema);
