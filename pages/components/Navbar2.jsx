import React from 'react';
import { Code, Palette, Zap, Wind } from 'lucide-react';
import { useRouter } from 'next/router';

// Define the sidebar data here so we can access the first item
const sidebarData = {
  'HTML': ['Prerequisites', 'HTML Introduction', 'HTML Elements', 'HTML Attributes', 'HTML Forms'],
  'CSS': ['CSS Basics', 'CSS Selectors', 'CSS Properties', 'CSS Flexbox', 'CSS Grid'],
  'JavaScript': ['JS Introduction', 'Variables', 'Functions', 'DOM Manipulation', 'Events'],
  'Tailwind': ['Installation', 'Utility Classes', 'Responsive Design', 'Components', 'Customization']
};

export default function Navbar2({ activeSection, setIsSidebarOpen }) {
  const router = useRouter();

  const navItems = [
    { name: 'HTML', icon: Code, color: 'from-orange-500 to-red-500' },
    { name: 'CSS', icon: Palette, color: 'from-blue-500 to-indigo-500' },
    { name: 'JavaScript', icon: Zap, color: 'from-yellow-500 to-orange-500' },
    { name: 'Tailwind', icon: Wind, color: 'from-green-500 to-teal-500' }
  ];

  const handleSectionClick = (section) => {
    console.log('Navbar2: Clicking section:', section);

    const firstItem = sidebarData[section] ? sidebarData[section][0] : null;

    if (firstItem) {
      // Use the section name directly as the slug (no toLowerCase())
      const sectionSlug = section;
      const itemSlug = firstItem.replace(/\s+/g, '-');

      const url = `/${sectionSlug}/${itemSlug}`;
      console.log('Navbar2: Redirecting to:', url);
      router.push(url);
    } else {
      // Fallback to section page if no items found
      // Use the section name directly as the slug
      const sectionSlug = section;
      console.log('Navbar2: Redirecting to section page:', `/${sectionSlug}`);
      router.push(`/${sectionSlug}`);
    }

    if (setIsSidebarOpen && typeof setIsSidebarOpen === 'function') {
      setIsSidebarOpen(true); // Always open sidebar on section click
    }
  };

  return (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-40 border-b border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="overflow-x-auto scrollbar-hide w-full max-w-7xl">
            <div className="flex items-center justify-center space-x-2 sm:space-x-4 min-w-max px-4">
              {navItems.map((item, index) => {
                const IconComponent = item.icon;
                const isActive = activeSection === item.name;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSectionClick(item.name)}
                    className={`
                      px-4 sm:px-6 py-3 rounded-lg text-sm font-semibold
                      transition-colors duration-200 ease-out
                      whitespace-nowrap min-w-[120px] sm:min-w-[140px]
                      focus:outline-none focus:ring-2 focus:ring-blue-400/50
                      ${isActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                    style={{
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    <div className="relative flex items-center justify-center space-x-2">
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">{item.name}</span>
                    </div>
                  </button>
                );
              })}
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