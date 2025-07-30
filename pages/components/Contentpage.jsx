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
        likes: liked ? prev.likes - 1 : prev.likes + 1
      }));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const processPostContent = (code) => {
    if (!code) return '';
    
    // Remove any HTML tags for safety and better display
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = code;
    return tempDiv.textContent || tempDiv.innerText || code;
  };

  // Landing page when no section is selected
  if (!activeSection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <Code2 className="w-24 h-24 text-blue-600 mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Welcome to <span className="text-blue-600">CodeLearn</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Master web development with our comprehensive tutorials covering HTML, CSS, JavaScript, and Tailwind CSS.
              Choose a technology from the navigation above to get started!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${tech.color} rounded-lg flex items-center justify-center text-2xl mb-4 mx-auto`}>
                  {tech.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tech.name}</h3>
                <p className="text-gray-600 text-sm">{tech.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Learning?</h2>
            <p className="text-gray-600 mb-6">
              Select any technology from the navigation bar above to explore tutorials and hands-on coding exercises.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                1000+ Students
              </span>
              <span className="flex items-center">
                <Code2 className="w-4 h-4 mr-1" />
                Comprehensive Tutorials
              </span>
              <span className="flex items-center">
                <Heart className="w-4 h-4 mr-1" />
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center max-w-2xl mx-auto">
          <BookOpen className="w-20 h-20 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {activeSection} Tutorials
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Select a topic from the sidebar to start learning {activeSection}. 
            Each topic contains detailed explanations, code examples, and practical exercises.
          </p>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <p className="text-gray-700 mb-4">
              <strong>Available Topics:</strong>
            </p>
            <div className="text-left space-y-2">
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading {activeSection} - {activeItem}...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tutorial Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchPost}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => handleSetActiveItem(null)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
            >
              Back to {activeSection} Topics
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No post found
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <Code2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tutorial Coming Soon
          </h2>
          <p className="text-gray-600 mb-6">
            The tutorial for {activeSection} - {activeItem} is not available yet.
          </p>
          <button
            onClick={() => handleSetActiveItem(null)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Browse Other Topics
          </button>
        </div>
      </div>
    );
  }

  // Display the full post
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-600 mb-6">
            <button 
              onClick={() => handleSetActiveSection(null)}
              className="hover:text-blue-600 transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-4 h-4 mx-2" />
            <button
              onClick={() => handleSetActiveItem(null)}
              className="hover:text-blue-600 transition-colors"
            >
              {activeSection}
            </button>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900 font-medium">{activeItem}</span>
          </nav>

          {/* Post Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title || `${activeSection} - ${activeItem}`}
            </h1>
            
            {post.description && (
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {post.description}
              </p>
            )}

            {/* Post Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                {post.language}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                {post.heading}
              </span>
              <span className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(post.createdAt)}
              </span>
              <span className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                {Math.ceil(post.code?.length / 1000) || 5} min read
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                liked 
                  ? 'bg-red-50 text-red-600 border border-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span>{post.likes || 0} Likes</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <ThumbsUp className="w-4 h-4" />
              <span>Helpful</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Content Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <h2 className="text-2xl font-bold mb-2">Tutorial Content</h2>
            <p className="text-blue-100">
              Follow along with this comprehensive guide to master {activeSection} {activeItem}
            </p>
          </div>

          {/* Post Content */}
          <div className="p-8">
            {post.code ? (
              <div className="space-y-6">
                {/* Code Content */}
                <div>
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                      <span className="text-gray-300 text-sm font-medium">
                        {activeSection} - {activeItem}
                      </span>
                      <button className="text-gray-400 hover:text-white text-sm">
                        Copy Code
                      </button>
                    </div>
                    <div className="p-6 overflow-x-auto">
                      <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        <code dangerouslySetInnerHTML={{ 
                          __html: post.code.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')
                        }} />
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    💡 What You'll Learn
                  </h3>
                  <ul className="space-y-2 text-blue-800">
                    <li>• Understanding {activeSection} {activeItem} concepts</li>
                    <li>• Practical implementation techniques</li>
                    <li>• Best practices and common patterns</li>
                    <li>• Real-world applications and examples</li>
                  </ul>
                </div>

                {/* Practice Section */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">
                    🚀 Try It Yourself
                  </h3>
                  <p className="text-green-800 mb-4">
                    Copy the code above and experiment with it in your development environment. 
                    Try modifying values and see how it affects the output.
                  </p>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Open in CodePen
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Code2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No content available for this tutorial yet.</p>
              </div>
            )}
          </div>
        </article>

        {/* Footer Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Was this tutorial helpful?
              </h3>
              <p className="text-gray-600 text-sm">
                Your feedback helps us improve our content
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
                👍 Yes
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors">
                👎 No
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}