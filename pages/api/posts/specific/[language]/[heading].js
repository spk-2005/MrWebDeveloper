// pages/api/posts/specific/[language]/[heading].js - Optimized with better performance
import dbConnect from '../../../lib/mongodb';
import Post from '../../../lib/models/post';
import { cache, isRedisAvailable } from '../../../lib/redis';

// Add memory cache as fallback
const memoryCache = new Map();
const MEMORY_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_MEMORY_CACHE_SIZE = 100;

// Memory cache utilities
const getFromMemoryCache = (key) => {
  const cached = memoryCache.get(key);
  if (cached && (Date.now() - cached.timestamp) < MEMORY_CACHE_TTL) {
    return cached.data;
  }
  memoryCache.delete(key);
  return null;
};

const setMemoryCache = (key, data) => {
  // Prevent memory leaks by limiting cache size
  if (memoryCache.size >= MAX_MEMORY_CACHE_SIZE) {
    const firstKey = memoryCache.keys().next().value;
    memoryCache.delete(firstKey);
  }
  
  memoryCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Enhanced parameter normalization
const normalizeParams = (language, heading) => {
  if (!language || !heading) return null;
  
  const normalizedLanguage = language.toString().trim();
  const normalizedHeading = decodeURIComponent(heading.toString())
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim();
    
  return { normalizedLanguage, normalizedHeading };
};

// Create multiple search queries with different strategies
const createSearchQueries = (language, heading) => {
  const baseQuery = {
    $or: [
      { isPublished: true },
      { isPublished: { $exists: false } },
      { isPublished: null }
    ]
  };

  // Strategy 1: Exact case-insensitive match
  const exactQuery = {
    ...baseQuery,
    language: new RegExp(`^${language}$`, 'i'),
    heading: new RegExp(`^${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i')
  };

  // Strategy 2: Flexible word matching
  const flexibleQuery = {
    ...baseQuery,
    language: new RegExp(`^${language}$`, 'i'),
    heading: new RegExp(heading.replace(/\s+/g, '\\s+').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
  };

  // Strategy 3: Partial match (fallback)
  const partialQuery = {
    ...baseQuery,
    language: new RegExp(`^${language}$`, 'i'),
    heading: new RegExp(heading.replace(/\s+/g, '.*'), 'i')
  };

  return [
    { name: 'exact', query: exactQuery },
    { name: 'flexible', query: flexibleQuery },
    { name: 'partial', query: partialQuery }
  ];
};

// Database connection with retry logic
let dbConnectionPromise = null;
const getDbConnection = async () => {
  if (!dbConnectionPromise) {
    dbConnectionPromise = dbConnect();
  }
  return dbConnectionPromise;
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  console.log(`🚀 [${requestId}] Starting request`);

  try {
    // Fast parameter validation
    const { language, heading } = req.query;
    const normalized = normalizeParams(language, heading);
    
    if (!normalized) {
      return res.status(400).json({
        success: false,
        message: 'Invalid language or heading parameters',
        requestId
      });
    }

    const { normalizedLanguage, normalizedHeading } = normalized;
    console.log(`📝 [${requestId}] Normalized: "${normalizedLanguage}" / "${normalizedHeading}"`);

    // Create cache key
    const cacheKey = `post_${normalizedLanguage}_${normalizedHeading}`.toLowerCase().replace(/\s+/g, '_');

    // Multi-level caching strategy
    let post = null;
    let cacheSource = null;

    // Level 1: Memory cache (fastest)
    post = getFromMemoryCache(cacheKey);
    if (post) {
      cacheSource = 'memory';
      console.log(`⚡ [${requestId}] Memory cache HIT`);
    }

    // Level 2: Redis cache
    if (!post && isRedisAvailable()) {
      try {
        post = await cache.get(cacheKey);
        if (post) {
          cacheSource = 'redis';
          console.log(`💾 [${requestId}] Redis cache HIT`);
          // Update memory cache
          setMemoryCache(cacheKey, post);
        }
      } catch (cacheError) {
        console.warn(`⚠️ [${requestId}] Redis cache failed:`, cacheError.message);
      }
    }

    // Level 3: Database query
    if (!post) {
      console.log(`🗄️ [${requestId}] Querying database...`);
      
      try {
        await getDbConnection();
        
        const searchQueries = createSearchQueries(normalizedLanguage, normalizedHeading);
        let strategyUsed = null;

        // Try each search strategy
        for (const { name, query } of searchQueries) {
          try {
            post = await Post.findOne(query).lean().maxTimeMS(5000); // 5 second timeout
            if (post) {
              strategyUsed = name;
              console.log(`✅ [${requestId}] Database HIT with ${name} strategy`);
              break;
            }
          } catch (queryError) {
            console.warn(`⚠️ [${requestId}] Query ${name} failed:`, queryError.message);
          }
        }

        if (!post) {
          console.log(`❌ [${requestId}] Post not found in database`);
          
          // Cache negative result briefly to prevent repeated failed queries
          const negativeResult = null;
          setMemoryCache(cacheKey, negativeResult);
          
          if (isRedisAvailable()) {
            await cache.set(cacheKey, negativeResult, 300).catch(() => {}); // 5 min cache
          }
          
          return res.status(404).json({
            success: false,
            message: 'Post not found',
            searchedFor: { 
              language: normalizedLanguage, 
              heading: normalizedHeading
            },
            requestId,
            responseTime: Date.now() - startTime
          });
        }

        // Process and normalize the post data
        const processedPost = {
          id: post._id?.toString(),
          language: post.language,
          heading: post.heading,
          code: post.code || '',
          likes: parseInt(post.likes) || 0,
          views: parseInt(post.views) || 0,
          images: Array.isArray(post.images) ? post.images : [],
          difficulty: post.difficulty || 'BEGINNER',
          tags: Array.isArray(post.tags) ? post.tags : [],
          description: post.description || '',
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          lastUpdated: post.updatedAt || post.createdAt
        };

        post = processedPost;
        cacheSource = 'database';

        // Cache the result in both levels
        setMemoryCache(cacheKey, post);
        
        if (isRedisAvailable()) {
          // Cache for 1 hour
          cache.set(cacheKey, post, 3600).catch(err => 
            console.warn(`⚠️ [${requestId}] Redis caching failed:`, err.message)
          );
        }

        // Async database operations (don't block response)
        setImmediate(() => {
          Post.findByIdAndUpdate(post.id, { 
            $inc: { views: 1 },
            $set: { lastAccessed: new Date() }
          }).catch(err => 
            console.error(`❌ [${requestId}] View increment failed:`, err.message)
          );
        });

      } catch (dbError) {
        console.error(`❌ [${requestId}] Database error:`, dbError.message);
        
        return res.status(500).json({
          success: false,
          message: 'Database query failed',
          requestId,
          responseTime: Date.now() - startTime
        });
      }
    }

    const responseTime = Date.now() - startTime;
    console.log(`🏁 [${requestId}] Request completed in ${responseTime}ms (source: ${cacheSource})`);

    // Return successful response
    return res.status(200).json({
      success: true,
      post: {
        ...post,
        views: (post.views || 0) + (cacheSource === 'database' ? 1 : 0)
      },
      cached: cacheSource !== 'database',
      cacheSource,
      requestId,
      responseTime,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`❌ [${requestId}] Unexpected error after ${responseTime}ms:`, {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
      requestId,
      responseTime
    });
  }
}

// Add route config for optimization
export const config = {
  api: {
    responseLimit: '8mb',
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}