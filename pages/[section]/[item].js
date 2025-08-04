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
  'HTML': ['Prerequisites', 'HTML Introduction', 'HTML Elements', 'HTML Attributes', 'HTML Forms'],
  'CSS': ['CSS Basics', 'CSS Selectors', 'CSS Properties', 'CSS Flexbox', 'CSS Grid'],
  'JavaScript': ['JS Introduction', 'Variables', 'Functions', 'DOM Manipulation', 'Events'],
  'Tailwind': ['Installation', 'Utility Classes', 'Responsive Design', 'Components', 'Customization']
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

const useRouting = (section, item, router, getPost) => {
  const [routeState, setRouteState] = useState({
    activeSection: null,
    activeItem: null,
    contentData: null,
    error: null,
    isProcessing: false
  });

  // Helper functions
  const getSectionFromUrl = useCallback((sectionSlug) => {
    return Object.keys(SIDEBAR_DATA).includes(sectionSlug) ? sectionSlug : null;
  }, []);

  const getItemFromUrl = useCallback((itemSlug) => {
    if (!itemSlug) return null;
    return itemSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    setRouteState(prev => ({ ...prev, isProcessing: true }));

    // Handle invalid or incomplete URLs
    if (!section || !item) {
      if (section && SIDEBAR_DATA[section]) {
        const firstItemSlug = SIDEBAR_DATA[section][0].replace(/\s+/g, '-');
        router.replace(`/${section}/${firstItemSlug}`);
      } else {
        router.replace('/HTML/Prerequisites');
      }
      return;
    }

    const properSectionName = getSectionFromUrl(section);
    const itemFromUrl = getItemFromUrl(item);

    if (properSectionName && SIDEBAR_DATA[properSectionName]?.includes(itemFromUrl)) {
      const post = getPost(properSectionName, itemFromUrl);
      
      setRouteState({
        activeSection: properSectionName,
        activeItem: itemFromUrl,
        contentData: post,
        error: post ? null : {
          type: 'CONTENT_NOT_FOUND',
          title: 'Content Not Available',
          message: `The tutorial "${itemFromUrl}" in ${properSectionName} is currently being updated or is not available.`,
          suggestion: 'Try selecting another lesson from the sidebar or check back later.'
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
          message: `The tutorial path "${section}/${item}" doesn't exist in our curriculum.`,
          suggestion: 'Please choose a valid tutorial from our available courses.'
        },
        isProcessing: false
      });
    }
  }, [router.isReady, section, item, router, getSectionFromUrl, getItemFromUrl, getPost]);

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
      action: () => router.push('/HTML/Prerequisites'),
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
      className={`fixed top-94 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-r-xl shadow-lg 
                  transition-all duration-300 hover:shadow-xl border border-l-0 border-gray-200 dark:border-gray-600 
                  text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 
                  ${isSidebarOpen ? 'left-72 xl:left-80' : 'left-0'}
                  md:block`} // This shows on desktop
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
  const { getPost, isInitialLoading } = usePostsContext();
  
  // Custom hooks
  const isOnline = useOnlineStatus();
  const { isMobile, isDesktop } = useResponsive();
  const { activeSection, activeItem, contentData, error, isProcessing } = useRouting(section, item, router, getPost);
  
  // Local state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Effects
  useEffect(() => {
    // Always show sidebar on desktop by default
    if (isDesktop) {
      setIsSidebarOpen(true);
    }
  }, [isDesktop]);

  // Memoized handlers
  const handleSetActiveSection = useCallback((newSection) => {
    if (newSection && SIDEBAR_DATA[newSection]) {
      const sectionSlug = newSection;
      const firstItem = SIDEBAR_DATA[newSection][0];
      const itemSlug = firstItem.replace(/\s+/g, '-');
      router.push(`/${sectionSlug}/${itemSlug}`);
    }
  }, [router]);

  const handleSetActiveItem = useCallback((newItem) => {
    if (activeSection && newItem) {
      const sectionSlug = activeSection;
      const itemSlug = newItem.replace(/\s+/g, '-');
      router.push(`/${sectionSlug}/${itemSlug}`);
    }
  }, [activeSection, router]);

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  const seoData = useMemo(() => ({
    title: activeItem ? `${activeItem} - ${activeSection} Tutorial | CodeLearn` : 'CodeLearn - Web Development Tutorials',
    description: activeItem 
      ? `Learn ${activeItem} in ${activeSection} with detailed examples, practical exercises, and step-by-step explanations.`
      : 'Master web development with comprehensive tutorials covering HTML, CSS, JavaScript, and Tailwind CSS.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "LearningResource",
      "name": activeItem ? `${activeItem} - ${activeSection} Tutorial` : 'CodeLearn Tutorials',
      "description": `Learn ${activeItem || 'web development'} ${activeSection ? `in ${activeSection}` : ''}`,
      "educationalLevel": "Beginner to Intermediate",
      "learningResourceType": "Tutorial",
      "provider": {
        "@type": "Organization",
        "name": "CodeLearn"
      }
    }
  }), [activeItem, activeSection]);

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
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
        
        {/* Offline notification */}
        {!isOnline && (
          <div className="bg-orange-100 dark:bg-orange-900/30 border-l-4 border-orange-500 dark:border-orange-400 text-orange-800 dark:text-orange-200 text-center py-2 px-4 text-sm font-medium flex items-center justify-center space-x-2 transition-colors duration-300">
            <WifiOff className="w-4 h-4" />
            <span>You&apos;re offline. Some features may not work properly.</span>
          </div>
        )}

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
            <main className="p-4">
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