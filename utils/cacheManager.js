// utils/cacheManager.js - Cache management utilities
import { cache } from '@/lib/redis';

export const cacheManager = {
  // Preload frequently accessed posts
  async preloadPopularPosts(languages = ['HTML', 'CSS', 'JavaScript']) {
    try {
      console.log('🔄 Preloading popular posts...');
      const results = await Promise.allSettled(
        languages.map(async (language) => {
          const response = await fetch(`/api/posts/language/${language}?limit=10`);
          const data = await response.json();
          return { language, count: data.posts?.length || 0 };
        })
      );
      
      const successful = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
      
      console.log('✅ Preload results:', successful);
      return successful;
    } catch (error) {
      console.error('❌ Preload error:', error);
      return [];
    }
  },

  // Warm cache with specific posts
  async warmCache(postsToCache = []) {
    const warmed = [];
    
    for (const { language, heading } of postsToCache) {
      try {
        const cacheKey = cache.keys.post(language, heading);
        const exists = await cache.exists(cacheKey);
        
        if (!exists) {
          const response = await fetch(`/api/posts/specific/${language}/${heading}`);
          if (response.ok) {
            warmed.push({ language, heading, status: 'warmed' });
          }
        } else {
          warmed.push({ language, heading, status: 'already_cached' });
        }
      } catch (error) {
        warmed.push({ language, heading, status: 'error', error: error.message });
      }
    }
    
    return warmed;
  },

  // Cache health check
  async healthCheck() {
    try {
      const stats = await cache.stats();
      const testKey = 'health_check_test';
      
      // Test write
      await cache.set(testKey, { test: true }, 10);
      
      // Test read
      const testValue = await cache.get(testKey);
      
      // Clean up
      await cache.del(testKey);
      
      return {
        healthy: true,
        connected: stats?.connected || false,
        keyCount: stats?.keyCount || 0,
        writeTest: !!testValue,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Smart cache invalidation
  async invalidatePost(language, heading) {
    const keys = [
      cache.keys.post(language, heading),
      cache.keys.languagePosts(language),
      cache.keys.metadata
    ];
    
    const results = await Promise.allSettled(
      keys.map(key => cache.del(key))
    );
    
    return {
      invalidated: results.filter(r => r.status === 'fulfilled').length,
      total: keys.length
    };
  },

  // Cache statistics
  async getCacheStats() {
    try {
      const redisStats = await cache.stats();
      return {
        redis: redisStats,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Emergency cache clear
  async emergencyClear() {
    try {
      await cache.flush();
      return { cleared: true, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        cleared: false, 
        error: error.message, 
        timestamp: new Date().toISOString() 
      };
    }
  }
};

// Background cache warming service
export class CacheWarmingService {
  constructor() {
    this.isWarming = false;
    this.warmingQueue = [];
  }

  // Add posts to warming queue
  queueForWarming(posts) {
    this.warmingQueue.push(...posts);
  }

  // Process warming queue
  async processQueue() {
    if (this.isWarming || this.warmingQueue.length === 0) return;
    
    this.isWarming = true;
    console.log(`🔥 Starting cache warming for ${this.warmingQueue.length} posts`);
    
    try {
      const batch = this.warmingQueue.splice(0, 5); // Process 5 at a time
      const results = await cacheManager.warmCache(batch);
      console.log('🔥 Cache warming results:', results);
      
      // Continue if more in queue
      if (this.warmingQueue.length > 0) {
        setTimeout(() => this.processQueue(), 1000); // 1 second delay between batches
      }
    } catch (error) {
      console.error('❌ Cache warming error:', error);
    } finally {
      this.isWarming = false;
    }
  }

  // Auto-warm popular content
  async autoWarm() {
    const popularPosts = [
      { language: 'HTML', heading: 'HTML Introduction' },
      { language: 'CSS', heading: 'CSS Basics' },
      { language: 'JavaScript', heading: 'JS Introduction' },
      { language: 'HTML', heading: 'Headings' },
      { language: 'CSS', heading: 'CSS Selectors' }
    ];
    
    this.queueForWarming(popularPosts);
    return this.processQueue();
  }
}

export const warmingService = new CacheWarmingService();