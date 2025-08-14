// pages/api/lib/models/post.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    trim: true
  },
  heading: {
    type: String,
    required: true,
    trim: true
  },
  subheading: {
    type: String,
    trim: true
  },
  code: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  collection: 'code_posts' // Explicitly set collection name
});

// Add indexes for better performance
postSchema.index({ language: 1, isPublished: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ tags: 1 });

// Prevent re-compilation during development
const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;