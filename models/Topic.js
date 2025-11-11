const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, trim: true, maxlength: 3000 },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true, index: true },
  keywords: [{ type: String, trim: true, maxlength: 60 }],
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner', index: true },
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
  geminiPromptTemplates: {
    explain: { type: String, default: '' },
    quiz: { type: String, default: '' },
    cheatSheet: { type: String, default: '' }
  }
}, { timestamps: true });

TopicSchema.index({ name: 1, module: 1 }, { unique: true });

module.exports = mongoose.model('Topic', TopicSchema);
