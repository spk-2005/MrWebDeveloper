import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  X, 
  BookOpen, 
  Code,
  Palette,
  Zap,
  Wind,
  Play,
  Target
} from 'lucide-react';

// Static sidebar data
const sidebarData = {
  'HTML': ['Prerequisites', 'HTML Introduction', 'HTML Elements', 'HTML Attributes', 'HTML Forms'],
  'CSS': ['CSS Basics', 'CSS Selectors', 'CSS Properties', 'CSS Flexbox', 'CSS Grid'],
  'JavaScript': ['JS Introduction', 'Variables', 'Functions', 'DOM Manipulation', 'Events'],
  'Tailwind': ['Installation', 'Utility Classes', 'Responsive Design', 'Components', 'Customization']
};

// Section configurations with enhanced colors
const sectionConfigs = {
  'HTML': {
    icon: Code,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20',
    border: 'border-orange-300 dark:border-orange-600',
    hoverBg: 'hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-25 dark:hover:from-orange-900/20 dark:hover:to-orange-800/10',
    iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
    shadow: 'shadow-orange-200/50 dark:shadow-orange-900/20'
  },
  'CSS': {
    icon: Palette,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20',
    border: 'border-blue-300 dark:border-blue-600',
    hoverBg: 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-25 dark:hover:from-blue-900/20 dark:hover:to-blue-800/10',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    shadow: 'shadow-blue-200/50 dark:shadow-blue-900/20'
  },
  'JavaScript': {
    icon: Zap,
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20',
    border: 'border-yellow-300 dark:border-yellow-600',
    hoverBg: 'hover:bg-gradient-to-r hover:from-yellow-50 hover:to-yellow-25 dark:hover:from-yellow-900/20 dark:hover:to-yellow-800/10',
    iconBg: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    shadow: 'shadow-yellow-200/50 dark:shadow-yellow-900/20'
  },
  'Tailwind': {
    icon: Wind,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20',
    border: 'border-emerald-300 dark:border-emerald-600',
    hoverBg: 'hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-25 dark:hover:from-emerald-900/20 dark:hover:to-emerald-800/10',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    shadow: 'shadow-emerald-200/50 dark:shadow-emerald-900/20'
  }
};

export default function Sidenavbar({ 
  activeSection = 'HTML', 
  activeItem = 'Prerequisites', 
  setActiveItem = () => {}, 
  isSidebarOpen = true 
}) {
  const [expandedSections, setExpandedSections] = useState(new Set([activeSection]));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (activeSection && !expandedSections.has(activeSection)) {
      setExpandedSections(prev => new Set([...prev, activeSection]));
    }
  }, [activeSection, expandedSections]);

  const toggleSection = (section) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  if (!mounted) {
    return (
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-120px)] lg:top-[120px] 
                    w-80 max-w-[85vw] lg:w-72 xl:w-80 
                    bg-gradient-to-b from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-md border-r border-gray-200/80 dark:border-gray-700/80
                    shadow-2xl lg:shadow-none overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent
                    z-40 lg:z-10 transform transition-transform duration-300 ease-out 
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-12 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl"></div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-120px)] lg:top-[120px] 
                  w-80 max-w-[85vw] lg:w-72 xl:w-80 
                  bg-gradient-to-b from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-md border-r border-gray-200/80 dark:border-gray-700/80
                  shadow-2xl lg:shadow-none overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent
                  z-40 lg:z-10 transform transition-transform duration-300 ease-out 
                  ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Mobile Header */}
      <div className="sticky top-0 bg-gradient-to-r from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/95 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-700/80 p-4 lg:hidden">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-200/50">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">Course Content</h2>
              <p className="text-xs text-gray-600 dark:text-gray-300">Choose your learning path</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="p-4 lg:p-6 space-y-2">
        {Object.entries(sidebarData).map(([section, items]) => {
          const config = sectionConfigs[section];
          const IconComponent = config.icon;
          const isExpanded = expandedSections.has(section);
          const isActiveSection = activeSection === section;

          return (
            <div key={section} className="space-y-1">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section)}
                className={`w-full flex items-center justify-between p-3 lg:p-4 rounded-xl transition-all duration-300 group transform hover:scale-[1.02]
                          ${isActiveSection 
                            ? `${config.bg} ${config.border} border shadow-lg ${config.shadow} ${config.color}` 
                            : `${config.hoverBg} border border-transparent text-gray-700 dark:text-gray-200 hover:border-gray-200/50 dark:hover:border-gray-600/50 hover:shadow-md`
                          }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110
                                ${isActiveSection ? config.iconBg : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700'}`}>
                    <IconComponent className={`w-4 h-4 lg:w-5 lg:h-5 ${isActiveSection ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm lg:text-base">{section}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {items.length} lessons
                    </div>
                  </div>
                </div>
                <ChevronRight 
                  className={`w-4 h-4 transition-transform duration-300 text-gray-400 dark:text-gray-500 ${
                    isExpanded ? 'rotate-90' : ''
                  }`} 
                />
              </button>

              {/* Section Items */}
              {isExpanded && (
                <div className="ml-4 lg:ml-6 space-y-1 animate-in slide-in-from-top-2 duration-200">
                  {items.map((item, index) => {
                    const isActiveItem = activeItem === item && isActiveSection;
                    
                    return (
                      <div key={item} className="relative">
                        <button
                          onClick={() => {
                            setActiveItem(item);
                            // Removed auto-close functionality - only the SidebarToggle can control open/close
                          }}
                          className={`w-full flex items-center space-x-3 p-3 lg:p-4 rounded-xl text-left transition-all duration-300 group transform hover:scale-[1.01]
                                    ${isActiveItem 
                                      ? `${config.bg} ${config.border} border shadow-lg ${config.shadow} ${config.color}` 
                                      : `${config.hoverBg} border border-transparent text-gray-700 dark:text-gray-200 hover:border-gray-200/50 dark:hover:border-gray-600/50 hover:shadow-md`
                                    }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            {/* Status Icon */}
                            <div className="flex-shrink-0">
                              {isActiveItem ? (
                                <div className={`w-4 h-4 rounded-full ${config.iconBg} flex items-center justify-center shadow-lg`}>
                                  <Play className="w-2 h-2 text-white ml-0.5" />
                                </div>
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700"></div>
                              )}
                            </div>
                            
                            {/* Item Content */}
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-sm lg:text-base truncate">
                                {item}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Lesson {index + 1}
                              </div>
                            </div>
                          </div>
                        </button>

                        {/* Active indicator */}
                        {isActiveItem && (
                          <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 ${config.iconBg} rounded-r-full shadow-lg`}></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 lg:p-6 border-t border-gray-200/80 dark:border-gray-700/80 bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-700 dark:text-gray-200">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Target className="w-2 h-2 text-white" />
            </div>
            <span className="font-medium bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">Start Learning Today!</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Access all lessons freely and learn at your own pace
          </p>
        </div>
      </div>
    </aside>
  );
}