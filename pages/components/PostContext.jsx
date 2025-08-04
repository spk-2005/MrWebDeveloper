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
        
        // Ensure each post has a proper ID
        const postsWithIds = (data.posts || []).map(post => ({
          ...post,
          // Use the existing id field, or fall back to _id, or create a unique ID
          id: post.id || post._id || `${post.language}-${post.heading}`.replace(/\s+/g, '-').toLowerCase()
        }));
        
        setAllPosts(postsWithIds);
        console.log('Loaded posts:', postsWithIds); // Debug log
        
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
    const post = allPosts.find(post => 
      post.language?.toLowerCase() === language?.toLowerCase() &&
      post.heading?.toLowerCase() === heading?.toLowerCase()
    );
    
    if (post) {
      console.log('Found post:', post); // Debug log
      return post;
    }
    
    console.log('Post not found for:', { language, heading }); // Debug log
    console.log('Available posts:', allPosts.map(p => ({ language: p.language, heading: p.heading, id: p.id }))); // Debug log
    return null;
  };

  // Helper function to get posts by language
  const getPostsByLanguage = (language) => {
    return allPosts.filter(post => 
      post.language?.toLowerCase() === language?.toLowerCase()
    );
  };

  // Helper function to update a post's likes locally (for optimistic updates)
  const updatePostLikes = (postId, newLikesCount) => {
    setAllPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: newLikesCount }
          : post
      )
    );
  };

  const value = {
    allPosts,
    isInitialLoading,
    error,
    getPost,
    getPostsByLanguage,
    updatePostLikes
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