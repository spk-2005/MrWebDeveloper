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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  if (isLoading && !post) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <div className="space-y-1">
            <div className="h-4 rounded w-48 mx-auto animate-pulse"></div>
            <div className="h-4 rounded w-32 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-2">
        <div className="text-center max-w-lg mx-auto p-4 rounded-2xl border">
          <AlertCircle className="w-16 h-16 mx-auto mb-2" />
          <h2 className="text-2xl font-bold mb-2">Content Not Available</h2>
          <p className="mb-4">The tutorial you're looking for could not be found or is being updated.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              onClick={() => handleSetActiveItem(null)}
              className="px-4 py-2 rounded-xl font-semibold transition-all border"
            >
              Browse Topics
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl font-semibold transition-all border"
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
      <div className="min-h-screen flex items-center justify-center p-2">
        <div className="text-center max-w-2xl mx-auto">
          <BookOpen className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">
            Welcome to {activeSection}
          </h1>
          <p className="text-xl mb-4">
            Select a lesson from the sidebar to begin your learning journey.
          </p>
          <div className="p-4 rounded-2xl border">
            <h3 className="font-semibold mb-1">Ready to Start Learning?</h3>
            <p>Choose any lesson from the sidebar to get started with your web development journey.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="p-2">
        {/* Breadcrumb & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2 space-y-2 lg:space-y-0">
          <nav className="flex items-center text-sm">
            <button 
              onClick={() => handleSetActiveSection(null)} 
              className="hover:underline transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-4 h-4 mx-1" />
            <button 
              onClick={() => handleSetActiveItem(null)} 
              className="hover:underline transition-colors"
            >
              {activeSection}
            </button>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="font-medium">{activeItem}</span>
          </nav>
          
          <div className="flex items-center space-x-1">
            <button 
              onClick={handleLike}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg transition-all text-sm "
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span>{(post.likes || 0) + (liked ? 1 : 0)}</span>
            </button>
            
            
            <button className="p-1 rounded-lg transition-all">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Meta Info */}
        <div className="mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">
            {activeItem}
          </h1>
          <div className="flex gap-3 text-sm mb-2">
            <span>Updated: {formatDate(post.lastUpdated)}</span>
            <span>•</span>
            <span>Views: {post.views || '0'}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <article className="rounded-lg  p-3 mb-2">
            <div className="prose max-w-none">
              {post.content && (
                <div 
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                  className="mb-3"
                />
              )}
              
              {/* Code Example Section */}
              {post.code ? (
                <div className="rounded-lg overflow-hidden mb-3 ">
                  <div className="p-3">
                    <pre className="text-sm">
                      <code dangerouslySetInnerHTML={{ __html: processPostContent(post.code) }} />
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 rounded-lg border-2 border-dashed mb-3">
                  <Code2 className="w-12 h-12 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Code Example Coming Soon</h3>
                  <p className="text-sm">Interactive code examples will be added to this lesson soon.</p>
                </div>
              )}
            </div>
          </article>

          {/* Feedback Section */}
          <div className="rounded-lg border p-3 mb-2">
            <h3 className="font-bold mb-2 flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              Was this helpful?
            </h3>
            <p className="mb-3 text-sm">Your feedback helps us improve our content.</p>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-1 px-4 py-2 rounded-lg transition-all text-sm border">
                <ThumbsUp className="w-3 h-3" />
                <span>Helpful</span>
              </button>
              <button className="flex items-center space-x-1 px-4 py-2 rounded-lg transition-all text-sm border">
                <ThumbsDown className="w-3 h-3" />
                <span>Needs Work</span>
              </button>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="rounded-lg border p-3">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
              <div className="text-center sm:text-left">
                <h4 className="font-bold mb-1">Continue Learning</h4>
                <p className="text-sm">Navigate through lessons at your own pace</p>
              </div>
              <div className="flex space-x-2">
                {getPreviousLesson() && (
                  <button 
                    onClick={handlePreviousLesson}
                    className="px-4 py-2 rounded-lg transition-all flex items-center space-x-1 text-sm border"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    <span>Previous</span>
                  </button>
                )}
                {getNextLesson() && (
                  <button 
                    onClick={handleNextLesson}
                    className="px-4 py-2 rounded-lg transition-all flex items-center space-x-1 text-sm border"
                  >
                    <span>Next Lesson</span>
                    <ChevronRight className="w-3 h-3" />
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