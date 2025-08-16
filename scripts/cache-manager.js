// scripts/cache-manager.js - CLI tool for cache management
const { cacheManager, warmingService } = require('../utils/cacheManager');
const { cache } = require('../lib/redis');

const commands = {
  async health() {
    console.log('🔍 Checking cache health...');
    const health = await cacheManager.healthCheck();
    console.log(JSON.stringify(health, null, 2));
  },

  async stats() {
    console.log('📊 Getting cache statistics...');
    const stats = await cacheManager.getCacheStats();
    console.log(JSON.stringify(stats, null, 2));
  },

  async clear() {
    console.log('🧹 Clearing entire cache...');
    const result = await cacheManager.emergencyClear();
    console.log(JSON.stringify(result, null, 2));
  },

  async warm() {
    console.log('🔥 Starting cache warming...');
    await warmingService.autoWarm();
    console.log('✅ Cache warming initiated');
  },

  async preload() {
    console.log('⚡ Preloading popular posts...');
    const results = await cacheManager.preloadPopularPosts();
    console.log('Preload results:', results);
  },

  async invalidate(language, heading) {
    if (!language || !heading) {
      console.error('❌ Usage: npm run cache:invalidate <language> <heading>');
      return;
    }
    
    console.log(`🗑️  Invalidating cache for: ${language}/${heading}`);
    const result = await cacheManager.invalidatePost(language, heading);
    console.log(JSON.stringify(result, null, 2));
  },

  help() {
    console.log(`
📚 Cache Manager Commands:

  npm run cache:health     - Check Redis connection and cache health
  npm run cache:stats      - Show cache statistics and memory usage  
  npm run cache:clear      - Clear all cached data (use with caution)
  npm run cache:warm       - Warm cache with popular content
  npm run cache:preload    - Preload frequently accessed posts
  npm run cache:invalidate <language> <heading> - Invalidate specific post

Examples:
  npm run cache:health
  npm run cache:invalidate HTML "HTML Introduction"
  npm run cache:warm
    `);
  }
};

// Parse command line arguments
const [,, command, ...args] = process.argv;

async function main() {
  try {
    if (!command || command === 'help') {
      commands.help();
      return;
    }

    if (commands[command]) {
      await commands[command](...args);
    } else {
      console.error(`❌ Unknown command: ${command}`);
      commands.help();
    }
  } catch (error) {
    console.error('❌ Command failed:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();