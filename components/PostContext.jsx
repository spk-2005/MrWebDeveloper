// components/PostContext.jsx - Optimized with proper request deduplication and caching
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';

const PostsContext = createContext();

export const usePostsContext = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePostsContext must be used within a PostsProvider');
  }
  return context;
};

export const PostsProvider = ({ children }) => {
  // Core state
  const [posts, setPosts] = useState(new Map()); // Use Map for O(1) lookups
  const [metadataCache, setMetadataCache] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  // Request management
  const activeRequests = useRef(new Map());
  const requestCache = useRef(new Map());
  const retryAttempts = useRef(new Map());

  // Constants
  const MAX_RETRIES = 2;
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  const REQUEST_TIMEOUT = 10000; // 10 seconds

  // Create unique cache key
  const getCacheKey = useCallback((language, heading) => {
    if (!language || !heading) return null;
    return `${language.toLowerCase()}_${heading.toLowerCase().replace(/\s+/g, '_')}`;
  }, []);

  // Enhanced request deduplication with timeout and retry logic
  const makeRequest = useCallback(async (url, cacheKey, options = {}) => {
    const { timeout = REQUEST_TIMEOUT, maxRetries = MAX_RETRIES } = options;
    
    // Check if request is already in progress
    if (activeRequests.current.has(cacheKey)) {
      console.log(`🔄 Deduplicating request for: ${cacheKey}`);
      return activeRequests.current.get(cacheKey);
    }

    // Check cache first
    const cachedEntry = requestCache.current.get(cacheKey);
    if (cachedEntry && (Date.now() - cachedEntry.timestamp) < CACHE_TTL) {
      console.log(`⚡ Cache HIT for: ${cacheKey}`);
      return cachedEntry.data;
    }

    // Create new request with timeout and retry logic
    const requestPromise = (async () => {
      let lastError = null;
      const currentRetries = retryAttempts.current.get(cacheKey) || 0;

      for (let attempt = 0; attempt <= Math.min(currentRetries + maxRetries, MAX_RETRIES); attempt++) {
        try {
          console.log(`🚀 Request attempt ${attempt + 1} for: ${cacheKey}`);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);

          const response = await fetch(url, {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache',
            },
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
          }

          const data = await response.json();
          
          if (!data.success) {
            throw new Error(data.message || 'API request failed');
          }

          // Cache successful response
          requestCache.current.set(cacheKey, {
            data: data.post,
            timestamp: Date.now(),
          });

          // Reset retry count on success
          retryAttempts.current.delete(cacheKey);
          
          console.log(`✅ Request successful for: ${cacheKey}`);
          return data.post;

        } catch (error) {
          lastError = error;
          console.warn(`⚠️ Request attempt ${attempt + 1} failed for ${cacheKey}:`, error.message);
          
          if (attempt < maxRetries && !error.name === 'AbortError') {
            // Exponential backoff: 500ms, 1s, 2s
            const delay = Math.min(500 * Math.pow(2, attempt), 2000);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }

      // Update retry count
      retryAttempts.current.set(cacheKey, currentRetries + 1);
      throw lastError;
    })();

    // Store active request
    activeRequests.current.set(cacheKey, requestPromise);

    // Clean up after completion
    requestPromise.finally(() => {
      activeRequests.current.delete(cacheKey);
    });

    return requestPromise;
  }, []);

  // Optimized post loading with proper error handling
  const loadSpecificPost = useCallback(async (language, heading) => {
    if (!language || !heading) {
      throw new Error('Language and heading are required');
    }

    const cacheKey = getCacheKey(language, heading);
    if (!cacheKey) {
      throw new Error('Invalid language or heading parameters');
    }

    // Check in-memory cache first
    if (posts.has(cacheKey)) {
      console.log(`💾 Memory cache HIT for: ${cacheKey}`);
      return posts.get(cacheKey);
    }

    try {
      const encodedLanguage = encodeURIComponent(language);
      const encodedHeading = encodeURIComponent(heading);
      const url = `/api/posts/specific/${encodedLanguage}/${encodedHeading}`;

      const post = await makeRequest(url, cacheKey);

      if (post) {
        // Store in state using functional update to avoid stale closures
        setPosts(prev => new Map(prev).set(cacheKey, post));
        
        console.log(`✅ Post loaded and cached: ${language}/${heading}`);
        return post;
      } else {
        throw new Error('No post data received');
      }

    } catch (error) {
      console.error(`❌ Failed to load post ${language}/${heading}:`, error.message);
      setError(`Failed to load "${heading}": ${error.message}`);
      throw error;
    }
  }, [posts, getCacheKey, makeRequest]);

  // Enhanced getPost with better caching strategy
  const getPost = useCallback(async (language, heading) => {
    if (!language || !heading) {
      console.warn('Missing parameters for getPost');
      return null;
    }

    const cacheKey = getCacheKey(language, heading);
    if (!cacheKey) return null;

    try {
      // First check memory cache
      if (posts.has(cacheKey)) {
        return posts.get(cacheKey);
      }

      // If not in memory, load it
      return await loadSpecificPost(language, heading);

    } catch (error) {
      console.error(`Error in getPost(${language}, ${heading}):`, error.message);
      return null;
    }
  }, [posts, getCacheKey, loadSpecificPost]);

  // Optimized search with better performance
  const searchPosts = useCallback((query, options = {}) => {
    if (!query?.trim()) return [];

    const { limit = 20, language } = options;
    const searchTerm = query.toLowerCase().trim();

    let results = metadataCache.filter(post => {
      if (language && post.language?.toLowerCase() !== language.toLowerCase()) {
        return false;
      }

      return (
        post.heading?.toLowerCase().includes(searchTerm) ||
        post.description?.toLowerCase().includes(searchTerm) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    });

    return results.slice(0, limit);
  }, [metadataCache]);

  // Optimized like update with optimistic updates
  const updatePostLikes = useCallback(async (postId, action) => {
    if (!postId || !action) return false;

    const increment = action === 'like' ? 1 : -1;

    try {
      // Optimistic update - update UI immediately
      setPosts(prev => {
        const updated = new Map(prev);
        for (const [key, post] of updated) {
          if (post.id === postId) {
            updated.set(key, {
              ...post,
              likes: Math.max(0, (post.likes || 0) + increment)
            });
            break;
          }
        }
        return updated;
      });

      // Update metadata cache
      setMetadataCache(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: Math.max(0, (post.likes || 0) + increment) }
          : post
      ));

      console.log(`✅ Optimistic like update for post ${postId}`);
      return true;

    } catch (error) {
      console.error('Error updating post likes:', error);
      return false;
    }
  }, []);

  // Clear cache and reset state
  const clearCache = useCallback(() => {
    setPosts(new Map());
    setMetadataCache([]);
    setError(null);
    
    // Clear all caches and requests
    activeRequests.current.clear();
    requestCache.current.clear();
    retryAttempts.current.clear();
    
    console.log('🧹 All caches cleared');
  }, []);

  // Available languages from metadata
  const availableLanguages = useMemo(() => {
    return [...new Set(metadataCache.map(post => post.language))].filter(Boolean);
  }, [metadataCache]);

  // Initialize loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isInitialLoading) {
        setIsInitialLoading(false);
      }
    }, 100); // Quick initialization

    return () => clearTimeout(timer);
  }, [isInitialLoading]);

  // Context value with performance monitoring
  const contextValue = useMemo(() => ({
    // Data
    metadataCache,
    totalPosts: metadataCache.length,
    availableLanguages,

    // State
    isInitialLoading,
    error,

    // Async Actions
    getPost,
    loadSpecificPost,

    // Sync Actions
    searchPosts,
    updatePostLikes,
    clearCache,

    // Status & Stats
    isEmpty: !isInitialLoading && metadataCache.length === 0,
    isHealthy: !error,
    cacheStats: {
      inMemoryPosts: posts.size,
      metadataCount: metadataCache.length,
      activeRequests: activeRequests.current.size,
      cachedRequests: requestCache.current.size,
      retryAttempts: retryAttempts.current.size,
    }
  }), [
    metadataCache,
    availableLanguages,
    isInitialLoading,
    error,
    getPost,
    loadSpecificPost,
    searchPosts,
    updatePostLikes,
    clearCache,
    posts.size
  ]);

  return (
    <PostsContext.Provider value={contextValue}>
      {children}
    </PostsContext.Provider>
  );
};

// Optimized usePost hook with better loading states
export const usePost = (language, heading) => {
  const { getPost, isInitialLoading, error } = usePostsContext();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  
  // Prevent re-fetching same post
  const currentRequest = useRef(null);
  const lastRequestKey = useRef(null);

  useEffect(() => {
    if (!language || !heading) {
      setPost(null);
      setLoadError(null);
      return;
    }

    const requestKey = `${language}-${heading}`;
    
    // Prevent duplicate requests
    if (lastRequestKey.current === requestKey) {
      return;
    }

    lastRequestKey.current = requestKey;
    setIsLoading(true);
    setLoadError(null);

    // Cancel previous request if exists
    if (currentRequest.current) {
      currentRequest.current.cancelled = true;
    }

    const request = { cancelled: false };
    currentRequest.current = request;

    getPost(language, heading)
      .then(result => {
        if (!request.cancelled) {
          setPost(result);
          setLoadError(result ? null : new Error('Post not found'));
        }
      })
      .catch(err => {
        if (!request.cancelled) {
          console.error('Error in usePost:', err);
          setPost(null);
          setLoadError(err);
        }
      })
      .finally(() => {
        if (!request.cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      if (currentRequest.current) {
        currentRequest.current.cancelled = true;
      }
    };
  }, [language, heading, getPost]);

  return {
    post,
    isLoading: isLoading || isInitialLoading,
    error: loadError || error,
    found: !!post && !loadError,
    isReady: !isLoading && !isInitialLoading,
  };
};

export default PostsProvider;