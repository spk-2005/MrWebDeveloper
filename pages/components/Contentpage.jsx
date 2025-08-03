import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Heart, 
  Code2, 
  Loader2, 
  AlertCircle, 
  BookOpen, 
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Copy,
  Check,
  MessageCircle,
  ChevronLeft
} from 'lucide-react';

export default function Contentpage({ 
  activeSection, 
  activeItem, 
  setActiveItem, 
  setActiveSection,
  contentData,
  isLoading 
}) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  const post = contentData;
  const error = post === null;

  // Sample lesson data for navigation
  const sidebarData = {
    'HTML': ['Prerequisites', 'HTML Introduction', 'HTML Elements', 'HTML Attributes', 'HTML Forms'],
    'CSS': ['CSS Basics', 'CSS Selectors', 'CSS Properties', 'CSS Flexbox', 'CSS Grid'],
    'JavaScript': ['JS Introduction', 'Variables', 'Functions', 'DOM Manipulation', 'Events'],
    'Tailwind': ['Installation', 'Utility Classes', 'Responsive Design', 'Components', 'Customization']
  };

  useEffect(() => {
    setMounted(true);
  }, []);

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
    setLiked(!liked);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleCopy = async () => {
    if (post?.code) {
      try {
        await navigator.clipboard.writeText(post.code.replace(/<br>/g, '\n').replace(/&nbsp;/g, ' '));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently updated';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const processPostContent = (code) => {
    if (!code) return '';
    return code.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
  };

  const getCurrentLessonIndex = () => {
    const lessons = sidebarData[activeSection] || [];
    return lessons.indexOf(activeItem);
  };

  const getNextLesson = () => {
    const lessons = sidebarData[activeSection] || [];
    const currentIndex = getCurrentLessonIndex();
    return currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  };

  const getPreviousLesson = () => {
    const lessons = sidebarData[activeSection] || [];
    const currentIndex = getCurrentLessonIndex();
    return currentIndex > 0 ? lessons[currentIndex - 1] : null;
  };

  const handleNextLesson = () => {
    const nextLesson = getNextLesson();
    if (nextLesson) {
      handleSetActiveItem(nextLesson);
    }
  };

  const handlePreviousLesson = () => {
    const previousLesson = getPreviousLesson();
    if (previousLesson) {
      handleSetActiveItem(previousLesson);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  if (isLoading && !post) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <div className="space-y-1">
            <div className="h-4 rounded w-48 mx-auto animate-pulse bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 rounded w-32 mx-auto animate-pulse bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 p-4">
        <div className="text-center max-w-lg mx-auto p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500 dark:text-red-400" />
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Content Not Available</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">The tutorial you're looking for could not be found or is being updated.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => handleSetActiveItem(null)}
              className="px-4 py-2 rounded-xl font-semibold transition-all border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Browse Topics
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl font-semibold transition-all border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center h-96 p-4">
        <div className="text-center max-w-2xl mx-auto">
          <BookOpen className="w-20 h-20 mx-auto mb-6 text-blue-500 dark:text-blue-400" />
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Welcome to {activeSection}
          </h1>
          <p className="text-xl mb-6 text-gray-600 dark:text-gray-400">
            Select a lesson from the sidebar to begin your learning journey.
          </p>
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Ready to Start Learning?</h3>
            <p className="text-gray-600 dark:text-gray-400">Choose any lesson from the sidebar to get started with your web development journey.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="">
        {/* Breadcrumb & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between ">
          <nav className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <button 
              onClick={() => handleSetActiveSection(null)} 
              className="hover:underline transition-colors hover:text-gray-900 dark:hover:text-gray-200"
            >
              Home
            </button>
            <ChevronRight className="w-4 h-4 mx-2" />
            <button 
              onClick={() => handleSetActiveItem(null)} 
              className="hover:underline transition-colors hover:text-gray-900 dark:hover:text-gray-200"
            >
              {activeSection}
            </button>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-gray-900 dark:text-white">{activeItem}</span>
          </nav>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm border
                ${liked 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300' 
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current text-red-500' : ''}`} />
              <span>{(post.likes || 0) + (liked ? 1 : 0)}</span>
            </button>
            
            <button 
              onClick={handleBookmark}
              className={`p-2 rounded-lg transition-all border
                ${bookmarked 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' 
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
            
            <button className="p-2 rounded-lg transition-all border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Meta Info */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            {activeItem}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Updated: {formatDate(post.lastUpdated)}</span>
            </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          <article className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 lg:p-8 mb-8 shadow-sm">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              
              {/* Code Example Section */}
              {post.code ? (
                <div className="rounded-lg bg-gray-900 dark:bg-gray-950 overflow-hidden mb-2 border border-gray-700">
                  <div className="p-6 overflow-x-auto">
                    <pre className="text-sm text-gray-300">
                      <code dangerouslySetInnerHTML={{ __html: processPostContent(post.code) }} />
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 mb-8 bg-gray-50 dark:bg-gray-800/50">
                  <Code2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Code Example Coming Soon</h3>
                  <p className="text-gray-600 dark:text-gray-400">Interactive code examples will be added to this lesson soon.</p>
                </div>
              )}
            </div>
          </article>

          {/* Feedback Section */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-8 shadow-sm">
            <h3 className="font-bold mb-3 flex items-center text-gray-900 dark:text-white">
              <MessageCircle className="w-5 h-5 mr-2" />
              Was this helpful?
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">Your feedback helps us improve our content.</p>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center space-x-2 px-6 py-3 rounded-lg transition-all border border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-700 dark:text-green-300">
                <ThumbsUp className="w-4 h-4" />
                <span>Helpful</span>
              </button>
              <button className="flex items-center space-x-2 px-6 py-3 rounded-lg transition-all border border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-700 dark:text-red-300">
                <ThumbsDown className="w-4 h-4" />
                <span>Needs Work</span>
              </button>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
              <div className="text-center lg:text-left">
                <h4 className="font-bold mb-2 text-gray-900 dark:text-white">Continue Learning</h4>
                <p className="text-gray-600 dark:text-gray-400">Navigate through lessons at your own pace</p>
              </div>
              <div className="flex space-x-3">
                {getPreviousLesson() && (
                  <button 
                    onClick={handlePreviousLesson}
                    className="px-6 py-3 rounded-lg transition-all flex items-center space-x-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                )}
                {getNextLesson() && (
                  <button 
                    onClick={handleNextLesson}
                    className="px-6 py-3 rounded-lg transition-all flex items-center space-x-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
                  >
                    <span>Next Lesson</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}