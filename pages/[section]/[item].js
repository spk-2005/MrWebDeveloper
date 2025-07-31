// ItemPage.js

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Navbar2 from '../components/Navbar2';
import Sidenavbar from '../components/Sidenavbar';
import Contentpage from '../components/Contentpage';
import Footer from '../components/Footer';
import { ChevronRight, ChevronLeft, Loader2, AlertTriangle } from 'lucide-react';
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
  if (Object.keys(sidebarData).includes(sectionSlug)) {
    return sectionSlug;
  }
  return null;
};

// Helper function to convert URL item to proper item name
const getItemFromUrl = (itemSlug) => {
  return itemSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function ItemPage() {
  const router = useRouter();
  const { section, item } = router.query;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSectionState] = useState(null);
  const [activeItem, setActiveItemState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('=== ITEM PAGE DEBUG ===');
  console.log('Router query:', router.query);
  console.log('Router isReady:', router.isReady);
  console.log('Section param:', section);
  console.log('Item param:', item);
  console.log('Current activeSection state:', activeSection);
  console.log('Current activeItem state:', activeItem);

  // Effect to update activeSection and activeItem when router query changes
  useEffect(() => {
    const initializePage = async () => {
      setIsLoading(true);
      setError(null);

      if (router.isReady && section && item) {
        console.log('Processing router params from URL:', { section, item });

        const properSectionName = getSectionFromUrl(section);
        const itemFromUrl = getItemFromUrl(item);

        console.log('Converted to display format:', { properSectionName, itemFromUrl });

        if (properSectionName && sidebarData[properSectionName] && sidebarData[properSectionName].includes(itemFromUrl)) {
          console.log('Valid section and item found in data. Updating states.');
          setActiveSectionState(properSectionName);
          setActiveItemState(itemFromUrl);
          setError(null);
        } else {
          console.error('Invalid URL section or item:', {
            properSectionName,
            itemFromUrl,
            availableSections: Object.keys(sidebarData),
            availableItems: properSectionName ? (sidebarData[properSectionName] || []) : []
          });
          setError({
            type: 'INVALID_ROUTE',
            message: `Invalid tutorial path: ${section}/${item}`,
            section: properSectionName,
            item: itemFromUrl
          });
        }
      } else if (router.isReady && section && !item) {
        // Handle direct access to /HTML or /CSS without an item
        const properSectionName = getSectionFromUrl(section);
        if (properSectionName && sidebarData[properSectionName]) {
          const firstItemSlug = sidebarData[properSectionName][0].replace(/\s+/g, '-');
          console.log(`Redirecting to first item of ${properSectionName}: /${section}/${firstItemSlug}`);
          router.replace(`/${section}/${firstItemSlug}`);
          return; // Don't set loading to false, let the redirect handle it
        } else {
          setError({
            type: 'INVALID_SECTION',
            message: `Invalid section: ${section}`,
            section: section
          });
        }
      } else if (router.isReady && !section && !item) {
        // If accessing root, redirect to default HTML Prerequisites
        console.log('No section/item in URL, redirecting to default HTML Prerequisites');
        router.replace('/HTML/Prerequisites');
        return; // Don't set loading to false, let the redirect handle it
      }

      // Add a small delay to prevent flash of loading state
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };

    initializePage();
  }, [router.isReady, section, item, router]);

  // Handler functions for state management
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

  // Show loading while router is not ready or while page is initializing
  if (!router.isReady || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Loading Tutorial</h2>
          <p className="text-slate-600 mb-2">Preparing your learning experience...</p>
          <div className="w-full bg-slate-200 rounded-full h-2 mt-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if there's an error state
  if (error) {
    const availableSections = Object.keys(sidebarData);
    const currentSectionItems = error.section && sidebarData[error.section] ? sidebarData[error.section] : [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-100px)] px-4">
          <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl max-w-2xl border border-white/20">
            <div className="w-20 h-20 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-red-600 mb-4">Content Not Found</h2>
            <p className="text-slate-600 mb-6 text-lg">
              {error.message}
            </p>

            <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-slate-900 mb-3">Available Learning Paths:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableSections.map((availableSection) => (
                  <div key={availableSection} className="space-y-2">
                    <h4 className="font-medium text-slate-800">{availableSection}</h4>
                    <div className="text-sm text-slate-600 space-y-1">
                      {sidebarData[availableSection].slice(0, 3).map((topic) => (
                        <div key={topic}>• {topic}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => router.push('/')}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Return Home
              </button>
              <button
                onClick={() => router.push('/HTML/Prerequisites')}
                className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start with HTML Prerequisites
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Final validation before rendering main content
  if (!activeSection || !activeItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
          <p className="text-slate-600 mb-4">Unable to load the tutorial content</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering with derived states:', { activeSection, activeItem, isSidebarOpen });

  return (
    <>
      <Head>
        <title>{activeItem} - {activeSection} Tutorial | CodeLearn</title>
        <meta name="description" content={`Learn ${activeItem} in ${activeSection} with detailed examples and explanations. Master web development with CodeLearn's comprehensive tutorials.`} />
        <meta name="keywords" content={`${activeSection}, ${activeItem}, web development, tutorial, coding, programming`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${activeItem} - ${activeSection} Tutorial`} />
        <meta property="og:description" content={`Learn ${activeItem} in ${activeSection} with detailed examples`} />
        <meta property="og:type" content="article" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LearningResource",
              "name": `${activeItem} - ${activeSection} Tutorial`,
              "description": `Learn ${activeItem} in ${activeSection} with detailed examples and explanations`,
              "educationalLevel": "Beginner to Intermediate",
              "learningResourceType": "Tutorial"
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
        <Navbar />
        <Navbar2
          activeSection={activeSection}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Left Sidebar Toggle Button for Mobile */}
        <button
          onClick={toggleSidebar}
          className={`fixed top-32 z-50 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-3 rounded-r-xl shadow-2xl transition-all duration-300 flex items-center justify-center group
            ${isSidebarOpen ? 'left-60' : 'left-0'}
            block md:hidden`}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
          ) : (
            <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
          )}
        </button>

        {/* Main content area with responsive layout */}
        <div className="flex flex-1">
          {/* Left Sidebar */}
          <Sidenavbar
            activeSection={activeSection}
            activeItem={activeItem}
            setActiveItem={handleSetActiveItem}
            isSidebarOpen={isSidebarOpen}
          />

          {/* Content area wrapper */}
          <div className="flex flex-col flex-1 min-h-[calc(100vh-160px)]">
            {/* Main Content Area with Desktop Right Sidebar */}
            <div className="flex flex-1">
              {/* Main Content */}
              <div className="flex-1 overflow-auto transition-all duration-300">
                <Contentpage
                  activeSection={activeSection}
                  activeItem={activeItem}
                  setActiveItem={handleSetActiveItem}
                  setActiveSection={handleSetActiveSection}
                />
              </div>

              {/* Right Sidebar - Desktop only (hidden on mobile/tablet) */}
              <RightSidenavbar
                activeSection={activeSection} 
                activeItem={activeItem} 
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar Content - Mobile/Tablet only (shown below main content) */}
        <RightSidenavbar
          activeSection={activeSection} 
          activeItem={activeItem} 
        />

        <Footer />
      </div>    
    </>
  );
}