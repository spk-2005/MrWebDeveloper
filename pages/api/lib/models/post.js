// src/app/lib/models/post.js - Ultra-optimized version WITHOUT text search conflicts
import mongoose from 'mongoose';

// Optimized schema for maximum performance
const postSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true,
    maxlength: 20
  },
  heading: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
    index: true
  },
  code: {
    type: String,
    required: true,
    maxlength: 100000
  },
  likes: {
    type: Number,
    default: 0,
    min: 0,
    index: true
  },
  views: {
    type: Number,
    default: 0,
    min: 0,
    index: true
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: arr => arr.length <= 5,
      message: 'Maximum 5 images allowed'
    }
  },
  difficulty: {
    type: String,
    enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    default: 'BEGINNER',
    index: true
  },
  tags: {
    type: [String],
    default: [],
    index: true,
    validate: {
      validator: arr => arr.length <= 10,
      message: 'Maximum 10 tags allowed'
    }
  },
  isPublished: {
    type: Boolean,
    default: true,
    index: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 300,
    trim: true
  },
  // Pre-computed fields for performance
  popularity: {
    type: Number,
    default: 0,
    index: true
  },
  codeLength: {
    type: Number,
    default: 0
  },
  linesCount: {
    type: Number,
    default: 0
  },
  // Search-friendly fields (instead of text index)
  searchTerms: {
    type: [String],
    default: [],
    index: true
  }
}, {
  timestamps: true,
  // Performance optimizations
  strict: true,
  minimize: false,
  read: 'secondaryPreferred',
  // Optimize JSON serialization
  toJSON: {
    virtuals: false,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.codeLength;
      delete ret.linesCount;
      delete ret.searchTerms; // Don't expose search terms to frontend
      return ret;
    }
  },
  toObject: { virtuals: false }
});

// PERFORMANCE INDEXES (NO TEXT SEARCH INDEX)
// Single field indexes for common queries
postSchema.index({ language: 1 });
postSchema.index({ isPublished: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ likes: -1 });
postSchema.index({ popularity: -1 });
postSchema.index({ searchTerms: 1 }); // For manual search implementation

// Compound indexes for complex queries
postSchema.index({ isPublished: 1, language: 1, createdAt: -1 });
postSchema.index({ isPublished: 1, popularity: -1 });
postSchema.index({ isPublished: 1, likes: -1 });
postSchema.index({ language: 1, heading: 1 }, { unique: true });
postSchema.index({ isPublished: 1, searchTerms: 1, popularity: -1 }); // For search queries

// PRE-SAVE MIDDLEWARE for performance optimization
postSchema.pre('save', function(next) {
  try {
    // Generate optimized slug
    if (!this.slug && this.heading && this.language) {
      const timestamp = Date.now().toString().slice(-6); // Last 6 digits for uniqueness
      this.slug = `${this.language.toLowerCase()}-${this.heading}`
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 90) + `-${timestamp}`; // Ensure uniqueness
    }
    
    // Normalize language
    if (this.language) {
      this.language = this.language.toUpperCase();
    }
    
    // Pre-compute metrics for faster queries
    if (this.code) {
      this.codeLength = this.code.length;
      this.linesCount = this.code.split('\n').length;
    }
    
    // Calculate popularity score
    this.popularity = (this.likes || 0) + Math.floor((this.views || 0) / 10);
    
    // Auto-generate description if missing
    if (!this.description && this.heading && this.language) {
      this.description = `Learn ${this.heading} in ${this.language} with practical examples.`;
    }
    
    // Generate search terms for manual search (instead of text index)
    this.searchTerms = [
      ...this.heading.toLowerCase().split(/\s+/),
      this.language.toLowerCase(),
      ...(this.description ? this.description.toLowerCase().split(/\s+/) : []),
      ...(this.tags || []).map(tag => tag.toLowerCase()),
      this.difficulty.toLowerCase()
    ].filter(term => term.length > 2); // Remove short terms
    
    next();
  } catch (error) {
    next(error);
  }
});

// ULTRA-OPTIMIZED STATIC METHODS
postSchema.statics.findAllOptimized = function(options = {}) {
  const {
    limit = 1000,
    language,
    popular = false,
    recent = false,
    fields = 'language heading code likes views images difficulty tags slug description createdAt updatedAt popularity'
  } = options;
  
  const query = { isPublished: true };
  if (language) query.language = language.toUpperCase();
  
  let sort = { createdAt: -1 };
  if (popular) sort = { popularity: -1, createdAt: -1 };
  if (recent) sort = { createdAt: -1 };
  
  return this.find(query)
    .select(fields)
    .sort(sort)
    .limit(limit)
    .lean({ virtuals: false })
    .hint(language ? { isPublished: 1, language: 1, createdAt: -1 } : { isPublished: 1, createdAt: -1 });
};

postSchema.statics.findByLanguageOptimized = function(language, options = {}) {
  const { limit = 100, sort = { createdAt: -1 } } = options;
  
  return this.find({
    language: language.toUpperCase(),
    isPublished: true
  })
  .select('language heading code likes views images difficulty tags slug description createdAt updatedAt')
  .sort(sort)
  .limit(limit)
  .lean({ virtuals: false })
  .hint({ isPublished: 1, language: 1, createdAt: -1 });
};

postSchema.statics.findPopularOptimized = function(limit = 50) {
  return this.find({ isPublished: true })
    .select('language heading code likes views images difficulty tags slug description createdAt updatedAt popularity')
    .sort({ popularity: -1, createdAt: -1 })
    .limit(limit)
    .lean({ virtuals: false })
    .hint({ isPublished: 1, popularity: -1 });
};

// FIXED SEARCH METHOD - Uses searchTerms instead of text index
postSchema.statics.searchOptimized = function(query, options = {}) {
  const { limit = 20, language } = options;
  
  // Split search query into terms
  const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 2);
  
  const searchQuery = {
    isPublished: true,
    $or: [
      // Direct regex searches for immediate terms
      { heading: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } },
      // Search in pre-computed search terms
      { searchTerms: { $in: searchTerms } }
    ]
  };
  
  if (language) searchQuery.language = language.toUpperCase();
  
  return this.find(searchQuery)
    .select('language heading code likes views images difficulty tags slug description createdAt updatedAt')
    .sort({ popularity: -1, createdAt: -1 })
    .limit(limit)
    .lean({ virtuals: false })
    .hint({ isPublished: 1, searchTerms: 1, popularity: -1 });
};

// ADVANCED SEARCH with multiple criteria
postSchema.statics.advancedSearch = function(criteria) {
  const {
    query,
    language,
    difficulty,
    tags,
    minLikes = 0,
    limit = 20,
    sortBy = 'popularity' // 'popularity', 'recent', 'likes', 'views'
  } = criteria;
  
  const searchQuery = { isPublished: true };
  
  // Text search
  if (query) {
    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 2);
    searchQuery.$or = [
      { heading: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { searchTerms: { $in: searchTerms } }
    ];
  }
  
  // Filter criteria
  if (language) searchQuery.language = language.toUpperCase();
  if (difficulty) searchQuery.difficulty = difficulty.toUpperCase();
  if (tags && tags.length > 0) searchQuery.tags = { $in: tags };
  if (minLikes > 0) searchQuery.likes = { $gte: minLikes };
  
  // Sort options
  const sortOptions = {
    popularity: { popularity: -1, createdAt: -1 },
    recent: { createdAt: -1 },
    likes: { likes: -1, createdAt: -1 },
    views: { views: -1, createdAt: -1 }
  };
  
  return this.find(searchQuery)
    .select('language heading code likes views images difficulty tags slug description createdAt updatedAt popularity')
    .sort(sortOptions[sortBy] || sortOptions.popularity)
    .limit(limit)
    .lean({ virtuals: false });
};

postSchema.statics.getStatsOptimized = function() {
  return this.aggregate([
    { $match: { isPublished: true } },
    {
      $group: {
        _id: null,
        totalPosts: { $sum: 1 },
        totalLikes: { $sum: '$likes' },
        totalViews: { $sum: '$views' },
        avgLikes: { $avg: '$likes' },
        avgViews: { $avg: '$views' },
        languages: { $addToSet: '$language' },
        difficulties: { $addToSet: '$difficulty' }
      }
    },
    {
      $project: {
        _id: 0,
        totalPosts: 1,
        totalLikes: 1,
        totalViews: 1,
        avgLikes: { $round: ['$avgLikes', 0] },
        avgViews: { $round: ['$avgViews', 0] },
        languageCount: { $size: '$languages' },
        languages: 1,
        difficulties: 1
      }
    }
  ]);
};

// OPTIMIZED INSTANCE METHODS
postSchema.methods.incrementViewsOptimized = function() {
  const newViews = (this.views || 0) + 1;
  const newPopularity = (this.likes || 0) + Math.floor(newViews / 10);
  
  return this.constructor.updateOne(
    { _id: this._id },
    { 
      $set: { 
        views: newViews,
        popularity: newPopularity
      }
    }
  );
};

postSchema.methods.updateLikesOptimized = function(increment = true) {
  const change = increment ? 1 : -1;
  const newLikes = Math.max((this.likes || 0) + change, 0);
  const newPopularity = newLikes + Math.floor((this.views || 0) / 10);
  
  return this.constructor.updateOne(
    { _id: this._id },
    { 
      $set: { 
        likes: newLikes,
        popularity: newPopularity
      }
    }
  );
};

// AGGREGATION PIPELINES for complex queries
postSchema.statics.getLanguageStatsOptimized = function() {
  return this.aggregate([
    { $match: { isPublished: true } },
    {
      $group: {
        _id: '$language',
        count: { $sum: 1 },
        totalLikes: { $sum: '$likes' },
        totalViews: { $sum: '$views' },
        avgLikes: { $avg: '$likes' },
        difficulties: { $addToSet: '$difficulty' },
        latestPost: { $max: '$createdAt' }
      }
    },
    {
      $project: {
        _id: 0,
        language: '$_id',
        count: 1,
        totalLikes: 1,
        totalViews: 1,
        avgLikes: { $round: ['$avgLikes', 1] },
        difficulties: 1,
        latestPost: 1
      }
    },
    { $sort: { count: -1 } }
  ]);
};

postSchema.statics.getTrendingPostsOptimized = function(limit = 20) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  return this.aggregate([
    {
      $match: {
        isPublished: true,
        createdAt: { $gte: weekAgo }
      }
    },
    {
      $addFields: {
        trendScore: {
          $add: [
            { $multiply: ['$likes', 2] },
            { $divide: ['$views', 5] },
            { $multiply: [{ $divide: [{ $subtract: [new Date(), '$createdAt'] }, 86400000] }, -1] }
          ]
        }
      }
    },
    { $sort: { trendScore: -1 } },
    { $limit: limit },
    {
      $project: {
        language: 1,
        heading: 1,
        code: 1,
        likes: 1,
        views: 1,
        images: 1,
        difficulty: 1,
        tags: 1,
        slug: 1,
        description: 1,
        createdAt: 1,
        updatedAt: 1,
        trendScore: 1
      }
    }
  ]);
};

// BULK OPERATIONS for performance
postSchema.statics.bulkUpdateViews = function(updates) {
  const bulkOps = updates.map(({ id, views }) => ({
    updateOne: {
      filter: { _id: id },
      update: {
        $set: { 
          views,
          popularity: (this.likes || 0) + Math.floor(views / 10)
        }
      }
    }
  }));
  
  return this.bulkWrite(bulkOps, { ordered: false });
};

// CONNECTION OPTIMIZATIONS
postSchema.post('init', function() {
  // Ensure indexes in development
  if (process.env.NODE_ENV === 'development') {
    this.constructor.ensureIndexes()
      .then(() => console.log('✅ Post indexes ensured'))
      .catch(err => console.error('❌ Index error:', err.message));
  }
});

// Index monitoring
postSchema.on('index', function(error) {
  if (error) {
    console.error('❌ Index creation error:', error.message);
  } else {
    console.log('✅ Post indexes created successfully');
  }
});

// Export with connection caching
const Post = mongoose.models.Post || mongoose.model('code_posts', postSchema);

// Performance monitoring method
Post.getPerformanceMetrics = async function() {
  try {
    const stats = await this.collection.stats();
    const indexes = await this.collection.getIndexes();
    
    return {
      documentCount: stats.count,
      avgObjectSize: Math.round(stats.avgObjSize || 0),
      storageSize: Math.round((stats.storageSize || 0) / 1024 / 1024), // MB
      indexCount: Object.keys(indexes).length,
      indexes: Object.keys(indexes),
      totalIndexSize: Math.round((stats.totalIndexSize || 0) / 1024 / 1024) // MB
    };
  } catch (error) {
    console.error('Performance metrics error:', error.message);
    return null;
  }
};

export default Post;  