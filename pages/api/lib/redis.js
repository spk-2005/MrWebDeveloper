// lib/redis.js - Enhanced Redis client with better debugging
import Redis from 'ioredis';

let redis = null;
let redisConnected = false;
let connectionAttempts = 0;
const maxConnectionAttempts = 3;

const getRedisClient = () => {
  if (!redis && connectionAttempts < maxConnectionAttempts) {
    connectionAttempts++;
    console.log(`🔄 Attempting Redis connection (attempt ${connectionAttempts}/${maxConnectionAttempts})`);
    
    try {
      redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        family: 4,
        keyPrefix: 'tutorial_app:',
        connectTimeout: 10000,
        commandTimeout: 5000,
      });

      redis.on('error', (err) => {
        console.error('❌ Redis connection error:', err.message);
        redisConnected = false;
      });

      redis.on('connect', () => {
        console.log('🔄 Redis connecting...');
      });

      redis.on('ready', () => {
        console.log('✅ Redis connected and ready');
        redisConnected = true;
        connectionAttempts = 0; // Reset on successful connection
      });

      redis.on('close', () => {
        console.warn('⚠️ Redis connection closed');
        redisConnected = false;
      });

      redis.on('reconnecting', () => {
        console.log('🔄 Redis reconnecting...');
        redisConnected = false;
      });

    } catch (error) {
      console.error('❌ Failed to create Redis client:', error.message);
      redis = null;
      redisConnected = false;
    }
  }
  
  return redis;
};

// Check if Redis is available
const isRedisAvailable = () => {
  return redis && redisConnected && redis.status === 'ready';
};

// Graceful fallback function
const withRedisOrFallback = async (operation, fallback = null) => {
  if (!isRedisAvailable()) {
    console.warn('⚠️ Redis not available, using fallback');
    return fallback;
  }
  
  try {
    return await operation();
  } catch (error) {
    console.error('❌ Redis operation failed:', error.message);
    return fallback;
  }
};

// Enhanced cache utility functions
export const cache = {
  // Cache keys with better normalization
  keys: {
    post: (language, heading) => {
      const normalizedHeading = heading
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''); // Remove special characters
      return `post:${language.toLowerCase()}:${normalizedHeading}`;
    },
    languagePosts: (language) => `language:${language.toLowerCase()}:posts`,
    metadata: 'metadata:all',
    likes: (postId) => `likes:${postId}`,
    views: (postId) => `views:${postId}`,
  },

  // Get data from cache with fallback
  async get(key) {
    return withRedisOrFallback(async () => {
      const client = getRedisClient();
      console.log(`🔍 Cache GET: ${key}`);
      
      const data = await client.get(key);
      if (data) {
        console.log(`✅ Cache HIT: ${key}`);
        return JSON.parse(data);
      } else {
        console.log(`❌ Cache MISS: ${key}`);
        return null;
      }
    }, null);
  },

  // Set data in cache with TTL and validation
  async set(key, data, ttlSeconds = 3600) {
    if (!data) {
      console.warn(`⚠️ Attempted to cache null/undefined data for key: ${key}`);
      return false;
    }

    return withRedisOrFallback(async () => {
      const client = getRedisClient();
      console.log(`💾 Cache SET: ${key} (TTL: ${ttlSeconds}s)`);
      
      await client.setex(key, ttlSeconds, JSON.stringify(data));
      console.log(`✅ Cached successfully: ${key}`);
      return true;
    }, false);
  },

  // Delete from cache
  async del(key) {
    return withRedisOrFallback(async () => {
      const client = getRedisClient();
      console.log(`🗑️ Cache DEL: ${key}`);
      
      const result = await client.del(key);
      console.log(`✅ Deleted ${result} key(s): ${key}`);
      return result > 0;
    }, false);
  },

  // Increment counter with error handling
  async incr(key, amount = 1) {
    return withRedisOrFallback(async () => {
      const client = getRedisClient();
      console.log(`📈 Cache INCR: ${key} by ${amount}`);
      
      const result = await client.incrby(key, amount);
      console.log(`✅ Incremented ${key}: ${result}`);
      return result;
    }, null);
  },

  // Check if key exists
  async exists(key) {
    return withRedisOrFallback(async () => {
      const client = getRedisClient();
      const exists = await client.exists(key);
      console.log(`🔍 Cache EXISTS ${key}: ${!!exists}`);
      return !!exists;
    }, false);
  },

  // Get multiple keys at once
  async mget(keys) {
    return withRedisOrFallback(async () => {
      const client = getRedisClient();
      console.log(`🔍 Cache MGET: ${keys.length} keys`);
      
      const results = await client.mget(keys);
      const parsed = results.map((result, index) => {
        try {
          return result ? JSON.parse(result) : null;
        } catch (error) {
          console.error(`❌ Failed to parse cached data for key ${keys[index]}:`, error);
          return null;
        }
      });
      
      const hits = parsed.filter(r => r !== null).length;
      console.log(`✅ Cache MGET: ${hits}/${keys.length} hits`);
      return parsed;
    }, keys.map(() => null));
  },

  // Set multiple keys at once
  async mset(keyValuePairs, ttlSeconds = 3600) {
    if (!Array.isArray(keyValuePairs) || keyValuePairs.length === 0) {
      console.warn('⚠️ Invalid keyValuePairs for MSET');
      return false;
    }

    return withRedisOrFallback(async () => {
      const client = getRedisClient();
      console.log(`💾 Cache MSET: ${keyValuePairs.length} pairs`);
      
      const pipeline = client.pipeline();
      
      keyValuePairs.forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          pipeline.setex(key, ttlSeconds, JSON.stringify(value));
        }
      });
      
      const results = await pipeline.exec();
      const successful = results?.filter(([err]) => !err).length || 0;
      
      console.log(`✅ MSET completed: ${successful}/${keyValuePairs.length} successful`);
      return successful === keyValuePairs.length;
    }, false);
  },

  // Clear all cache (use with caution)
  async flush() {
    return withRedisOrFallback(async () => {
      const client = getRedisClient();
      console.log('🧹 Flushing all cache...');
      
      await client.flushdb();
      console.log('✅ Cache flushed successfully');
      return true;
    }, false);
  },

  // Get detailed cache statistics
  async stats() {
    return withRedisOrFallback(async () => {
      const client = getRedisClient();
      const info = await client.info('memory');
      const dbsize = await client.dbsize();
      
      return {
        connected: redisConnected,
        status: client.status,
        keyCount: dbsize,
        memoryInfo: info,
        connectionAttempts,
        isAvailable: isRedisAvailable()
      };
    }, {
      connected: false,
      status: 'disconnected',
      keyCount: 0,
      memoryInfo: '',
      connectionAttempts,
      isAvailable: false
    });
  },

  // Health check
  async healthCheck() {
    return withRedisOrFallback(async () => {
      const client = getRedisClient();
      const start = Date.now();
      await client.ping();
      const latency = Date.now() - start;
      
      console.log(`✅ Redis health check: ${latency}ms`);
      return {
        healthy: true,
        latency,
        status: client.status,
        connected: redisConnected
      };
    }, {
      healthy: false,
      latency: -1,
      status: 'disconnected',
      connected: false,
      error: 'Redis not available'
    });
  }
};

export { isRedisAvailable, withRedisOrFallback };
export default getRedisClient;