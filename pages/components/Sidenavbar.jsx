// components/Sidenavbar.jsx
import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft } from 'lucide-react'; // Import necessary icons

// Move sidebar object outside the component, as it's static
const sidebar = {
  'HTML': ['Prerequisites', 'HTML Introduction', 'HTML Elements', 'HTML Attributes', 'HTML Forms'],
  'CSS': ['CSS Basics', 'CSS Selectors', 'CSS Properties', 'CSS Flexbox', 'CSS Grid'],
  'JavaScript': ['JS Introduction', 'Variables', 'Functions', 'DOM Manipulation', 'Events'],
  'Tailwind': ['Installation', 'Utility Classes', 'Responsive Design', 'Components', 'Customization']
};

// Accept activeItem and setActiveItem as props
export default function Sidenavbar({ activeSection, activeItem, setActiveItem }) {
  const [expandedSections, setExpandedSections] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Auto-expand the active section and collapse others
  useEffect(() => {
    if (activeSection && sidebar[activeSection]) {
      const newExpandedSections = {};
      newExpandedSections[activeSection] = true;
      setExpandedSections(newExpandedSections);
    } else {
      setExpandedSections({});
    }
  }, [activeSection]);

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-1/2 -translate-y-1/2 z-50 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-md shadow-lg transition-all duration-300 flex items-center justify-center
          ${isSidebarOpen ? 'left-60' : 'left-0'}`}
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isSidebarOpen ? (
          <ChevronLeft className="w-4 h-4 transition-transform duration-300" />
        ) : (
          <ChevronRight className="w-4 h-4 transition-transform duration-300" />
        )}
      </button>

      {/* Sidebar */}
      <nav className={`bg-gray-100 h-screen border-r border-gray-200 overflow-y-auto transition-all duration-300 ${
        isSidebarOpen ? 'w-60' : 'w-0 overflow-hidden' // Add overflow-hidden when w-0 to prevent content peeking
      }`}>
        <div className={`p-0 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
          <h2 className="text-xl font-bold text-gray-950 m-1 text-center">Learning Path</h2>

          <div className="space-y-1">
            {Object.entries(sidebar).map(([section, items]) => (
              activeSection === section && (
                <div key={section} className="border-b border-gray-100 pb-1"> {/* Consistent border-gray-100 */}
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section)}
                    className={`w-full flex items-center justify-between p-1 text-center shadow-sm transition-colors duration-200 group ${
                      activeSection === section
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <span className={`font-semibold ${
                      activeSection === section
                        ? 'text-white'
                        : 'text-gray-700 group-hover:text-blue-600'
                    }`}>
                      {section}
                    </span>
                  </button>

                  {/* Section Items */}
                  <div className={`overflow-hidden transition-all duration-300 ${
                    expandedSections[section] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <ol className="mt-0 space-y-0 pl-0">
                      {items.map((item, index) => (
                        <li key={index} className="border-b border-gray-200 last:border-b-0"> {/* Consistent border-gray-200 */}
                          <a
                            href="#" // Keep href for semantic correctness, but prevent default behavior
                            onClick={(e) => {
                              e.preventDefault(); // Prevent page reload
                              setActiveItem(item); // Update the active item state in Home.jsx
                            }}
                            className={`block py-2 px-4 text-sm transition-colors duration-200 cursor-pointer
                              ${activeItem === item
                                ? 'bg-blue-100 text-blue-800 font-semibold' // Active item styling
                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600' // Inactive item styling with hover
                              }`}
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}