// pages/api/posts/all.js - Ultra-optimized version
import mongoose from 'mongoose';
import Post from '@/pages/api/lib/models/post';

// Multi-layer caching system
const memoryCache = new Map();
const queryCache = new Map();
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes for faster updates
const MAX_CACHE_SIZE = 50;

// Database connection with connection pooling
let cachedConnection = null;
const connectDB = async () => {
  if (cachedConnection?.readyState === 1) {
    return cachedConnection;
  }

  try {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000, // Faster timeout
      socketTimeoutMS: 30000,
      maxPoolSize: 20, // Increased pool size
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      // Use read preference for faster reads
      readPreference: 'secondaryPreferred',
      // Enable connection compression
      compressors: 'zstd,zlib'
    };

    cachedConnection = await mongoose.connect(process.env.MONGODB_URI, opts);
    console.log('✅ Database connected with optimizations');
    return cachedConnection;
  } catch (error) {
    console.error('❌ DB connection failed:', error);
    cachedConnection = null;
    throw error;
  }
};

// Ultra-fast cache manager
const ultraCache = {
  get: (key) => {
    const item = memoryCache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > CACHE_TTL) {
      memoryCache.delete(key);
      return null;
    }
    
    item.hits++;
    item.lastAccess = Date.now();
    return item.data;
  },
  
  set: (key, data) => {
    // Clean old entries if cache is full
    if (memoryCache.size >= MAX_CACHE_SIZE) {
      const entries = Array.from(memoryCache.entries());
      // Remove oldest 30% of entries
      entries
        .sort((a, b) => a[1].lastAccess - b[1].lastAccess)
        .slice(0, Math.floor(entries.length * 0.3))
        .forEach(([k]) => memoryCache.delete(k));
    }
    
    memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      lastAccess: Date.now(),
      hits: 0
    });
  }
};

// Optimized aggregation pipeline
const buildOptimizedPipeline = (options = {}) => {
  const { limit = 1000, language, popular, recent, lean = true } = options;
  
  const pipeline = [
    // Stage 1: Match (with indexes)
    {
      $match: {
        isPublished: true,
        ...(language && { language: language.toUpperCase() })
      }
    }
  ];
  
  // Stage 2: Project only essential fields for speed
  if (lean) {
    pipeline.push({
      $project: {
        language: 1,
        heading: 1,
        code: 1,
        likes: { $ifNull: ['$likes', 0] },
        views: { $ifNull: ['$views', 0] },
        images: { $ifNull: ['$images', []] },
        difficulty: { $ifNull: ['$difficulty', 'BEGINNER'] },
        tags: { $ifNull: ['$tags', []] },
        slug: 1,
        description: 1,
        createdAt: 1,
        updatedAt: 1,
        // Pre-compute popularity score
        popularity: {
          $add: [
            { $ifNull: ['$likes', 0] },
            { $divide: [{ $ifNull: ['$views', 0] }, 10] }
          ]
        }
      }
    });
  }
  
  // Stage 3: Sort
  if (popular) {
    pipeline.push({ $sort: { popularity: -1, createdAt: -1 } });
  } else if (recent) {
    pipeline.push({ $sort: { createdAt: -1 } });
  } else {
    pipeline.push({ $sort: { createdAt: -1 } });
  }
  
  // Stage 4: Limit
  pipeline.push({ $limit: limit });
  
  return pipeline;
};

// Lightning-fast post processor
const processPostMinimal = (post) => ({
  id: post._id?.toString() || post.id,
  language: post.language,
  heading: post.heading,
  code: post.code || '',
  likes: post.likes || 0,
  views: post.views || 0,
  images: post.images || [],
  difficulty: post.difficulty || 'BEGINNER',
  tags: post.tags || [],
  slug: post.slug,
  description: post.description || '',
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  popularity: post.popularity || 0
});

export default async function handler(req, res) {
  const startTime = process.hrtime();
  
  // Ultra-aggressive headers for speed
  res.setHeader('Cache-Control', 'public, max-age=180, stale-while-revalidate=300, stale-if-error=3600');
  res.setHeader('CDN-Cache-Control', 'max-age=180');
  res.setHeader('Vary', 'Accept-Encoding');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      timestamp: new Date().toISOString()
    });
  }

  try {
    const { 
      language, 
      limit = 1000, 
      popular, 
      recent, 
      lean = 'true',
      nocache
    } = req.query;
    
    // Create cache key
    const cacheKey = `posts:${JSON.stringify({
      language,
      limit: parseInt(limit),
      popular: !!popular,
      recent: !!recent,
      lean: lean === 'true'
    })}`;
    
    // Check cache first
    if (!nocache) {
      const cached = ultraCache.get(cacheKey);
      if (cached) {
        const elapsed = process.hrtime(startTime);
        const responseTimeMs = elapsed[0] * 1000 + elapsed[1] / 1e6;
        
        return res.status(200).json({
          ...cached,
          cached: true,
          cacheHit: true,
          responseTime: Math.round(responseTimeMs * 100) / 100
        });
      }
    }
    
    // Connect to database
    await connectDB();
    
    // Build optimized aggregation pipeline
    const pipeline = buildOptimizedPipeline({
      limit: parseInt(limit),
      language,
      popular: popular === 'true',
      recent: recent === 'true',
      lean: lean === 'true'
    });
    
    // Execute with optimizations
    const posts = await Post.aggregate(pipeline)
      .allowDiskUse(false) // Keep in memory for speed
      .option('maxTimeMS', 5000) // 5 second timeout
      .exec();
    
    // Minimal processing
    const processedPosts = posts.map(processPostMinimal);
    
    // Quick stats computation
    const stats = {
      total: processedPosts.length,
      languages: [...new Set(processedPosts.map(p => p.language))],
      avgLikes: processedPosts.length ? 
        Math.round(processedPosts.reduce((sum, p) => sum + p.likes, 0) / processedPosts.length) : 0
    };
    
    // Calculate response time
    const elapsed = process.hrtime(startTime);
    const responseTimeMs = elapsed[0] * 1000 + elapsed[1] / 1e6;
    
    // Build response
    const responseData = {
      success: true,
      posts: processedPosts,
      stats,
      total: processedPosts.length,
      languages: stats.languages,
      responseTime: Math.round(responseTimeMs * 100) / 100,
      cached: false,
      cacheKey,
      timestamp: new Date().toISOString(),
      serverLoad: process.memoryUsage().heapUsed / 1024 / 1024 // MB
    };
    
    // Cache the response
    ultraCache.set(cacheKey, responseData);
    
    console.log(`🚀 API: ${Math.round(responseTimeMs)}ms | Posts: ${processedPosts.length} | Cache: ${memoryCache.size} entries`);
    
    return res.status(200).json(responseData);
    
  } catch (error) {
    console.error('❌ API Error:', error.message);
    
    const elapsed = process.hrtime(startTime);
    const responseTimeMs = elapsed[0] * 1000 + elapsed[1] / 1e6;
    
    // Try serving stale cache on error
    const staleData = Array.from(memoryCache.values())
      .find(item => item.data?.posts?.length > 0);
    
    if (staleData) {
      console.log('📦 Serving stale data due to error');
      return res.status(200).json({
        ...staleData.data,
        cached: true,
        stale: true,
        error: 'Fresh data unavailable, serving cached data',
        responseTime: Math.round(responseTimeMs * 100) / 100
      });
    }
    
    // Error response
    return res.status(500).json({
      success: false,
      message: 'Database query failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      posts: [],
      total: 0,
      responseTime: Math.round(responseTimeMs * 100) / 100,
      timestamp: new Date().toISOString()
    });
  }
}

// Health check endpoint for monitoring
export async function GET(req) {
  if (req.url?.includes('/health')) {
    const memUsage = process.memoryUsage();
    
    return Response.json({
      status: 'healthy',
      database: mongoose.connections[0]?.readyState === 1 ? 'connected' : 'disconnected',
      cache: {
        entries: memoryCache.size,
        maxSize: MAX_CACHE_SIZE,
        utilization: `${Math.round((memoryCache.size / MAX_CACHE_SIZE) * 100)}%`
      },
      memory: {
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
      },
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  }
}

// Optional: Optimized model with better indexes
export const optimizePostModel = async () => {
  try {
    const Post = mongoose.model('Post');
    
    // Create optimized indexes for common queries
    const indexes = [
      // Single field indexes
      { language: 1 },
      { isPublished: 1 },
      { likes: -1 },
      { createdAt: -1 },
      
      // Compound indexes for fast queries
      { language: 1, createdAt: -1 },
      { language: 1, likes: -1 },
      { isPublished: 1, createdAt: -1 },
      { isPublished: 1, likes: -1 },
      
      // Sparse index for slugs
      { slug: 1 },
      
      // Text search index
      {
        language: 'text',
        heading: 'text',
        description: 'text',
        tags: 'text'
      }
    ];
    
    // Create indexes in background
    for (const index of indexes) {
      await Post.collection.createIndex(index, { background: true });
    }
    
    console.log('✅ Optimized indexes created');
    
  } catch (error) {
    console.error('❌ Index optimization failed:', error.message);
  }
};

// Pre-warming cache function
export const prewarmCache = async () => {
  try {
    const commonQueries = [
      {},
      { popular: 'true' },
      { recent: 'true' },
      { language: 'JAVASCRIPT' },
      { language: 'PYTHON' },
      { language: 'REACT' }
    ];
    
    console.log('🔥 Pre-warming cache...');
    
    for (const query of commonQueries) {
      const mockReq = { method: 'GET', query };
      const mockRes = {
        setHeader: () => {},
        status: (code) => ({
          json: (data) => {
            console.log(`✅ Pre-warmed: ${JSON.stringify(query)} - ${data.total} posts`);
            return data;
          }
        })
      };
      
      await handler(mockReq, mockRes);
      
      // Small delay between queries
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('🔥 Cache pre-warming completed');
    
  } catch (error) {
    console.error('❌ Cache pre-warming failed:', error.message);
  }
};