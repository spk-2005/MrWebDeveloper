import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronDown,
  BookOpen, 
  Target
} from 'lucide-react';

const sidebarData = {
  'HTML': [
    'Prerequisites',
    'HTML Introduction',
    {
      title: 'HTML Elements',
      subItems: ['Headings', 'Paragraph', 'HyperLink', 'Image','Unordered Lists','Ordered Lists','div','span','br','hr']
    },
    {
      title: 'HTML Attributes',
      subItems: ['Global Attributes', 'Event Attributes', 'Data Attributes']
    },
    {
      title: 'HTML Forms',
      subItems: [
        'Input Types',
        'Form Attributes',
        'Form Validation',
        'Form Styling',
        'Labels and Accessibility',
        'Textarea',
        'Select Dropdowns',
        'Checkboxes and Radio Buttons',
        'File Uploads',
        'Buttons and Submit Types',
        'Fieldsets and Legends',
        'Placeholder and Default Values',
        'Required and Optional Fields',
        'Disabled and Readonly Fields',
        'Form Action and Method',
        'Autocomplete and Autofocus',
        'Hidden Inputs',
        'Datalist and Suggestion Lists',
        'Date and Time Inputs',
        'Range and Number Inputs',
        'Pattern Matching with Regex'
      ]
    }
  ],
  'CSS': [
    'CSS Basics',
    {
      title: 'CSS Selectors',
      subItems: ['Element Selectors', 'Class Selectors', 'ID Selectors', 'Pseudo Selectors']
    },
    'CSS Properties',
    {
      title: 'CSS Flexbox',
      subItems: ['Flex Container', 'Flex Items', 'Flex Direction', 'Justify Content']
    },
    {
      title: 'CSS Grid',
      subItems: ['Grid Container', 'Grid Items', 'Grid Template', 'Grid Areas']
    }
  ],
  'JavaScript': [
    'JS Introduction',
    {
      title: 'Variables',
      subItems: ['var, let, const', 'Scope', 'Hoisting']
    },
    {
      title: 'Functions',
      subItems: ['Function Declaration', 'Arrow Functions', 'Closures', 'Callbacks']
    },
    {
      title: 'DOM Manipulation',
      subItems: ['Selecting Elements', 'Modifying Elements', 'Creating Elements']
    },
    'Events'
  ],
  'Tailwind': [
    'Installation',
    {
      title: 'Utility Classes',
      subItems: ['Layout', 'Typography', 'Colors', 'Spacing']
    },
    'Responsive Design',
    {
      title: 'Components',
      subItems: ['Buttons', 'Cards', 'Forms', 'Navigation']
    },
    'Customization'
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
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    // Check if device is mobile and get viewport height
    const updateDimensions = () => {
      setIsMobile(window.innerWidth < 1024);
      setViewportHeight(window.innerHeight);
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

  // Handle item click - set active item and close sidebar on mobile
  const handleItemClick = (item) => {
    setActiveItem(item);
    
    // Close sidebar on mobile devices
    if (isMobile && typeof onClose === 'function') {
      setTimeout(() => {
        onClose();
      }, 150);
    }
  };

  // Toggle expansion of parent items
  const toggleExpanded = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Handle parent item click
  const handleParentClick = (item, index) => {
    if (typeof item === 'object' && item.subItems) {
      // If it's a parent with sub-items, always expand it and set as active
      setExpandedItems(prev => ({ ...prev, [index]: true }));
      setActiveItem(item.title);
      
      // Close sidebar on mobile devices
      if (isMobile && typeof onClose === 'function') {
        setTimeout(() => {
          onClose();
        }, 150);
      }
    } else {
      // Regular item click
      handleItemClick(item);
    }
  };

  if (!mounted) {
    return (
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-120px)] lg:top-[120px] 
                    w-80 max-w-[85vw] lg:w-72 xl:w-80 
                    bg-white 
                    shadow-2xl lg:shadow-none overflow-hidden 
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

  // Calculate dynamic heights based on viewport
  const mobileHeaderHeight = isMobile ? 76 : 0; // Height of mobile header
  const sectionHeaderHeight = 56; // Height of section header
  const footerHeight = isMobile ? 100 : 120; // Height of footer
  const availableHeight = isMobile 
    ? viewportHeight - mobileHeaderHeight - sectionHeaderHeight - footerHeight
    : 'auto';

  return (
    <aside 
      className={`fixed lg:sticky top-0 left-0  lg:top-[120px]
                  w-80 max-w-[85vw] lg:w-72 xl:w-80 
                  bg-gray-200 border-r border-gray-200
                  shadow-2xl lg:shadow-none 
                  z-40 lg:z-10 transform transition-transform duration-300 ease-out 
                  ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                  flex flex-col`}
    >
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
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
      )}

      {/* Active Section Header */}
      <div className="flex-shrink-0">
        <h3 
          style={{ background: `linear-gradient(135deg, #1B365D 0%, #2994E1 100%)` }}
          className="font-semibold text-lg text-white p-2 text-center lg:text-left"
        >
          {activeSection}
        </h3>
      </div>

      {/* Scrollable Section Items */}
      <div className="overflow-y-auto flex-1">
        <div className="pb-2">  
          {activeSectionItems.map((item, index) => {
            // Check if item is an object with sub-items
            const isParentItem = typeof item === 'object' && item.subItems;
            const itemTitle = isParentItem ? item.title : item;
            const isActiveItem = activeItem === itemTitle;
            const isExpanded = expandedItems[index];
            
            return (
              <div key={index}>
                {/* Parent Item */}
                <button
                  onClick={() => handleParentClick(item, index)}
                  className={`w-full flex items-center justify-between py-3 px-4 text-left transition-colors
                            ${isActiveItem 
                              ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' 
                              : 'text-gray-700 hover:bg-gray-50'
                            }`}
                >
                  <span className="font-medium text-sm leading-relaxed">{itemTitle}</span>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {isActiveItem && !isParentItem && (
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    )}
                    {isParentItem && (
                      <ChevronRight 
                        className={`w-4 h-4 transition-transform duration-200 
                                  ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    )}
                  </div>
                </button>

                {/* Sub Items */}
                {isParentItem && isExpanded && (
                  <div className="bg-gray-50 border-l-4 border-gray-200 ml-4">
                    {item.subItems.map((subItem, subIndex) => {
                      const isActiveSubItem = activeItem === subItem;
                      
                      return (
                        <button
                          key={subIndex}
                          onClick={() => handleItemClick(subItem)}
                          className={`w-full flex items-center justify-between py-2.5 px-6 text-left transition-colors text-sm
                                    ${isActiveSubItem 
                                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500 ml-0' 
                                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                    }`}
                        >
                          <span className="leading-relaxed">{subItem}</span>
                          {isActiveSubItem && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
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
      <div className="mt-auto p-4 lg:p-6 border-t border-gray-200 bg-white">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-700">
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
              <Target className="w-2 h-2 text-white" />
            </div>
            <span className="font-medium">Start Learning Today!</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Access all lessons freely and learn at your own pace
          </p>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </aside>
  );
}