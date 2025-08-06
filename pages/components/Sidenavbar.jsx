    import React, { useState, useEffect } from 'react';
    import { 
      ChevronRight, 
      BookOpen, 
      Target
    } from 'lucide-react';

    // Static sidebar data
    const sidebarData = {
      'HTML': ['Prerequisites', 'HTML Introduction', 'HTML Elements', 'HTML Attributes', 'HTML Forms'],
      'CSS': ['CSS Basics', 'CSS Selectors', 'CSS Properties', 'CSS Flexbox', 'CSS Grid'],
      'JavaScript': ['JS Introduction', 'Variables', 'Functions', 'DOM Manipulation', 'Events'],
      'Tailwind': ['Installation', 'Utility Classes', 'Responsive Design', 'Components', 'Customization']
    };

    export default function Sidenavbar({ 
      activeSection = 'HTML', 
      activeItem = 'Prerequisites', 
      setActiveItem = () => {}, 
      isSidebarOpen = true 
    }) {
      const [mounted, setMounted] = useState(false);

      useEffect(() => {
        setMounted(true);
      }, []);

      if (!mounted) {
        return (
          <aside
            className={`fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-120px)] lg:top-[120px] 
                        w-80 max-w-[85vw] lg:w-72 xl:w-80 
                        bg-white 
                        shadow-2xl lg:shadow-none overflow-y-auto 
                        z-40 lg:z-10 transform transition-transform duration-300 ease-out 
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </aside>
        );
      }

      const activeSectionItems = sidebarData[activeSection] || [];

      return (
        <aside 
          className={`fixed lg:sticky top-0 left-0 h-screen 
                      w-80 max-w-[85vw] lg:w-72 xl:w-80 
                      bg-gray-200 border-r border-gray-200
                      shadow-2xl lg:shadow-none overflow-y-auto 
                      z-40 lg:z-10 transform transition-transform duration-300 ease-out 
                      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Mobile Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 lg:hidden">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Course Content</h2>
                  <p className="text-xs text-gray-600">Choose your learning path</p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Section Header */}
          <div className=" text-center ">
                <div className="">
        <h3 
          style={{ background: `linear-gradient(135deg, #1B365D 0%, #2994E1 100%)` }}
          className="font-semibold text-lg text-white p-2 text-center md:text-left"
        >
          {activeSection}
        </h3>
      </div>

            {/* Section Items */}
            <div className="">
              {activeSectionItems.map((item) => {
                const isActiveItem = activeItem === item;
                
                return (
                  <button
                    key={item}
                    onClick={() => setActiveItem(item)}
                    className={`w-full flex items-center justify-between p-3  text-left transition-colors
                              ${isActiveItem 
                                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' 
                                : 'text-gray-700 hover:bg-gray-50'
                              }`}
                  >
                    <span className="font-medium text-sm">{item}</span>
                    {isActiveItem && (
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 w-full p-4 lg:p-6 border-t border-gray-200 ">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-700">
                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                  <Target className="w-2 h-2 text-white" />
                </div>
                <span className="font-medium">Start Learning Today!</span>
              </div>
              <p className="text-xs text-gray-600">
                Access all lessons freely and learn at your own pace
              </p>
            </div>
          </div>
        </aside>
      );
    }