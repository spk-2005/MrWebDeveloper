

// components/ThemeToggle.js
import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse transition-colors duration-300"></div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="group relative p-3 rounded-xl transition-all duration-300
                bg-white/1000 dark:bg-gray-800/90 backdrop-blur-sm
                border border-gray-200/80 dark:border-gray-600/80
                hover:shadow-lg dark:hover:shadow-gray-900/20
                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                transform hover:scale-105 active:scale-95
                text-gray-700 dark:text-gray-200"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-6 h-6">
        {/* Sun Icon */}
        <Sun 
          className={`absolute inset-0 w-6 h-6 text-yellow-500 dark:text-yellow-400 transition-all duration-500 transform
                    ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
        />
        
        {/* Moon Icon */}
        <Moon 
          className={`absolute inset-0 w-6 h-6 text-blue-600 dark:text-blue-400 transition-all duration-500 transform
                    ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}
        />
      </div>

      {/* Tooltip */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1
                      bg-gray-900 dark:bg-gray-100 text-white dark:text-white-900
                      text-sm rounded-lg opacity-0 group-hover:opacity-100
                      transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        {isDark ? 'Light mode' : 'Dark mode'}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0
                        border-l-4 border-r-4 border-t-4 border-transparent
                        border-t-gray-900 dark:border-t-gray-100"></div>
      </div>
    </button>
  );
}
