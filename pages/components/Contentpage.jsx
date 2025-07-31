import React, { useState, useEffect } from 'react';
import { ChevronRight, Heart, Eye, Calendar, Code2, Loader2, AlertCircle, BookOpen, Clock, ThumbsUp } from 'lucide-react';

export default function Contentpage({ 
  activeSection, 
  activeItem, 
  setActiveItem, 
  setActiveSection 
}) {
  // Add safety checks for the functions
  const handleSetActiveItem = (item) => {
    if (setActiveItem && typeof setActiveItem === 'function') {
      setActiveItem(item);
    }
  };

  const handleSetActiveSection = (section) => {
    if (setActiveSection && typeof setActiveSection === 'function') {
      setActiveSection(section);
    }
  };

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);

  // Fetch the specific post when activeSection and activeItem change
  useEffect(() => {
    if (activeSection && activeItem) {
      fetchPost();
    } else if (activeSection && !activeItem) {
      // Reset when only section is selected but no item
      setPost(null);
      setError(null);
    }
  }, [activeSection, activeItem]);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters to get the specific post
      const params = new URLSearchParams();
      params.append('language', activeSection);
      params.append('heading', activeItem);
      params.append('limit', '1'); // We expect only one post

      console.log('[Contentpage] Fetching post with params:', params.toString());

      const response = await fetch(`/api/posts?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('[Contentpage] Fetched data:', data);
      
      if (data.posts && data.posts.length > 0) {
        setPost(data.posts[0]); // Get the first (and should be only) post
      } else {
        setPost(null);
        setError(`No tutorial found for ${activeSection} - ${activeItem}`);
      }
      
    } catch (err) {
      console.error('[Contentpage] Error fetching post:', err);
      setError(err.message || 'Failed to load post');
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    
    try {
      // Simulate like functionality - you can implement actual API call here
      setLiked(!liked);
      // Update local post likes count
      setPost(prev => ({
        ...prev,
        likes: liked ? (prev.likes || 0) - 1 : (prev.likes || 0) + 1
      }));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error("Invalid date string:", dateString, e);
      return dateString; // Return original if invalid
    }
  };

  // This function is problematic for directly rendering HTML content.
  // If post.code contains actual HTML, it should be rendered using dangerouslySetInnerHTML,
  // but sanitization is crucial. If it's pure code string, `pre` and `code` tags are enough.
  // Given the current `dangerouslySetInnerHTML` usage with `replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')`,
  // it suggests `post.code` is a plain text code string, which is good.
  const processPostContent = (code) => {
    if (!code) return '';
    // This part converts newlines to <br> and spaces to &nbsp; for pre-formatted display
    return code.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
  };

  // Landing page when no section is selected
  if (!activeSection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 sm:p-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <Code2 className="w-20 h-20 sm:w-24 sm:h-24 text-blue-600 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Welcome to <span className="text-blue-600">CodeLearn</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Master web development with our comprehensive tutorials covering HTML, CSS, JavaScript, and Tailwind CSS.
              Choose a technology from the navigation above to get started!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {[
              { 
                name: 'HTML', 
                icon: '🏗️', 
                desc: 'Structure and markup',
                color: 'from-orange-500 to-red-500'
              },
              { 
                name: 'CSS', 
                icon: '🎨', 
                desc: 'Styling and design',
                color: 'from-blue-500 to-indigo-500'
              },
              { 
                name: 'JavaScript', 
                icon: '⚡', 
                desc: 'Interactive functionality',
                color: 'from-yellow-500 to-orange-500'
              },
              { 
                name: 'Tailwind', 
                icon: '🌪️', 
                desc: 'Utility-first CSS',
                color: 'from-green-500 to-teal-500'
              }
            ].map((tech, index) => (
              <div 
                key={index}
                onClick={() => handleSetActiveSection(tech.name)}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r ${tech.color} rounded-lg flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4 mx-auto`}>
                  {tech.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{tech.name}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{tech.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Ready to Start Learning?</h2>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Select any technology from the navigation bar above to explore tutorials and hands-on coding exercises.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-gray-500">
              <span className="flex items-center">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                1000+ Students
              </span>
              <span className="flex items-center">
                <Code2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Comprehensive Tutorials
              </span>
              <span className="flex items-center">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Free Forever
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // When section is selected but no item from sidebar
  if (activeSection && !activeItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8">
        <div className="text-center max-w-2xl mx-auto">
          <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 text-blue-600 mx-auto mb-4 sm:mb-6" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            {activeSection} Tutorials
          </h1>
          <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8">
            Select a topic from the sidebar to start learning {activeSection}. 
            Each topic contains detailed explanations, code examples, and practical exercises.
          </p>
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
            <p className="text-gray-700 mb-3 sm:mb-4 text-base sm:text-lg">
              <strong>Available Topics:</strong>
            </p>
            <div className="text-left space-y-1 sm:space-y-2 text-sm sm:text-base">
              {activeSection === 'HTML' && (
                <ul className="space-y-1 text-gray-600">
                  <li>• Prerequisites - Getting started with web development</li>
                  <li>• HTML Introduction - Learn the basics of HTML</li>
                  <li>• HTML Elements - Master HTML tags and structure</li>
                  <li>• HTML Attributes - Understanding element attributes</li>
                  <li>• HTML Forms - Creating interactive forms</li>
                </ul>
              )}
              {activeSection === 'CSS' && (
                <ul className="space-y-1 text-gray-600">
                  <li>• CSS Basics - Fundamentals of styling</li>
                  <li>• CSS Selectors - Targeting elements effectively</li>
                  <li>• CSS Properties - Styling properties and values</li>
                  <li>• CSS Flexbox - Modern layout with Flexbox</li>
                  <li>• CSS Grid - Advanced grid layouts</li>
                </ul>
              )}
              {activeSection === 'JavaScript' && (
                <ul className="space-y-1 text-gray-600">
                  <li>• JS Introduction - JavaScript fundamentals</li>
                  <li>• Variables - Working with data storage</li>
                  <li>• Functions - Creating reusable code blocks</li>
                  <li>• DOM Manipulation - Interacting with HTML</li>
                  <li>• Events - Handling user interactions</li>
                </ul>
              )}
              {activeSection === 'Tailwind' && (
                <ul className="space-y-1 text-gray-600">
                  <li>• Installation - Setting up Tailwind CSS</li>
                  <li>• Utility Classes - Using Tailwind utilities</li>
                  <li>• Responsive Design - Mobile-first development</li>
                  <li>• Components - Building reusable components</li>
                  <li>• Customization - Extending Tailwind</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 animate-spin mx-auto mb-3 sm:mb-4" />
          <p className="text-base sm:text-lg text-gray-600">Loading {activeSection} - {activeItem}...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md mx-auto p-6 sm:p-8 bg-white rounded-lg shadow-md">
          <AlertCircle className="w-14 h-14 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Tutorial Not Found</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchPost}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors text-sm sm:text-base"
            >
              Try Again
            </button>
            <button
              onClick={() => handleSetActiveItem(null)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg transition-colors text-sm sm:text-base"
            >
              Back to {activeSection} Topics
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No post found (after loading, no error, but still no post)
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md mx-auto p-6 sm:p-8 bg-white rounded-lg shadow-md">
          <Code2 className="w-14 h-14 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Tutorial Coming Soon
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            The tutorial for {activeSection} - {activeItem} is not available yet.
          </p>
          <button
            onClick={() => handleSetActiveItem(null)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors text-sm sm:text-base"
          >
            Browse Other Topics
          </button>
        </div>
      </div>
    );
  }

  // Display the full post
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Breadcrumb and Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <nav className="flex items-center text-xs sm:text-sm text-gray-600 mb-3 sm:mb-0">
            <button 
              onClick={() => handleSetActiveSection(null)}
              className="hover:text-blue-600 transition-colors"
              aria-label="Go to Home"
            >
              Home
            </button>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2" />
            <button
              onClick={() => handleSetActiveItem(null)}
              className="hover:text-blue-600 transition-colors"
              aria-label={`Go to ${activeSection} Topics`}
            >
              {activeSection}
            </button>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2" />
            <span className="text-gray-900 font-medium">{activeItem}</span>
          </nav>
          
          {/* Action Buttons (Like) */}
          <div className="flex items-center justify-end"> {/* Use justify-end to push to right on small screens */}
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-all text-sm sm:text-base ${
                liked 
                  ? 'bg-red-50 text-red-600 border border-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-pressed={liked}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span>{post.likes || 0} Likes</span>
            </button>
          </div>
        </div>

        {/* Post Title & Meta Info */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {activeItem} - {activeSection} Tutorial
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-8">
          <span className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1 text-blue-500" />
            Category: {activeSection}
          </span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-purple-500" />
            Reading Time: {post.readingTime || '5-10 mins'}
          </span>
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-green-500" />
            Last Updated: {formatDate(post.lastUpdated || new Date())}
          </span>
          <span className="flex items-center">
            <Eye className="w-4 h-4 mr-1 text-orange-500" />
            Views: {post.views || 0}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          {/* Post Content */}
          <div className="prose prose-sm sm:prose-base max-w-none"> {/* Tailwind Typography for content */}
            {post.content && (
              <div dangerouslySetInnerHTML={{ __html: post.content }} className="mb-6" />
            )}

            {post.code ? (
              <div className="bg-gray-800 text-white rounded-lg overflow-hidden font-mono text-sm sm:text-base">
                <div className="flex justify-between items-center bg-gray-700 px-4 py-2">
                  <span className="text-sm text-gray-300">Code Example</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(post.code.replace(/<br>/g, '\n').replace(/&nbsp;/g, ' '))}
                    className="flex items-center text-gray-300 hover:text-white transition-colors text-xs sm:text-sm"
                  >
                    <Code2 className="w-4 h-4 mr-1" /> Copy Code
                  </button>
                </div>
                <div className="overflow-x-auto p-4"> {/* Added horizontal scroll for code */}
                  <pre>
                    <code dangerouslySetInnerHTML={{ 
                      __html: processPostContent(post.code) // Use the processing function for display
                    }} />
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                <Code2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p>No code example available for this tutorial yet.</p>
              </div>
            )}
          </div>
        </article>

        {/* Footer Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8"> {/* Added bottom margin */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Was this tutorial helpful?
              </h3>
              <p className="text-gray-600 text-sm">
                Your feedback helps us improve our content.
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition-colors text-sm sm:text-base">
                <ThumbsUp className="w-4 h-4 inline-block mr-1" /> Yes
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg transition-colors text-sm sm:text-base">
                👎 No
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}