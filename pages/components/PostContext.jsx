import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';

const PostsContext = createContext();

// In-memory cache for Claude.ai compatibility
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 2;

// In-memory storage (no localStorage)
let memoryCache = {
  data: null,
  timestamp: null,
  version: '2.0'
};

// Optimized cache utilities
const cache = {
  get: (key) => {
    if (!memoryCache.data || !memoryCache.timestamp) return null;
    
    const age = Date.now() - memoryCache.timestamp;
    if (age > CACHE_DURATION) {
      memoryCache = { data: null, timestamp: null, version: '2.0' };
      return null;
    }
    
    return memoryCache.data;
  },
  
  set: (key, data) => {
    memoryCache = {
      data,
      timestamp: Date.now(),
      version: '2.0'
    };
  },
  
  clear: () => {
    memoryCache = { data: null, timestamp: null, version: '2.0' };
  }
};

export const usePostsContext = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePostsContext must be used within a PostsProvider');
  }
  return context;
};

export const PostsProvider = ({ children }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const abortControllerRef = useRef(null);
  
  const postMaps = useMemo(() => {
    const lookupMap = new Map();
    const languageMap = new Map();
    const slugMap = new Map();
    
    allPosts.forEach(post => {
      // Main lookup
      if (post.language && post.heading) {
        const key = `${post.language.toLowerCase()}-${post.heading.toLowerCase()}`;
        lookupMap.set(key, post);
      }
      
      // Language grouping
      const lang = post.language?.toLowerCase();
      if (lang) {
        if (!languageMap.has(lang)) {
          languageMap.set(lang, []);
        }
        languageMap.get(lang).push(post);
      }
      
      // Slug lookup
      if (post.slug) {
        slugMap.set(post.slug, post);
      }
    });
    
    return { lookupMap, languageMap, slugMap };
  }, [allPosts]);

  // Optimized fetch with aggressive caching and parallel processing
  const fetchPosts = useCallback(async (forceRefresh = false, options = {}) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    try {
      setError(null);
      
      // Check cache first
      if (!forceRefresh) {
        const cached = cache.get('posts');
        if (cached?.posts?.length > 0) {
          console.log('⚡ Cache hit - instant load');
          setAllPosts(cached.posts);
          setLastFetched(cached.timestamp || Date.now());
          setIsInitialLoad(false);
          return cached.posts;
        }
      }

      setIsLoading(true);
      console.log('🚀 Fetching posts...');
      
      // Create new abort controller
      abortControllerRef.current = new AbortController();
      const timeoutId = setTimeout(() => abortControllerRef.current?.abort(), 8000); // 8s timeout
      
      // Optimized fetch with minimal payload
      const response = await fetch('/api/posts/all?limit=500&lean=true', {
        method: 'GET',
        signal: abortControllerRef.current.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'max-age=300',
          'X-Requested-With': 'XMLHttpRequest'
        },
        // Add fetch optimizations
        keepalive: true,
        mode: 'cors'
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success || !Array.isArray(data.posts)) {
        throw new Error(data.message || 'Invalid response format');
      }
      
      // Minimal post processing for speed
      const processedPosts = data.posts.map((post, index) => ({
        id: post.id || post._id || `post-${index}`,
        language: post.language || 'UNKNOWN',
        heading: post.heading || 'Untitled',
        code: post.code || '',
        likes: post.likes || 0,
        views: post.views || 0,
        images: post.images || [],
        difficulty: post.difficulty || 'BEGINNER',
        tags: post.tags || [],
        slug: post.slug || `${post.language?.toLowerCase() || 'unknown'}-${post.heading?.toLowerCase().replace(/\s+/g, '-') || index}`,
        description: post.description || '',
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        // Pre-computed search string for faster searching
        searchText: `${post.language || ''} ${post.heading || ''} ${post.description || ''}`.toLowerCase()
      }));
      
      // Update state
      setAllPosts(processedPosts);
      setLastFetched(Date.now());
      
      // Cache the result
      cache.set('posts', {
        posts: processedPosts,
        timestamp: Date.now()
      });
      
      console.log(`✅ Loaded ${processedPosts.length} posts in ${Date.now() - (window.performance?.now() || 0)}ms`);
      return processedPosts;
      
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('🔄 Request cancelled');
        return;
      }
      
      console.error('❌ Fetch error:', err);
      setError(err.message);
      
      // Try to use stale cache as fallback
      const staleCache = cache.get('posts');
      if (staleCache?.posts?.length > 0) {
        console.log('📦 Using stale cache as fallback');
        setAllPosts(staleCache.posts);
        setLastFetched(staleCache.timestamp);
        setError(`${err.message} (showing cached data)`);
        return staleCache.posts;
      }
      
      throw err;
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
      abortControllerRef.current = null;
    }
  }, []);

  // Initialize with immediate cache check
  useEffect(() => {
    const initLoad = async () => {
      // Check for immediate cache hit
      const cached = cache.get('posts');
      if (cached?.posts?.length > 0) {
        console.log('⚡ Instant cache load on mount');
        setAllPosts(cached.posts);
        setLastFetched(cached.timestamp);
        setIsInitialLoad(false);
        return;
      }
      
      // Otherwise fetch
      try {
        await fetchPosts();
      } catch (err) {
        console.error('Initial load failed:', err);
      }
    };
    
    initLoad();
    
    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchPosts]);

  // Lightning-fast getters using Maps
  const getPost = useCallback((language, heading) => {
    if (!language || !heading) return null;
    const key = `${language.toLowerCase()}-${heading.toLowerCase()}`;
    return postMaps.lookupMap.get(key) || null;
  }, [postMaps.lookupMap]);

  const getPostsByLanguage = useCallback((language) => {
    if (!language) return [];
    return postMaps.languageMap.get(language.toLowerCase()) || [];
  }, [postMaps.languageMap]);

  const getPostBySlug = useCallback((slug) => {
    if (!slug) return null;
    return postMaps.slugMap.get(slug) || null;
  }, [postMaps.slugMap]);

  // Optimized search with pre-computed search text
  const searchPosts = useCallback((query, options = {}) => {
    if (!query?.trim()) return [];
    
    const { limit = 20, language } = options;
    const searchTerm = query.toLowerCase().trim();
    const results = [];
    
    for (const post of allPosts) {
      if (language && post.language.toLowerCase() !== language.toLowerCase()) continue;
      
      if (post.searchText.includes(searchTerm) || 
          post.code?.toLowerCase().includes(searchTerm)) {
        results.push(post);
        if (results.length >= limit) break;
      }
    }
    
    return results;
  }, [allPosts]);

  // Optimistic updates for better UX
  const updatePostLikes = useCallback((postId, newCount) => {
    setAllPosts(prev => 
      prev.map(post => 
        post.id === postId ? { ...post, likes: Math.max(0, newCount) } : post
      )
    );
  }, []);

  const refreshPosts = useCallback(() => fetchPosts(true), [fetchPosts]);
  const clearCache = useCallback(() => {
    cache.clear();
    return fetchPosts(true);
  }, [fetchPosts]);

  // Memoized computed values
  const computedValues = useMemo(() => ({
    totalPosts: allPosts.length,
    availableLanguages: Array.from(postMaps.languageMap.keys()),
    postsByLanguage: Object.fromEntries(postMaps.languageMap),
    isHealthy: !error && allPosts.length > 0,
    isEmpty: !isLoading && allPosts.length === 0,
    cacheAge: lastFetched ? Date.now() - lastFetched : null
  }), [allPosts.length, postMaps.languageMap, error, isLoading, lastFetched]);

  // Context value with stable references
  const contextValue = useMemo(() => ({
    // Data
    allPosts,
    ...computedValues,
    
    // State
    isLoading,
    isInitialLoad,
    error,
    lastFetched,
    
    // Actions
    getPost,
    getPostsByLanguage,
    getPostBySlug,
    searchPosts,
    updatePostLikes,
    refreshPosts,
    clearCache,
    
    // Utilities
    retry: refreshPosts,
    canRetry: true
  }), [
    allPosts,
    computedValues,
    isLoading,
    isInitialLoad,
    error,
    lastFetched,
    getPost,
    getPostsByLanguage,
    getPostBySlug,
    searchPosts,
    updatePostLikes,
    refreshPosts,
    clearCache
  ]);

  return (
    <PostsContext.Provider value={contextValue}>
      {children}
    </PostsContext.Provider>
  );
};

// Optimized custom hooks
export const usePost = (language, heading) => {
  const { getPost, isInitialLoad, error } = usePostsContext();
  
  return useMemo(() => ({
    post: getPost(language, heading),
    isLoading: isInitialLoad,
    error,
    found: !!getPost(language, heading)
  }), [getPost, language, heading, isInitialLoad, error]);
};

export const useLanguagePosts = (language) => {
  const { getPostsByLanguage, isInitialLoad, error } = usePostsContext();
  
  return useMemo(() => {
    const posts = getPostsByLanguage(language);
    return {
      posts,
      count: posts.length,
      isLoading: isInitialLoad,
      error,
      isEmpty: posts.length === 0
    };
  }, [getPostsByLanguage, language, isInitialLoad, error]);
};

export const useSearch = (query, options = {}) => {
  const { searchPosts, isInitialLoad } = usePostsContext();
  
  return useMemo(() => {
    if (!query?.trim() || isInitialLoad) {
      return { results: [], isSearching: false, count: 0 };
    }
    
    const results = searchPosts(query, options);
    return {
      results,
      count: results.length,
      isSearching: false,
      hasResults: results.length > 0
    };
  }, [searchPosts, query, options.limit, options.language, isInitialLoad]);
};

// Performance monitoring hook
export const usePostsPerformance = () => {
  const { lastFetched, totalPosts, isLoading, error } = usePostsContext();
  
  return useMemo(() => ({
    cacheAge: lastFetched ? Date.now() - lastFetched : null,
    cacheStatus: lastFetched ? 'active' : 'empty',
    dataFreshness: lastFetched && (Date.now() - lastFetched) < CACHE_DURATION ? 'fresh' : 'stale',
    postsLoaded: totalPosts,
    isHealthy: !error && totalPosts > 0 && !isLoading,
    performance: {
      hasCache: !!lastFetched,
      postsPerSecond: lastFetched ? totalPosts / ((Date.now() - lastFetched) / 1000) : 0
    }
  }), [lastFetched, totalPosts, isLoading, error]);
};

// Demo component
const PostsDemo = () => {
  const { 
    totalPosts, 
    availableLanguages, 
    isLoading, 
    isInitialLoad, 
    error, 
    refreshPosts,
    isHealthy 
  } = usePostsContext();
  
  const perf = usePostsPerformance();
  const jsxPosts = useLanguagePosts('jsx');
  const searchResults = useSearch('react hooks', { limit: 5 });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-bold mb-2">⚡ Optimized Posts Context</h1>
        <p className="text-blue-100">Lightning-fast data fetching with intelligent caching</p>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="text-sm text-gray-600">Total Posts</div>
          <div className="text-2xl font-bold text-gray-800">{totalPosts}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="text-sm text-gray-600">Languages</div>
          <div className="text-2xl font-bold text-gray-800">{availableLanguages.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="text-sm text-gray-600">Cache Status</div>
          <div className="text-sm font-bold text-gray-800 capitalize">
            {perf.cacheStatus} • {perf.dataFreshness}
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="mb-6 space-y-2">
        {isInitialLoad && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-800">Initial loading...</span>
            </div>
          </div>
        )}
        
        {isLoading && !isInitialLoad && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
              <span className="text-yellow-800">Refreshing data...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-red-800">⚠️ {error}</span>
              <button 
                onClick={refreshPosts}
                className="text-red-600 hover:text-red-800 font-medium text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        {isHealthy && !isLoading && (
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <span className="text-green-800">✅ System healthy • Data loaded successfully</span>
          </div>
        )}
      </div>

      {/* Language Examples */}
      {availableLanguages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Available Languages</h3>
          <div className="flex flex-wrap gap-2">
            {availableLanguages.slice(0, 10).map(lang => (
              <span 
                key={lang}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700"
              >
                {lang.toUpperCase()}
              </span>
            ))}
            {availableLanguages.length > 10 && (
              <span className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-600">
                +{availableLanguages.length - 10} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* JSX Posts Example */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">JSX Posts ({jsxPosts.count})</h3>
        {jsxPosts.isLoading ? (
          <div className="text-gray-500">Loading JSX posts...</div>
        ) : jsxPosts.posts.length > 0 ? (
          <div className="space-y-2">
            {jsxPosts.posts.slice(0, 3).map(post => (
              <div key={post.id} className="bg-gray-50 p-3 rounded border">
                <div className="font-medium">{post.heading}</div>
                <div className="text-sm text-gray-600">
                  {post.likes} likes • {post.views} views
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No JSX posts found</div>
        )}
      </div>

      {/* Search Example */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Search Results: "react hooks"</h3>
        {searchResults.hasResults ? (
          <div className="space-y-2">
            {searchResults.results.map(post => (
              <div key={post.id} className="bg-blue-50 p-3 rounded border">
                <div className="font-medium">{post.heading}</div>
                <div className="text-sm text-gray-600">
                  {post.language} • {post.likes} likes
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No results found for "react hooks"</div>
        )}
      </div>

      {/* Performance Metrics */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Cache Age</div>
            <div className="font-mono">
              {perf.cacheAge ? `${Math.round(perf.cacheAge / 1000)}s` : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Health Status</div>
            <div className={perf.isHealthy ? 'text-green-600' : 'text-red-600'}>
              {perf.isHealthy ? 'Healthy' : 'Issues'}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Has Cache</div>
            <div className={perf.performance.hasCache ? 'text-green-600' : 'text-gray-600'}>
              {perf.performance.hasCache ? 'Yes' : 'No'}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Data Status</div>
            <div className="capitalize">{perf.dataFreshness}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper component
const OptimizedPostsApp = () => {
  return (
    <PostsProvider>
      <PostsDemo />
    </PostsProvider>
  );
};

export default OptimizedPostsApp;