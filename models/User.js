const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  
  email: {
    type: String,
    required: false, // optional for guest users
    unique: true,
    sparse: true, // allow multiple docs without email (guests)
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  
  password: {
    type: String,
    required: false, // optional for guest users
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  
  // Guest session flags
  isGuest: { type: Boolean, default: false },
  guestExpiresAt: { type: Date },
  
  // College preference - open input
  collegePreference: {
    type: String,
    trim: true,
    maxlength: 150
  },
  
  // Profile setup status
  profileSetup: {
    completionPercent: { type: Number, min: 0, max: 100, default: 0 },
    stepsCompleted: [{ type: String, trim: true }]
  },
  
  // Accessibility preferences
  accessibility: {
    textSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
    contrastMode: { type: String, enum: ['default', 'high-contrast'], default: 'default' },
    screenReader: { type: Boolean, default: false }
  },
  
  // AI interaction history metadata
  aiHistory: {
    totalInteractions: { type: Number, default: 0 },
    lastInteractionAt: { type: Date },
    topSubjects: [{ type: String, trim: true }]
  },
  
  // Gemini conversation context storage
  geminiContext: {
    lastConversationId: { type: String },
    conversationSummaries: [{
      conversationId: { type: String },
      summary: { type: String, maxlength: 2000 },
      updatedAt: { type: Date, default: Date.now }
    }]
  },
  
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  
  // Progress Tracking
  totalExamsTaken: {
    type: Number,
    default: 0
  },
  
  averageScore: {
    type: Number,
    default: 0
  },
  
  studyStreak: {
    type: Number,
    default: 0
  },
  
  lastStudyDate: {
    type: Date
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full profile completion percentage remains
UserSchema.virtual('profileCompletion').get(function() {
  return this.profileSetup?.completionPercent || 0;
});

// Indexes
UserSchema.index({ role: 1 });
UserSchema.index({ 'aiHistory.lastInteractionAt': -1 });
UserSchema.index({ isGuest: 1, guestExpiresAt: 1 });

// Pre-save middleware to hash password if present
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedJwtToken = function(expiresInOverride) {
  return jwt.sign(
    { id: this._id, guest: !!this.isGuest },
    process.env.JWT_SECRET,
    { expiresIn: expiresInOverride || process.env.JWT_EXPIRES_IN || '30d' }
  );
};

UserSchema.methods.updateStudyStreak = function() {
  const today = new Date();
  const lastStudy = this.lastStudyDate ? new Date(this.lastStudyDate) : null;
  if (!lastStudy) {
    this.studyStreak = 1;
  } else {
    const diffTime = Math.abs(today - lastStudy);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) this.studyStreak += 1;
    else if (diffDays > 1) this.studyStreak = 1;
  }
  this.lastStudyDate = today;
  return this.save();
};

UserSchema.statics.getLeaderboard = function(limit = 10) {
  return this.find({ isActive: true })
    .select('name collegePreference averageScore studyStreak totalExamsTaken')
    .sort({ averageScore: -1, studyStreak: -1 })
    .limit(limit);
};

module.exports = mongoose.model('User', UserSchema);
