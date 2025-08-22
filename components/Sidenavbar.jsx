import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronDown,
  BookOpen, 
  Target,
  X
} from 'lucide-react';

const sidebarData = {
  'HTML': [
    'Prerequisites',
    'HTML Introduction',
    {
      title: 'HTML Elements',
      subItems: ['Headings', 'Paragraph', 'HyperLink', 'Image','Unordered Lists','Ordered Lists','div container','span','br','hr']
    },
    {
      title: 'HTML Attributes',
      subItems: ['Global Attributes', 'Event Attributes', 'Data Attributes']
    },
    {
      title: 'HTML Forms',
      subItems: [ 
        'Input Types',
        'Form Attributes','Form Validation','Form Styling'
      ]
    }
  ],
  'CSS': [
    'CSS Basics',{title: 'CSS Selectors',subItems: ['Element Selectors']}
    
  ],
  'JavaScript': [
    'JS Introduction',{
      title: 'Variables',
      subItems: []
    }
    
  ],
  'Tailwind CSS': [
    'Installation',{
      title: 'Utility Classes',
      subItems: []
    },
    
  ]
};

export default function Sidenavbar({ 
  activeSection = 'HTML', 
  activeItem = 'Prerequisites', 
  setActiveItem = () => {}, 
  isSidebarOpen = true,
  onClose = () => {}
}) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    setMounted(true);
    
    const updateDimensions = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Auto-expand item if activeItem is a sub-item
  useEffect(() => {
    const activeSectionItems = sidebarData[activeSection] || [];
    activeSectionItems.forEach((item, index) => {
      if (typeof item === 'object' && item.subItems) {
        if (item.subItems.includes(activeItem)) {
          setExpandedItems(prev => ({ ...prev, [index]: true }));
        }
      }
    });
  }, [activeItem, activeSection]);

  const handleItemClick = (item) => {
    setActiveItem(item);
    
    if (isMobile && typeof onClose === 'function') {
      setTimeout(() => {
        onClose();
      }, 150);
    }
  };

  const toggleExpanded = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleParentClick = (item, index) => {
    if (typeof item === 'object' && item.subItems) {
      setExpandedItems(prev => ({ ...prev, [index]: true }));
      setActiveItem(item.title);
      
      if (isMobile && typeof onClose === 'function') {
        setTimeout(() => {
          onClose();
        }, 150);
      }
    } else {
      handleItemClick(item);
    }
  };

  if (!mounted) {
    return (
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-120px)] lg:top-[120px] 
                    w-80 max-w-[85vw] lg:w-72 xl:w-80 
                    bg-white border-r border-gray-200
                    shadow-2xl lg:shadow-none overflow-hidden 
                    z-40 lg:z-10 transform transition-transform duration-300 ease-out 
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  const activeSectionItems = sidebarData[activeSection] || [];

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside 
        className={`fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-112px)] lg:top-[112px]
                    w-80 max-w-[85vw] lg:w-72 xl:w-80 
                    bg-white border-r border-gray-200
                    shadow-2xl lg:shadow-none 
                    z-40 lg:z-10 transform transition-transform duration-300 ease-out 
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    flex flex-col`}
      >
        {/* Mobile Header */}
        {isMobile && (
          <div className="flex-shrink-0 bg-gradient-to-r from-slate-800 to-slate-900 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-md">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-white">Course Content</h2>
                  <p className="text-xs text-slate-300">Choose your learning path</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex-shrink-0">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-1 text-center lg:text-left">
            <h3 className="font-bold text-lg text-white tracking-wide">
              {activeSection}
            </h3>
            <div className="mt-1 h-0.5 bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <div className="p-2">  
            {activeSectionItems.map((item, index) => {
              const isParentItem = typeof item === 'object' && item.subItems;
              const itemTitle = isParentItem ? item.title : item;
              const isActiveItem = activeItem === itemTitle;
              const isExpanded = expandedItems[index];
              
              return (
                <div key={index} className="mb-1">
                  {/* Parent Item */}
                  <button
                    onClick={() => handleParentClick(item, index)}
                    className={`w-full flex items-center justify-between py-3 px-4 text-left transition-all duration-200 rounded-lg group
                              ${isActiveItem 
                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500 shadow-sm' 
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                  >
                    <span className="font-medium text-sm leading-relaxed">{itemTitle}</span>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {isActiveItem && !isParentItem && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm"></div>
                      )}
                      {isParentItem && (
                        <ChevronRight 
                          className={`w-4 h-4 transition-transform duration-200 text-gray-400
                                    ${isExpanded ? 'rotate-90' : ''} group-hover:text-gray-600`}
                        />
                      )}
                    </div>
                  </button>

                  {/* Sub Items */}
                  {isParentItem && isExpanded && (
                    <div className="mt-1 ml-4 border-l-2 border-gray-100 pl-4 space-y-1">
                      {item.subItems.map((subItem, subIndex) => {
                        const isActiveSubItem = activeItem === subItem;
                        
                        return (
                          <button
                            key={subIndex}
                            onClick={() => handleItemClick(subItem)}
                            className={`w-full flex items-center justify-between py-2 px-3 text-left transition-all duration-200 text-sm rounded-md
                                      ${isActiveSubItem 
                                        ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-500' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                      }`}
                          >
                            <span className="leading-relaxed">{subItem}</span>
                            {isActiveSubItem && (
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 shadow-sm"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-700">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                <Target className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="font-semibold">Start Learning Today!</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed px-2">
              Access all lessons freely and learn at your own pace
            </p>
          </div>
        </div>
      </aside>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
}