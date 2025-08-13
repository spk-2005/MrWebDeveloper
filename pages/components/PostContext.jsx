// components/PostContext.js
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';

const PostsContext = createContext();

// Enhanced cache with better persistence
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const MAX_RETRIES = 2;

// Check if we're running on the client side
const isClient = typeof window !== 'undefined';

// Multi-layer cache system with SSR safety
const cacheSystem = {
  // In-memory cache (fastest)
  memoryCache: {
    data: null,
    timestamp: null,
    version: '2.1'
  },
  
  // SessionStorage cache (survives page reloads) - only on client
  getSessionCache: () => {
    if (!isClient) return null;
    
    try {
      const cached = sessionStorage.getItem('postsCache');
      if (cached) {
        const parsed = JSON.parse(cached);
        const age = Date.now() - (parsed.timestamp || 0);
        if (age < CACHE_DURATION) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to read session cache:', e);
    }
    return null;
  },
  
  setSessionCache: (data) => {
    if (!isClient) return;
    
    try {
      sessionStorage.setItem('postsCache', JSON.stringify({
        ...data,
        timestamp: Date.now(),
        version: '2.1'
      }));
    } catch (e) {
      console.warn('Failed to write session cache:', e);
    }
  },
  
  // Get data from any available cache
  get: () => {
    // Try memory first
    if (cacheSystem.memoryCache.data && cacheSystem.memoryCache.timestamp) {
      const age = Date.now() - cacheSystem.memoryCache.timestamp;
      if (age < CACHE_DURATION) {
        return cacheSystem.memoryCache;
      }
    }
    
    // Try session storage only on client
    if (isClient) {
      return cacheSystem.getSessionCache();
    }
    
    return null;
  },
  
  // Set data in all caches
  set: (data) => {
    const cacheData = {
      ...data,
      timestamp: Date.now(),
      version: '2.1'
    };
    
    // Set memory cache
    cacheSystem.memoryCache = cacheData;
    
    // Set session cache only on client
    if (isClient) {
      cacheSystem.setSessionCache(cacheData);
    }
  },
  
  clear: () => {
    cacheSystem.memoryCache = { data: null, timestamp: null, version: '2.1' };
    
    if (isClient) {
      try {
        sessionStorage.removeItem('postsCache');
      } catch (e) {
        console.warn('Failed to clear session cache:', e);
      }
    }
  }
};

export const usePostsContext = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePostsContext must be used within a PostsProvider');
  }
  return context;
};

export const PostsProvider = ({ children, preloadedData = null }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const [cacheStats, setCacheStats] = useState({ hits: 0, misses: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const abortControllerRef = useRef(null);
  const initializationRef = useRef(false);
  
  // Track when component is mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Memoized post lookups for ultra-fast access
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

  // Initialize with preloaded data or cache
  const initializeData = useCallback(async () => {
    if (initializationRef.current) return;
    initializationRef.current = true;
    
    console.log('🔄 Initializing PostsContext...');
    
    // Try preloaded data first (from _app.js)
    if (preloadedData?.posts?.length > 0) {
      console.log('⚡ Using preloaded data:', preloadedData.posts.length, 'posts');
      setAllPosts(preloadedData.posts);
      setLastFetched(preloadedData.timestamp || Date.now());
      setIsInitialLoading(false);
      setCacheStats(prev => ({ ...prev, hits: prev.hits + 1 }));
      
      // Update cache system
      cacheSystem.set(preloadedData);
      return;
    }
    
    // Only check cache if we're mounted (client-side)
    if (isMounted) {
      const cached = cacheSystem.get();
      if (cached?.posts?.length > 0) {
        console.log('💾 Using cached data:', cached.posts.length, 'posts');
        setAllPosts(cached.posts);
        setLastFetched(cached.timestamp);
        setIsInitialLoading(false);
        setCacheStats(prev => ({ ...prev, hits: prev.hits + 1 }));
        return;
      }
    }
    
    // If no cache and we're mounted, fetch fresh data
    if (isMounted) {
      console.log('🌐 No cache available, fetching fresh data...');
      setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
      await fetchPosts(true);
    }
  }, [preloadedData, isMounted]);

  // Ultra-optimized fetch with intelligent caching
  const fetchPosts = useCallback(async (forceRefresh = false, options = {}) => {
    // Only run on client side
    if (!isClient) {
      console.log('🚫 Server-side detected, skipping fetch');
      return [];
    }
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    try {
      setError(null);
      
      // Check cache first unless forced refresh
      if (!forceRefresh) {
        const cached = cacheSystem.get();
        if (cached?.posts?.length > 0) {
          console.log('⚡ Cache hit - instant load');
          setAllPosts(cached.posts);
          setLastFetched(cached.timestamp);
          setIsInitialLoading(false);
          setCacheStats(prev => ({ ...prev, hits: prev.hits + 1 }));
          return cached.posts;
        }
      }

      setIsLoading(true);
      console.log('🚀 Fetching posts...');
      
      // Create abort controller with timeout
      abortControllerRef.current = new AbortController();
      const timeoutId = setTimeout(() => abortControllerRef.current?.abort(), 10000); // 10s timeout
      
      // Optimized fetch
      const response = await fetch('/api/posts/all?limit=500&lean=true&v=2.1', {
        method: 'GET',
        signal: abortControllerRef.current.signal,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'max-age=600', // 10 min browser cache
          'X-Requested-With': 'XMLHttpRequest',
          'X-Cache-Version': '2.1'
        },
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
      
      // Process posts with minimal overhead
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
        searchText: `${post.language || ''} ${post.heading || ''} ${post.description || ''}`.toLowerCase()
      }));
      
      // Update state
      setAllPosts(processedPosts);
      const now = Date.now();
      setLastFetched(now);
      
      // Cache the result in all layers
      cacheSystem.set({
        posts: processedPosts,
        timestamp: now
      });
      
      setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
      
      console.log(`✅ Loaded ${processedPosts.length} posts successfully`);
      return processedPosts;
      
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('🔄 Request cancelled');
        return [];
      }
      
      console.error('❌ Fetch error:', err);
      setError(err.message);
      
      // Try to use stale cache as fallback
      const staleCache = cacheSystem.get();
      if (staleCache?.posts?.length > 0) {
        console.log('📦 Using stale cache as fallback');
        setAllPosts(staleCache.posts);
        setLastFetched(staleCache.timestamp);
        setError(`${err.message} (showing cached data)`);
        return staleCache.posts;
      }
      
      return [];
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  // Initialize on mount - only run when component is mounted
  useEffect(() => {
    if (isMounted) {
      initializeData();
    }
    
    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [initializeData, isMounted]);

  // Optimized getters with Map lookups
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

  // High-performance search with early termination
  const searchPosts = useCallback((query, options = {}) => {
    if (!query?.trim()) return [];
    
    const { limit = 20, language, includeCode = false } = options;
    const searchTerm = query.toLowerCase().trim();
    const results = [];
    
    for (const post of allPosts) {
      if (language && post.language.toLowerCase() !== language.toLowerCase()) continue;
      
      // Multi-field search with scoring
      let score = 0;
      
      if (post.heading.toLowerCase().includes(searchTerm)) score += 10;
      if (post.searchText.includes(searchTerm)) score += 5;
      if (includeCode && post.code?.toLowerCase().includes(searchTerm)) score += 3;
      if (post.tags?.some(tag => tag.toLowerCase().includes(searchTerm))) score += 8;
      
      if (score > 0) {
        results.push({ ...post, searchScore: score });
        if (results.length >= limit) break;
      }
    }
    
    // Sort by relevance score
    return results.sort((a, b) => b.searchScore - a.searchScore);
  }, [allPosts]);

  // Optimistic updates for better UX
  const updatePostLikes = useCallback((postId, newCount) => {
    setAllPosts(prev => 
      prev.map(post => 
        post.id === postId ? { ...post, likes: Math.max(0, newCount) } : post
      )
    );
    
    // Update cache only if on client
    if (isClient) {
      const cached = cacheSystem.get();
      if (cached?.posts) {
        const updatedPosts = cached.posts.map(post =>
          post.id === postId ? { ...post, likes: Math.max(0, newCount) } : post
        );
        cacheSystem.set({ ...cached, posts: updatedPosts });
      }
    }
  }, []);

  const refreshPosts = useCallback(() => fetchPosts(true), [fetchPosts]);
  const clearCache = useCallback(() => {
    cacheSystem.clear();
    setCacheStats({ hits: 0, misses: 0 });
    return fetchPosts(true);
  }, [fetchPosts]);

  // Memoized computed values
  const computedValues = useMemo(() => ({
    totalPosts: allPosts.length,
    availableLanguages: Array.from(postMaps.languageMap.keys()),
    postsByLanguage: Object.fromEntries(postMaps.languageMap),
    isHealthy: !error && allPosts.length > 0,
    isEmpty: !isLoading && !isInitialLoading && allPosts.length === 0,
    cacheAge: lastFetched ? Date.now() - lastFetched : null,
    cacheStats,
    dataFreshness: lastFetched && (Date.now() - lastFetched) < CACHE_DURATION ? 'fresh' : 'stale'
  }), [allPosts.length, postMaps.languageMap, error, isLoading, isInitialLoading, lastFetched, cacheStats]);

  // Context value with stable references
  const contextValue = useMemo(() => ({
    // Data
    allPosts,
    ...computedValues,
    
    // State
    isLoading,
    isInitialLoading,
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
    isInitialLoading,
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

// Enhanced hooks
export const usePost = (language, heading) => {
  const { getPost, isInitialLoading, error } = usePostsContext();
  
  return useMemo(() => ({
    post: getPost(language, heading),
    isLoading: isInitialLoading,
    error,
    found: !!getPost(language, heading)
  }), [getPost, language, heading, isInitialLoading, error]);
};

export const useLanguagePosts = (language) => {
  const { getPostsByLanguage, isInitialLoading, error } = usePostsContext();
  
  return useMemo(() => {
    const posts = getPostsByLanguage(language);
    return {
      posts,
      count: posts.length,
      isLoading: isInitialLoading,
      error,
      isEmpty: posts.length === 0
    };
  }, [getPostsByLanguage, language, isInitialLoading, error]);
};

export const useSearch = (query, options = {}) => {
  const { searchPosts, isInitialLoading } = usePostsContext();
  
  return useMemo(() => {
    if (!query?.trim() || isInitialLoading) {
      return { results: [], isSearching: false, count: 0 };
    }
    
    const results = searchPosts(query, options);
    return {
      results,
      count: results.length,
      isSearching: false,
      hasResults: results.length > 0
    };
  }, [searchPosts, query, JSON.stringify(options), isInitialLoading]);
};

// Performance monitoring hook
export const usePostsPerformance = () => {
  const { lastFetched, totalPosts, isLoading, error, cacheStats, dataFreshness } = usePostsContext();
  
  return useMemo(() => ({
    cacheAge: lastFetched ? Date.now() - lastFetched : null,
    cacheStatus: lastFetched ? 'active' : 'empty',
    dataFreshness,
    postsLoaded: totalPosts,
    isHealthy: !error && totalPosts > 0 && !isLoading,
    cacheStats,
    performance: {
      hasCache: !!lastFetched,
      cacheHitRate: cacheStats.hits + cacheStats.misses > 0 
        ? (cacheStats.hits / (cacheStats.hits + cacheStats.misses) * 100).toFixed(1)
        : 0,
      postsPerSecond: lastFetched ? totalPosts / ((Date.now() - lastFetched) / 1000) : 0
    }
  }), [lastFetched, totalPosts, isLoading, error, cacheStats, dataFreshness]);
};