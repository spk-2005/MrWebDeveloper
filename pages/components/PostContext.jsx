// components/PostContext.jsx - Enhanced with better error handling
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
  const [allPosts, setAllPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Enhanced fetch function with detailed error handling
  const fetchPosts = useCallback(async (isRetry = false) => {
    console.log('🔄 Starting to fetch posts...', isRetry ? '(Retry)' : '');
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📡 Making API request to /api/posts/all');
      
      const response = await fetch('/api/posts/all', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📥 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        // Try to get error details from response
        let errorDetails;
        try {
          errorDetails = await response.json();
          console.log('❌ Error response body:', errorDetails);
        } catch (parseError) {
          console.log('❌ Could not parse error response:', parseError);
          errorDetails = { message: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        throw new Error(errorDetails.message || `Failed to fetch: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 Data received:', {
        success: data.success,
        postsCount: data.posts?.length || 0,
        hasMessage: !!data.message
      });
      
      if (!data.success) {
        throw new Error(data.message || 'API returned unsuccessful response');
      }
      
      if (!Array.isArray(data.posts)) {
        throw new Error('Invalid response format: posts is not an array');
      }
      
      // Process posts with better error handling
      const processedPosts = data.posts.map((post, index) => {
        try {
          return {
            id: post.id || post._id || `post-${index}`,
            language: post.language || 'UNKNOWN',
            heading: post.heading || 'Untitled',
            code: post.code || '',
            likes: parseInt(post.likes) || 0,
            views: parseInt(post.views) || 0,
            images: Array.isArray(post.images) ? post.images : [],
            difficulty: post.difficulty || 'BEGINNER',
            tags: Array.isArray(post.tags) ? post.tags : [],
            description: post.description || '',
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
          };
        } catch (processError) {
          console.warn('⚠️ Error processing post at index', index, ':', processError);
          return null;
        }
      }).filter(Boolean); // Remove any null posts
      
      console.log(`✅ Successfully processed ${processedPosts.length} posts`);
      setAllPosts(processedPosts);
      setRetryCount(0); // Reset retry count on success
      
    } catch (err) {
      console.error('❌ Fetch error:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      
      setError(err.message);
      
      // Auto-retry logic for certain errors
      if (!isRetry && retryCount < 2) {
        console.log(`🔄 Auto-retrying in 2 seconds... (attempt ${retryCount + 1})`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => fetchPosts(true), 2000);
      }
      
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [retryCount]);

  // Load data on mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Simple lookup functions (unchanged)
  const getPost = useCallback((language, heading) => {
    if (!language || !heading) return null;
    
    return allPosts.find(post => 
      post.language.toLowerCase() === language.toLowerCase() &&
      post.heading.toLowerCase() === heading.toLowerCase()
    ) || null;
  }, [allPosts]);

  const getPostsByLanguage = useCallback((language) => {
    if (!language) return [];
    
    return allPosts.filter(post => 
      post.language.toLowerCase() === language.toLowerCase()
    );
  }, [allPosts]);

  const searchPosts = useCallback((query, options = {}) => {
    if (!query?.trim()) return [];
    
    const { limit = 20, language } = options;
    const searchTerm = query.toLowerCase().trim();
    
    let results = allPosts.filter(post => {
      if (language && post.language.toLowerCase() !== language.toLowerCase()) {
        return false;
      }
      
      return post.heading.toLowerCase().includes(searchTerm) ||
             post.description?.toLowerCase().includes(searchTerm) ||
             post.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
    });
    
    return results.slice(0, limit);
  }, [allPosts]);

  const updatePostLikes = useCallback((postId, newCount) => {
    setAllPosts(prev => 
      prev.map(post => 
        post.id === postId ? { ...post, likes: Math.max(0, newCount) } : post
      )
    );
  }, []);

  // Manual retry function
  const retry = useCallback(() => {
    console.log('🔄 Manual retry requested');
    setRetryCount(0);
    fetchPosts();
  }, [fetchPosts]);

  // Context value
  const contextValue = useMemo(() => ({
    // Data
    allPosts,
    totalPosts: allPosts.length,
    availableLanguages: [...new Set(allPosts.map(post => post.language))],
    
    // State
    isLoading,
    isInitialLoading,
    error,
    retryCount,
    
    // Actions
    getPost,
    getPostsByLanguage,
    searchPosts,
    updatePostLikes,
    refreshPosts: fetchPosts,
    retry,
    
    // Status
    isEmpty: !isLoading && !isInitialLoading && allPosts.length === 0,
    isHealthy: !error && allPosts.length > 0,
    canRetry: !isLoading && !!error,
  }), [
    allPosts,
    isLoading,
    isInitialLoading,
    error,
    retryCount,
    getPost,
    getPostsByLanguage,
    searchPosts,
    updatePostLikes,
    fetchPosts,
    retry
  ]);

  return (
    <PostsContext.Provider value={contextValue}>
      {children}
    </PostsContext.Provider>
  );
};

// Enhanced hooks (unchanged from previous version)
export const usePost = (language, heading) => {
  const { getPost, isInitialLoading, error } = usePostsContext();
  const post = getPost(language, heading);
  
  return {
    post,
    isLoading: isInitialLoading,
    error,
    found: !!post
  };
};

export const useLanguagePosts = (language) => {
  const { getPostsByLanguage, isInitialLoading, error } = usePostsContext();
  const posts = getPostsByLanguage(language);
  
  return {
    posts,
    count: posts.length,
    isLoading: isInitialLoading,
    error,
    isEmpty: posts.length === 0
  };
};

export const useSearch = (query, options = {}) => {
  const { searchPosts, isInitialLoading } = usePostsContext();
  
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
};

export default PostsProvider; 