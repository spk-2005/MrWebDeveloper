// ItemPage.js - Enhanced with modern styling and responsive design

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Navbar2 from '../components/Navbar2';
import Sidenavbar from '../components/Sidenavbar';
import Contentpage from '../components/Contentpage';
import Footer from '../components/Footer';
import { 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  AlertTriangle, 
  Menu,
  X,
  Home,
  BookOpen,
  Zap
} from 'lucide-react';
import RightSidenavbar from '../components/RightSidenavbar';

// Static sidebar data mapping sections to their respective items
const sidebarData = {
  'HTML': ['Prerequisites', 'HTML Introduction', 'HTML Elements', 'HTML Attributes', 'HTML Forms'],
  'CSS': ['CSS Basics', 'CSS Selectors', 'CSS Properties', 'CSS Flexbox', 'CSS Grid'],
  'JavaScript': ['JS Introduction', 'Variables', 'Functions', 'DOM Manipulation', 'Events'],
  'Tailwind': ['Installation', 'Utility Classes', 'Responsive Design', 'Components', 'Customization']
};

// Helper function to convert URL section to proper section name
const getSectionFromUrl = (sectionSlug) => {
  return Object.keys(sidebarData).includes(sectionSlug) ? sectionSlug : null;
};

// Helper function to convert URL item to proper item name
const getItemFromUrl = (itemSlug) => {
  return itemSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// A caching mechanism for content to avoid re-fetching on back/forward navigation
const contentCache = new Map();

export default function ItemPage() {
  const router = useRouter();
  const { section, item } = router.query;
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [activeSection, setActiveSectionState] = useState(null);
  const [activeItem, setActiveItemState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contentData, setContentData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true); // Auto-open on desktop
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Corrected fetchContent function
  const fetchContent = async (sectionName, itemName) => {
    const cacheKey = `${sectionName}-${itemName}`;
    if (contentCache.has(cacheKey)) {
      return contentCache.get(cacheKey);
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Construct the API URL
    const apiUrl = `/api/posts?language=${encodeURIComponent(sectionName)}&heading=${encodeURIComponent(itemName)}`;

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch content from the API');
    }

    const data = await response.json();
    const post = data.posts && data.posts.length > 0 ? data.posts[0] : null;

    if (post) {
      contentCache.set(cacheKey, post);
      return post;
    }
    
    return null;
  };  

  // The single, powerful useEffect that handles all logic
  useEffect(() => {
    let isMounted = true;
    
    const processRoute = async () => {
      setIsLoading(true);
      setError(null);
      setContentData(null);

      if (!router.isReady) {
        return;
      }

      // Handle invalid or incomplete URLs
      if (!section || !item) {
        if (section && sidebarData[section]) {
          const firstItemSlug = sidebarData[section][0].replace(/\s+/g, '-');
          router.replace(`/${section}/${firstItemSlug}`);
        } else {
          router.replace('/HTML/Prerequisites');
        }
        return;
      }
      
      const properSectionName = getSectionFromUrl(section);
      const itemFromUrl = getItemFromUrl(item);

      if (properSectionName && sidebarData[properSectionName]?.includes(itemFromUrl)) {
        if (isMounted) {
          setActiveSectionState(properSectionName);
          setActiveItemState(itemFromUrl);
          
          try {
            const data = await fetchContent(properSectionName, itemFromUrl);
            if (isMounted) {
              setContentData(data);
            }
          } catch (err) {
            if (isMounted) {
              setError({ type: 'FETCH_ERROR', message: 'Failed to load content.' });
            }
          } finally {
            if (isMounted) {
              setIsLoading(false);
            }
          }
        }
      } else {
        if (isMounted) {
          setError({ type: 'INVALID_ROUTE', message: `Invalid tutorial path: ${section}/${item}` });
          setIsLoading(false);
        }
      }
    };
    
    processRoute();

    return () => {
      isMounted = false;
    };
  }, [router.isReady, section, item, router]);

  // Handler functions
  const handleSetActiveSection = (newSection) => {
    if (newSection && sidebarData[newSection]) {
      const sectionSlug = newSection;
      const firstItem = sidebarData[newSection][0];
      const itemSlug = firstItem.replace(/\s+/g, '-');
      router.push(`/${sectionSlug}/${itemSlug}`);
    }
  };

  const handleSetActiveItem = (newItem) => {
    if (activeSection && newItem) {
      const sectionSlug = activeSection;
      const itemSlug = newItem.replace(/\s+/g, '-');
      router.push(`/${sectionSlug}/${itemSlug}`);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const closeRightSidebar = () => {
    setIsRightSidebarOpen(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
          <div className="relative mb-6">
            <Loader2 className="w-16 h-16 text-blue-600 mx-auto animate-spin" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full mx-auto animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-700 mb-2">Loading Content</h2>
          <p className="text-slate-500">Preparing your learning experience...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center p-4">
        <div className="text-center bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl max-w-2xl border border-white/20">
          <div className="relative mb-6">
            <AlertTriangle className="w-20 h-20 text-red-500 mx-auto" />
            <div className="absolute inset-0 w-20 h-20 bg-red-100 rounded-full mx-auto animate-ping opacity-20"></div>
          </div>
          <h2 className="text-3xl font-bold text-red-600 mb-4">Oops! Content Not Found</h2>
          <p className="text-slate-600 mb-8 text-lg leading-relaxed">{error.message}</p>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => router.push('/')}
              className="group flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Return Home</span>
            </button>
            
            <button
              onClick={() => router.push('/HTML/Prerequisites')}
              className="group flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Start Learning</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{activeItem} - {activeSection} Tutorial | CodeLearn</title>
        <meta name="description" content={`Learn ${activeItem} in ${activeSection} with detailed examples and explanations.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
        {/* Navigation */}
        <Navbar />
        <Navbar2
          activeSection={activeSection}
          setActiveSection={handleSetActiveSection}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Mobile Navigation Buttons */}
        <div className="fixed top-20 left-4 right-4 z-50 flex justify-between items-center md:hidden">
          <button
            onClick={toggleSidebar}
            className={`bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-xl shadow-lg border border-white/20 transition-all duration-300 hover:bg-white hover:shadow-xl ${
              isSidebarOpen ? 'bg-blue-600 text-white' : ''
            }`}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleRightSidebar}
            className={`bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-xl shadow-lg border border-white/20 transition-all duration-300 hover:bg-white hover:shadow-xl ${
              isRightSidebarOpen ? 'bg-purple-600 text-white' : ''
            }`}
            aria-label={isRightSidebarOpen ? 'Close table of contents' : 'Open table of contents'}
          >
            <Zap className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className={`hidden md:block fixed top-32 z-40 bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-r-xl shadow-lg border border-white/20 transition-all duration-300 hover:bg-white hover:shadow-xl ${
            isSidebarOpen ? 'left-64' : 'left-0'
          }`}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>

        {/* Main Content Area */}
        <div className="flex flex-1 relative">
          {/* Left Sidebar */}
          <Sidenavbar
            activeSection={activeSection}
            activeItem={activeItem}
            setActiveItem={handleSetActiveItem}
            isSidebarOpen={isSidebarOpen}
            onClose={closeSidebar}
          />

          {/* Content Area */}
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex flex-1 relative">
              {/* Main Content */}
              <div className="flex-1 overflow-auto">
                <main className="p-4 md:p-6 lg:p-8">
                  <Contentpage
                    key={`${activeSection}-${activeItem}`}
                    activeSection={activeSection}
                    activeItem={activeItem}
                    setActiveItem={handleSetActiveItem}
                    setActiveSection={handleSetActiveSection}
                    contentData={contentData}
                    isLoading={isLoading}
                  />
                </main>
              </div>

              {/* Right Sidebar */}
              <div className={`${isRightSidebarOpen || !isMobile ? 'block' : 'hidden'} ${isMobile ? 'absolute right-0 top-0 h-full z-30' : 'relative'}`}>
                <RightSidenavbar 
                  activeSection={activeSection} 
                  activeItem={activeItem}
                  isOpen={isRightSidebarOpen}
                  onClose={closeRightSidebar}
                  isMobile={isMobile}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />

        {/* Mobile backdrop for right sidebar */}
        {isMobile && isRightSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={closeRightSidebar}
          />
        )}
      </div>
    </>
  );
}