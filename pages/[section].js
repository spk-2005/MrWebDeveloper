  import React, { useState, useEffect } from 'react';
  import { useRouter } from 'next/router';
  import Head from 'next/head';
  import Navbar from '../../pages/components/Navbar';
  import Navbar2 from '../../pages/components/Navbar2';
  import Sidenavbar from '../../pages/components/Sidenavbar';
  import Footer from '../../pages/components/Footer';
  import { ChevronRight, ChevronLeft } from 'lucide-react';

  // Static sidebar data (needs to be available here too)
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

  export default function SectionPage() {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeSection, setActiveSectionState] = useState(null);
    const [activeItem, setActiveItemState] = useState(null);

    useEffect(() => {
      if (router.isReady) {
        const { section } = router.query;
        console.log('Section page router query:', router.query);

        if (section) {
          const properSectionName = getSectionFromUrl(section);
          console.log('Setting active section to:', properSectionName);

          if (properSectionName && sidebarData[properSectionName]) {
            setActiveSectionState(properSectionName);
            // Set the first item as default for section overview
            setActiveItemState(sidebarData[properSectionName][0]);
          }
        }
      }
    }, [router.isReady, router.query.section, router]); // Added 'router' to dependencies

    const handleSetActiveSection = (newSection) => {
      // newSection is already in the correct casing
      const sectionSlug = newSection;
      router.push(`/${sectionSlug}`);
    };

    const handleSetActiveItem = (newItem) => {
      if (activeSection) {
        // activeSection is already in the correct casing
        const sectionSlug = activeSection;
        const itemSlug = newItem.replace(/\s+/g, '-');
        router.push(`/${sectionSlug}/${itemSlug}`);
      }
    };

    const toggleSidebar = () => {
      setIsSidebarOpen(prev => !prev);
    };

    // Show loading while router is not ready
    if (!router.isReady) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
            <p className="text-gray-600">Please wait while we load the content.</p>
          </div>
        </div>
      );
    }

    // Show error if invalid section
    if (!activeSection || !sidebarData[activeSection]) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Section Not Found</h2>
            <p className="text-gray-600">The requested section does not exist.</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }

    console.log('Section page render:', { activeSection, activeItem, isSidebarOpen });

    return (
      <>
        <Head>
          <title>{activeSection} Learning Path - Web Development Tutorial</title>
          <meta name="description" content={`Learn ${activeSection} with comprehensive tutorials and examples`} />
        </Head>

        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Navbar2
            activeSection={activeSection}
            setActiveSection={handleSetActiveSection}
            setIsSidebarOpen={setIsSidebarOpen}
          />

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
            {/* Sidenavbar */}
            <Sidenavbar
              activeSection={activeSection}
              activeItem={activeItem}
              setActiveItem={handleSetActiveItem}
              isSidebarOpen={isSidebarOpen}
            />

            {/* Main Content Area */}
            <div className={`transition-all duration-300 ${
              isSidebarOpen ? 'ml-0 md:ml-60' : 'ml-0'
            } flex-1`}>
              <div className="p-8">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    {activeSection} Learning Path
                  </h1>
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <p className="text-lg text-gray-600 mb-6">
                      Welcome to the {activeSection} learning section. Choose a topic from the sidebar to get started.
                    </p>

                    {/* Topics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      {sidebarData[activeSection].map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleSetActiveItem(item)}
                          className="text-left p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-gray-200 transition-colors duration-200"
                        >
                          <h3 className="font-semibold text-gray-900 mb-2">{item}</h3>
                          <p className="text-sm text-gray-600">
                            Learn about {item.toLowerCase()} in {activeSection}
                          </p>
                        </button>
                      ))}
                    </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-blue-900 mb-3">
                          📚 What You&apos;ll Learn
                        </h3>
                        <p className="text-blue-800">
                          Comprehensive tutorials and examples for {activeSection} development.
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-green-900 mb-3">
                          🚀 Get Started
                        </h3>
                        <p className="text-green-800">
                          Select a topic from the sidebar to begin your learning journey.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </>
    );
  }