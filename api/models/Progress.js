import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  completedTopics: { type: [String], default: [] },
  masteryScore: { type: Number, default: 0 },
  mistakeLog: [{
    questionId: String,
    timestamp: { type: Date, default: Date.now },
    userAnswer: mongoose.Schema.Types.Mixed,
    correctAnswer: mongoose.Schema.Types.Mixed
  }],
  preparedModeUnlocked: { type: Boolean, default: false },
  streakDays: { type: Number, default: 0 },
  lastActiveDate: { type: String, default: null }, // YYYY-MM-DD
  xp: { type: Number, default: 0 },
  // Matches the client format: { "YYYY-MM-DD": <topics-completed-count> }
  dailyActivity: {
    type: Map,
    of: Number,
    default: {}
  },
  quizHistory: [{
    topicId: String,
    score: Number,
    total: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  reviews: {
    type: Map,
    of: {
      nextReviewTime: Date,
      interval: Number,
      easeFactor: Number,
      history: [mongoose.Schema.Types.Mixed]
    },
    default: {}
  },
  studyPlan: { type: String, default: null },
  planStartDate: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);
