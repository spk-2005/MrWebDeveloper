// pages/api/posts/all.js - Refactored for Mongoose
import mongoose from 'mongoose';
import Post from '@/pages/api/lib/models/post';

// Advanced caching with multiple layers
const memoryCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_ENTRIES = 20;

// Mongoose connection caching
let cachedConnection = null;

const connectDB = async () => {
  // If a connection exists and is ready, reuse it.
  if (cachedConnection && mongoose.connections[0].readyState === 1) {
    console.log('✅ Reusing cached Mongoose connection.');
    return;
  }

  // Otherwise, create a new connection.
  try {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cachedConnection = await mongoose.connect(process.env.MONGODB_URI, opts);
    console.log('✅ New Mongoose connection established.');
  } catch (error) {
    console.error('❌ Mongoose connection error:', error);
    cachedConnection = null;
    throw error;
  }
};

// Enhanced cache management
const cacheManager = {
  get: (key) => {
    const cached = memoryCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      cached.hits = (cached.hits || 0) + 1;
      return cached.data;
    }
    memoryCache.delete(key);
    return null;
  },
  set: (key, data) => {
    if (memoryCache.size >= MAX_CACHE_ENTRIES) {
      const entries = Array.from(memoryCache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toRemove = Math.floor(entries.length * 0.3);
      for (let i = 0; i < toRemove; i++) {
        memoryCache.delete(entries[i][0]);
      }
    }
    memoryCache.set(key, { data, timestamp: Date.now(), hits: 0 });
  },
  getStats: () => {
    return {
      size: memoryCache.size,
      entries: Array.from(memoryCache.entries()).map(([key, value]) => ({
        key,
        age: Date.now() - value.timestamp,
        hits: value.hits,
      })),
    };
  },
};

// High-performance post processing
const processPost = (post) => {
  const codeLength = post.code?.length || 0;
  const linesCount = post.code ? post.code.split('\n').length : 0;
  const readingTime = post.readingTime ||
    (codeLength < 500 ? '1-2 mins' :
      codeLength < 1500 ? '2-3 mins' :
      codeLength < 3000 ? '3-5 mins' : '5-10 mins');

  return {
    id: post._id?.toString() || post.id,
    language: post.language,
    heading: post.heading,
    title: post.title || `${post.heading} - ${post.language} Tutorial`,
    code: post.code,
    likes: post.likes || 0,
    views: post.views || 0,
    images: post.images || [],
    readingTime,
    difficulty: post.difficulty || 'BEGINNER',
    tags: post.tags || [],
    slug: post.slug,
    description: post.description || post.summary,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    isNew: post.createdAt && (Date.now() - new Date(post.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000,
    popularity: (post.likes || 0) + Math.floor((post.views || 0) / 10),
    codeLineCount: linesCount,
  };
};

export default async function handler(req, res) {
  const startTime = Date.now();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600, stale-if-error=86400');
  res.setHeader('CDN-Cache-Control', 'max-age=300');
  res.setHeader('Vary', 'Accept-Encoding');

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Only GET requests are supported.',
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const { language, limit = 1000, popular = false, recent = false, difficulty, nocache = false } = req.query;
    const cacheKey = `posts:${JSON.stringify({ language, limit, popular, recent, difficulty })}`;

    if (!nocache) {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        console.log(`📦 Cache hit for ${cacheKey} - Response time: ${Date.now() - startTime}ms`);
        return res.status(200).json({ ...cached, cached: true, cacheHit: true, responseTime: Date.now() - startTime });
      }
    }

    await connectDB();

    let posts;

    if (popular === 'true') {
      posts = await Post.findPopular(parseInt(limit));
    } else if (recent === 'true') {
      posts = await Post.findRecent(parseInt(limit));
    } else if (language) {
      posts = await Post.findByLanguage(language, {
        limit: parseInt(limit),
        ...(difficulty && { sort: { difficulty: 1, createdAt: -1 } }),
      });
    } else {
      const pipeline = [
        { $match: { isPublished: true, ...(difficulty && { difficulty: difficulty.toUpperCase() }) } },
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
          },
        },
        { $sort: { createdAt: -1 } },
        { $limit: parseInt(limit) },
      ];

      posts = await Post.aggregate(pipeline).allowDiskUse(true).option('maxTimeMS', 10000);
    }

    const processedPosts = posts.map(processPost);
    const postsByLanguage = processedPosts.reduce((acc, post) => {
      const lang = post.language;
      (acc[lang] = acc[lang] || []).push(post);
      return acc;
    }, {});

    const stats = {
      totalPosts: processedPosts.length,
      languages: Object.keys(postsByLanguage),
      languageCount: Object.keys(postsByLanguage).length,
      averageLikes: processedPosts.reduce((sum, post) => sum + post.likes, 0) / processedPosts.length || 0,
      averageViews: processedPosts.reduce((sum, post) => sum + post.views, 0) / processedPosts.length || 0,
      difficultyDistribution: processedPosts.reduce((acc, post) => {
        acc[post.difficulty] = (acc[post.difficulty] || 0) + 1;
        return acc;
      }, {}),
      mostPopularLanguage: Object.entries(postsByLanguage).sort((a, b) => b[1].length - a[1].length)[0]?.[0] || null,
    };

    const responseData = {
      success: true,
      posts: processedPosts,
      postsByLanguage,
      stats,
      total: processedPosts.length,
      languages: Object.keys(postsByLanguage),
      responseTime: Date.now() - startTime,
      cached: false,
      cacheKey,
      message: `Successfully fetched ${processedPosts.length} posts`,
      timestamp: new Date().toISOString(),
      cacheStats: process.env.NODE_ENV === 'development' ? cacheManager.getStats() : undefined,
    };

    cacheManager.set(cacheKey, responseData);

    console.log(`🚀 API Response: ${Date.now() - startTime}ms | Posts: ${processedPosts.length} | Languages: ${stats.languageCount}`);
    res.status(200).json(responseData);
  } catch (error) {
    console.error('❌ API Error:', error);
    const errorResponse = {
      success: false,
      message: 'Failed to fetch posts from database',
      error: process.env.NODE_ENV === 'development' ? { message: error.message, stack: error.stack, name: error.name } : 'Internal server error',
      posts: [],
      postsByLanguage: {},
      total: 0,
      responseTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
    const staleCache = Array.from(memoryCache.values()).find((cached) => cached.data && cached.data.posts);
    if (staleCache) {
      console.log('📦 Serving stale cache data due to error');
      return res.status(200).json({ ...staleCache.data, cached: true, stale: true, error: 'Fresh data unavailable, serving cached data' });
    }
    res.status(500).json(errorResponse);
  }
}

// Health check endpoint
export async function GET(req) {
  if (req.url?.includes('/health')) {
    return Response.json({
      status: 'healthy',
      cache: cacheManager.getStats(),
      connection: mongoose.connections[0].readyState === 1 ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
}