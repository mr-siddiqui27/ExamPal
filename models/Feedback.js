const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  aiInteraction: { type: mongoose.Schema.Types.ObjectId, ref: 'AIInteraction', index: true },
  sessionType: { type: String, enum: ['chatbot', 'quiz', 'explanation', 'cheat-sheet'], required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comments: { type: String, trim: true, maxlength: 2000 },
  geminiResponseQuality: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

FeedbackSchema.index({ aiInteraction: 1, createdAt: -1 });

module.exports = mongoose.model('Feedback', FeedbackSchema);
