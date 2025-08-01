import { useEffect, useState } from "react";
import Link from 'next/link';

const sidebar = {
  'HTML': ['Prerequisites', 'HTML Introduction', 'HTML Elements', 'HTML Attributes', 'HTML Forms'],
  'CSS': ['CSS Basics', 'CSS Selectors', 'CSS Properties', 'CSS Flexbox', 'CSS Grid'],
  'JavaScript': ['JS Introduction', 'Variables', 'Functions', 'DOM Manipulation', 'Events'],
  'Tailwind': ['Installation', 'Utility Classes', 'Responsive Design', 'Components', 'Customization']
};

export default function Sidenavbar({ activeSection, activeItem, isSidebarOpen, onClose }) {
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    if (activeSection && sidebar[activeSection]) {
      setExpandedSections({ [activeSection]: true });
    } else {
      setExpandedSections({});
    }
  }, [activeSection]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!activeSection || !sidebar[activeSection]) {
    return null;
  }

  const items = sidebar[activeSection];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        />
      )}
      
      <div className="relative">
        <nav
          className={`bg-white shadow-lg border-r border-gray-200 overflow-y-auto transition-all duration-300 z-40
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            fixed left-0 top-0 h-full w-64 
            md:relative md:translate-x-0 md:shadow-none
            ${isSidebarOpen ? 'md:w-64' : 'md:w-16'}
          `}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center justify-between p-4">
              <h2 className={`font-bold transition-all duration-300 ${
                isSidebarOpen ? 'text-lg opacity-100' : 'text-sm opacity-0 md:opacity-100'
              }`}>
                {isSidebarOpen ? 'Learning Path' : 'LP'}
              </h2>
              
              {/* Close button for mobile */}
              <button
                onClick={onClose}
                className="md:hidden text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className={`transition-all duration-300 ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0 md:opacity-100'
          }`}>
            <div className="p-3">
              {/* Active Section */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => toggleSection(activeSection)}
                  className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className={`font-semibold transition-all duration-300 ${
                      isSidebarOpen ? 'block' : 'hidden md:block'
                    }`}>
                      {isSidebarOpen ? activeSection : activeSection.charAt(0)}
                    </span>
                  </div>
                  
                  <span className={`text-white transition-transform duration-200 ${
                    expandedSections[activeSection] ? 'rotate-180' : ''
                  } ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                {/* Section Items */}
                <div className={`overflow-hidden transition-all duration-300 ${
                  expandedSections[activeSection] && isSidebarOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="mt-3 space-y-1">
                    {items.map((item, index) => (
                      <div key={index} className="relative">
                        <Link 
                          href={`/${activeSection}/${item.replace(/\s+/g, '-')}`}
                          className={`group flex items-center justify-between w-full py-3 px-4 text-sm rounded-lg transition-all duration-200 relative
                            ${activeItem === item
                              ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-500 shadow-sm'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600 hover:shadow-sm'
                            }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                              activeItem === item ? 'bg-blue-500' : 'bg-gray-300 group-hover:bg-blue-400'
                            }`}></div>
                            
                            <span className="transition-all duration-200 leading-tight">
                              {item}
                            </span>
                          </div>
                          
                          {activeItem === item && (
                            <div className="flex items-center space-x-1">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                            </div>
                          )}
                          
                          {/* Hover indicator */}
                          <div className={`absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                            activeItem === item ? 'hidden' : ''
                          }`}>
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress indicator */}
              {isSidebarOpen && (
                <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600">Progress</span>
                    <span className="text-xs text-gray-500">
                      {items.indexOf(activeItem) + 1}/{items.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((items.indexOf(activeItem) + 1) / items.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}