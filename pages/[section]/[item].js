import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { usePostsContext } from '../components/PostContext';
import Navbar from '../components/Navbar';
import Navbar2 from '../components/Navbar2';
import Sidenavbar from '../components/Sidenavbar';
import Contentpage from '../components/Contentpage';
import Footer from '../components/Footer';
import RightSidenavbar from '../components/RightSidenavbar';
import { 
  ChevronRight, 
  ChevronLeft, 
  AlertTriangle, 
  Menu,
  X,
  Home,
  BookOpen,
  Zap
} from 'lucide-react';

// Static sidebar data mapping sections to their respective items
const sidebarData = {
  'HTML': ['Prerequisites', 'HTML Introduction', 'HTML Elements', 'HTML Attributes', 'HTML Forms'],
  'CSS': ['CSS Basics', 'CSS Selectors', 'CSS Properties', 'CSS Flexbox', 'CSS Grid'],
  'JavaScript': ['JS Introduction', 'Variables', 'Functions', 'DOM Manipulation', 'Events'],
  'Tailwind': ['Installation', 'Utility Classes', 'Responsive Design', 'Components', 'Customization']
};

// Helper functions
const getSectionFromUrl = (sectionSlug) => {
  return Object.keys(sidebarData).includes(sectionSlug) ? sectionSlug : null;
};

const getItemFromUrl = (itemSlug) => {
  return itemSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function ItemPage() {
  const router = useRouter();
  const { section, item } = router.query;
  const { getPost, isInitialLoading } = usePostsContext();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [activeSection, setActiveSectionState] = useState(null);
  const [activeItem, setActiveItemState] = useState(null);
  const [error, setError] = useState(null);
  const [contentData, setContentData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Process route and get content (now instant!)
  useEffect(() => {
    if (!router.isReady || isInitialLoading) {
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
      setActiveSectionState(properSectionName);
      setActiveItemState(itemFromUrl);
      
      // Get post instantly from pre-loaded data
      const post = getPost(properSectionName, itemFromUrl);
      setContentData(post);
      
      if (!post) {
        setError({ type: 'CONTENT_NOT_FOUND', message: `Content not available for ${properSectionName}/${itemFromUrl}` });
      } else {
        setError(null);
      }
    } else {
      setError({ type: 'INVALID_ROUTE', message: `Invalid tutorial path: ${section}/${item}` });
    }
  }, [router.isReady, section, item, router, isInitialLoading, getPost]);

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

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const toggleRightSidebar = () => setIsRightSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);
  const closeRightSidebar = () => setIsRightSidebarOpen(false);

  // Show app loading screen while initial data is loading
  if (isInitialLoading) {
    return null; // AppLoadingScreen will handle this
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
          <h2 className="text-3xl font-bold text-red-600 mb-4">Content Not Found</h2>
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
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleRightSidebar}
            className={`bg-white/90 backdrop-blur-sm text-gray-700 p-3 rounded-xl shadow-lg border border-white/20 transition-all duration-300 hover:bg-white hover:shadow-xl ${
              isRightSidebarOpen ? 'bg-purple-600 text-white' : ''
            }`}
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
                    isLoading={false} // No longer loading since data is pre-loaded
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