import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const PostsContext = createContext();

// Cache configuration
const CACHE_KEY = 'codelearn_posts_cache';
const CACHE_VERSION = '1.0';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Optimized storage utilities
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

  // Create a memoized lookup map for O(1) post retrieval
  const postLookupMap = useMemo(() => {
    const map = new Map();
    allPosts.forEach(post => {
      const key = `${post.language?.toLowerCase()}-${post.heading?.toLowerCase()}`;
      map.set(key, post);
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

  // Optimized fetch function with retry logic
  const fetchPosts = useCallback(async (forceRefresh = false) => {
    try {
      setError(null);
      
      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = storage.get(CACHE_KEY);
        if (cached && cached.posts && Array.isArray(cached.posts)) {
          console.log('📦 Loading posts from cache');
          setAllPosts(cached.posts);
          setLastFetched(cached.timestamp);
          setIsInitialLoading(false);
          return;
        }
      }

      console.log('🌐 Fetching posts from API...');
      setIsInitialLoading(true);
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch('/api/posts/all', {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'max-age=300', // 5 minutes browser cache
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch posts`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'API returned unsuccessful response');
      }
      
      // Process posts with better ID generation
      const postsWithIds = (data.posts || []).map(post => ({
        ...post,
        id: post.id || post._id || `${post.language}-${post.heading}`.replace(/\s+/g, '-').toLowerCase(),
        // Add computed fields for better performance
        searchKey: `${post.language} ${post.heading}`.toLowerCase(),
        slug: post.heading?.replace(/\s+/g, '-').toLowerCase()
      }));
      
      setAllPosts(postsWithIds);
      setLastFetched(Date.now());
      
      // Cache the processed data
      storage.set(CACHE_KEY, {
        posts: postsWithIds,
        timestamp: Date.now()
      });
      
      console.log(`✅ Loaded ${postsWithIds.length} posts successfully`);
      
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please check your connection.');
      } else {
        setError(err.message);
      }
      console.error('❌ Error fetching posts:', err);
      
      // Try to use cached data as fallback
      const cached = storage.get(CACHE_KEY);
      if (cached && cached.posts) {
        console.log('📦 Using cached data as fallback');
        setAllPosts(cached.posts);
        setLastFetched(cached.timestamp);
      }
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  // Initialize data loading
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Optimized getPost function using Map lookup
  const getPost = useCallback((language, heading) => {
    if (!language || !heading) return null;
    
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
    if (!language) return [];
    return postsByLanguage[language.toLowerCase()] || [];
  }, [postsByLanguage]);

  // Update post likes with optimistic updates
  const updatePostLikes = useCallback((postId, newLikesCount) => {
    setAllPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: newLikesCount }
          : post
      )
    );
  }, []);

  // Refresh function
  const refreshPosts = useCallback(() => {
    return fetchPosts(true);
  }, [fetchPosts]);

  // Clear cache function
  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(CACHE_KEY);
      return fetchPosts(true);
    } catch (error) {
      console.warn('Failed to clear cache:', error);
      return fetchPosts(true);
    }
  }, [fetchPosts]);

  // Search posts function
  const searchPosts = useCallback((query) => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return allPosts.filter(post => 
      post.searchKey?.includes(lowerQuery) ||
      post.code?.toLowerCase().includes(lowerQuery)
    );
  }, [allPosts]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    allPosts,
    isInitialLoading,
    error,
    lastFetched,
    getPost,
    getPostsByLanguage,
    updatePostLikes,
    refreshPosts,
    clearCache,
    searchPosts,
    // Additional computed values
    totalPosts: allPosts.length,
    availableLanguages: Object.keys(postsByLanguage),
    postsByLanguage
  }), [
    allPosts,
    isInitialLoading,
    error,
    lastFetched,
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