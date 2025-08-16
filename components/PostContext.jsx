// components/PostContext.jsx - Optimized with request deduplication
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
  const [languagePosts, setLanguagePosts] = useState({});
  const [individualPosts, setIndividualPosts] = useState({});
  const [metadataCache, setMetadataCache] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [error, setError] = useState(null);

  // Request deduplication maps
  const pendingRequests = useRef(new Map());
  const lastRequestTime = useRef(new Map());

  // Debounce duplicate requests (prevent double fetching)
  const dedupDelay = 100; // ms

  // Enhanced request deduplication
  const createRequest = useCallback(async (key, requestFn, ttl = 5000) => {
    const now = Date.now();
    const lastTime = lastRequestTime.current.get(key);
    
    // If there's a recent request, wait a bit
    if (lastTime && (now - lastTime) < dedupDelay) {
      await new Promise(resolve => setTimeout(resolve, dedupDelay));
    }

    // Check if request is already pending
    if (pendingRequests.current.has(key)) {
      console.log(`🔄 Deduplicating request: ${key}`);
      return pendingRequests.current.get(key);
    }

    // Create new request
    console.log(`🚀 New request: ${key}`);
    lastRequestTime.current.set(key, now);
    
    const requestPromise = requestFn().finally(() => {
      // Clean up after request completes
      pendingRequests.current.delete(key);
      setTimeout(() => {
        lastRequestTime.current.delete(key);
      }, ttl);
    });

    pendingRequests.current.set(key, requestPromise);
    return requestPromise;
  }, []);


  // Optimized specific post loading with deduplication
// Fixed loadSpecificPost for nested route structure [language]/[heading].js
const loadSpecificPost = useCallback(async (language, heading) => {
  try {
    // Encode URL parameters to handle special characters
    const encodedLanguage = encodeURIComponent(language);
    const encodedHeading = encodeURIComponent(heading);
    
    console.log(`🔍 Loading specific post: ${language}/${heading}`);
    
    // URL structure matches: /api/posts/specific/[language]/[heading]
    const response = await fetch(
      `/api/posts/specific/${encodedLanguage}/${encodedHeading}`
    );

    if (!response.ok) {
      // More detailed error information
      const errorText = await response.text();
      console.error(`API Error ${response.status}:`, errorText);
      
      throw new Error(
        `Failed to load post: ${response.status} ${response.statusText}${
          errorText ? ` - ${errorText}` : ''
        }`
      );
    }

    const data = await response.json();
    
    // Cache the loaded post
    const cacheKey = `${language}-${heading}`;
    setIndividualPosts(prev => ({
      ...prev,
      [cacheKey]: data.post || data // Handle both response formats
    }));
    
    console.log(`✅ Loaded specific post: ${language}/${heading}`);
    return data.post || data; // Handle both response formats
    
  } catch (error) {
    console.error("Error loading specific post:", error);
    setError(`Failed to load post: ${error.message}`);
    throw error;
  }
}, []);


  // Smart getPost with fallback strategies
  const getPost = useCallback(async (language, heading) => {
    if (!language || !heading) {
      console.warn('Missing language or heading for getPost');
      return null;
    }

    try {
      const cacheKey = `${language}-${heading}`;

      // Strategy 1: Check individual cache first
      if (individualPosts[cacheKey]) {
        return individualPosts[cacheKey];
      }

      // Strategy 2: Check language cache for lightweight version
      const languageCache = languagePosts[language];
      if (languageCache) {
        const found = languageCache.find(post => 
          post.heading?.toLowerCase() === heading.toLowerCase()
        );
        
        if (found) {
          // If found but doesn't have full content, load full version
          if (!found.code) {
            return await loadSpecificPost(language, heading);
          }
          return found;
        }
      }

      // Strategy 3: Load specific post from API
      return await loadSpecificPost(language, heading);

    } catch (err) {
      console.error(`Error in getPost(${language}, ${heading}):`, err);
      return null;
    }
  }, [individualPosts, languagePosts, loadSpecificPost]);

  // Optimized language posts getter
  const getPostsByLanguage = useCallback(async (language) => {
    if (!language) return [];

    try {
      if (languagePosts[language]) {
        return languagePosts[language];
      }

      return await loadLanguagePosts(language);
    } catch (err) {
      console.error(`Error in getPostsByLanguage(${language}):`, err);
      return [];
    }
  }, [languagePosts]);

  // Enhanced search with caching
  const searchPosts = useCallback((query, options = {}) => {
    if (!query?.trim()) return [];

    const { limit = 20, language } = options;
    const searchTerm = query.toLowerCase().trim();

    let results = metadataCache.filter(post => {
      if (language && post.language?.toLowerCase() !== language.toLowerCase()) {
        return false;
      }

      return post.heading?.toLowerCase().includes(searchTerm) ||
             post.description?.toLowerCase().includes(searchTerm) ||
             post.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
    });

    return results.slice(0, limit);
  }, [metadataCache]);

  // Optimized like update with cache sync
  const updatePostLikes = useCallback(async (postId, newCount) => {
    try {
      // Optimistic update
      const updateFn = (post) => 
        post.id === postId ? { ...post, likes: Math.max(0, newCount) } : post;

      // Update all caches
      setMetadataCache(prev => prev.map(updateFn));
      
      setLanguagePosts(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(lang => {
          updated[lang] = updated[lang].map(updateFn);
        });
        return updated;
      });

      setIndividualPosts(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (updated[key].id === postId) {
            updated[key] = { ...updated[key], likes: Math.max(0, newCount) };
          }
        });
        return updated;
      });

      console.log(`✅ Updated likes for post ${postId}: ${newCount}`);
    } catch (err) {
      console.error('Error updating post likes:', err);
    }
  }, []);

  // Available languages
  const availableLanguages = useMemo(() => {
    return [...new Set(metadataCache.map(post => post.language))].filter(Boolean);
  }, [metadataCache]);

  // Clear cache and pending requests
  const clearCache = useCallback(() => {
    setLanguagePosts({});
    setIndividualPosts({});
    setMetadataCache([]);
    setError(null);
    
    // Clear pending requests
    pendingRequests.current.clear();
    lastRequestTime.current.clear();
    
    console.log('🧹 Cache cleared');
  }, []);

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
    getPostsByLanguage,
    loadSpecificPost,

    // Sync Actions
    searchPosts,
    updatePostLikes,
    clearCache,

    // Status & Stats
    isEmpty: !isInitialLoading && metadataCache.length === 0,
    isHealthy: !error && metadataCache.length > 0,
    cacheStats: {
      metadata: metadataCache.length,
      languageCaches: Object.keys(languagePosts).length,
      individualPosts: Object.keys(individualPosts).length,
      pendingRequests: pendingRequests.current.size
    }
  }), [
    metadataCache,
    availableLanguages,
    isInitialLoading,
    error,
    getPost,
    getPostsByLanguage,
    loadSpecificPost,
    searchPosts,
    updatePostLikes,
    clearCache,
    languagePosts,
    individualPosts
  ]);

  return (
    <PostsContext.Provider value={contextValue}>
      {children}
    </PostsContext.Provider>
  );
};

// Optimized hook with better loading states
export const usePost = (language, heading) => {
  const { getPost, isInitialLoading, error } = usePostsContext();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState(null);

  // Prevent duplicate requests with same parameters
  const requestKey = useMemo(() => 
    language && heading ? `${language}-${heading}` : null, 
    [language, heading]
  );

  useEffect(() => {
    if (!requestKey) return;
    
    // Prevent duplicate requests
    if (lastFetched === requestKey) return;

    let cancelled = false;

    const fetchPost = async () => {
      if (cancelled) return;
      
      setIsLoading(true);
      try {
        const result = await getPost(language, heading);
        if (!cancelled) {
          setPost(result);
          setLastFetched(requestKey);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error in usePost:', err);
          setPost(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchPost();

    return () => {
      cancelled = true;
    };
  }, [requestKey, language, heading, getPost, lastFetched]);

  return {
    post,
    isLoading: isLoading || isInitialLoading,
    error,
    found: !!post,
    lastFetched
  };
};

// Other hooks remain similar but with better error handling
export const useLanguagePosts = (language) => {
  const { getPostsByLanguage, isInitialLoading, error } = usePostsContext();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState(null);

  useEffect(() => {
    if (!language || lastFetched === language) return;

    let cancelled = false;

    const fetchPosts = async () => {
      if (cancelled) return;
      
      setIsLoading(true);
      try {
        const result = await getPostsByLanguage(language);
        if (!cancelled) {
          setPosts(result || []);
          setLastFetched(language);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error in useLanguagePosts:', err);
          setPosts([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      cancelled = true;
    };
  }, [language, getPostsByLanguage, lastFetched]);

  return {
    posts,
    count: posts.length,
    isLoading: isLoading || isInitialLoading,
    error,
    isEmpty: posts.length === 0 && !isLoading
  };
};

export default PostsProvider;