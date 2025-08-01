import React from 'react';
import { Code, Palette, Zap, Wind } from 'lucide-react';
import Link from 'next/link';

// Define the sidebar data here so we can access the first item
const sidebarData = {
  'HTML': ['Prerequisites', 'HTML Introduction', 'HTML Elements', 'HTML Attributes', 'HTML Forms'],
  'CSS': ['CSS Basics', 'CSS Selectors', 'CSS Properties', 'CSS Flexbox', 'CSS Grid'],
  'JavaScript': ['JS Introduction', 'Variables', 'Functions', 'DOM Manipulation', 'Events'],
  'Tailwind': ['Installation', 'Utility Classes', 'Responsive Design', 'Components', 'Customization']
};

export default function Navbar2({ activeSection }) {
  const navItems = [
    { name: 'HTML', icon: Code, color: 'from-orange-500 to-red-500', bgActive: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { name: 'CSS', icon: Palette, color: 'from-blue-500 to-indigo-500', bgActive: 'bg-gradient-to-r from-blue-500 to-indigo-500' },
    { name: 'JavaScript', icon: Zap, color: 'from-yellow-500 to-orange-500', bgActive: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
    { name: 'Tailwind', icon: Wind, color: 'from-green-500 to-teal-500', bgActive: 'bg-gradient-to-r from-green-500 to-teal-500' }
  ];

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl sticky top-0 z-50 border-b border-gray-600 backdrop-blur-sm">
      <div className="px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                WebDev
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 flex justify-center">
            <div className="overflow-x-auto scrollbar-hide max-w-4xl">
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
                        relative group px-3 sm:px-5 py-2.5 rounded-xl text-sm font-semibold
                        transition-all duration-300 ease-out transform hover:scale-105
                        whitespace-nowrap min-w-[100px] sm:min-w-[130px]
                        focus:outline-none focus:ring-2 focus:ring-white/20
                        ${isActive
                          ? `${item.bgActive} text-white shadow-lg shadow-${item.color.split('-')[1]}-500/25`
                          : 'text-gray-300 hover:bg-white/10 hover:text-white hover:shadow-md'
                        }
                      `}
                    >
                      <div className="relative flex items-center justify-center space-x-2">
                        {/* Icon with glow effect for active state */}
                        <div className={`relative ${isActive ? 'drop-shadow-lg' : ''}`}>
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />
                          {isActive && (
                            <div className={`absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r ${item.color} opacity-20 blur-sm`}></div>
                          )}
                        </div>
                        
                        {/* Text */}
                        <span className="hidden sm:inline transition-all duration-300">
                          {item.name}
                        </span>
                        
                        {/* Mobile text (abbreviated) */}
                        <span className="sm:hidden text-xs font-medium">
                          {item.name === 'JavaScript' ? 'JS' : item.name.slice(0, 4)}
                        </span>
                      </div>

                      {/* Active indicator */}
                      {isActive && (
                        <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r ${item.color} rounded-full`}></div>
                      )}

                      {/* Hover effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right side - could add user menu, search, etc. */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2">
              {activeSection && (
                <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-300 font-medium">
                    Learning {activeSection}
                  </span>
                </div>
              )}
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