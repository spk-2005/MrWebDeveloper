import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import Link from 'next/link';
import { useRouter } from 'next/router';

// New ShareModal component
const ShareModal = ({ title, text, url, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy share text:', err);
    }
  };

  const socialLinks = useMemo(() => [
    { name: 'Twitter', icon: '🐦', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
    { name: 'LinkedIn', icon: '👔', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { name: 'WhatsApp', icon: '🟢', href: `https://api.whatsapp.com/send?text=${encodeURIComponent(text)} ${encodeURIComponent(url)}` },
    { name: 'Facebook', icon: '🔵', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  ], [text, url]);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl relative">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Share This Tutorial</h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Spread the knowledge! Share this great tutorial with your friends and colleagues.
        </p>

        <textarea
          readOnly
          value={text}
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 resize-none"
          rows="4"
        />

        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={handleCopy}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            disabled={copied}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
          
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
        
        <div className="flex space-x-3 justify-center border-t border-gray-200 dark:border-gray-700 pt-4">
          {socialLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xl"
              aria-label={`Share on ${link.name}`}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};


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
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false); // New state for share modal

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
    if (post) {
      setLikeCount(post.likes || 0);
      // Check if user has already liked this post from localStorage
      const userLikes = JSON.parse(localStorage.getItem('userLikes') || '{}');
      setLiked(userLikes[post.id] || false);
    }
  }, [post]);

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

  const handleLike = useCallback(async () => {
    if (!post || !post.id || isLiking) {
      console.log('Cannot like: missing post data or already processing');
      return;
    }
    
    setIsLiking(true);
    const previousLiked = liked;
    const previousCount = likeCount;
    
    // Optimistic update
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    
    // Update localStorage
    const userLikes = JSON.parse(localStorage.getItem('userLikes') || '{}');
    userLikes[post.id] = newLiked;
    localStorage.setItem('userLikes', JSON.stringify(userLikes));
    
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: previousLiked ? 'unlike' : 'like'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Update with server response
        setLikeCount(data.likes);
        console.log(`Successfully ${previousLiked ? 'unliked' : 'liked'} post`);
      } else {
        throw new Error(data.error || 'Failed to update like');
      }
      
    } catch (error) {
      console.error('Error updating like:', error);
      
      // Revert optimistic update on error
      setLiked(previousLiked);
      setLikeCount(previousCount);
      
      // Revert localStorage
      const userLikes = JSON.parse(localStorage.getItem('userLikes') || '{}');
      userLikes[post.id] = previousLiked;
      localStorage.setItem('userLikes', JSON.stringify(userLikes));
      
      // Show error message to user
      alert('Failed to update like. Please try again.');
    } finally {
      setIsLiking(false);
    }
  }, [post, isLiking, liked, likeCount]);

  const handleBookmark = useCallback(() => {
    if (!post || !post.id) return;
    
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);
    
    // Update localStorage for bookmarks
    const userBookmarks = JSON.parse(localStorage.getItem('userBookmarks') || '{}');
    userBookmarks[post.id] = newBookmarked;
    localStorage.setItem('userBookmarks', JSON.stringify(userBookmarks));
  }, [post, bookmarked]);

  const handleCopy = useCallback(async () => {
    if (post?.code) {
      try {
        await navigator.clipboard.writeText(post.code.replace(/<br>/g, '\n').replace(/&nbsp;/g, ' '));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    }
  }, [post]);

  const handleShare = useCallback(async () => {
    const shareTitle = `${activeItem} - ${activeSection} Tutorial`;
    const shareText = `Mastering ${activeItem} with CodeLearn! This tutorial is a game-changer for understanding ${activeSection}. Check it out:`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing with Web Share API:', err);
        // Fallback to custom modal
        setShowShareModal(true);
      }
    } else {
      // Fallback to custom modal on desktop
      setShowShareModal(true);
    }
  }, [activeItem, activeSection]);

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

  const handleNextLesson = useCallback(() => {
    const nextLesson = getNextLesson();
    if (nextLesson) {
      handleSetActiveItem(nextLesson);
    }
  }, [getNextLesson]);

  const handlePreviousLesson = useCallback(() => {
    const previousLesson = getPreviousLesson();
    if (previousLesson) {
      handleSetActiveItem(previousLesson);
    }
  }, [getPreviousLesson]);

  // Load user preferences on mount
  useEffect(() => {
    if (post && post.id) {
      const userBookmarks = JSON.parse(localStorage.getItem('userBookmarks') || '{}');
      setBookmarked(userBookmarks[post.id] || false);
    }
  }, [post]);
const router=useRouter();
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
      <div className="flex items-center bg-gray-300 justify-center h-96 p-4">
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
    <div className="w-full h-full bg-gray-250 ">
      {showShareModal && (
        <ShareModal
          title={`${activeItem} - ${activeSection} Tutorial`}
          text={`Mastering ${activeItem} with CodeLearn! This tutorial is a game-changer for understanding ${activeSection}. Check it out: ${window.location.href}`}
          url={window.location.href}
          onClose={() => setShowShareModal(false)}
        />
      )}
      <div className="">
        {/* Breadcrumb & Actions */}
        <div style={{backgroundColor:"#2d5571ff"}} className="flex p-3 flex-col lg:flex-row lg:items-center lg:justify-between ">
          <nav className="flex items-center text-sm text-white">
            <button 
              onClick={() =>router.push("/")} 
              className="hover:underline transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-4 h-4 mx-2" />
            <button 
              onClick={() => handleSetActiveItem(null)} 
              className="hover:underline transition-colors hover:text-gray-200"
            >
              {activeSection}
            </button>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-white  hover:text-gray-200">{activeItem}</span>
          
          </nav>
          
        </div>


        {/* Main Content */}
        <div className='flex justify-between'>
        <div className="flex items-center space-x-2">
  <button
    onClick={handleLike}
    disabled={isLiking}
    className={`flex items-center space-x-2 px-4 py-2 transition-all text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
      ${liked
        ? 'text-red-700'
        : 'text-gray-700'
      }`}
  >
    {isLiking ? (
      <Loader2 className="w-4 h-4 animate-spin" />
    ) : (
      <Heart className={`w-4 h-4 ${liked ? 'fill-current text-red-500' : ''}`} />
    )}
    <span>{likeCount}</span>
  </button>

  <button
    onClick={handleShare}
    className="p-2 transition-all text-gray-700"
  >
    <Share2 className="w-4 h-4" />
  </button>
  
</div><div className="flex flex-wrap p-2 ">
            <span>Updated: {formatDate(post.lastUpdated)}</span>
          </div>
          </div>
        <div className="w-full">
          <article className="rounded-lg   mb-3 ">
            <div className="prose prose-lg max-w-none ">
              
              {/* Code Example Section */}
              {post.code ? (
                <div className="rounded-lg  overflow-hidden mb-2 relative">
                  
                  <div className="p-4 overflow-x-auto">
                    <pre className="text-sm text--black">
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