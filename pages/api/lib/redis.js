// lib/redis.js - Optimized Redis with connection pooling and fallbacks
import Redis from 'ioredis';

class RedisManager {
  constructor() {
    this.redis = null;
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxConnectionAttempts = 3;
    this.reconnectTimer = null;
    
    // Connection stats
    this.stats = {
      hits: 0,
      misses: 0,
      errors: 0,
      operations: 0
    };
    
    this.initializeConnection();
  }

  initializeConnection() {
    if (this.connectionAttempts >= this.maxConnectionAttempts) {
      console.warn('⚠️ Redis max connection attempts reached, using fallback mode');
      return;
    }

    this.connectionAttempts++;
    console.log(`🔄 Redis connection attempt ${this.connectionAttempts}/${this.maxConnectionAttempts}`);

    try {
      this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 2, // Reduced from 3
        lazyConnect: true,
        keepAlive: 30000,
        family: 4,
        keyPrefix: 'tutorial_app:',
        connectTimeout: 5000, // Reduced from 10000
        commandTimeout: 3000, // Reduced from 5000
        enableReadyCheck: true,
        showFriendlyErrorStack: process.env.NODE_ENV === 'development',
        
        // Connection pool settings
        maxRetriesPerRequest: 2,
        retryDelayOnFailover: 50,
        enableOfflineQueue: false, // Don't queue commands when offline
        
        // Performance settings
        dropBufferSupport: true,
        enableAutoPipelining: true,
      });

      this.setupEventHandlers();
      
      // Attempt to connect immediately
      this.redis.connect().catch(err => {
        console.error('❌ Initial Redis connection failed:', err.message);
      });

    } catch (error) {
      console.error('❌ Redis client creation failed:', error.message);
      this.handleConnectionFailure();
    }
  }

  setupEventHandlers() {
    this.redis.on('error', (err) => {
      console.error('❌ Redis error:', err.message);
      this.isConnected = false;
      this.stats.errors++;
      this.scheduleReconnect();
    });

    this.redis.on('connect', () => {
      console.log('🔄 Redis connecting...');
      this.isConnected = false;
    });

    this.redis.on('ready', () => {
      console.log('✅ Redis connected and ready');
      this.isConnected = true;
      this.connectionAttempts = 0; // Reset on successful connection
      
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    });

    this.redis.on('close', () => {
      console.warn('⚠️ Redis connection closed');
      this.isConnected = false;
      this.scheduleReconnect();
    });

    this.redis.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...');
      this.isConnected = false;
    });

    this.redis.on('end', () => {
      console.warn('⚠️ Redis connection ended');
      this.isConnected = false;
    });
  }

  scheduleReconnect() {
    if (this.reconnectTimer || this.connectionAttempts >= this.maxConnectionAttempts) {
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.connectionAttempts), 10000);
    console.log(`⏰ Scheduling Redis reconnect in ${delay}ms`);
    
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.initializeConnection();
    }, delay);
  }

  handleConnectionFailure() {
    this.redis = null;
    this.isConnected = false;
    this.scheduleReconnect();
  }

  isAvailable() {
    return this.redis && this.isConnected && this.redis.status === 'ready';
  }

  async executeWithFallback(operation, fallback = null) {
    if (!this.isAvailable()) {
      console.warn('⚠️ Redis not available, using fallback');
      return fallback;
    }

    this.stats.operations++;
    
    try {
      const result = await Promise.race([
        operation(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Operation timeout')), 2000)
        )
      ]);
      
      return result;
    } catch (error) {
      console.error('❌ Redis operation failed:', error.message);
      this.stats.errors++;
      return fallback;
    }
  }

  // Cache utility methods
  async get(key) {
    const result = await this.executeWithFallback(async () => {
      console.log(`🔍 Redis GET: ${key}`);
      const data = await this.redis.get(key);
      
      if (data) {
        console.log(`✅ Redis HIT: ${key}`);
        this.stats.hits++;
        return JSON.parse(data);
      } else {
        console.log(`❌ Redis MISS: ${key}`);
        this.stats.misses++;
        return null;
      }
    }, null);

    return result;
  }

  async set(key, data, ttlSeconds = 3600) {
    if (data === null || data === undefined) {
      console.warn(`⚠️ Skipping cache of null/undefined data for key: ${key}`);
      return false;
    }

    return this.executeWithFallback(async () => {
      console.log(`💾 Redis SET: ${key} (TTL: ${ttlSeconds}s)`);
      await this.redis.setex(key, ttlSeconds, JSON.stringify(data));
      console.log(`✅ Redis cached: ${key}`);
      return true;
    }, false);
  }

  async del(key) {
    return this.executeWithFallback(async () => {
      console.log(`🗑️ Redis DEL: ${key}`);
      const result = await this.redis.del(key);
      console.log(`✅ Redis deleted ${result} key(s): ${key}`);
      return result > 0;
    }, false);
  }

  async incr(key, amount = 1) {
    return this.executeWithFallback(async () => {
      console.log(`📈 Redis INCR: ${key} by ${amount}`);
      const result = await this.redis.incrby(key, amount);
      console.log(`✅ Redis incremented ${key}: ${result}`);
      return result;
    }, null);
  }

  async exists(key) {
    return this.executeWithFallback(async () => {
      const exists = await this.redis.exists(key);
      console.log(`🔍 Redis EXISTS ${key}: ${!!exists}`);
      return !!exists;
    }, false);
  }

  async mget(keys) {
    return this.executeWithFallback(async () => {
      console.log(`🔍 Redis MGET: ${keys.length} keys`);
      
      const results = await this.redis.mget(keys);
      const parsed = results.map((result, index) => {
        try {
          return result ? JSON.parse(result) : null;
        } catch (error) {
          console.error(`❌ Failed to parse cached data for key ${keys[index]}:`, error);
          return null;
        }
      });
      
      const hits = parsed.filter(r => r !== null).length;
      this.stats.hits += hits;
      this.stats.misses += (keys.length - hits);
      
      console.log(`✅ Redis MGET: ${hits}/${keys.length} hits`);
      return parsed;
    }, keys.map(() => null));
  }

  async mset(keyValuePairs, ttlSeconds = 3600) {
    if (!Array.isArray(keyValuePairs) || keyValuePairs.length === 0) {
      console.warn('⚠️ Invalid keyValuePairs for MSET');
      return false;
    }

    return this.executeWithFallback(async () => {
      console.log(`💾 Redis MSET: ${keyValuePairs.length} pairs`);
      
      const pipeline = this.redis.pipeline();
      
      keyValuePairs.forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          pipeline.setex(key, ttlSeconds, JSON.stringify(value));
        }
      });
      
      const results = await pipeline.exec();
      const successful = results?.filter(([err]) => !err).length || 0;
      
      console.log(`✅ Redis MSET completed: ${successful}/${keyValuePairs.length} successful`);
      return successful === keyValuePairs.length;
    }, false);
  }

  async flush() {
    return this.executeWithFallback(async () => {
      console.log('🧹 Flushing Redis cache...');
      await this.redis.flushdb();
      console.log('✅ Redis cache flushed');
      return true;
    }, false);
  }

  async getStats() {
    const redisStats = await this.executeWithFallback(async () => {
      const info = await this.redis.info('memory');
      const dbsize = await this.redis.dbsize();
      return { info, dbsize };
    }, { info: '', dbsize: 0 });

    return {
      connected: this.isConnected,
      status: this.redis?.status || 'disconnected',
      keyCount: redisStats.dbsize,
      memoryInfo: redisStats.info,
      connectionAttempts: this.connectionAttempts,
      isAvailable: this.isAvailable(),
      operations: this.stats,
      performance: {
        hitRate: this.stats.operations > 0 
          ? ((this.stats.hits / (this.stats.hits + this.stats.misses)) * 100).toFixed(2) + '%'
          : '0%'
      }
    };
  }

  async healthCheck() {
    return this.executeWithFallback(async () => {
      const start = Date.now();
      await this.redis.ping();
      const latency = Date.now() - start;
      
      console.log(`✅ Redis health check: ${latency}ms`);
      return {
        healthy: true,
        latency,
        status: this.redis.status,
        connected: this.isConnected
      };
    }, {
      healthy: false,
      latency: -1,
      status: 'disconnected',
      connected: false,
      error: 'Redis not available'
    });
  }

  // Cleanup method
  async disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.redis) {
      try {
        await this.redis.quit();
        console.log('✅ Redis connection closed gracefully');
      } catch (error) {
        console.warn('⚠️ Error closing Redis connection:', error.message);
      }
    }

    this.redis = null;
    this.isConnected = false;
  }
}

// Create singleton instance
const redisManager = new RedisManager();

// Cache utility object with enhanced key generation
export const cache = {
  keys: {
    post: (language, heading) => {
      if (!language || !heading) return null;
      
      const normalizedLanguage = language.toLowerCase().trim();
      const normalizedHeading = heading
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_-]/g, ''); // Remove special characters
      
      return `post_${normalizedLanguage}_${normalizedHeading}`;
    },
    languagePosts: (language) => `lang_${language.toLowerCase()}_posts`,
    metadata: 'metadata_all',
    likes: (postId) => `likes_${postId}`,
    views: (postId) => `views_${postId}`,
    user: (userId) => `user_${userId}`,
  },

  // Delegate all operations to the manager
  get: (key) => redisManager.get(key),
  set: (key, data, ttl) => redisManager.set(key, data, ttl),
  del: (key) => redisManager.del(key),
  incr: (key, amount) => redisManager.incr(key, amount),
  exists: (key) => redisManager.exists(key),
  mget: (keys) => redisManager.mget(keys),
  mset: (pairs, ttl) => redisManager.mset(pairs, ttl),
  flush: () => redisManager.flush(),
  stats: () => redisManager.getStats(),
  healthCheck: () => redisManager.healthCheck(),
};

// Export utility functions
export const isRedisAvailable = () => redisManager.isAvailable();
export const withRedisOrFallback = (operation, fallback) => 
  redisManager.executeWithFallback(operation, fallback);

// Export Redis manager for advanced usage
export const getRedisClient = () => redisManager.redis;

// Graceful shutdown handler
if (typeof process !== 'undefined') {
  const gracefulShutdown = async () => {
    console.log('🔄 Shutting down Redis connection...');
    await redisManager.disconnect();
    process.exit(0);
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
  process.on('uncaughtException', async (error) => {
    console.error('❌ Uncaught exception:', error);
    await redisManager.disconnect();
    process.exit(1);
  });
}

export default redisManager;