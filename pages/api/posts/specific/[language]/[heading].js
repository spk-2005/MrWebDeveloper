// pages/api/posts/specific/[language]/[heading].js - Robust version with Redis fallback
import dbConnect from '../../../lib/mongodb';
import Post from '../../../lib/models/post';
import { cache, isRedisAvailable } from '../../../lib/redis';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  // Add request ID for tracking
  const requestId = Math.random().toString(36).substring(7);
  console.log(`🚀 [${requestId}] API Request started`);

  try {
    // Enhanced parameter validation for nested dynamic routes
    console.log(`🔍 [${requestId}] Query received:`, {
      query: req.query,
      url: req.url
    });

    // For nested dynamic routes: /api/posts/specific/[language]/[heading]
    // Parameters come as req.query.language and req.query.heading
    const { language, heading } = req.query;
    
    if (!language || !heading) {
      console.error(`❌ [${requestId}] Missing parameters:`, { 
        language, 
        heading,
        fullQuery: req.query
      });
      
      return res.status(400).json({
        success: false,
        message: 'Both language and heading parameters are required',
        debug: {
          received: { language, heading },
          expected: 'Both language and heading as URL segments',
          requestId
        }
      });
    }

    // Validate extracted parameters
    if (!language?.trim() || !heading?.trim()) {
      console.error(`❌ [${requestId}] Empty parameters:`, { language, heading });
      return res.status(400).json({
        success: false,
        message: 'Language and heading cannot be empty',
        received: { language, heading },
        requestId
      });
    }

    console.log(`📝 [${requestId}] Processing: "${language}" / "${heading}"`);

    // Check Redis availability and cache
    const redisAvailable = isRedisAvailable();
    console.log(`💾 [${requestId}] Redis available: ${redisAvailable}`);

    let cachedPost = null;
    let cacheKey = null;

    if (redisAvailable) {
      try {
        cacheKey = cache.keys.post(language, heading);
        console.log(`🔍 [${requestId}] Cache key: ${cacheKey}`);
        cachedPost = await cache.get(cacheKey);
        
        if (cachedPost) {
          console.log(`⚡ [${requestId}] Cache HIT - returning cached post`);
          
          // Async increment view count without blocking response
          cache.incr(cache.keys.views(cachedPost.id)).catch(err => 
            console.error(`❌ [${requestId}] View increment failed:`, err.message)
          );
          
          return res.status(200).json({
            success: true,
            post: {
              ...cachedPost,
              views: cachedPost.views + 1
            },
            cached: true,
            redisAvailable,
            requestId,
            timestamp: new Date().toISOString()
          });
        } else {
          console.log(`❌ [${requestId}] Cache MISS - proceeding to database`);
        }
      } catch (cacheError) {
        console.error(`⚠️ [${requestId}] Cache operation failed:`, cacheError.message);
      }
    }

    // Database query
    console.log(`🗄️ [${requestId}] Connecting to database...`);
    await dbConnect();

    // Enhanced search with multiple strategies
    const normalizedHeading = heading
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    console.log(`🔍 [${requestId}] Normalized heading: "${normalizedHeading}"`);

    const searchStrategies = [
      {
        name: 'Exact match',
        query: {
          language: new RegExp(`^${language}$`, 'i'),
          heading: new RegExp(`^${normalizedHeading}$`, 'i')
        }
      },
      {
        name: 'Hyphen to space',
        query: {
          language: new RegExp(`^${language}$`, 'i'),
          heading: new RegExp(`^${heading.replace(/-/g, ' ')}$`, 'i')
        }
      },
      {
        name: 'Flexible spacing',
        query: {
          language: new RegExp(`^${language}$`, 'i'),
          heading: new RegExp(normalizedHeading.replace(/\s+/g, '\\s*'), 'i')
        }
      },
      {
        name: 'Multiple variations',
        query: {
          language: new RegExp(`^${language}$`, 'i'),
          $or: [
            { heading: new RegExp(normalizedHeading, 'i') },
            { heading: new RegExp(heading.replace(/-/g, ' '), 'i') },
            { heading: new RegExp(heading.replace(/-/g, '\\s*'), 'i') }
          ]
        }
      }
    ];

    let post = null;
    let strategyUsed = null;

    for (let i = 0; i < searchStrategies.length; i++) {
      const strategy = searchStrategies[i];
      const fullQuery = {
        ...strategy.query,
        $or: [
          { isPublished: true },
          { isPublished: { $exists: false } },
          { isPublished: null }
        ]
      };

      console.log(`🔍 [${requestId}] Trying strategy ${i + 1}: ${strategy.name}`);
      
      try {
        post = await Post.findOne(fullQuery).lean();
        
        if (post) {
          strategyUsed = i + 1;
          console.log(`✅ [${requestId}] Database HIT with strategy ${strategyUsed}: "${post.heading}"`);
          break;
        }
      } catch (dbError) {
        console.error(`❌ [${requestId}] Database query failed for strategy ${i + 1}:`, dbError.message);
      }
    }

    if (!post) {
      console.log(`❌ [${requestId}] Post not found after all strategies`);
      
      // Cache the negative result if Redis is available
      if (redisAvailable && cacheKey) {
        await cache.set(cacheKey, null, 300).catch(err => 
          console.error(`❌ [${requestId}] Failed to cache negative result:`, err.message)
        );
      }
      
      return res.status(404).json({
        success: false,
        message: 'Post not found',
        searchedFor: { 
          language, 
          heading: normalizedHeading,
          strategiesUsed: searchStrategies.length
        },
        redisAvailable,
        requestId
      });
    }

    // Process post data
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

    console.log(`✅ [${requestId}] Post processed successfully`);

    // Cache the successful result if Redis is available
    if (redisAvailable && cacheKey) {
      const cacheSuccess = await cache.set(cacheKey, processedPost, 3600).catch(err => {
        console.error(`⚠️ [${requestId}] Failed to cache result:`, err.message);
        return false;
      });
      
      if (cacheSuccess) {
        console.log(`💾 [${requestId}] Cached post successfully`);
      }
    }

    // Async operations (don't block response)
    Promise.all([
      // Increment view count in DB
      Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } }).catch(err =>
        console.error(`❌ [${requestId}] DB view increment failed:`, err.message)
      ),
      // Update view count in cache if available
      redisAvailable ? cache.incr(cache.keys.views(processedPost.id)).catch(err =>
        console.error(`❌ [${requestId}] Cache view increment failed:`, err.message)
      ) : Promise.resolve()
    ]);

    console.log(`🏁 [${requestId}] Request completed successfully`);

    return res.status(200).json({
      success: true,
      post: {
        ...processedPost,
        views: processedPost.views + 1
      },
      cached: false,
      strategy: strategyUsed,
      redisAvailable,
      requestId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ [${requestId}] Unexpected error:`, {
      message: error.message,
      stack: error.stack,
      url: req.url
    });
    
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch specific post',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack
      } : 'Internal server error',
      requestId
    });
  }
} 