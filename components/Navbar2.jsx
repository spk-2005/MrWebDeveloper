import React, { useState, useEffect } from 'react';
import { Code, Palette, Zap, Wind } from 'lucide-react';
import Link from 'next/link';

// Define the sidebar data here so we can access the first item
const sidebarData = {'Tech Tips':[
  'Portfolio'
],
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
    'Installation',
    {
      title: 'Utility Classes',
      subItems: []
    },
  ]
};

export default function Navbar2({ activeSection }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [   {
      name: 'Tech Tips',
      icon: Code,
    },
    {
      name: 'HTML',
      icon: Code,
    },
    {
      name: 'CSS',
      icon: Palette,
    },
    {
      name: 'JavaScript',
      icon: Zap,
    },
    {
      name: 'Tailwind CSS',
      icon: Wind,
    }
  ];

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <nav style={{backgroundColor:"#040e20ff"}}className=" sticky z-40">
      <div className="flex justify-center   px-4">
        <div className="flex items-center space-x-4 overflow-x-auto">
          {navItems.map((item, index) => {
            const isActive = activeSection === item.name;

            const firstItem = sidebarData[item.name] ? sidebarData[item.name][0] : null;
            const href = firstItem ? `/${item.name}/${firstItem.replace(/\s+/g, '-')}` : `/${item.name}`;

            return (
              <Link
                key={index}
                href={href}
                className={`
                  flex items-center p-3  font-medium hover:bg-red-100
                  ${isActive
                    ? 'text-blue-600 bg-red-100'
                    : 'text-white hover:text-blue-600'
                  }
                `}
              >
                
                {/* Full name for desktop */}
                <span className="hidden sm:inline">
                  {item.name}
                </span>

                {/* Abbreviated name for mobile */}
                <span className="sm:hidden">
                  {item.name === 'JavaScript' ? 'JS' : item.name.slice(0, 4)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}