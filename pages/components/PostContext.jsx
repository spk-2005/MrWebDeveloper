import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const PostsContext = createContext();

// Cache configuration
const CACHE_KEY = 'codelearn_posts_cache';
const CACHE_VERSION = '1.0';
const CACHE_DURATION = 10 * 60 * 1000; 

// Optimized storage utilities with better error handling
const storage = {
  get: (key) => {
    try {
      if (typeof window === 'undefined') return null;
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      
      // Check expiry and version
      if (parsed.expiry && Date.now() > parsed.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      
      if (parsed.version !== CACHE_VERSION) {
        localStorage.removeItem(key);
        return null;
      }
      
      return parsed.data;
    } catch (error) {
      console.warn('Cache read error:', error);
      try {
        localStorage.removeItem(key);
      } catch (cleanupError) {
        console.warn('Cache cleanup error:', cleanupError);
      }
      return null;
    }
  },
  
  set: (key, data) => {
    try {
      if (typeof window === 'undefined') return;
      
      const item = {
        data,
        expiry: Date.now() + CACHE_DURATION,
        version: CACHE_VERSION,
        timestamp: Date.now()
      };
      
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.warn('Cache write error:', error);
      // If storage is full, try to clear some space
      if (error.name === 'QuotaExceededError') {
        try {
          localStorage.clear();
          console.log('Cleared localStorage due to quota exceeded');
        } catch (clearError) {
          console.warn('Failed to clear localStorage:', clearError);
        }
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

export const PostsProvider = ({ children }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Create a memoized lookup map for O(1) post retrieval
  const postLookupMap = useMemo(() => {
    const map = new Map();
    allPosts.forEach(post => {
      if (post.language && post.heading) {
        const key = `${post.language.toLowerCase()}-${post.heading.toLowerCase()}`;
        map.set(key, post);
      }
    });
    return map;
  }, [allPosts]);

  // Group posts by language (memoized)
  const postsByLanguage = useMemo(() => {
    const grouped = {};
    allPosts.forEach(post => {
      const lang = post.language?.toLowerCase();
      if (lang) {
        if (!grouped[lang]) grouped[lang] = [];
        grouped[lang].push(post);
      }
    });
    return grouped;
  }, [allPosts]);

  // Optimized fetch function with retry logic and better error handling
  const fetchPosts = useCallback(async (forceRefresh = false) => {
    try {
      setError(null);
      
      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = storage.get(CACHE_KEY);
        if (cached && cached.posts && Array.isArray(cached.posts) && cached.posts.length > 0) {
          console.log('📦 Loading posts from cache');
          setAllPosts(cached.posts);
          setLastFetched(cached.timestamp);
          setIsInitialLoading(false);
          setRetryCount(0);
          return cached.posts;
        }
      }

      console.log('🌐 Fetching posts from API...');
      setIsInitialLoading(true);
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      let response;
      try {
        response = await fetch('/api/posts/all', {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'max-age=300', // 5 minutes browser cache
            'Accept': 'application/json',
          }
        });
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out. Please check your connection and try again.');
        }
        throw new Error(`Network error: ${fetchError.message}`);
      }
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: `;
        try {
          const errorData = await response.json();
          errorMessage += errorData.message || 'Failed to fetch posts';
          console.error('API Error Details:', errorData);
        } catch (parseError) {
          errorMessage += `Failed to fetch posts (${response.statusText})`;
        }
        throw new Error(errorMessage);
      }
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response format from server');
      }
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response data format');
      }
      
      if (!data.success) {
        throw new Error(data.message || 'API returned unsuccessful response');
      }
      
      // Validate posts data
      const posts = data.posts;
      if (!Array.isArray(posts)) {
        console.warn('Posts data is not an array:', typeof posts);
        throw new Error('Invalid posts data format from server');
      }
      
      // Process posts with better ID generation and validation
      const postsWithIds = posts.map((post, index) => {
        try {
          return {
            ...post,
            id: post.id || post._id || `post-${index}-${Date.now()}`,
            // Add computed fields for better performance
            searchKey: `${post.language || ''} ${post.heading || ''}`.toLowerCase(),
            slug: post.slug || (post.heading ? post.heading.replace(/\s+/g, '-').toLowerCase() : `post-${index}`)
          };
        } catch (processError) {
          console.warn('Error processing post at index', index, processError);
          return {
            id: `error-post-${index}`,
            language: 'UNKNOWN',
            heading: 'Error loading post',
            code: '// Error loading this post',
            likes: 0,
            views: 0,
            images: [],
            searchKey: 'error post',
            slug: `error-post-${index}`
          };
        }
      }).filter(post => post && post.id); // Filter out any null/undefined posts
      
      setAllPosts(postsWithIds);
      setLastFetched(Date.now());
      setRetryCount(0);
      
      // Cache the processed data
      storage.set(CACHE_KEY, {
        posts: postsWithIds,
        timestamp: Date.now()
      });
      
      console.log(`✅ Loaded ${postsWithIds.length} posts successfully`);
      return postsWithIds;
      
    } catch (err) {
      console.error('❌ Error fetching posts:', err);
      setError(err.message);
      
      // Try to use cached data as fallback
      const cached = storage.get(CACHE_KEY);
      if (cached && cached.posts && Array.isArray(cached.posts) && cached.posts.length > 0) {
        console.log('📦 Using cached data as fallback due to error');
        setAllPosts(cached.posts);
        setLastFetched(cached.timestamp);
        setError(`${err.message} (showing cached data)`);
        return cached.posts;
      }
      
      // If no cache available and this is a retryable error, set up retry
      if (retryCount < 3 && !err.message.includes('timed out')) {
        console.log(`🔄 Scheduling retry ${retryCount + 1}/3 in ${(retryCount + 1) * 2} seconds`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchPosts(forceRefresh);
        }, (retryCount + 1) * 2000);
      }
      
      throw err;
    } finally {
      setIsInitialLoading(false);
    }
  }, [retryCount]);

  // Initialize data loading
  useEffect(() => {
    fetchPosts().catch(err => {
      console.error('Initial fetch failed:', err);
      // Error is already handled in fetchPosts
    });
  }, [fetchPosts]);

  // Optimized getPost function using Map lookup
  const getPost = useCallback((language, heading) => {
    if (!language || !heading) {
      console.warn('getPost called with missing parameters:', { language, heading });
      return null;
    }
    
    const key = `${language.toLowerCase()}-${heading.toLowerCase()}`;
    const post = postLookupMap.get(key);
    
    if (post) {
      console.log('✅ Found post:', { language: post.language, heading: post.heading });
    } else {
      console.log('❌ Post not found for:', { language, heading });
    }
    
    return post || null;
  }, [postLookupMap]);

  // Optimized getPostsByLanguage function
  const getPostsByLanguage = useCallback((language) => {
    if (!language) {
      console.warn('getPostsByLanguage called with empty language');
      return [];
    }
    return postsByLanguage[language.toLowerCase()] || [];
  }, [postsByLanguage]);

  // Update post likes with optimistic updates
  const updatePostLikes = useCallback((postId, newLikesCount) => {
    if (!postId || typeof newLikesCount !== 'number') {
      console.warn('Invalid parameters for updatePostLikes:', { postId, newLikesCount });
      return;
    }
    
    setAllPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: Math.max(0, newLikesCount) }
          : post
      )
    );
  }, []);

  // Refresh function
  const refreshPosts = useCallback(() => {
    setRetryCount(0);
    return fetchPosts(true);
  }, [fetchPosts]);

  // Clear cache function
  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(CACHE_KEY);
      console.log('Cache cleared successfully');
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
    setRetryCount(0);
    return fetchPosts(true);
  }, [fetchPosts]);

  // Search posts function
  const searchPosts = useCallback((query) => {
    if (!query || typeof query !== 'string') {
      console.warn('Invalid search query:', query);
      return [];
    }
    
    const lowerQuery = query.toLowerCase().trim();
    if (lowerQuery.length === 0) return [];
    
    return allPosts.filter(post => {
      try {
        return post.searchKey?.includes(lowerQuery) ||
               post.code?.toLowerCase().includes(lowerQuery) ||
               post.description?.toLowerCase().includes(lowerQuery) ||
               post.tags?.some(tag => tag.toLowerCase().includes(lowerQuery));
      } catch (filterError) {
        console.warn('Error filtering post in search:', filterError);
        return false;
      }
    });
  }, [allPosts]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    allPosts,
    isInitialLoading,
    error,
    lastFetched,
    retryCount,
    getPost,
    getPostsByLanguage,
    updatePostLikes,
    refreshPosts,
    clearCache,
    searchPosts,
    // Additional computed values
    totalPosts: allPosts.length,
    availableLanguages: Object.keys(postsByLanguage),
    postsByLanguage,
    // Health status
    isHealthy: !error && allPosts.length > 0
  }), [
    allPosts,
    isInitialLoading,
    error,
    lastFetched,
    retryCount,
    getPost,
    getPostsByLanguage,
    updatePostLikes,
    refreshPosts,
    clearCache,
    searchPosts,
    postsByLanguage
  ]);

  return (
    <PostsContext.Provider value={contextValue}>
      {children}
    </PostsContext.Provider>
  );
};

// Additional custom hooks for specific use cases
export const usePost = (language, heading) => {
  const { getPost, isInitialLoading, error } = usePostsContext();
  
  return useMemo(() => ({
    post: getPost(language, heading),
    isLoading: isInitialLoading,
    error
  }), [getPost, language, heading, isInitialLoading, error]);
};

export const useLanguagePosts = (language) => {
  const { getPostsByLanguage, isInitialLoading, error } = usePostsContext();
  
  return useMemo(() => ({
    posts: getPostsByLanguage(language),
    isLoading: isInitialLoading,
    error
  }), [getPostsByLanguage, language, isInitialLoading, error]);
};

// Error boundary hook for better error handling
export const usePostsError = () => {
  const { error, refreshPosts, clearCache, retryCount } = usePostsContext();
  
  const retry = useCallback(() => {
    refreshPosts().catch(err => {
      console.error('Manual retry failed:', err);
    });
  }, [refreshPosts]);
  
  const resetCache = useCallback(() => {
    clearCache().catch(err => {
      console.error('Cache reset failed:', err);
    });
  }, [clearCache]);
  
  return {
    error,
    hasError: !!error,
    retry,
    resetCache,
    retryCount,
    canRetry: retryCount < 3
  };
};

// Default export (keep your existing page component)
const PostContextPage = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1>Post Context Provider</h1>
      <p>This page should not be accessed directly.</p>
      <p>It contains the context provider for managing posts throughout the application.</p>
    </div>
  );
};

export default PostContextPage;