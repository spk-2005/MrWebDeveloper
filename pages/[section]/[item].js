// Updated ItemPage.js - Fixed navigation and content fetching
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
  WifiOff
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

// FIXED: Helper function to get all items (including sub-items) from a section
const getAllItemsFromSection = (sectionData) => {
  const items = [];
  
  if (!Array.isArray(sectionData)) {
    console.warn('Section data is not an array:', sectionData);
    return items;
  }
  
  sectionData.forEach((item, index) => {
    console.log(`Processing section item ${index}:`, item);
    
    if (typeof item === 'string') {
      items.push(item);
      console.log('Added string item:', item);
    } else if (item && typeof item === 'object' && item.title) {
      // Add parent item
      items.push(item.title);
      console.log('Added parent item:', item.title);
      
      // Add all sub-items if they exist
      if (Array.isArray(item.subItems)) {
        item.subItems.forEach(subItem => {
          items.push(subItem);
          console.log('Added sub-item:', subItem);
        });
      }
    } else {
      console.warn('Unrecognized item structure at index', index, ':', item);
    }
  });
  
  console.log('Final items from section:', items);
  return items;
};

// FIXED: Helper function for case-insensitive and flexible matching
const normalizeString = (str) => {
  if (!str) return '';
  return str.toString().toLowerCase().trim();
};

const isStringMatch = (str1, str2) => {
  const normalized1 = normalizeString(str1);
  const normalized2 = normalizeString(str2);
  
  // Direct match
  if (normalized1 === normalized2) return true;
  
  // Handle URL slug format (e.g., "div-container" matches "div container")
  const slugified1 = normalized1.replace(/\s+/g, '-');
  const slugified2 = normalized2.replace(/\s+/g, '-');
  if (slugified1 === slugified2) return true;
  
  // Handle spaces vs hyphens
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

// FIXED: Enhanced routing hook with better post lookup
const useRouting = (section, item, router, allPosts) => {
  const [routeState, setRouteState] = useState({
    activeSection: null,
    activeItem: null,
    contentData: null,
    error: null,
    isProcessing: false
  });

  // Helper functions
  const getSectionFromUrl = useCallback((sectionSlug) => {
    // Direct match
    if (Object.keys(SIDEBAR_DATA).includes(sectionSlug)) {
      return sectionSlug;
    }
    
    // Case insensitive match
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
    
    // Convert slug back to title format
    return itemSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, []);

  // FIXED: Enhanced post lookup with flexible matching
  const findPostByLanguageAndHeading = useCallback((language, heading) => {
    console.log(`🔍 Looking for post: language="${language}", heading="${heading}"`);
    console.log('📊 Available posts:', allPosts.length);
    
    if (!allPosts || allPosts.length === 0) {
      console.log('❌ No posts available');
      return null;
    }

    // Log all HTML posts for debugging
    const htmlPosts = allPosts.filter(post => 
      normalizeString(post.language) === normalizeString(language)
    );
    console.log(`🌐 ${language} posts found:`, htmlPosts.length);
    htmlPosts.forEach((post, index) => {
      console.log(`  ${index + 1}. "${post.heading}" (id: ${post.id})`);
    });

    // Try multiple matching strategies
    const matchingStrategies = [
      // Strategy 1: Exact match
      (post) => isStringMatch(post.language, language) && isStringMatch(post.heading, heading),
      
      // Strategy 2: Language match with flexible heading match
      (post) => {
        const langMatch = isStringMatch(post.language, language);
        const headingMatch = isStringMatch(post.heading, heading);
        console.log(`  Checking "${post.heading}": lang=${langMatch}, heading=${headingMatch}`);
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
      console.log(`🎯 Trying matching strategy ${i + 1}...`);
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
      console.log('🚫 Router not ready yet');
      return;
    }

    console.log('🔄 Processing route change:', { section, item });
    setRouteState(prev => ({ ...prev, isProcessing: true }));

    // Handle invalid or incomplete URLs
    if (!section || !item) {
      console.log('⚠️ Incomplete URL, redirecting...');
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

    console.log('🎯 Resolved:', {
      properSectionName,
      itemFromUrl,
      originalSection: section,
      originalItem: item
    });

    if (properSectionName && SIDEBAR_DATA[properSectionName]) {
      // Get all valid items (including sub-items) from the section
      const allValidItems = getAllItemsFromSection(SIDEBAR_DATA[properSectionName]);
      console.log('📝 Valid items for section:', allValidItems);
      
      // Check if the item is valid in this section
      const isValidItem = allValidItems.some(validItem => isStringMatch(validItem, itemFromUrl));
      console.log('🔍 Is valid item?', isValidItem, 'for', itemFromUrl);
      
      if (isValidItem) {
        // Find the exact matching item name from our sidebar data
        const exactItemName = allValidItems.find(validItem => isStringMatch(validItem, itemFromUrl));
        console.log('✅ Exact item name:', exactItemName);
        
        // Look for post with enhanced matching
        const post = findPostByLanguageAndHeading(properSectionName, exactItemName || itemFromUrl);
        
        setRouteState({
          activeSection: properSectionName,
          activeItem: exactItemName || itemFromUrl,
          contentData: post,
          error: post ? null : {
            type: 'CONTENT_NOT_FOUND',
            title: 'Content Not Available',
            message: `The tutorial "${exactItemName || itemFromUrl}" in ${properSectionName} is currently being updated or is not available.`,
            suggestion: 'Try selecting another lesson from the sidebar or check back later.'
          },
          isProcessing: false
        });
      } else {
        console.log('❌ Invalid item for section');
        setRouteState({
          activeSection: null,
          activeItem: null,
          contentData: null,
          error: {
            type: 'INVALID_ROUTE',
            title: 'Tutorial Not Found',
            message: `The tutorial "${itemFromUrl}" doesn't exist in ${properSectionName} section.`,
            suggestion: 'Please choose a valid tutorial from our available courses.'
          },
          isProcessing: false
        });
      }
    } else {
      console.log('❌ Invalid section');
      setRouteState({
        activeSection: null,
        activeItem: null,
        contentData: null,
        error: {
          type: 'INVALID_ROUTE',
          title: 'Section Not Found',
          message: `The section "${section}" doesn't exist in our curriculum.`,
          suggestion: 'Please choose a valid section from our available courses.'
        },
        isProcessing: false
      });
    }
  }, [router.isReady, section, item, router, getSectionFromUrl, getItemFromUrl, findPostByLanguageAndHeading]);

  return routeState;
};

// Memoized components
const LoadingScreen = React.memo(() => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
      <div className="text-center space-y-6 p-8">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
          <div className="absolute inset-0 w-16 h-16 bg-blue-600 dark:bg-blue-400 rounded-full mx-auto animate-ping opacity-20"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Loading CodeLearn
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Preparing your learning experience...
          </p>
        </div>
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
LoadingScreen.displayName = 'LoadingScreen';

const ErrorScreen = React.memo(({ error, router }) => {
  const errorActions = useMemo(() => [
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
    },
    {
      icon: Settings,
      label: 'Retry',
      action: () => window.location.reload(),
      variant: 'tertiary'
    }
  ], [router]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="text-center bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-8 lg:p-12 rounded-3xl shadow-2xl max-w-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="relative mb-8">
          <AlertTriangle className="w-20 h-20 text-red-500 dark:text-red-400 mx-auto" />
          <div className="absolute inset-0 w-20 h-20 bg-red-500 dark:bg-red-400 rounded-full mx-auto animate-ping opacity-20"></div>
        </div>
       
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {error.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg leading-relaxed">
          {error.message}
        </p>
        <p className="text-gray-500 dark:text-gray-500 mb-8 text-sm">
          {error.suggestion}
        </p>
       
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {errorActions.map(({ icon: Icon, label, action, variant }) => (
            <button
              key={label}
              onClick={action}
              className={`group flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold
                        transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105
                        ${variant === 'primary'
                          ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white'
                          : variant === 'secondary'
                          ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
            >
              <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
ErrorScreen.displayName = 'ErrorScreen';

const SidebarToggle = React.memo(({ isSidebarOpen, toggleSidebar }) => {
  return (
    <button
      onClick={toggleSidebar}
      className={`fixed top-84 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-1 rounded-r-xl shadow-lg
                  transition-all duration-300 hover:shadow-xl border border-l-0 border-gray-200 dark:border-gray-600
                  text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                  ${isSidebarOpen ? 'left-72 xl:left-80' : 'left-0'}
                  md:block`}
      aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
    >
      {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
    </button>
  );
});
SidebarToggle.displayName = 'SidebarToggle';

export default function ItemPage() {
  const router = useRouter();
  const { section, item } = router.query;
  const { allPosts, isInitialLoading } = usePostsContext(); // CHANGED: Use allPosts instead of getPost
  
  // Custom hooks
  const isOnline = useOnlineStatus();
  const { isMobile, isDesktop } = useResponsive();
  const { activeSection, activeItem, contentData, error, isProcessing } = useRouting(section, item, router, allPosts);
  
  // Local state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Effects
  useEffect(() => {
    // Always show sidebar on desktop by default
    if (isDesktop) {
      setIsSidebarOpen(true);
    }
  }, [isDesktop]);

  // Log posts for debugging
  useEffect(() => {
    console.log('📊 Total posts in context:', allPosts?.length || 0);
    if (allPosts && allPosts.length > 0) {
      console.log('🔍 Sample posts:');
      allPosts.slice(0, 5).forEach((post, index) => {
        console.log(`  ${index + 1}. ${post.language} - "${post.heading}"`);
      });
    }
  }, [allPosts]);

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

  const seoData = useMemo(() => {
    // Use fallback data if contentData is not available
    const defaultTitle = 'MrDeveloper - Web Development Tutorials';
    const defaultDescription = 'Master web development with comprehensive tutorials covering HTML, CSS, JavaScript, and Tailwind CSS.';
    const defaultStructuredData = {
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
    };

    if (!contentData) {
      return {
        title: defaultTitle,
        description: defaultDescription,
        structuredData: defaultStructuredData,
        tags: []
      };
    }
    
    // Dynamically fetch title, description, and tags from contentData
    const title = contentData.title || `${contentData.heading} - ${contentData.language} Tutorial | MrDeveloper`;
    const description = contentData.description || `Learn ${contentData.heading} in ${contentData.language} with detailed examples, practical exercises, and step-by-step explanations.`;
    const tags = contentData.tags || [];

    const structuredData = {
      ...defaultStructuredData,
      "name": title,
      "description": description
    };

    return {
      title,
      description,
      tags, // Now includes tags from the database
      structuredData
    };
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
        {/* Add meta keywords using tags */}
        {seoData.tags && seoData.tags.length > 0 && (
          <meta name="keywords" content={seoData.tags.join(', ')} />
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" />
        
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="CodeLearn" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.structuredData) }}
        />
      </Head>
      
      <div style={{backgroundColor:"#f5fdff66"}} className="min-h-screen flex flex-col transition-colors duration-300">
        {/* Navigation */}
        <div className="sticky top-0 z-50">
          <Navbar />
          <Navbar2
            activeSection={activeSection}
            setActiveSection={handleSetActiveSection}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>

        <SidebarToggle
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        {/* Main Layout - Sidebar and Content Side by Side */}
        <div className="flex flex-1 relative">
          {/* Left Sidebar - Only render when open on desktop, always render on mobile for overlay */}
          {(isSidebarOpen || isMobile) && (
            <Sidenavbar
              activeSection={activeSection}
              activeItem={activeItem}
              setActiveItem={handleSetActiveItem}
              isSidebarOpen={isSidebarOpen}
              onClose={closeSidebar}
            />
          )}

          {/* Main Content Area - Full width when sidebar closed */}
          <div className="flex-1 min-w-0 overflow-auto">
            <main className="">
              <Contentpage
                key={`${activeSection}-${activeItem}`}
                activeSection={activeSection}
                activeItem={activeItem}
                setActiveItem={handleSetActiveItem}
                setActiveSection={handleSetActiveSection}
                contentData={contentData}
                isLoading={false}
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