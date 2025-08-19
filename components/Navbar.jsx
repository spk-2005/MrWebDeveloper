import React, { useState, useEffect } from 'react';
import { Menu, X, Home, BookOpen, Code, ChevronRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navlists = ['Home', 'How To Learn', 'Our Aim'];
  const navLinks = ['/', '/howtolearn', '/Ouraim'];

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside or on overlay
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Prevent hydration mismatch with enhanced loading state
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <div className="flex items-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
            </div>
            <div className="hidden lg:flex items-center space-x-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
            <div className="lg:hidden">
              <div className="w-8 h-8 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav
        className={`sticky top-0 z-50 backdrop-blur-lg transition-all duration-300 border-b
          ${scrolled 
            ? 'bg-white/98 shadow-lg border-gray-300/60' 
            : 'bg-white/95 shadow-sm border-gray-200/40'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Enhanced Logo */}
            <Link href="/" className="flex items-center group relative">
              <div className="relative overflow-hidden rounded-xl group-hover:scale-105 transition-all duration-300 ease-out">
                <Image
                  src='/logo.png'
                  width={56}
                  height={56}
                  alt="MrDeveloper - Learn Web Development"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl shadow-sm transition-all duration-300"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-indigo-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/5 group-hover:to-indigo-500/10 transition-all duration-300 rounded-xl"></div>
                <div className="absolute inset-0 ring-0 ring-blue-400/0 group-hover:ring-2 group-hover:ring-blue-400/20 rounded-xl transition-all duration-300"></div>
              </div>
              <div className="ml-3 hidden sm:block">
                <div className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  MrDeveloper
                </div>
                <div className="text-xs text-gray-600 -mt-1 group-hover:text-gray-700 transition-colors duration-300">
                  Learn. Code. Excel.
                </div>
              </div>
            </Link>

            {/* Enhanced Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1">
              {navlists.map((item, index) => (
                <Link
                  key={index}
                  href={navLinks[index]}
                  className="group relative px-4 xl:px-5 py-2.5 font-semibold text-sm xl:text-base transition-all duration-300 rounded-xl hover:scale-105 active:scale-95"
                >
                  <div className="relative z-10 flex items-center space-x-2 text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                    {index === 0 && <Home className="w-4 h-4" />}
                    {index === 1 && <BookOpen className="w-4 h-4" />}
                    {index === 2 && <Sparkles className="w-4 h-4" />}
                    <span>{item}</span>
                  </div>
                  
                  {/* Enhanced hover effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 rounded-xl transition-all duration-300 ease-out"></div>
                  <div className="absolute inset-0 ring-0 ring-blue-200/0 group-hover:ring-1 group-hover:ring-blue-200/50 rounded-xl transition-all duration-300"></div>
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-3/4 transform -translate-x-1/2 transition-all duration-300 ease-out rounded-full"></div>
                </Link>
              ))}
            </div>

            {/* Enhanced Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden group relative p-2.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:scale-95 hover:bg-gray-100/80"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              <div className="relative w-6 h-6">
                <Menu 
                  className={`absolute inset-0 w-6 h-6 text-gray-700 transition-all duration-300 ease-out ${
                    isOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
                  }`}
                />
                <X 
                  className={`absolute inset-0 w-6 h-6 text-gray-700 transition-all duration-300 ease-out ${
                    isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-300 ease-out lg:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Enhanced Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white/98 backdrop-blur-xl shadow-2xl transform transition-all duration-300 ease-out z-50 border-l border-gray-200/80 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        {/* Mobile Menu Header */}
        <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-b border-gray-200/60">
          <div className="flex justify-between items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div>
                <h2 id="mobile-menu-title" className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  MrDeveloper
                </h2>
                <p className="text-xs text-gray-600 font-medium">
                  Navigation Menu
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="group p-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:scale-95 hover:bg-white/80"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5 text-gray-700 group-hover:text-gray-900 group-hover:rotate-90 transition-all duration-300" />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>

        {/* Mobile Menu Items */}
        <div className="flex flex-col p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-180px)] custom-scrollbar">
          {navlists.map((item, index) => (
            <Link
              key={index}
              href={navLinks[index]}
              onClick={() => setIsOpen(false)}
              className="group flex items-center space-x-4 p-4 font-semibold rounded-xl transition-all duration-300 hover:translate-x-1 active:scale-98 hover:shadow-md border border-transparent hover:border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-gray-700 hover:text-blue-600"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-100 group-hover:to-indigo-100 group-hover:shadow-md">
                  {index === 0 && <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />}
                  {index === 1 && <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />}
                  {index === 2 && <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />}
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-base transition-colors duration-300">{item}</div>
                <div className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300 mt-0.5">
                  {index === 0 && "Return to homepage"}
                  {index === 1 && "Learning resources & guides"}
                  {index === 2 && "Our mission & vision"}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Enhanced Mobile Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-white/95 backdrop-blur-sm border-t border-gray-200/60">
          <div className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="relative">
                  <Image
                    src='/logo.png'
                    width={40}
                    height={40}
                    alt="MrDeveloper Logo"
                    className="w-10 h-10 rounded-lg shadow-md"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-sm">MrDeveloper Platform</div>
                  <div className="text-xs text-gray-600 font-medium">Learn. Practice. Excel.</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-200/60">
                <span className="font-medium">💡 Pro Tip:</span> Use keyboard shortcuts for faster navigation!
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </>
  );
}