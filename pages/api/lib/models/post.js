// src/app/lib/models/post.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    index: true, // Single field index for language queries
    trim: true,
    uppercase: true // Normalize to uppercase for consistency
  },
  heading: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200 // Prevent extremely long headings
  },
  code: {
    type: String,
    required: true,
    maxlength: 50000 // Reasonable limit for code snippets
  },
  likes: {
    type: Number,
    default: 0,
    min: 0, // Prevent negative likes
    index: true // Index for sorting by popularity
  },
  images: {
    type: [String], // Base64 strings or URLs
    default: [],
    validate: {
      validator: function(arr) {
        return arr.length <= 10; // Limit number of images
      },
      message: 'Maximum 10 images allowed per post'
    }
  },
  // Additional fields for better functionality
  views: {
    type: Number,
    default: 0,
    min: 0
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
    index: true // For tag-based searches
  },
  isPublished: {
    type: Boolean,
    default: true,
    index: true // For filtering published content
  },
  // SEO and search optimization
  slug: {
    type: String,
    unique: true,
    sparse: true // Allow null values but ensure uniqueness when present
  },
  description: {
    type: String,
    maxlength: 500,
    trim: true
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  // Optimize for read performance
  read: 'secondaryPreferred',
  // Enable strict mode
  strict: true,
  // Optimize JSON output
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true
  }
});

// COMPOUND INDEXES for better query performance
// Most important - queries by language sorted by date
postSchema.index({ language: 1, createdAt: -1 });

// For popular posts by language
postSchema.index({ language: 1, likes: -1 });

// For finding specific posts
postSchema.index({ language: 1, heading: 1 }, { unique: true });

// For published content queries
postSchema.index({ isPublished: 1, createdAt: -1 });

// For search functionality
postSchema.index({ 
  language: 'text', 
  heading: 'text', 
  description: 'text',
  tags: 'text'
}, {
  weights: {
    heading: 10,
    description: 5,
    language: 3,
    tags: 2
  },
  name: 'post_search_index'
});

// VIRTUAL PROPERTIES
postSchema.virtual('readingTime').get(function() {
  if (!this.code) return '1-2 mins';
  
  const codeLength = this.code.length;
  const linesOfCode = this.code.split('\n').length;
  
  // Estimate reading time based on code complexity
  const minutes = Math.ceil((codeLength / 300) + (linesOfCode / 15));
  
  if (minutes <= 1) return '1-2 mins';
  if (minutes <= 3) return '2-3 mins';
  if (minutes <= 5) return '3-5 mins';
  if (minutes <= 10) return '5-10 mins';
  return `${minutes} mins`;
});

postSchema.virtual('title').get(function() {
  return `${this.heading} - ${this.language} Tutorial`;
});

postSchema.virtual('summary').get(function() {
  if (this.description) return this.description;
  return `Learn ${this.heading} in ${this.language} with practical examples and detailed explanations.`;
});

// PRE-SAVE MIDDLEWARE for data optimization
postSchema.pre('save', function(next) {
  // Generate slug if not provided
  if (!this.slug && this.heading) {
    this.slug = `${this.language.toLowerCase()}-${this.heading}`
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .toLowerCase();
  }
  
  // Normalize language
  if (this.language) {
    this.language = this.language.toUpperCase();
  }
  
  // Auto-generate description if not provided
  if (!this.description && this.heading && this.language) {
    this.description = `Learn ${this.heading} in ${this.language}. ` +
                      `Complete tutorial with code examples and practical exercises.`;
  }
  
  next();
});

// STATIC METHODS for optimized queries
postSchema.statics.findByLanguage = function(language, options = {}) {
  const { limit = 50, sort = { createdAt: -1 }, includeUnpublished = false } = options;
  
  const query = { 
    language: language.toUpperCase(),
    ...(includeUnpublished ? {} : { isPublished: true })
  };
  
  return this.find(query)
    .select('language heading code likes images createdAt updatedAt views difficulty tags slug description')
    .sort(sort)
    .limit(limit)
    .lean(); // Return plain objects for better performance
};

postSchema.statics.findPopular = function(limit = 20) {
  return this.find({ isPublished: true })
    .select('language heading code likes images createdAt views difficulty tags slug description')
    .sort({ likes: -1, views: -1, createdAt: -1 })
    .limit(limit)
    .lean();
};

postSchema.statics.findRecent = function(limit = 50) {
  return this.find({ isPublished: true })
    .select('language heading code likes images createdAt views difficulty tags slug description')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

postSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug, isPublished: true }).lean();
};

postSchema.statics.searchPosts = function(query, options = {}) {
  const { limit = 20, language } = options;
  
  const searchQuery = {
    $text: { $search: query },
    isPublished: true,
    ...(language ? { language: language.toUpperCase() } : {})
  };
  
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .select('language heading code likes images createdAt views difficulty tags slug description')
    .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
    .limit(limit)
    .lean();
};

// INSTANCE METHODS
postSchema.methods.incrementViews = function() {
  this.views = (this.views || 0) + 1;
  return this.save();
};

postSchema.methods.incrementLikes = function() {
  this.likes = (this.likes || 0) + 1;
  return this.save();
};

postSchema.methods.decrementLikes = function() {
  this.likes = Math.max((this.likes || 0) - 1, 0);
  return this.save();
};

// INDEX EVENT HANDLERS
postSchema.on('index', function(error) {
  if (error) {
    console.error('❌ Index creation error:', error);
  } else {
    console.log('✅ Post indexes created successfully');
  }
});

// Ensure indexes are built in development
if (process.env.NODE_ENV === 'development') {
  postSchema.post('init', function() {
    this.constructor.ensureIndexes();
  });
}

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;  