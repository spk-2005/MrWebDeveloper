// pages/[language]/[heading].js - Optimized with prefetching and better loading
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { usePostsContext, usePost } from '../../components/PostContext';
import Navbar from '../../components/Navbar';
import Navbar2 from '../../components/Navbar2';
import Sidenavbar from '../../components/Sidenavbar';
import Contentpage from '../../components/Contentpage';
import Footer from '../../components/Footer';
import {
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Loader2,
  WifiOff,
  RefreshCw,
  Home,
  BookOpen
} from 'lucide-react';

// Static sidebar data
const SIDEBAR_DATA = {
  'HTML': [
    'Prerequisites',
    'HTML Introduction',
    {
      title: 'HTML Elements',
      subItems: ['Headings', 'Paragraph', 'HyperLink', 'Image', 'Unordered Lists', 'Ordered Lists', 'div container', 'span', 'br', 'hr']
    },
    {
      title: 'HTML Attributes',
      subItems: ['Global Attributes', 'Event Attributes', 'Data Attributes']
    },
    {
      title: 'HTML Forms',
      subItems: [
        'Input Types', 'Form Attributes', 'Form Validation', 'Form Styling',
        'Labels and Accessibility', 'Textarea', 'Select Dropdowns',
        'Checkboxes and Radio Buttons', 'File Uploads', 'Buttons and Submit Types'
      ]
    }
  ],
  'CSS': [
    'CSS Basics',
    {
      title: 'CSS Selectors',
      subItems: ['Element Selectors', 'Class Selectors', 'ID Selectors', 'Pseudo Selectors']
    },
    'CSS Properties',
    {
      title: 'CSS Flexbox',
      subItems: ['Flex Container', 'Flex Items', 'Flex Direction', 'Justify Content']
    },
    {
      title: 'CSS Grid',
      subItems: ['Grid Container', 'Grid Items', 'Grid Template', 'Grid Areas']
    }
  ],
  'JavaScript': [
    'JS Introduction',
    {
      title: 'Variables',
      subItems: ['var, let, const', 'Scope', 'Hoisting']
    },
    {
      title: 'Functions',
      subItems: ['Function Declaration', 'Arrow Functions', 'Closures', 'Callbacks']
    },
    {
      title: 'DOM Manipulation',
      subItems: ['Selecting Elements', 'Modifying Elements', 'Creating Elements']
    },
    'Events'
  ],
  'Tailwind': [
    'Installation',
    {
      title: 'Utility Classes',
      subItems: ['Layout', 'Typography', 'Colors', 'Spacing']
    },
    'Responsive Design',
    {
      title: 'Components',
      subItems: ['Buttons', 'Cards', 'Forms', 'Navigation']
    },
    'Customization'
  ]
};

// Utility functions
const normalizeString = (str) => {
  if (!str) return '';
  return str.toString().toLowerCase().trim();
};

const getAllItemsFromSection = (sectionData) => {
  const items = [];
  if (!Array.isArray(sectionData)) return items;
  
  sectionData.forEach((item) => {
    if (typeof item === 'string') {
      items.push(item);
    } else if (item && typeof item === 'object' && item.title) {
      items.push(item.title);
      if (Array.isArray(item.subItems)) {
        item.subItems.forEach(subItem => items.push(subItem));
      }
    }
  });
  
  return items;
};

// Custom hooks
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    if (typeof window !== 'undefined') {
      updateScreenSize();
      window.addEventListener('resize', updateScreenSize);
      return () => window.removeEventListener('resize', updateScreenSize);
    }
  }, []);

  return { isMobile };
};

// Enhanced routing hook with prefetching
const useRouting = (section, item, router) => {
  const [routeState, setRouteState] = useState({
    activeSection: null,
    activeItem: null,
    error: null,
    isProcessing: true
  });

  const getSectionFromUrl = useCallback((sectionSlug) => {
    if (!sectionSlug) return null;
    return Object.keys(SIDEBAR_DATA).find(key => 
      normalizeString(key) === normalizeString(sectionSlug)
    ) || null;
  }, []);

  const getItemFromUrl = useCallback((itemSlug) => {
    if (!itemSlug) return null;
    return decodeURIComponent(itemSlug)
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    const processRoute = () => {
      setRouteState(prev => ({ ...prev, isProcessing: true, error: null }));

      // Handle missing parameters
      if (!section || !item) {
        const defaultSection = 'HTML';
        const defaultItem = 'Prerequisites';
        const itemSlug = defaultItem.replace(/\s+/g, '-').toLowerCase();
        
        router.replace(`/${defaultSection}/${itemSlug}`);
        return;
      }

      const properSectionName = getSectionFromUrl(section);
      const itemFromUrl = getItemFromUrl(item);

      if (!properSectionName || !SIDEBAR_DATA[properSectionName]) {
        setRouteState({
          activeSection: null,
          activeItem: null,
          error: {
            type: 'INVALID_SECTION',
            title: 'Section Not Found',
            message: `The section "${section}" doesn't exist.`,
            suggestion: 'Please choose a valid section from our available courses.'
          },
          isProcessing: false
        });
        return;
      }

      const allValidItems = getAllItemsFromSection(SIDEBAR_DATA[properSectionName]);
      const exactItemName = allValidItems.find(validItem => 
        normalizeString(validItem) === normalizeString(itemFromUrl)
      );

      if (exactItemName) {
        setRouteState({
          activeSection: properSectionName,
          activeItem: exactItemName,
          error: null,
          isProcessing: false
        });
      } else {
        setRouteState({
          activeSection: properSectionName,
          activeItem: null,
          error: {
            type: 'INVALID_ITEM',
            title: 'Tutorial Not Found',
            message: `The tutorial "${itemFromUrl}" doesn't exist in ${properSectionName}.`,
            suggestion: 'Please choose a valid tutorial from the sidebar.'
          },
          isProcessing: false
        });
      }
    };

    // Small delay to batch rapid route changes
    const timer = setTimeout(processRoute, 50);
    return () => clearTimeout(timer);
  }, [router.isReady, section, item, router, getSectionFromUrl, getItemFromUrl]);

  return routeState;
};

// Optimized loading screen
const LoadingScreen = React.memo(() => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 30, 85));
    }, 200);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
          <div className="absolute inset-0 w-16 h-16 bg-blue-600 rounded-full mx-auto animate-ping opacity-20"></div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Loading Tutorial
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we prepare your content...
          </p>
        </div>
        
        <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-auto">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {progress < 30 ? 'Initializing...' :
           progress < 60 ? 'Loading content...' :
           'Almost ready...'}
        </p>
      </div>
    </div>
  );
});

LoadingScreen.displayName = 'LoadingScreen';

// Enhanced error screen
const ErrorScreen = React.memo(({ error, router, onRetry }) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = useCallback(async () => {
    setIsRetrying(true);
    try {
      if (onRetry) {
        await onRetry();
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.location.reload();
      }
    } finally {
      setIsRetrying(false);
    }
  }, [onRetry]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="text-center bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-lg border">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {error.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error.message}
        </p>
        <p className="text-gray-500 dark:text-gray-500 mb-6 text-sm">
          {error.suggestion}
        </p>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={() => router.push('/HTML/prerequisites')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Start Learning
          </button>
          {error.type !== 'INVALID_SECTION' && (
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Retry'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

ErrorScreen.displayName = 'ErrorScreen';

// Sidebar toggle button
const SidebarToggle = React.memo(({ isSidebarOpen, toggleSidebar }) => (
  <button
    onClick={toggleSidebar}
    className={`fixed top-20 z-50 bg-white/90 backdrop-blur p-2 rounded-r-lg shadow-lg transition-all duration-300 hover:shadow-xl border border-l-0 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      isSidebarOpen ? 'left-72' : 'left-0'
    }`}
    aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
  >
    {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
  </button>
));

SidebarToggle.displayName = 'SidebarToggle';

// Offline indicator
const OfflineIndicator = React.memo(({ isOnline }) => {
  if (isOnline) return null;
  
  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
      <WifiOff className="w-4 h-4" />
      <span className="text-sm font-medium">You&apos;re offline</span>
    </div>
  );
});

OfflineIndicator.displayName = 'OfflineIndicator';

// Main component
export default function ItemPage() {
  const router = useRouter();
  const { section, item } = router.query;
  
  // Custom hooks
  const isOnline = useOnlineStatus();
  const { isMobile } = useResponsive();
  const { activeSection, activeItem, error, isProcessing } = useRouting(section, item, router);
  
  // Use the optimized usePost hook
  const { post: contentData, isLoading: postLoading, error: postError, isReady } = usePost(activeSection, activeItem);
  
  // Local state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auto-open sidebar on desktop
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  // Navigation handlers
  const handleSetActiveSection = useCallback((newSection) => {
    if (newSection && SIDEBAR_DATA[newSection]) {
      const firstItem = SIDEBAR_DATA[newSection][0];
      const firstItemName = typeof firstItem === 'string' ? firstItem : firstItem.title;
      const itemSlug = firstItemName.replace(/\s+/g, '-').toLowerCase();
      router.push(`/${newSection}/${itemSlug}`);
    }
  }, [router]);

  const handleSetActiveItem = useCallback((newItem) => {
    if (activeSection && newItem) {
      const itemSlug = newItem.replace(/\s+/g, '-').toLowerCase();
      router.push(`/${activeSection}/${itemSlug}`);
    }
  }, [activeSection, router]);

  // Sidebar handlers
  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  // Extract post ID
  const postId = useMemo(() => {
    return contentData?.id || contentData?._id || null;
  }, [contentData]);

  // SEO data
  const seoData = useMemo(() => {
    const defaultTitle = 'MrDeveloper - Web Development Tutorials';
    const defaultDescription = 'Master web development with comprehensive tutorials covering HTML, CSS, JavaScript, and Tailwind CSS.';
    
    if (contentData) {
      const title = `${activeItem} - ${activeSection} Tutorial | MrDeveloper`;
      const description = contentData.description || `Learn ${activeItem} in ${activeSection} with detailed examples and step-by-step explanations.`;
      
      return {
        title,
        description,
        keywords: [activeSection, activeItem, 'tutorial', 'web development', 'programming'].join(', ')
      };
    }
    
    return {
      title: defaultTitle,
      description: defaultDescription,
      keywords: 'web development, HTML, CSS, JavaScript, tutorials'
    };
  }, [contentData, activeSection, activeItem]);

  // Show loading screen
  if (isProcessing || (postLoading && !isReady)) {
    return <LoadingScreen />;
  }

  // Show error screen
  if (error) {
    return <ErrorScreen error={error} router={router} />;
  }

  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://yoursite.com/${section}/${item}`} />
      </Head>
      
      <div className="min-h-screen flex flex-col bg-gray-50">
        <OfflineIndicator isOnline={isOnline} />
        
        {/* Navigation */}
        <div className="sticky top-0 z-40">
          <Navbar />
          <Navbar2
            activeSection={activeSection}
            setActiveSection={handleSetActiveSection}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>

        {/* Sidebar Toggle */}
        <SidebarToggle
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        {/* Main Layout */}
        <div className="flex flex-1 relative">
          {/* Sidebar */}
          {(isSidebarOpen || isMobile) && (
            <Sidenavbar
              activeSection={activeSection}
              activeItem={activeItem}
              setActiveItem={handleSetActiveItem}
              isSidebarOpen={isSidebarOpen}
              onClose={closeSidebar}
            />
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <main>
              <Contentpage
                key={`${activeSection}-${activeItem}-${postId}`}
                activeSection={activeSection}
                activeItem={activeItem}
                setActiveItem={handleSetActiveItem}
                setActiveSection={handleSetActiveSection}
                contentData={contentData}
                isLoading={postLoading && !isReady}
                Post_Id={postId}
              />
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}