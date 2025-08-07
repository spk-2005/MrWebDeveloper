import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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

// Enhanced ShareModal component with attractive content
const ShareModal = ({ title, activeSection, activeItem, onClose }) => {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  // Generate attractive share content
  const shareContent = useMemo(() => {
    const emojis = {
      'HTML': '🌐',
      'CSS': '🎨', 
      'JavaScript': '⚡',
      'Tailwind': '💨',
      'React': '⚛️',
      'Node.js': '🚀',
      'Python': '🐍',
      'default': '💻'
    };

    const emoji = emojis[activeSection] || emojis.default;
    
    const attractiveTexts = [
      `${emoji} Just mastered "${activeItem}" in ${activeSection}! 🔥\n\nThis tutorial is absolutely mind-blowing! Every developer should check this out 👨‍💻✨\n\n#WebDev #${activeSection} #CodeLearn #Programming`,
      
      `🚀 Level up your ${activeSection} skills! 
      
${emoji} Currently learning: "${activeItem}"

This tutorial breaks it down perfectly - from beginner to pro! 💪

Perfect for anyone wanting to master web development 🌟

#WebDevelopment #${activeSection} #Learning #Tech`,

      `💡 Game-changer alert! 

Just discovered this amazing ${activeSection} tutorial on "${activeItem}" ${emoji}

🔥 Clear explanations
✅ Practical examples  
🎯 Perfect for all levels

Every ${activeSection} developer needs to see this! 

#CodeLearn #WebDev #${activeSection}`,

      `${emoji} Calling all developers! 

Found the BEST resource for learning "${activeItem}" in ${activeSection}! 

🎯 Step-by-step guidance
💻 Real-world examples
🚀 Beginner-friendly

This is exactly what I was looking for! 

#Programming #${activeSection} #WebDevelopment #Learning`
    ];

    return attractiveTexts[Math.floor(Math.random() * attractiveTexts.length)];
  }, [activeSection, activeItem]);

  const handleCopy = async () => {
    try {
      const textToCopy = `${shareContent}\n\n${url}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy share text:', err);
    }
  };

  const socialLinks = useMemo(() => {
    const whatsappContent = `🔥 ${activeItem} - ${activeSection} Tutorial

${shareContent.split('\n').slice(0, 3).join(' ')}

Check it out: ${url}`;

    const encodedText = encodeURIComponent(shareContent);
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedWhatsAppText = encodeURIComponent(whatsappContent);

    return [
      { 
        name: 'Twitter', 
        icon: '🐦', 
        color: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
        href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
      },
      { 
        name: 'LinkedIn', 
        icon: '💼', 
        color: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedText}`
      },
      { 
        name: 'WhatsApp', 
        icon: '💬', 
        color: 'hover:bg-green-50 dark:hover:bg-green-900/20',
        href: `https://api.whatsapp.com/send?text=${encodedWhatsAppText}`
      },
      { 
        name: 'Facebook', 
        icon: '📘', 
        color: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`
      },
      { 
        name: 'Telegram', 
        icon: '✈️', 
        color: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
        href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
      },
      { 
        name: 'Reddit', 
        icon: '🤖', 
        color: 'hover:bg-orange-50 dark:hover:bg-orange-900/20',
        href: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`
      }
    ];
  }, [shareContent, url, title, activeSection, activeItem]);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Share This Tutorial</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          🌟 Spread the knowledge! Share this amazing tutorial with your network and help others level up their skills.
        </p>

        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">🎯</span>
            <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Ready to share your learning journey!</p>
        </div>

        <textarea
          readOnly
          value={shareContent}
          className="w-full p-4 mb-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 resize-none text-sm leading-relaxed"
          rows="6"
          placeholder="Loading share content..."
        />

        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={handleCopy}
            className="flex items-center space-x-2 px-6 py-3 rounded-lg transition-all bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
            disabled={copied}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span className="font-medium">{copied ? '✨ Copied!' : '📋 Copy Text'}</span>
          </button>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Click any platform to share instantly! 🚀
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">
            📱 Share on Social Media
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {socialLinks.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex flex-col items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700 ${link.color} transition-all text-center group hover:scale-105 transform`}
                aria-label={`Share on ${link.name}`}
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{link.icon}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{link.name}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
          <p className="text-xs text-yellow-800 dark:text-yellow-200 text-center">
            💡 <strong>Pro tip:</strong> Sharing helps us create more awesome content like this!
          </p>
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
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Refs for dynamic content
  const contentRef = useRef(null);
  const dynamicStyleRef = useRef(null);

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

  // Enhanced function to process and apply dynamic content with complete CSS isolation
  const processAndApplyDynamicContent = useCallback((code, images) => {
    if (!code) return '';
    
    let processedCode = code;
    let extractedCSS = '';
    let extractedJS = '';
    
    // Generate unique scope ID for this component instance
    const scopeId = `content-scope-${Math.random().toString(36).substr(2, 9)}`;
    
    // Extract and process CSS
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let styleMatch;
    
    while ((styleMatch = styleRegex.exec(processedCode)) !== null) {
      extractedCSS += styleMatch[1] + '\n';
      // Remove style tags from the content
      processedCode = processedCode.replace(styleMatch[0], '');
    }
    
    // Extract and process JavaScript
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    let scriptMatch;
    
    while ((scriptMatch = scriptRegex.exec(processedCode)) !== null) {
      extractedJS += scriptMatch[1] + '\n';
      // Remove script tags from the content
      processedCode = processedCode.replace(scriptMatch[0], '');
    }
    
    // Apply extracted CSS with complete isolation
    if (extractedCSS) {
      // Remove existing dynamic styles
      if (dynamicStyleRef.current) {
        dynamicStyleRef.current.remove();
      }
      
      // Create completely isolated CSS with CSS reset for the scoped area
      const isolatedCSS = createIsolatedCSS(extractedCSS, scopeId);
      
      // Create new style element
      const styleElement = document.createElement('style');
      styleElement.type = 'text/css';
      styleElement.innerHTML = isolatedCSS;
      styleElement.setAttribute('data-dynamic-style', 'true');
      styleElement.setAttribute('data-scope-id', scopeId);
      document.head.appendChild(styleElement);
      dynamicStyleRef.current = styleElement;
      
      // Store the scope ID to apply to our container
      processedCode = `<div class="isolated-content-container" data-scope-id="${scopeId}">${processedCode}</div>`;
    } else {
      // Even without extracted CSS, wrap in isolation container
      processedCode = `<div class="isolated-content-container" data-scope-id="${scopeId}">${processedCode}</div>`;
    }
    
    // Process the remaining HTML content
    processedCode = processedCode.replace(/\n/g, '<br>').replace(/ {2,}/g, match => '&nbsp;'.repeat(match.length));
    
    // Handle images
    if (images && images.length > 0) {
      let imageIndex = 0;
      processedCode = processedCode.replace(/<img([^>]*)>/g, (match, attributes) => {
        if (imageIndex < images.length) {
          const currentImage = images[imageIndex];
          imageIndex++;
          
          const altMatch = attributes.match(/alt=["']([^"']*)["']/);
          const classMatch = attributes.match(/class=["']([^"']*)["']/);
          const styleMatch = attributes.match(/style=["']([^"']*)["']/);
          
          const alt = altMatch ? altMatch[1] : `Image ${imageIndex}`;
          const className = classMatch ? classMatch[1] : '';
          const style = styleMatch ? styleMatch[1] : '';
          
          return `<img src="${currentImage}" alt="${alt}" class="${className}" style="${style}" loading="lazy" />`;
        }
        return match;
      });
    }
    
    // Execute JavaScript with scoped context
    if (extractedJS) {
      setTimeout(() => {
        try {
          // Create a safer execution context with scoped DOM access
          const scopedJS = createScopedJavaScript(extractedJS, scopeId);
          const scriptFunction = new Function('scopeId', scopedJS);
          scriptFunction(scopeId);
        } catch (error) {
          console.warn('Error executing dynamic JavaScript:', error);
        }
      }, 100);
    }
    
    return processedCode;
  }, []);

  // Helper function to create completely isolated CSS with reset
  const createIsolatedCSS = (css, scopeId) => {
    // Complete CSS reset for the isolated container
    const cssReset = `
      [data-scope-id="${scopeId}"] {
        /* Reset all inherited properties */
        all: initial !important;
        
        /* Reset box model */
        box-sizing: border-box !important;
        margin: 0 !important;
        padding: 0 !important;
        
        /* Reset typography */
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-size: 16px !important;
        font-weight: normal !important;
        line-height: 1.5 !important;
        color: #000 !important;
        text-align: left !important;
        
        /* Reset positioning */
        position: static !important;
        display: block !important;
        
        /* Reset background */
        background: transparent !important;
        
        /* Reset borders */
        border: none !important;
        outline: none !important;
        
        /* Reset transforms and animations */
        transform: none !important;
        animation: none !important;
        transition: none !important;
        
        /* Reset flex/grid */
        flex: none !important;
        grid: none !important;
        
        /* Prevent inheritance from parent */
        isolation: isolate !important;
      }
      
      [data-scope-id="${scopeId}"] * {
        /* Reset all properties for all children */
        all: unset !important;
        box-sizing: border-box !important;
        
        /* Set display back to its natural values */
        display: revert !important;
      }
      
      /* Re-establish basic HTML semantics inside the isolated container */
      [data-scope-id="${scopeId}"] div { display: block !important; }
      [data-scope-id="${scopeId}"] span { display: inline !important; }
      [data-scope-id="${scopeId}"] p { display: block !important; margin: 1em 0 !important; }
      [data-scope-id="${scopeId}"] h1 { display: block !important; font-size: 2em !important; font-weight: bold !important; margin: 0.67em 0 !important; }
      [data-scope-id="${scopeId}"] h2 { display: block !important; font-size: 1.5em !important; font-weight: bold !important; margin: 0.75em 0 !important; }
      [data-scope-id="${scopeId}"] h3 { display: block !important; font-size: 1.17em !important; font-weight: bold !important; margin: 0.83em 0 !important; }
      [data-scope-id="${scopeId}"] h4 { display: block !important; font-size: 1em !important; font-weight: bold !important; margin: 1.12em 0 !important; }
      [data-scope-id="${scopeId}"] h5 { display: block !important; font-size: 0.83em !important; font-weight: bold !important; margin: 1.5em 0 !important; }
      [data-scope-id="${scopeId}"] h6 { display: block !important; font-size: 0.75em !important; font-weight: bold !important; margin: 1.67em 0 !important; }
      [data-scope-id="${scopeId}"] img { display: inline-block !important; max-width: 100% !important; height: auto !important; }
      [data-scope-id="${scopeId}"] a { color: #0066cc !important; text-decoration: underline !important; cursor: pointer !important; }
      [data-scope-id="${scopeId}"] button { cursor: pointer !important; }
      [data-scope-id="${scopeId}"] input, [data-scope-id="${scopeId}"] textarea, [data-scope-id="${scopeId}"] select {
        font-family: inherit !important;
        font-size: inherit !important;
        padding: 4px !important;
        border: 1px solid #ccc !important;
        border-radius: 4px !important;
        background: white !important;
        color: black !important;
      }
      [data-scope-id="${scopeId}"] ul, [data-scope-id="${scopeId}"] ol { 
        display: block !important; 
        margin: 1em 0 !important; 
        padding-left: 2em !important; 
      }
      [data-scope-id="${scopeId}"] li { display: list-item !important; }
      [data-scope-id="${scopeId}"] ul li { list-style-type: disc !important; }
      [data-scope-id="${scopeId}"] ol li { list-style-type: decimal !important; }
      [data-scope-id="${scopeId}"] table { border-collapse: collapse !important; width: 100% !important; }
      [data-scope-id="${scopeId}"] td, [data-scope-id="${scopeId}"] th { 
        border: 1px solid #ddd !important; 
        padding: 8px !important; 
        text-align: left !important; 
      }
      [data-scope-id="${scopeId}"] th { font-weight: bold !important; background-color: #f2f2f2 !important; }
    `;
    
    // Split CSS into rules and scope them properly
    const rules = css.split('}').filter(rule => rule.trim());
    
    const scopedRules = rules.map(rule => {
      if (!rule.trim()) return '';
      
      const [selectors, properties] = rule.split('{');
      if (!selectors || !properties) return rule + '}';
      
      // Process each selector
      const scopedSelectors = selectors
        .split(',')
        .map(selector => {
          selector = selector.trim();
          
          // Skip @rules, keyframes, and other special CSS rules
          if (selector.startsWith('@') || selector.includes('@keyframes') || 
              selector.includes('@media') || selector.includes('@import')) {
            return selector;
          }
          
          // For :root, html, body selectors, scope them to the container
          if (selector === ':root' || selector === 'html' || selector === 'body') {
            return `[data-scope-id="${scopeId}"]`;
          }
          
          // For * selector, scope it
          if (selector === '*') {
            return `[data-scope-id="${scopeId}"] *`;
          }
          
          // Add scope to regular selectors with higher specificity
          return `[data-scope-id="${scopeId}"] ${selector}`;
        })
        .join(', ');
      
      return `${scopedSelectors} {${properties}}`;
    }).join(' ');
    
    // Combine CSS reset with scoped rules
    return cssReset + '\n' + scopedRules;
  };

  // Helper function to create scoped JavaScript execution
  const createScopedJavaScript = (js, scopeId) => {
    // Replace common DOM queries with scoped versions
    let scopedJS = js
      // Replace document.getElementById with scoped version
      .replace(/document\.getElementById\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g, 
        `document.querySelector('[data-scope-id="${scopeId}"] #$1')`)
      .replace(/getElementById\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g, 
        `document.querySelector('[data-scope-id="${scopeId}"] #$1')`)
      
      // Replace document.querySelector with scoped version
      .replace(/document\.querySelector\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g, 
        `document.querySelector('[data-scope-id="${scopeId}"] $1')`)
      .replace(/(?<!document\.)querySelector\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g, 
        `document.querySelector('[data-scope-id="${scopeId}"] $1')`)
      
      // Replace document.querySelectorAll with scoped version
      .replace(/document\.querySelectorAll\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g, 
        `document.querySelectorAll('[data-scope-id="${scopeId}"] $1')`)
      .replace(/(?<!document\.)querySelectorAll\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g, 
        `document.querySelectorAll('[data-scope-id="${scopeId}"] $1')`)
      
      // Replace document.getElementsByClassName with scoped version
      .replace(/document\.getElementsByClassName\s*\(/g, 
        `document.querySelector('[data-scope-id="${scopeId}"]').getElementsByClassName(`)
      .replace(/getElementsByClassName\s*\(/g, 
        `document.querySelector('[data-scope-id="${scopeId}"]').getElementsByClassName(`)
      
      // Replace document.getElementsByTagName with scoped version
      .replace(/document\.getElementsByTagName\s*\(/g, 
        `document.querySelector('[data-scope-id="${scopeId}"]').getElementsByTagName(`)
      .replace(/getElementsByTagName\s*\(/g, 
        `document.querySelector('[data-scope-id="${scopeId}"]').getElementsByTagName(`);
    
    return scopedJS;
  };

  // Clean up dynamic styles on unmount
  useEffect(() => {
    return () => {
      if (dynamicStyleRef.current) {
        dynamicStyleRef.current.remove();
      }
    };
  }, []);

  // Process content when post changes
  const processedContent = useMemo(() => {
    if (!post || !post.code) return '';
    return processAndApplyDynamicContent(post.code, post.images);
  }, [post, processAndApplyDynamicContent]);

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
      
      alert('Failed to update like. Please try again.');
    } finally {
      setIsLiking(false);
    }
  }, [post, isLiking, liked, likeCount]);

  const handleBookmark = useCallback(() => {
    if (!post || !post.id) return;
    
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);
    
    const userBookmarks = JSON.parse(localStorage.getItem('userBookmarks') || '{}');
    userBookmarks[post.id] = newBookmarked;
    localStorage.setItem('userBookmarks', JSON.stringify(userBookmarks));
  }, [post, bookmarked]);

  const handleCopy = useCallback(async () => {
    if (post?.code) {
      try {
        // Clean the code for copying (remove HTML tags and decode entities)
        const cleanCode = post.code
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/&nbsp;/g, ' ')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&');
          
        await navigator.clipboard.writeText(cleanCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    }
  }, [post]);

  const handleShare = useCallback(async () => {
    const shareTitle = `🔥 ${activeItem} - Master ${activeSection} Like a Pro!`;
    
    const attractiveTexts = [
      `🚀 Just discovered this AMAZING ${activeSection} tutorial! "${activeItem}" explained perfectly - from zero to hero! 💪 Every developer should bookmark this! 🔖`,
      `💡 Level up alert! 🔥 Currently mastering "${activeItem}" in ${activeSection} and this tutorial is absolutely mind-blowing! Perfect for beginners and pros alike! ✨`,
      `🎯 Found the holy grail of ${activeSection} tutorials! "${activeItem}" - explained so clearly, even my grandma could code! 😄 This is pure gold! 🏆`
    ];

    const randomText = attractiveTexts[Math.floor(Math.random() * attractiveTexts.length)];
    const shareUrl = window.location.href;
    const shareContent = `${randomText}\n\nCheck it out: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareContent,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing with Web Share API:', err);
        setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  }, [activeItem, activeSection, setShowShareModal]);

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
    <div className="w-full h-full bg-gray-250">
      {showShareModal && (
        <ShareModal
          title={`${activeItem} - ${activeSection} Tutorial`}
          activeSection={activeSection}
          activeItem={activeItem}
          onClose={() => setShowShareModal(false)}
        />
      )}
      
      <div className="">
        {/* Breadcrumb & Actions */}
        <div 
          style={{background: "linear-gradient(135deg, #1B365D 0%, #2994E1 100%)"}} 
          className="flex p-3 flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <nav className="flex items-center text-sm text-white">
            <button 
              onClick={() => window.location.href = "/"} 
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
            <span className="font-medium text-white hover:text-gray-200">{activeItem}</span>
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
              className="p-2 transition-all text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              title="Share this tutorial"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 p-2 transition-all text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg"
              title="Copy code"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex flex-wrap p-2">
            <span>Updated: {formatDate(post.lastUpdated)}</span>
          </div>
        </div>

        <div className="w-full">
          <article className="rounded-lg mb-3">
            <div className="prose prose-lg max-w-none">
              {/* Enhanced Code Example Section with complete CSS isolation */}
              {post.code ? (
                <div className="rounded-lg overflow-hidden mb-2 relative">
                  <div 
                    ref={contentRef}
                    className="p-4 overflow-x-auto"
                    style={{ 
                      isolation: 'isolate',
                      contain: 'layout style paint',
                      position: 'relative'
                    }}
                  >
                    <div
                      className="isolated-content-wrapper"
                      style={{
                        all: 'initial',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        lineHeight: 'inherit',
                        color: 'inherit'
                      }}
                    >
                      <code 
                        dangerouslySetInnerHTML={{ __html: processedContent }}
                        style={{
                          all: 'initial',
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word'
                        }}
                      />
                    </div>
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

          {/* Navigation Footer */}
          <div className="rounded-lg border p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
              <div className="text-center lg:text-left text-black">
                <h4 className="font-bold mb-2">Continue Learning</h4>
                <p className="">Navigate through lessons at your own pace</p>
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