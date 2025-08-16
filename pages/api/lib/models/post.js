// pages/api/lib/models/post.js - Optimized for speed and AdSense approval
import mongoose from 'mongoose';

// Enhanced schema with performance optimizations
const postSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    index: true // Individual index for faster queries
  },
  heading: {
    type: String,
    required: true,
    trim: true,
    index: true // Individual index for faster queries
  },
  slug: {
    type: String,
    unique: true,
    index: true,
    sparse: true // For faster URL-based lookups
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
  // SEO fields for AdSense approval
  metaDescription: {
    type: String,
    maxlength: 160,
    trim: true
  },
  metaKeywords: [{
    type: String,
    trim: true
  }],
  // Content quality indicators for AdSense
  wordCount: {
    type: Number,
    default: 0,
    min: 0
  },
  readingTime: {
    type: Number,
    default: 0 // in minutes
  },
  // Performance optimizations
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 10,
    index: true // For serving high-priority content first
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    index: true
  }],
  difficulty: {
    type: String,
    enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    default: 'BEGINNER',
    uppercase: true,
    index: true
  },
  // Publishing controls for AdSense compliance
  isPublished: {
    type: Boolean,
    default: true,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  isAdsEnabled: {
    type: Boolean,
    default: true // Controls AdSense placement
  },
  // Analytics for performance monitoring
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  shares: {
    type: Number,
    default: 0,
    min: 0
  },
  // Performance tracking
  lastViewed: {
    type: Date,
    default: Date.now,
    index: true
  },
  averageSessionTime: {
    type: Number,
    default: 0 // in seconds
  },
  bounceRate: {
    type: Number,
    default: 0 // percentage
  },
  // Content freshness for AdSense
  contentLastModified: {
    type: Date,
    default: Date.now,
    index: true
  },
  // Images for better UX and Core Web Vitals
  featuredImage: {
    url: String,
    alt: String,
    width: Number,
    height: Number
  },
  images: [{
    url: String,
    alt: String,
    width: Number,
    height: Number,
    caption: String
  }],
  // Related content for better engagement
  relatedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  // Category for better organization
  category: {
    type: String,
    enum: ['TUTORIAL', 'REFERENCE', 'EXAMPLE', 'PROJECT'],
    default: 'TUTORIAL',
    index: true
  },
  // Status for content moderation
  status: {
    type: String,
    enum: ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'],
    default: 'PUBLISHED',
    index: true
  }
}, {
  timestamps: true,
  collection: 'code_posts',
  // Optimizations
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ===== PERFORMANCE INDEXES =====
// Compound indexes for common query patterns
postSchema.index({ language: 1, isPublished: 1, priority: -1 }); // Main listing
postSchema.index({ language: 1, heading: 1, isPublished: 1 }); // Specific post lookup
postSchema.index({ isPublished: 1, isFeatured: 1, createdAt: -1 }); // Featured content
postSchema.index({ tags: 1, isPublished: 1, views: -1 }); // Popular by tags
postSchema.index({ difficulty: 1, language: 1, isPublished: 1 }); // Difficulty filtering
postSchema.index({ views: -1, createdAt: -1 }); // Popular content
postSchema.index({ lastViewed: -1 }); // Recently viewed
postSchema.index({ contentLastModified: -1 }); // Content freshness

// Text index for search functionality
postSchema.index({
  heading: 'text',
  subheading: 'text',
  explanation: 'text',
  metaDescription: 'text',
  tags: 'text'
});

// ===== VIRTUAL FIELDS =====
// SEO-friendly URL
postSchema.virtual('url').get(function() {
  return `/${this.language}/${this.slug || this.heading.toLowerCase().replace(/\s+/g, '-')}`;
});

// Engagement score for content ranking
postSchema.virtual('engagementScore').get(function() {
  const viewWeight = 1;
  const likeWeight = 5;
  const shareWeight = 10;
  return (this.views * viewWeight) + (this.likes * likeWeight) + (this.shares * shareWeight);
});

// Content freshness score
postSchema.virtual('freshnessScore').get(function() {
  const now = new Date();
  const lastModified = this.contentLastModified || this.updatedAt;
  const daysSinceUpdate = Math.floor((now - lastModified) / (1000 * 60 * 60 * 24));
  return Math.max(0, 100 - daysSinceUpdate); // 100 = fresh, decreases over time
});

// ===== MIDDLEWARE FOR PERFORMANCE =====
// Pre-save middleware to auto-generate optimizations
postSchema.pre('save', function(next) {
  // Auto-generate slug if not provided
  if (!this.slug && this.heading) {
    this.slug = this.heading
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }

  // Auto-calculate word count and reading time
  if (this.code || this.explanation) {
    const content = `${this.explanation || ''} ${this.code || ''}`;
    const words = content.trim().split(/\s+/).length;
    this.wordCount = words;
    this.readingTime = Math.max(1, Math.ceil(words / 200)); // 200 words per minute
  }

  // Auto-generate meta description if not provided
  if (!this.metaDescription && this.explanation) {
    this.metaDescription = this.explanation
      .substring(0, 157)
      .trim() + '...';
  }

  // Update content last modified
  if (this.isModified('code') || this.isModified('explanation') || this.isModified('heading')) {
    this.contentLastModified = new Date();
  }

  next();
});

// Post-save middleware for cache invalidation
postSchema.post('save', function(doc) {
  // Invalidate related caches (implement based on your cache strategy)
  console.log(`📝 Post saved: ${doc.language}/${doc.heading} - Cache invalidation needed`);
});

// ===== STATIC METHODS FOR FAST QUERIES =====
// Get posts optimized for homepage/listing
postSchema.statics.getFeaturedPosts = function(limit = 10) {
  return this.find({
    isPublished: true,
    isFeatured: true,
    status: 'PUBLISHED'
  })
  .select('language heading slug metaDescription featuredImage views likes createdAt readingTime difficulty')
  .sort({ priority: -1, views: -1 })
  .limit(limit)
  .lean(); // Returns plain objects, faster than Mongoose documents
};

// Get posts by language with pagination
postSchema.statics.getByLanguage = function(language, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  
  return this.find({
    language: language.toUpperCase(),
    isPublished: true,
    status: 'PUBLISHED'
  })
  .select('heading slug metaDescription featuredImage views likes createdAt readingTime difficulty tags')
  .sort({ priority: -1, views: -1, createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .lean();
};

// Fast search for specific post
postSchema.statics.findByLanguageAndHeading = function(language, heading) {
  const headingRegex = new RegExp(`^${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
  
  return this.findOne({
    language: language.toUpperCase(),
    $or: [
      { heading: headingRegex },
      { slug: heading.toLowerCase() }
    ],
    isPublished: true,
    status: 'PUBLISHED'
  }).lean();
};

// Popular posts for recommendations
postSchema.statics.getPopularPosts = function(language = null, limit = 5) {
  const query = { isPublished: true, status: 'PUBLISHED' };
  if (language) query.language = language.toUpperCase();
  
  return this.find(query)
    .select('language heading slug metaDescription featuredImage views likes')
    .sort({ views: -1, likes: -1 })
    .limit(limit)
    .lean();
};

// Related posts for better engagement
postSchema.statics.getRelatedPosts = function(language, tags, currentPostId, limit = 3) {
  return this.find({
    language: language.toUpperCase(),
    tags: { $in: tags },
    _id: { $ne: currentPostId },
    isPublished: true,
    status: 'PUBLISHED'
  })
  .select('language heading slug metaDescription featuredImage views likes readingTime')
  .sort({ views: -1 })
  .limit(limit)
  .lean();
};

// Sitemap generation for SEO
postSchema.statics.getSitemapData = function() {
  return this.find({
    isPublished: true,
    status: 'PUBLISHED'
  })
  .select('language slug contentLastModified')
  .sort({ contentLastModified: -1 })
  .lean();
};

// ===== INSTANCE METHODS =====
// Increment views with throttling to prevent spam
postSchema.methods.incrementViews = function() {
  // Only increment if last view was more than 1 minute ago
  const now = new Date();
  const timeSinceLastView = now - (this.lastViewed || new Date(0));
  
  if (timeSinceLastView > 60000) { // 1 minute
    return this.constructor.updateOne(
      { _id: this._id },
      { 
        $inc: { views: 1 },
        $set: { lastViewed: now }
      }
    );
  }
};

// Update engagement metrics
postSchema.methods.updateEngagement = function(action, value = 1) {
  const update = {};
  update[`$inc`] = {};
  update[`$inc`][action] = value;
  
  return this.constructor.updateOne({ _id: this._id }, update);
};

// Prevent re-compilation during development
const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;