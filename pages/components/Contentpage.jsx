// components/Contentpage.js - Complete Child Component

import React from 'react';
import { ChevronRight, Heart, Eye, Calendar, Code2, Loader2, AlertCircle, BookOpen, Clock, ThumbsUp } from 'lucide-react';

export default function Contentpage({ 
  activeSection, 
  activeItem, 
  setActiveItem, 
  setActiveSection,
  contentData, // The fetched post data
  isLoading // Prop to handle loading state
}) {
  // The component no longer needs to fetch data, so we remove `useEffect` and `fetchPost`
  const post = contentData;
  const error = post === null; // Simple check, parent handles more specific errors

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

  const handleLike = () => {
    // Implement like functionality here or call a parent function
    console.log('Like clicked');
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
      return dateString;
    }
  };

  const processPostContent = (code) => {
    if (!code) return '';
    return code.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
  };

  // If the parent is loading, show a spinner (for transitions)
  if (isLoading && !post) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Handle the "not found" state passed from the parent
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md mx-auto p-6 sm:p-8 bg-white rounded-lg shadow-md">
          <AlertCircle className="w-14 h-14 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Tutorial Not Found</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">The content you are looking for could not be found.</p>
          <button
            onClick={() => handleSetActiveItem(null)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors text-sm sm:text-base"
          >
            Back to Topics
          </button>
        </div>
      </div>
    );
  }

  // Final check to prevent rendering if no post data is available
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8">
        <div className="text-center max-w-2xl mx-auto">
          <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 text-blue-600 mx-auto mb-4 sm:mb-6" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            {activeSection} Tutorials
          </h1>
          <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8">
            Select a topic from the sidebar to start learning.
          </p>
        </div>
      </div>
    );
  }

  // Display the full post
  return (
    <div className="min-h-screen">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <nav className="flex items-center text-xs sm:text-sm text-gray-600 mb-3 sm:mb-0">
            <button onClick={() => handleSetActiveSection(null)} className="hover:text-blue-600 transition-colors" aria-label="Go to Home">Home</button>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2" />
            <button onClick={() => handleSetActiveItem(null)} className="hover:text-blue-600 transition-colors" aria-label={`Go to ${activeSection} Topics`}>{activeSection}</button>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2" />
            <span className="text-gray-900 font-medium">{activeItem}</span>
          </nav>
          <div className="flex items-center justify-end">
            <button onClick={handleLike} className="flex items-center space-x-2 px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-all text-sm sm:text-base bg-gray-100 text-gray-600 hover:bg-gray-200" aria-pressed={false}>
              <Heart className="w-4 h-4" />
              <span>{post.likes || 0} Likes</span>
            </button>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {activeItem} - {activeSection} Tutorial
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-8">
          <span className="flex items-center"><BookOpen className="w-4 h-4 mr-1 text-blue-500" />Category: {activeSection}</span>
          <span className="flex items-center"><Clock className="w-4 h-4 mr-1 text-purple-500" />Reading Time: {post.readingTime || '5-10 mins'}</span>
          <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-green-500" />Last Updated: {formatDate(post.lastUpdated || new Date())}</span>
          <span className="flex items-center"><Eye className="w-4 h-4 mr-1 text-orange-500" />Views: {post.views || 0}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          <div className="prose prose-sm sm:prose-base max-w-none">
            {post.content && (<div dangerouslySetInnerHTML={{ __html: post.content }} className="mb-6" />)}
            {post.code ? (
              <div className="bg-gray-800 text-white rounded-lg overflow-hidden font-mono text-sm sm:text-base">
                <div className="flex justify-between items-center bg-gray-700 px-4 py-2">
                  <span className="text-sm text-gray-300">Code Example</span>
                  <button onClick={() => navigator.clipboard.writeText(post.code.replace(/<br>/g, '\n').replace(/&nbsp;/g, ' '))} className="flex items-center text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">
                    <Code2 className="w-4 h-4 mr-1" /> Copy Code
                  </button>
                </div>
                <div className="overflow-x-auto p-4">
                  <pre><code dangerouslySetInnerHTML={{ __html: processPostContent(post.code) }} /></pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600"><Code2 className="w-12 h-12 text-gray-400 mx-auto mb-3" /><p>No code example available for this tutorial yet.</p></div>
            )}
          </div>
        </article>
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Was this tutorial helpful?</h3>
              <p className="text-gray-600 text-sm">Your feedback helps us improve our content.</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition-colors text-sm sm:text-base"><ThumbsUp className="w-4 h-4 inline-block mr-1" /> Yes</button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg transition-colors text-sm sm:text-base">👎 No</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}