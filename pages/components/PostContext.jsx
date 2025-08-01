import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all posts on app initialization
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        setIsInitialLoading(true);
        
        // Fetch all posts at once
        const response = await fetch('/api/posts/all');
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        setAllPosts(data.posts || []);
        
      } catch (err) {
        console.error('Error fetching all posts:', err);
        setError(err.message);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  // Helper function to get a specific post
  const getPost = (language, heading) => {
    return allPosts.find(post => 
      post.language?.toLowerCase() === language?.toLowerCase() && 
      post.heading?.toLowerCase() === heading?.toLowerCase()
    );
  };

  // Helper function to get posts by language
  const getPostsByLanguage = (language) => {
    return allPosts.filter(post => 
      post.language?.toLowerCase() === language?.toLowerCase()
    );
  };

  const value = {
    allPosts,
    isInitialLoading,
    error,
    getPost,
    getPostsByLanguage
  };

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
};

// Default export to satisfy Next.js page requirements
// This creates a dummy page that users shouldn't access directly
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