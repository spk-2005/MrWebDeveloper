import React, { useState, useEffect } from 'react';

// Define the sidebar data here so we can access the first item
const sidebarData = {
  'HTML': ['Prerequisites', 'HTML Introduction', 'HTML Elements', 'HTML Attributes', 'HTML Forms'],
  'CSS': ['CSS Basics', 'CSS Selectors', 'CSS Properties', 'CSS Flexbox', 'CSS Grid'],
  'JavaScript': ['JS Introduction', 'Variables', 'Functions', 'DOM Manipulation', 'Events'],
  'Tailwind': ['Installation', 'Utility Classes', 'Responsive Design', 'Components', 'Customization']
};

export default function Navbar2({ activeSection }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'HTML' },
    { name: 'CSS' },
    { name: 'JavaScript' },
    { name: 'Tailwind' }
  ];

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-14 sm:h-16">
            <div className="flex space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-16 sm:w-20 h-8 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`bg-white border-b sticky top-0 z-40 transition-colors duration-200 ${
      isScrolled ? 'border-gray-300 shadow-sm' : 'border-gray-200'
    }`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-14 sm:h-16">
          
          {/* Navigation Items Container */}
          <div className="w-full max-w-4xl overflow-x-auto scrollbar-hide">
            <div className="flex items-center justify-center space-x-2 sm:space-x-4 min-w-max px-2">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.name;
                const firstItem = sidebarData[item.name] ? sidebarData[item.name][0] : null;
                const href = firstItem ? `/${item.name}/${firstItem.replace(/\s+/g, '-')}` : `/${item.name}`;

                return (
                  <button
                    key={index} 
                    onClick={() => console.log(`Navigate to ${href}`)}
                    className={`
                      px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm font-medium
                      transition-colors duration-200 whitespace-nowrap
                      min-w-[70px] sm:min-w-[90px]
                      ${isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-transparent'
                      }
                    `}
                  >
                    <span className="text-center">
                      {/* Ultra mobile text */}
                      <span className="block sm:hidden">
                        {item.name === 'JavaScript' ? 'JS' : item.name.slice(0, 4)}
                      </span>
                      
                      {/* Desktop text */}
                      <span className="hidden sm:block">
                        {item.name}
                      </span>
                    </span>

                    {/* Simple active indicator */}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
        }
        
        @media (max-width: 640px) {
          .scrollbar-hide {
            scroll-snap-type: x mandatory;
          }
          .scrollbar-hide > div > button {
            scroll-snap-align: start;
          }
        }
        
        @media (max-width: 240px) {
          .scrollbar-hide > div {
            gap: 0.25rem;
          }
          .scrollbar-hide > div > button {
            min-width: 60px !important;
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
          }
        }
      `}</style>
    </nav>
  );
}