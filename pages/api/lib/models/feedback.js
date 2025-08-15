import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    trim: true,
    default: 'Anonymous'
  },
  comment: {
    type: String,
    required: false,
    trim: true
  },
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  section: {
    type: String,
    trim: true
  },
  item: {
    type: String,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'feedbacks'
});

// Add indexes for better query performance
feedbackSchema.index({ postId: 1 });
feedbackSchema.index({ stars: 1 });
feedbackSchema.index({ createdAt: -1 });

// Prevent re-compilation during development
const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

export default Feedback;