  import { useEffect, useState } from "react";
  import { useRouter } from 'next/router';

  const sidebar = {
    'HTML': ['Prerequisites', 'HTML Introduction', 'HTML Elements', 'HTML Attributes', 'HTML Forms'],
    'CSS': ['CSS Basics', 'CSS Selectors', 'CSS Properties', 'CSS Flexbox', 'CSS Grid'],
    'JavaScript': ['JS Introduction', 'Variables', 'Functions', 'DOM Manipulation', 'Events'],
    'Tailwind': ['Installation', 'Utility Classes', 'Responsive Design', 'Components', 'Customization']
  };


  export default function Sidenavbar({ activeSection, activeItem, setActiveItem, isSidebarOpen }) {
    const router = useRouter();
    const [expandedSections, setExpandedSections] = useState({});

    useEffect(() => {
      if (activeSection && sidebar[activeSection]) {
        setExpandedSections({ [activeSection]: true });
      } else {
        setExpandedSections({});
      }
    }, [activeSection]);

    const handleItemClick = (item) => {
      console.log('Sidenavbar: Clicking item:', item);
      
      if (activeSection) {
        // Create URL slug for the item
        const itemSlug = item.replace(/\s+/g, '-');
        const sectionSlug = activeSection;
        const newUrl = `/${sectionSlug}/${itemSlug}`;
        
        // Navigate to the new URL
        router.push(newUrl);
      }
      
      // Update state
      if (setActiveItem && typeof setActiveItem === 'function') {
        setActiveItem(item);
      }
    };

    const toggleSection = (section) => {
      setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    };

    // Debug logging
    console.log('Sidenavbar render:', { activeSection, activeItem, isSidebarOpen });

    if (!activeSection || !sidebar[activeSection]) {
      console.log('Sidenavbar: No active section or invalid section');
      return null;
    }

    const items = sidebar[activeSection];

    return (
      <div className="relative">
        <nav
          className={`bg-gray-100 border-r border-gray-200 overflow-y-auto transition-all duration-300 z-40
            ${isSidebarOpen ? 'w-60' : 'w-0 overflow-hidden'}
            fixed left-0 top-0 h-full md:relative md:top-0
          `}
          style={{ 
            paddingTop: isSidebarOpen ? '80px' : '0', // Account for navbar height
            height: '100vh'
          }}
        >
          <div className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300 h-full`}>
            <h2 className="text-xl font-bold text-gray-950 p-4 text-center border-b border-gray-200 bg-white sticky top-0">
              Learning Path
            </h2>

            <div className="space-y-1 p-2">
              <div className="border-b border-gray-100 pb-1">
                <button
                  type="button"
                  onClick={() => toggleSection(activeSection)}
                  className="w-full flex items-center justify-between p-3 text-center shadow-sm transition-colors duration-200 group bg-blue-600 text-white rounded-md"
                >
                  <span className="font-semibold text-white">
                    {activeSection}
                  </span>
                  <span className="text-white">
                    {expandedSections[activeSection] ? '−' : '+'}
                  </span>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${
                  expandedSections[activeSection] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="mt-2 space-y-1">
                    {items.map((item, index) => (
                      <div key={index} className="border-b border-gray-200 last:border-b-0">
                        <button
                          type="button"
                          onClick={() => handleItemClick(item)}
                          className={`w-full text-left py-3 px-4 text-sm transition-colors duration-200 relative rounded-md
                            ${activeItem === item
                              ? 'bg-blue-100 text-blue-800 font-semibold border-l-4 border-blue-600'
                              : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                          style={{
                            cursor: 'pointer',
                            userSelect: 'none'
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span>{item}</span>
                            
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
  }