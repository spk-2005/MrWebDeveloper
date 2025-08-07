const mongoose = require('mongoose');

// Define the schema first
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  code: {
    type: String,
    required: [true, 'Code content is required']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  language: {
    type: String,
    required: [true, 'Programming language is required'],
    enum: ['HTML', 'CSS', 'JavaScript', 'Python', 'Java', 'C++', 'React', 'Vue', 'Angular', 'Node.js', 'PHP', 'Ruby', 'Go', 'Rust', 'TypeScript', 'Swift', 'Kotlin', 'C#'],
    index: true
  },
  category: {
    type: String,
    default: 'General'
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: String,
    default: 'Anonymous'
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  isPublished: {
    type: Boolean,
    default: true,
    index: true
  },
  searchTerms: {
    type: String,
    index: true
  },
  images: [{
    type: String
  }],
  estimatedReadTime: {
    type: Number,
    min: 1
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'code_posts'
});

// Create compound indexes
postSchema.index({ language: 1, isPublished: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ likes: -1 });
postSchema.index({ views: -1 });

// Pre-save middleware to generate search terms
postSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isModified('description') || this.isModified('tags')) {
    const searchableFields = [
      this.title,
      this.description,
      ...this.tags
    ].filter(Boolean);
    
    this.searchTerms = searchableFields.join(' ').toLowerCase();
  }
  
  // Calculate estimated read time if code is modified
  if (this.isModified('code')) {
    const wordsPerMinute = 200;
    const words = this.code.split(/\s+/).length;
    this.estimatedReadTime = Math.max(1, Math.ceil(words / wordsPerMinute));
  }
  
  next();
});

// Instance methods
postSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

postSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

postSchema.methods.decrementLikes = function() {
  if (this.likes > 0) {
    this.likes -= 1;
  }
  return this.save();
};

// Static methods
postSchema.statics.findByLanguage = function(language, options = {}) {
  const query = { language, isPublished: true };
  return this.find(query, null, options).sort({ createdAt: -1 });
};

postSchema.statics.searchPosts = function(searchTerm, options = {}) {
  const regex = new RegExp(searchTerm, 'i');
  const query = {
    isPublished: true,
    $or: [
      { title: regex },
      { description: regex },
      { searchTerms: regex },
      { tags: { $in: [regex] } }
    ]
  };
  return this.find(query, null, options).sort({ createdAt: -1 });
};

postSchema.statics.getPopular = function(limit = 10) {
  return this.find({ isPublished: true })
    .sort({ likes: -1, views: -1 })
    .limit(limit);
};

postSchema.statics.getRecent = function(limit = 10) {
  return this.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Performance monitoring method
postSchema.statics.getPerformanceMetrics = async function() {
  try {
    const [totalPosts, publishedPosts, languageStats] = await Promise.all([
      this.countDocuments(),
      this.countDocuments({ isPublished: true }),
      this.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: '$language', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    return {
      totalPosts,
      publishedPosts,
      languageDistribution: languageStats,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error getting performance metrics:', error);
    throw error;
  }
};

// FIXED: Proper model export with duplicate prevention
let Post;

try {
  // Try to get the existing model first
  Post = mongoose.model('code_posts');
} catch (error) {
  // If model doesn't exist, create it
  Post = mongoose.model('code_posts', postSchema);
}

module.exports = Post;