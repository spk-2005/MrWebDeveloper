import React from 'react';

export default function Navbar2({ activeSection, setActiveSection }) {
  const navlist2 = ['HTML', 'CSS', 'JavaScript', 'Tailwind'];

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-lg sticky top-0 z--1">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-10">
          <div className="overflow-x-auto scrollbar-hide w-full max-w-7xl">
            <div className="flex items-center justify-center space-x-4 min-w-max px-4">
              {navlist2.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSection(item)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium
                    transition-colors duration-300 ease-in-out transform
                    relative group whitespace-nowrap cursor-pointer
                    ${
                      activeSection === item
                        ? 'bg-blue-700 text-white shadow-lg' // Active state: blue background, white text
                        : 'bg-transparent text-gray-300 hover:bg-blue-700 hover:text-white' // Inactive: transparent bg, hover to blue
                    }
                  `}
                >
                  {item}
                  {/* The bottom span is still there if you want a subtle underline, but it's not strictly needed for the fill effect */}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-400 transition-all duration-300 ${
                    activeSection === item ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-pulse"></div>

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