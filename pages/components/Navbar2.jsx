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

// Section configurations for styling
const sectionConfigs = {
  'HTML': {
    gradient: 'from-orange-400 to-red-500',
    ring: 'ring-orange-500/20',
    border: 'border-orange-300/50',
    shadow: 'shadow-orange-500/25'
  },
  'CSS': {
    gradient: 'from-blue-400 to-cyan-500',
    ring: 'ring-blue-500/20',
    border: 'border-blue-300/50',
    shadow: 'shadow-blue-500/25'
  },
  'JavaScript': {
    gradient: 'from-yellow-400 to-orange-500',
    ring: 'ring-yellow-500/20',
    border: 'border-yellow-300/50',
    shadow: 'shadow-yellow-500/25'
  },
  'Tailwind': {
    gradient: 'from-emerald-400 to-teal-500',
    ring: 'ring-emerald-500/20',
    border: 'border-emerald-300/50',
    shadow: 'shadow-emerald-500/25'
  }
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
      <nav className="shadow-2xl sticky z-40 backdrop-blur-sm">
        <div className="px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <div className="w-24 h-8 rounded animate-pulse"></div>
            <div className="flex space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-20 h-10 rounded-xl animate-pulse border border-gray-200"></div>
              ))}
            </div>
            <div className="w-32 h-8 rounded animate-pulse border border-gray-200"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`shadow-2xl sticky top-16 z-40 backdrop-blur-xl transition-all duration-300 ${
      isScrolled ? 'shadow-2xl border-gray-200/50' : 'border-gray-100/50'
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
                  const config = sectionConfigs[item.name];
                  
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
                          ? `border-2 ${config.border} shadow-xl ${config.shadow} ring-4 ${config.ring}`
                          : 'border border-gray-200/60 hover:border-gray-300/80 shadow-lg hover:shadow-xl'
                        }
                      `}
                    >
                      <div className="relative flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                        {/* Glass morphism overlay */}
                        <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? `bg-gradient-to-br ${config.gradient} opacity-90` 
                            : 'bg-gradient-to-br from-white/60 to-gray-50/40 opacity-0 group-hover:opacity-100'
                        }`}></div>
                        
                        {/* Text */}
                        <div className={`relative z-10 text-center sm:text-left ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>
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
                          <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r ${config.gradient} rounded-full`}></div>
                          <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r ${config.gradient} rounded-full blur-sm animate-pulse`}></div>
                        </>
                      )}

                      {/* Progress indicator for active item */}
                      {isActive && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl overflow-hidden">
                          <div className={`h-full w-3/4 bg-gradient-to-r ${config.gradient} animate-pulse`}></div>
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