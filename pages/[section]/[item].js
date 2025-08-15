// Enhanced ItemPage.js - Fixed navigation and content fetching with improvements
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { usePostsContext } from '../components/PostContext';
import Navbar from '../components/Navbar';
import Navbar2 from '../components/Navbar2';
import Sidenavbar from '../components/Sidenavbar';
import Contentpage from '../components/Contentpage';
import Footer from '../components/Footer';
import {
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Menu,
  X,
  Home,
  BookOpen,
  Settings,
  Loader2,
  WifiOff,
  RefreshCw
} from 'lucide-react';

// Static sidebar data mapping sections to their respective items 
const SIDEBAR_DATA = {
  'HTML': [
    'Prerequisites',
    'HTML Introduction',
    {
      title: 'HTML Elements',
      subItems: ['Headings', 'Paragraph', 'HyperLink', 'Image','Unordered Lists','Ordered Lists','div container','span','br','hr']
    },
    {
      title: 'HTML Attributes',
      subItems: ['Global Attributes', 'Event Attributes', 'Data Attributes']
    },
    {
      title: 'HTML Forms',
      subItems: [
        'Input Types',
        'Form Attributes',
        'Form Validation',
        'Form Styling',
        'Labels and Accessibility',
        'Textarea',
        'Select Dropdowns',
        'Checkboxes and Radio Buttons',
        'File Uploads',
        'Buttons and Submit Types',
        'Fieldsets and Legends',
        'Placeholder and Default Values',
        'Required and Optional Fields',
        'Disabled and Readonly Fields',
        'Form Action and Method',
        'Autocomplete and Autofocus',
        'Hidden Inputs',
        'Datalist and Suggestion Lists',
        'Date and Time Inputs',
        'Range and Number Inputs',
        'Pattern Matching with Regex'
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

// Helper function to get all items (including sub-items) from a section
const getAllItemsFromSection = (sectionData) => {
  const items = [];
  
  if (!Array.isArray(sectionData)) {
    console.warn('Section data is not an array:', sectionData);
    return items;
  }
  
  sectionData.forEach((item, index) => {
    if (typeof item === 'string') {
      items.push(item);
    } else if (item && typeof item === 'object' && item.title) {
      items.push(item.title);
      if (Array.isArray(item.subItems)) {
        item.subItems.forEach(subItem => {
          items.push(subItem);
        });
      }
    }
  });
  
  return items;
};

// Helper function for case-insensitive and flexible matching
const normalizeString = (str) => {
  if (!str) return '';
  return str.toString().toLowerCase().trim();
};

const isStringMatch = (str1, str2) => {
  const normalized1 = normalizeString(str1);
  const normalized2 = normalizeString(str2);
  
  if (normalized1 === normalized2) return true;
  
  const slugified1 = normalized1.replace(/\s+/g, '-');
  const slugified2 = normalized2.replace(/\s+/g, '-');
  if (slugified1 === slugified2) return true;
  
  const spaced1 = normalized1.replace(/-/g, ' ');
  const spaced2 = normalized2.replace(/-/g, ' ');
  if (spaced1 === spaced2) return true;
  
  return false;
};

// Custom hooks for better organization
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return isOnline;
};

const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false
  });

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      });
    };

    if (typeof window !== 'undefined') {
      updateScreenSize();
      window.addEventListener('resize', updateScreenSize);
      return () => window.removeEventListener('resize', updateScreenSize);
    }
  }, []);

  return screenSize;
};

// Enhanced routing hook with better post lookup and error handling
const useRouting = (section, item, router, allPosts) => {
  const [routeState, setRouteState] = useState({
    activeSection: null,
    activeItem: null,
    contentData: null,
    error: null,
    isProcessing: false
  });

  const getSectionFromUrl = useCallback((sectionSlug) => {
    if (Object.keys(SIDEBAR_DATA).includes(sectionSlug)) {
      return sectionSlug;
    }
    
    const normalizedSlug = normalizeString(sectionSlug);
    for (const sectionKey of Object.keys(SIDEBAR_DATA)) {
      if (normalizeString(sectionKey) === normalizedSlug) {
        return sectionKey;
      }
    }
    
    return null;
  }, []);

  const getItemFromUrl = useCallback((itemSlug) => {
    if (!itemSlug) return null;
    
    return itemSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, []);

  // Enhanced post lookup with comprehensive matching
  const findPostByLanguageAndHeading = useCallback((language, heading) => {
    console.log(`🔍 Looking for post: language="${language}", heading="${heading}"`);
    
    if (!allPosts || allPosts.length === 0) {
      console.log('❌ No posts available');
      return null;
    }

    const matchingStrategies = [
      // Strategy 1: Exact match
      (post) => isStringMatch(post.language, language) && isStringMatch(post.heading, heading),
      
      // Strategy 2: Language match with flexible heading match
      (post) => {
        const langMatch = isStringMatch(post.language, language);
        const headingMatch = isStringMatch(post.heading, heading);
        return langMatch && headingMatch;
      },
      
      // Strategy 3: Partial heading match
      (post) => {
        const langMatch = isStringMatch(post.language, language);
        const headingContains = normalizeString(post.heading).includes(normalizeString(heading)) ||
                               normalizeString(heading).includes(normalizeString(post.heading));
        return langMatch && headingContains;
      }
    ];

    for (let i = 0; i < matchingStrategies.length; i++) {
      const found = allPosts.find(matchingStrategies[i]);
      if (found) {
        console.log(`✅ Found post using strategy ${i + 1}:`, found.heading);
        return found;
      }
    }

    console.log(`❌ No matching post found for "${heading}" in ${language}`);
    return null;
  }, [allPosts]);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    setRouteState(prev => ({ ...prev, isProcessing: true, error: null }));

    // Handle invalid or incomplete URLs
    if (!section || !item) {
      if (section && SIDEBAR_DATA[section]) {
        const firstItem = SIDEBAR_DATA[section][0];
        const firstItemName = typeof firstItem === 'string' ? firstItem : firstItem.title;
        const firstItemSlug = firstItemName.replace(/\s+/g, '-').toLowerCase();
        router.replace(`/${section}/${firstItemSlug}`);
      } else {
        router.replace('/HTML/prerequisites');
      }
      return;
    }

    const properSectionName = getSectionFromUrl(section);
    const itemFromUrl = getItemFromUrl(item);

    if (properSectionName && SIDEBAR_DATA[properSectionName]) {
      const allValidItems = getAllItemsFromSection(SIDEBAR_DATA[properSectionName]);
      const isValidItem = allValidItems.some(validItem => isStringMatch(validItem, itemFromUrl));
      
      if (isValidItem) {
        const exactItemName = allValidItems.find(validItem => isStringMatch(validItem, itemFromUrl));
        const post = findPostByLanguageAndHeading(properSectionName, exactItemName || itemFromUrl);
        
        setRouteState({
          activeSection: properSectionName,
          activeItem: exactItemName || itemFromUrl,
          contentData: post,
          error: post ? null : {
            type: 'CONTENT_NOT_FOUND',
            title: 'Content Not Available',
            message: `The tutorial "${exactItemName || itemFromUrl}" in ${properSectionName} is currently being updated or is not available.`,
            suggestion: 'Try selecting another lesson from the sidebar or check back later.',
            canRetry: true
          },
          isProcessing: false
        });
      } else {
        setRouteState({
          activeSection: null,
          activeItem: null,
          contentData: null,
          error: {
            type: 'INVALID_ROUTE',
            title: 'Tutorial Not Found',
            message: `The tutorial "${itemFromUrl}" doesn't exist in ${properSectionName} section.`,
            suggestion: 'Please choose a valid tutorial from our available courses.',
            canRetry: false
          },
          isProcessing: false
        });
      }
    } else {
      setRouteState({
        activeSection: null,
        activeItem: null,
        contentData: null,
        error: {
          type: 'INVALID_ROUTE',
          title: 'Section Not Found',
          message: `The section "${section}" doesn't exist in our curriculum.`,
          suggestion: 'Please choose a valid section from our available courses.',
          canRetry: false
        },
        isProcessing: false
      });
    }
  }, [router.isReady, section, item, router, getSectionFromUrl, getItemFromUrl, findPostByLanguageAndHeading]);

  return routeState;
};

// Enhanced loading screen with progress indication
const LoadingScreen = React.memo(() => {
  const [loadingText, setLoadingText] = useState('Initializing...');
  
  useEffect(() => {
    const messages = [
      'Initializing...',
      'Loading curriculum...',
      'Preparing your lesson...',
      'Almost ready...'
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      setLoadingText(messages[index % messages.length]);
      index++;
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
      <div className="text-center space-y-8 p-8">
        <div className="relative">
          <Loader2 className="w-20 h-20 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
          <div className="absolute inset-0 w-20 h-20 bg-blue-600 dark:bg-blue-400 rounded-full mx-auto animate-ping opacity-20"></div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            CodeLearn
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {loadingText}
          </p>
        </div>
        
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
        
        <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse rounded-full"></div>
        </div>
      </div>
    </div>
  );
});
LoadingScreen.displayName = 'LoadingScreen';

// Enhanced error screen with better UX
const ErrorScreen = React.memo(({ error, router }) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = useCallback(async () => {
    setIsRetrying(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate retry delay
      window.location.reload();
    } catch (err) {
      console.error('Retry failed:', err);
    } finally {
      setIsRetrying(false);
    }
  }, []);

  const errorActions = useMemo(() => {
    const baseActions = [
      {
        icon: Home,
        label: 'Go Home',
        action: () => router.push('/'),
        variant: 'primary'
      },
      {
        icon: BookOpen,
        label: 'Start Learning',
        action: () => router.push('/HTML/prerequisites'),
        variant: 'secondary'
      }
    ];

    if (error.canRetry) {
      baseActions.push({
        icon: RefreshCw,
        label: isRetrying ? 'Retrying...' : 'Retry',
        action: handleRetry,
        variant: 'tertiary',
        disabled: isRetrying
      });
    }

    return baseActions;
  }, [router, error.canRetry, isRetrying, handleRetry]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="text-center bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-8 lg:p-12 rounded-3xl shadow-2xl max-w-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="relative mb-8">
          <AlertTriangle className="w-24 h-24 text-red-500 dark:text-red-400 mx-auto" />
          <div className="absolute inset-0 w-24 h-24 bg-red-500 dark:bg-red-400 rounded-full mx-auto animate-ping opacity-20"></div>
        </div>
       
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {error.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg leading-relaxed">
          {error.message}
        </p>
        <p className="text-gray-500 dark:text-gray-500 mb-8 text-base">
          {error.suggestion}
        </p>
       
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {errorActions.map(({ icon: Icon, label, action, variant, disabled }) => (
            <button
              key={label}
              onClick={action}
              disabled={disabled}
              className={`group flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold
                        transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                        ${variant === 'primary'
                          ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white'
                          : variant === 'secondary'
                          ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isRetrying && label.includes('Retrying') ? 'animate-spin' : 'group-hover:scale-110'}`} />
              <span>{label}</span>
            </button>
          ))}
        </div>
        
        {error.type === 'CONTENT_NOT_FOUND' && (
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 <strong>Tip:</strong> This lesson might be available soon. Check our sidebar for alternative lessons or try refreshing the page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});
ErrorScreen.displayName = 'ErrorScreen';

// Enhanced sidebar toggle with better accessibility
const SidebarToggle = React.memo(({ isSidebarOpen, toggleSidebar }) => {
  return (
    <button
      onClick={toggleSidebar}
      className={`fixed top-84 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 rounded-r-xl shadow-lg
                  transition-all duration-300 hover:shadow-xl border border-l-0 border-gray-200 dark:border-gray-600
                  text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${isSidebarOpen ? 'left-72 xl:left-80' : 'left-0'}
                  md:block`}
      aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
    >
      {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
    </button>
  );
});
SidebarToggle.displayName = 'SidebarToggle';

// Offline indicator component
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

export default function ItemPage() {
  const router = useRouter();
  const { section, item } = router.query;
  const { allPosts, isInitialLoading } = usePostsContext();
  
  // Custom hooks
  const isOnline = useOnlineStatus();
  const { isMobile, isDesktop } = useResponsive();
  const { activeSection, activeItem, contentData, error, isProcessing } = useRouting(section, item, router, allPosts);
  
  // Local state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Effects
  useEffect(() => {
    if (isDesktop) {
      setIsSidebarOpen(true);
    }
  }, [isDesktop]);

  // Memoized handlers
  const handleSetActiveSection = useCallback((newSection) => {
    if (newSection && SIDEBAR_DATA[newSection]) {
      const sectionSlug = newSection;
      const firstItem = SIDEBAR_DATA[newSection][0];
      const firstItemName = typeof firstItem === 'string' ? firstItem : firstItem.title;
      const itemSlug = firstItemName.replace(/\s+/g, '-').toLowerCase();
      router.push(`/${sectionSlug}/${itemSlug}`);
    }
  }, [router]);

  const handleSetActiveItem = useCallback((newItem) => {
    if (activeSection && newItem) {
      const sectionSlug = activeSection;
      const itemSlug = newItem.replace(/\s+/g, '-').toLowerCase();
      router.push(`/${sectionSlug}/${itemSlug}`);
    }
  }, [activeSection, router]);

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  // FIXED: Properly extract Post_Id from contentData
  const postId = useMemo(() => {
    return contentData?.id || contentData?._id || null;
  }, [contentData]);
  

  // Enhanced SEO data with better fallbacks
  const seoData = useMemo(() => {
    const defaultTitle = 'MrDeveloper - Web Development Tutorials';
    const defaultDescription = 'Master web development with comprehensive tutorials covering HTML, CSS, JavaScript, and Tailwind CSS.';
    
    if (!contentData) {
      return {
        title: defaultTitle,
        description: defaultDescription,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "LearningResource",
          "name": 'CodeLearn Tutorials',
          "description": defaultDescription,
          "educationalLevel": "Beginner to Intermediate",
          "learningResourceType": "Tutorial",
          "provider": {
            "@type": "Organization",
            "name": "CodeLearn"
          }
        },
        tags: []
      };
    }
    
    const title = contentData.title || `${contentData.heading} - ${contentData.language} Tutorial | MrDeveloper`;
    const description = contentData.description || `Learn ${contentData.heading} in ${contentData.language} with detailed examples, practical exercises, and step-by-step explanations.`;
    const tags = contentData.tags || [contentData.language, contentData.heading, 'tutorial', 'web development'];

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LearningResource",
      "name": title,
      "description": description,
      "educationalLevel": "Beginner to Intermediate",
      "learningResourceType": "Tutorial",
      "about": {
        "@type": "Thing",
        "name": `${contentData.language} - ${contentData.heading}`
      },
      "provider": {
        "@type": "Organization",
        "name": "CodeLearn"
      },
      "dateCreated": contentData.createdAt || new Date().toISOString(),
      "dateModified": contentData.updatedAt || new Date().toISOString()
    };

    return { title, description, tags, structuredData };
  }, [contentData]);

  // Loading screen
  if (isInitialLoading || isProcessing) {
    return <LoadingScreen />;
  }

  // Error screen
  if (error) {
    return <ErrorScreen error={error} router={router} />;
  }

  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        {seoData.tags && seoData.tags.length > 0 && (
          <meta name="keywords" content={seoData.tags.join(', ')} />
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="CodeLearn" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.structuredData) }}
        />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </Head>
      
      <div style={{backgroundColor:"#f5fdff66"}} className="min-h-screen flex flex-col transition-colors duration-300">
        {/* Offline Indicator */}
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
          <div className="flex-1 min-w-0 overflow-auto">
            <main>
              <Contentpage
                key={`${activeSection}-${activeItem}-${postId}`} // Include postId in key for better re-renders
                activeSection={activeSection}
                activeItem={activeItem}
                setActiveItem={handleSetActiveItem}
                setActiveSection={handleSetActiveSection}
                contentData={contentData}
                isLoading={false}
                Post_Id={postId} // FIXED: Use properly extracted postId
              />
            </main>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}