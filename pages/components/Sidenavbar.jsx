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

// Section configurations
const sectionConfigs = {
  'HTML': {
    icon: Code,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    border: 'border-orange-200 dark:border-orange-700',
    hoverBg: 'hover:bg-orange-50 dark:hover:bg-orange-900/20'
  },
  'CSS': {
    icon: Palette,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    border: 'border-blue-200 dark:border-blue-700',
    hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
  },
  'JavaScript': {
    icon: Zap,
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    border: 'border-yellow-200 dark:border-yellow-700',
    hoverBg: 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
  },
  'Tailwind': {
    icon: Wind,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/30',
    border: 'border-green-200 dark:border-green-700',
    hoverBg: 'hover:bg-green-50 dark:hover:bg-green-900/20'
  }
};

export default function Sidenavbar({ 
  activeSection, 
  activeItem, 
  setActiveItem, 
  isSidebarOpen, 
  onClose 
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
      <aside className={`fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-120px)] lg:top-[120px] 
                        w-64 lg:w-72 backdrop-blur-md border-r shadow-2xl lg:shadow-none 
                        overflow-y-auto z-50 lg:z-10 transform transition-transform duration-300 ease-out 
                        bg-white/90 dark:bg-gray-900/90 border-gray-200 dark:border-gray-700
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-120px)] lg:top-[120px] 
                   w-80 max-w-[85vw] lg:w-72 xl:w-80 
                   bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-r border-gray-200 dark:border-gray-700
                   shadow-2xl lg:shadow-none overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent
                   z-50 lg:z-10 transform transition-transform duration-300 ease-out 
                   ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Mobile Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">Course Content</h2>
                <p className="text-xs text-gray-600 dark:text-gray-300">Choose your learning path</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
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
                  className={`w-full flex items-center justify-between p-3 lg:p-4 rounded-xl transition-all duration-300 group
                            ${isActiveSection 
                              ? `${config.bg} ${config.border} border shadow-md ${config.color}` 
                              : `${config.hoverBg} border border-transparent text-gray-700 dark:text-gray-200 hover:border-gray-200 dark:hover:border-gray-600`
                            }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200
                                   ${isActiveSection ? config.bg : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <IconComponent className={`w-4 h-4 lg:w-5 lg:h-5 ${isActiveSection ? config.color : 'text-gray-600 dark:text-gray-300'}`} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm lg:text-base">{section}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {items.length} lessons
                      </div>
                    </div>
                  </div>
                  <ChevronRight 
                    className={`w-4 h-4 transition-transform duration-200 text-gray-400 dark:text-gray-500 ${
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
                              if (window.innerWidth < 1024) onClose();
                            }}
                            className={`w-full flex items-center space-x-3 p-3 lg:p-4 rounded-xl text-left transition-all duration-200 group
                                      ${isActiveItem 
                                        ? `${config.bg} ${config.border} border shadow-md ${config.color}` 
                                        : `${config.hoverBg} border border-transparent text-gray-700 dark:text-gray-200 hover:border-gray-200 dark:hover:border-gray-600`
                                      }`}
                          >
                            <div className="flex items-center space-x-3 min-w-0 flex-1">
                              {/* Status Icon */}
                              <div className="flex-shrink-0">
                                {isActiveItem ? (
                                  <Play className={`w-4 h-4 ${config.color}`} />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
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
                            <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 ${config.bg.replace('bg-', 'bg-').split(' ')[0].replace('bg-', 'bg-').replace('/30', '')} rounded-r-full`}></div>
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
        <div className="p-4 lg:p-6 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-700 dark:text-gray-200">
              <Target className="w-4 h-4 text-blue-500" />
              <span>Start Learning Today!</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Access all lessons freely and learn at your own pace
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}