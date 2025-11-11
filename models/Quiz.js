const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  questions: [{
    question: { type: String, required: true },
    type: { type: String, enum: ['MCQ', 'Descriptive'], default: 'MCQ' },
    options: [{ type: String }],
    correctAnswer: { type: String },
    explanation: { type: String },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    aiMetadata: {
      model: { type: String },
      prompt: { type: String },
      tokensUsed: { type: Number }
    }
  }],
  userResponses: [{
    questionIndex: { type: Number, required: true },
    answer: { type: String },
    isCorrect: { type: Boolean }
  }],
  score: { type: Number, min: 0, max: 100, default: 0 },
  timeTakenSeconds: { type: Number, min: 0, default: 0 },
  geminiConversationId: { type: String, index: true },
  retryAttempts: { type: Number, min: 0, default: 0 },
  completedAt: { type: Date }
}, { timestamps: true });

QuizSchema.index({ user: 1, completedAt: -1 });

module.exports = mongoose.model('Quiz', QuizSchema);
