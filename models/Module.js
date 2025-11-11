const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  number: { type: Number, required: true, min: 1, index: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
  description: { type: String, trim: true, maxlength: 2000 },
  learningObjectives: [{ type: String, trim: true, maxlength: 300 }]
}, { timestamps: true });

ModuleSchema.index({ subject: 1, number: 1 }, { unique: true });

module.exports = mongoose.model('Module', ModuleSchema);
