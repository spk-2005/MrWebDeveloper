import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Navbar2 from '../components/Navbar2';
import Sidenavbar from '../components/Sidenavbar';
import Contentpage from '../components/Contentpage';
import Footer from '../components/Footer';
import { ChevronRight, ChevronLeft } from 'lucide-react';

// Static sidebar data mapping sections to their respective items
const sidebarData = {
  'HTML': ['Prerequisites', 'HTML Introduction', 'HTML Elements', 'HTML Attributes', 'HTML Forms'],
  'CSS': ['CSS Basics', 'CSS Selectors', 'CSS Properties', 'CSS Flexbox', 'CSS Grid'],
  'JavaScript': ['JS Introduction', 'Variables', 'Functions', 'DOM Manipulation', 'Events'],
  'Tailwind': ['Installation', 'Utility Classes', 'Responsive Design', 'Components', 'Customization']
};

// Helper function to convert URL section to proper section name
const getSectionFromUrl = (sectionSlug) => {
  // Now, the URL will directly contain the capitalized section name,
  // so we just need to return it directly if it exists in sidebarData keys.
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

  console.log('=== ITEM PAGE DEBUG ===');
  console.log('Router query:', router.query);
  console.log('Router isReady:', router.isReady);
  console.log('Section param:', section);
  console.log('Item param:', item);
  console.log('Current activeSection state:', activeSection);
  console.log('Current activeItem state:', activeItem);

  // Effect to update activeSection and activeItem when router query changes
  useEffect(() => {
    if (router.isReady && section && item) {
      console.log('Processing router params from URL:', { section, item });

      const properSectionName = getSectionFromUrl(section);
      const itemFromUrl = getItemFromUrl(item);

      console.log('Converted to display format:', { properSectionName, itemFromUrl });

      if (properSectionName && sidebarData[properSectionName] && sidebarData[properSectionName].includes(itemFromUrl)) {
        console.log('Valid section and item found in data. Updating states.');
        setActiveSectionState(properSectionName);
        setActiveItemState(itemFromUrl);
      } else {
        console.error('Invalid URL section or item. Redirecting to home or error page:', {
          properSectionName,
          itemFromUrl,
          availableSections: Object.keys(sidebarData),
          availableItems: properSectionName ? (sidebarData[properSectionName] || []) : []
        });
        // Redirect to 404 or default page if invalid
        router.replace('/HTML/Prerequisites'); // Use original casing here
      }
    } else if (router.isReady && section && !item) {
        // This case handles direct access to /HTML or /CSS without an item
        // Redirect to the first item of that section
        const properSectionName = getSectionFromUrl(section);
        if (properSectionName && sidebarData[properSectionName]) {
            const firstItemSlug = sidebarData[properSectionName][0].replace(/\s+/g, '-');
            console.log(`Redirecting to first item of ${properSectionName}: /${section}/${firstItemSlug}`);
            router.replace(`/${section}/${firstItemSlug}`); // Use original casing for section
        }
    } else if (router.isReady && !section && !item) {
        // If just accessing root, redirect to default HTML Prerequisites
        console.log('No section/item in URL, redirecting to default HTML Prerequisites');
        router.replace('/HTML/Prerequisites'); // Use original casing here
    }
  }, [router.isReady, section, item, router]); // Added 'router' to dependencies

  // Handler functions for state management
  const handleSetActiveSection = (newSection) => {
    if (newSection && sidebarData[newSection]) {
      // Use newSection directly as it's already in the correct casing
      const sectionSlug = newSection;
      const firstItem = sidebarData[newSection][0];
      const itemSlug = firstItem.replace(/\s+/g, '-');
      router.push(`/${sectionSlug}/${itemSlug}`);
    }
  };

  const handleSetActiveItem = (newItem) => {
    if (activeSection && newItem) {
      // Use activeSection directly as it's already in the correct casing
      const sectionSlug = activeSection;
      const itemSlug = newItem.replace(/\s+/g, '-');
      router.push(`/${sectionSlug}/${itemSlug}`);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Show loading while router is not ready OR while activeSection/activeItem are being determined
  if (!router.isReady || activeSection === null || activeItem === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading content...</h2>
          <p className="text-gray-600">Please wait while we prepare the tutorial.</p>
        </div>
      </div>
    );
  }

  // Show error if activeSection or activeItem are still null after router is ready
  if (!activeSection || !activeItem) {
    const availableSections = Object.keys(sidebarData);
    const currentSectionItems = activeSection ? sidebarData[activeSection] || [] : [];

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Content Not Found</h2>
          <p className="text-gray-600 mb-4">
            The requested content for "{section || 'unknown'}/{item || 'unknown'}" does not exist or is invalid.
          </p>

          <div className="text-sm text-gray-500 mb-6">
            <p><strong>Available sections:</strong> {availableSections.join(', ')}</p>
            {activeSection && (
              <p><strong>Available items in {activeSection}:</strong> {currentSectionItems.join(', ')}</p>
            )}
          </div>

          <div className="space-y-2">
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Go Home
            </button>
            <button
              onClick={() => router.push('/HTML/Prerequisites')} // Use original casing here
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Start with HTML Prerequisites
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('Rendering with derived states:', { activeSection, activeItem, isSidebarOpen });

  return (
    <>
        <Head>
        <title>{activeItem} - {activeSection} Tutorial</title>
        <meta name="description" content={`Learn ${activeItem} in ${activeSection} with detailed examples and explanations`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Navbar2
          activeSection={activeSection}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-20 right-4 bg-yellow-100 border border-yellow-300 rounded p-2 text-xs z-50 max-w-xs">
            <div><strong>Debug:</strong></div>
            <div>Section: {activeSection}</div>
            <div>Item: {activeItem}</div>
            <div>Sidebar: {isSidebarOpen ? 'Open' : 'Closed'}</div>
            <div>URL: {router.asPath}</div>
          </div>
        )}

        {/* Toggle Button (Mobile only) */}
        <button
          onClick={toggleSidebar}
          className={`fixed top-32 z-50 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-md shadow-lg transition-all duration-300 flex items-center justify-center
            ${isSidebarOpen ? 'left-60' : 'left-0'}
            block md:hidden`}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="w-4 h-4 transition-transform duration-300" />
          ) : (
            <ChevronRight className="w-4 h-4 transition-transform duration-300" />
          )}
        </button>

        <div className="flex min-h-[calc(100vh-160px)]">
          {/* Sidenavbar with proper prop handlers */}
          <Sidenavbar
            activeSection={activeSection}
            activeItem={activeItem}
            setActiveItem={handleSetActiveItem}
            isSidebarOpen={isSidebarOpen}
          />

          {/* Main Content */}
          <div className={`transition-all duration-300 ${
            isSidebarOpen ? 'ml-0 md:ml-60' : 'ml-0'
          } flex-1`}>
            {/* Contentpage with all required props */}
            <Contentpage
              activeSection={activeSection}
              activeItem={activeItem}
              setActiveItem={handleSetActiveItem}
              setActiveSection={handleSetActiveSection}
            />
          </div>
        </div>

        <Footer />
      </div>    
    </>
  );
}