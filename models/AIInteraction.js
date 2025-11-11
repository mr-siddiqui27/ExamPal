const mongoose = require('mongoose');

const AIInteractionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  sessionId: { type: String, required: true, index: true },
  conversationId: { type: String },
  queryType: { type: String, enum: ['chat', 'explain', 'quiz', 'cheat-sheet'], required: true, index: true },
  context: {
    college: { type: String, trim: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }
  },
  prompt: { type: String },
  response: { type: String },
  responseQuality: {
    rating: { type: Number, min: 1, max: 5 },
    comments: { type: String, trim: true, maxlength: 1000 }
  },
  tokenUsage: {
    promptTokens: { type: Number, default: 0 },
    completionTokens: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 0 }
  }
}, { timestamps: true });

AIInteractionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('AIInteraction', AIInteractionSchema);
