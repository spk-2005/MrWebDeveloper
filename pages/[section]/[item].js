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
  // ... (component code remains the same)
});
LoadingScreen.displayName = 'LoadingScreen';

const ErrorScreen = React.memo(({ error, router }) => {
  // ... (component code remains the same)
});
ErrorScreen.displayName = 'ErrorScreen';
const SidebarToggle = React.memo(({ isSidebarOpen, toggleSidebar }) => {
  // ... (component code remains the same)
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
      
      <div className="min-h-screen  flex flex-col  transition-colors duration-300">

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