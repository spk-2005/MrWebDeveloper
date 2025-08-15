// components/PostContext.jsx - Updated with fixed API endpoints
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const PostsContext = createContext();

export const usePostsContext = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePostsContext must be used within a PostsProvider');
  }
  return context;
};

export const PostsProvider = ({ children }) => {
  // Separate state for different types of data
  const [languagePosts, setLanguagePosts] = useState({}); // Cache posts by language
  const [individualPosts, setIndividualPosts] = useState({}); // Cache individual posts
  const [metadataCache, setMetadataCache] = useState([]); // Lightweight metadata only
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load minimal metadata first (just for listings/navigation)
  const loadMetadata = useCallback(async () => {
    if (metadataCache.length > 0) return; // Already loaded
    
    console.log('🔄 Loading metadata...');
    setIsInitialLoading(true);
    
    try {
      const response = await fetch('/api/posts/all?fields=minimal&limit=100', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.posts)) {
        setMetadataCache(data.posts);
        console.log(`✅ Loaded ${data.posts.length} post metadata`);
      }
    } catch (err) {
      console.error('❌ Failed to load metadata:', err);
      setError(err.message);
    } finally {
      setIsInitialLoading(false);
    }
  }, [metadataCache.length]);

  // Load posts for a specific language (lazy loading)
  const loadLanguagePosts = useCallback(async (language) => {
    if (languagePosts[language]) return languagePosts[language]; // Already cached
    
    console.log(`🔄 Loading ${language} posts...`);
    
    try {
      // FIXED: Use new API endpoint structure
      const response = await fetch(`/api/posts/language/${language}?includeCode=false&limit=50`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.posts)) {
        setLanguagePosts(prev => ({
          ...prev,
          [language]: data.posts
        }));
        console.log(`✅ Cached ${data.posts.length} ${language} posts`);
        return data.posts;
      }
      
      return [];
    } catch (err) {
      console.error(`❌ Failed to load ${language} posts:`, err);
      return [];
    }
  }, [languagePosts]);

  // Load individual post with full content (only when needed)
  const loadSpecificPost = useCallback(async (language, heading) => {
    const cacheKey = `${language}-${heading}`;
    
    if (individualPosts[cacheKey]) {
      console.log(`📋 Using cached post: ${cacheKey}`);
      return individualPosts[cacheKey];
    }
    
    console.log(`🔄 Loading specific post: ${language}/${heading}`);
    
    try {
      const headingSlug = heading.replace(/\s+/g, '-').toLowerCase();
      // FIXED: Use new catch-all API endpoint structure
      const response = await fetch(`/api/posts/specific/${language}/${headingSlug}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // Post not found
        }
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.post) {
        setIndividualPosts(prev => ({
          ...prev,
          [cacheKey]: data.post
        }));
        console.log(`✅ Cached individual post: ${cacheKey}`);
        return data.post;
      }
      
      return null;
    } catch (err) {
      console.error(`❌ Failed to load specific post ${cacheKey}:`, err);
      return null;
    }
  }, [individualPosts]);

  // Initialize metadata on mount
  useEffect(() => {
    loadMetadata();
  }, [loadMetadata]);

  // Optimized getPost function with lazy loading
  const getPost = useCallback(async (language, heading) => {
    if (!language || !heading) return null;
    
    // Try to get from individual cache first
    const cacheKey = `${language}-${heading}`;
    if (individualPosts[cacheKey]) {
      return individualPosts[cacheKey];
    }
    
    // Try to find in language cache (without full content)
    const languageCache = languagePosts[language];
    if (languageCache) {
      const found = languageCache.find(post => 
        post.heading?.toLowerCase() === heading.toLowerCase()
      );
      if (found && !found.code) {
        // Found in cache but without full content, load full version
        return await loadSpecificPost(language, heading);
      }
      if (found) return found;
    }
    
    // Not in cache, load specific post
    return await loadSpecificPost(language, heading);
  }, [individualPosts, languagePosts, loadSpecificPost]);

  // Get posts by language with lazy loading
  const getPostsByLanguage = useCallback(async (language) => {
    if (!language) return [];
    
    // Check if already cached
    if (languagePosts[language]) {
      return languagePosts[language];
    }
    
    // Load from API
    return await loadLanguagePosts(language);
  }, [languagePosts, loadLanguagePosts]);

  // Search function using metadata cache first
  const searchPosts = useCallback((query, options = {}) => {
    if (!query?.trim()) return [];
    
    const { limit = 20, language } = options;
    const searchTerm = query.toLowerCase().trim();
    
    // Search in metadata cache first (fast)
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

  // Get available languages from metadata
  const availableLanguages = useMemo(() => {
    return [...new Set(metadataCache.map(post => post.language))].filter(Boolean);
  }, [metadataCache]);

  // Update post likes function
  const updatePostLikes = useCallback((postId, newCount) => {
    // Update in all caches
    setMetadataCache(prev => 
      prev.map(post => 
        post.id === postId ? { ...post, likes: Math.max(0, newCount) } : post
      )
    );
    
    setLanguagePosts(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(lang => {
        updated[lang] = updated[lang].map(post =>
          post.id === postId ? { ...post, likes: Math.max(0, newCount) } : post
        );
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
  }, []);

  // Clear cache function for admin/development
  const clearCache = useCallback(() => {
    setLanguagePosts({});
    setIndividualPosts({});
    setMetadataCache([]);
    setError(null);
  }, []);

  // Context value
  const contextValue = useMemo(() => ({
    // Data
    metadataCache,
    totalPosts: metadataCache.length,
    availableLanguages,
    
    // State
    isInitialLoading,
    error,
    
    // Async Actions (return promises)
    getPost,
    getPostsByLanguage,
    loadSpecificPost,
    
    // Sync Actions
    searchPosts,
    updatePostLikes,
    clearCache,
    refreshMetadata: loadMetadata,
    
    // Status
    isEmpty: !isInitialLoading && metadataCache.length === 0,
    isHealthy: !error && metadataCache.length > 0,
    cacheStats: {
      metadata: metadataCache.length,
      languageCaches: Object.keys(languagePosts).length,
      individualPosts: Object.keys(individualPosts).length
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
    loadMetadata,
    languagePosts,
    individualPosts
  ]);

  return (
    <PostsContext.Provider value={contextValue}>
      {children}
    </PostsContext.Provider>
  );
};

// Updated hooks for async operations
export const usePost = (language, heading) => {
  const { getPost, isInitialLoading, error } = usePostsContext();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!language || !heading) return;
    
    let cancelled = false;
    
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const result = await getPost(language, heading);
        if (!cancelled) {
          setPost(result);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching post:', err);
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
  }, [language, heading, getPost]);

  return {
    post,
    isLoading: isLoading || isInitialLoading,
    error,
    found: !!post
  };
};

export const useLanguagePosts = (language) => {
  const { getPostsByLanguage, isInitialLoading, error } = usePostsContext();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!language) return;
    
    let cancelled = false;
    
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const result = await getPostsByLanguage(language);
        if (!cancelled) {
          setPosts(result || []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching language posts:', err);
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
  }, [language, getPostsByLanguage]);

  return {
    posts,
    count: posts.length,
    isLoading: isLoading || isInitialLoading,
    error,
    isEmpty: posts.length === 0 && !isLoading
  };
};

export const useSearch = (query, options = {}) => {
  const { searchPosts, isInitialLoading } = usePostsContext();
  
  const results = useMemo(() => {
    if (!query?.trim() || isInitialLoading) {
      return [];
    }
    return searchPosts(query, options);
  }, [query, options, searchPosts, isInitialLoading]);

  return {
    results,
    count: results.length,
    isSearching: false,
    hasResults: results.length > 0
  };
};

export default PostsProvider;