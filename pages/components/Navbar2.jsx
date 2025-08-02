import React, { useState, useEffect } from 'react';
import { Code, Palette, Zap, Wind, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

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
    { 
      name: 'HTML', 
      icon: Code, 
      description: 'Structure & Markup'
    },
    { 
      name: 'CSS', 
      icon: Palette, 
      description: 'Styling & Design'
    },
    { 
      name: 'JavaScript', 
      icon: Zap, 
      description: 'Interactivity & Logic'
    },
    { 
      name: 'Tailwind', 
      icon: Wind, 
      description: 'Utility-First CSS'
    }
  ];

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <nav className="shadow-2xl sticky  z-40 border-b backdrop-blur-sm">
        <div className="px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <div className="w-24 h-8 rounded animate-pulse"></div>
            <div className="flex space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-20 h-10 rounded-xl animate-pulse"></div>
              ))}
            </div>
            <div className="w-32 h-8 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`shadow-2xl sticky top-16 z-40 border-b backdrop-blur-sm transition-all duration-300 ${
      isScrolled ? 'shadow-2xl' : ''
    }`}>
      <div className="px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
         

          {/* Navigation Items */}
          <div className="flex-1 flex justify-center">
            <div className="overflow-x-auto scrollbar-hide max-w-5xl">
              <div className="flex items-center space-x-1 sm:space-x-2 min-w-max px-2">
                {navItems.map((item, index) => {
                  const IconComponent = item.icon;
                  const isActive = activeSection === item.name;
                  
                  const firstItem = sidebarData[item.name] ? sidebarData[item.name][0] : null;
                  const href = firstItem ? `/${item.name}/${firstItem.replace(/\s+/g, '-')}` : `/${item.name}`;

                  return (
                    <Link 
                      key={index} 
                      href={href}
                      className={`
                        group relative px-3 sm:px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl text-sm font-semibold
                        transition-all duration-300 ease-out transform hover:scale-105
                        whitespace-nowrap min-w-[90px] sm:min-w-[120px] lg:min-w-[140px]
                        focus:outline-none focus:ring-2
                        ${isActive
                          ? 'shadow-lg'
                          : 'hover:shadow-md'
                        }
                      `}
                    >
                      <div className="relative flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                       
                        
                        {/* Text */}
                        <div className="text-center sm:text-left">
                          <span className="hidden sm:inline text-sm lg:text-base font-semibold transition-all duration-300">
                            {item.name}
                          </span>
                          
                          {/* Mobile text (abbreviated) */}
                          <span className="sm:hidden text-xs font-medium">
                            {item.name === 'JavaScript' ? 'JS' : item.name.slice(0, 4)}
                          </span>

                        </div>
                      </div>

                      {/* Active indicator */}
                      {isActive && (
                        <>
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 rounded-full"></div>
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 rounded-full blur-sm animate-pulse"></div>
                        </>
                      )}

                      {/* Hover effect */}
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Progress indicator for active item */}
                      {isActive && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl overflow-hidden">
                          <div className="h-full w-3/4 animate-pulse"></div>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
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
      `}</style>
    </nav>
  );
}