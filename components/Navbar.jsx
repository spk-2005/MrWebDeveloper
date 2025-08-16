import React, { useState, useEffect } from 'react';
import { Menu, X, Home, BookOpen, Code, ChevronDown } from 'lucide-react';
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

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <nav className="flex items-center justify-between px-6 lg:px-8 z-50 shadow-md backdrop-blur-md bg-white/90 transition-colors duration-300">
        <div className="flex items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl animate-pulse bg-gray-200"></div>
        </div>
        <div className="hidden lg:flex space-x-4">
          <div className="w-24 h-10 rounded-xl animate-pulse bg-gray-200"></div>
          <div className="w-24 h-10 rounded-xl animate-pulse bg-gray-200"></div>
          <div className="w-24 h-10 rounded-xl animate-pulse bg-gray-200"></div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav style={{backgroundColor:"#ffffffff"}}
        className={`flex items-center justify-between px-1 sm:px-2 lg:px-8 sticky top-0 z-50 transition-all duration-500 backdrop-blur-md 
                    text-black-900
                   border-b border-gray-200/50
                   ${scrolled 
                     ? 'shadow-xl border-opacity-100' 
                     : 'shadow-lg border-opacity-30'
                   }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center group relative">
          <div className="relative overflow-hidden rounded-xl group-hover:scale-105 transition-transform duration-300">
            <Image
              src='/logo.png'
              width={128}
              height={99}
              alt="MrDeveloper Logo"
              className=" sm:w-20 sm:h-11 rounded-xl transition-all duration-300"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <div className="absolute inset-0 ring-2 ring-blue-500 ring-opacity-0 group-hover:ring-opacity-30 rounded-xl transition-all duration-300"></div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center xl:space-x-2">
          {navlists.map((item, index) => {
            return (
              <Link
                key={index}
                href={navLinks[index]}
                className="group relative px-4 xl:px-6 py-3 font-semibold transition-all duration-300 rounded-xl 
                          hover:shadow-md hover:bg-gray-100/80 
                          text-black hover:text-blue-600"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm xl:text-base">{item}</span>
                </div>
                <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-3/4 transform -translate-x-1/2 rounded-full"></span>
                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 -z-10"></div>
              </Link>
            );
          })}
        </div>

        {/* Mobile Toggle Button */}
        <div className="lg:hidden flex items-center space-x-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="group p-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95
                      hover:bg-gray-100"
            aria-label="Toggle mobile menu"
          >
            {isOpen ? (
              <X size={24} className="group-hover:rotate-90 transition-transform duration-200 text-black" />
            ) : (
              <Menu size={24} className="group-hover:scale-110 transition-transform duration-200 text-black" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 lg:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] 
                   bg-white/98 backdrop-blur-md shadow-2xl 
                   transform transition-all duration-300 ease-out z-50 
                   border-l border-gray-200
                   ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Mobile Menu Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-blue-500">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 transition-colors duration-300">MrDeveloper</h2>
              <p className="text-xs text-gray-600 transition-colors duration-300">
                Navigation Menu
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="group p-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95
                      hover:bg-gray-100"
            aria-label="Close mobile menu"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform duration-200 text-black" />
          </button>
        </div>

        {/* Mobile Menu Items */}
        <div className="flex flex-col p-6 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          {navlists.map((item, index) => {
            return (
              <Link
                key={index}
                href={navLinks[index]}
                onClick={() => setIsOpen(false)}
                className="group flex items-center space-x-4 p-4 font-semibold rounded-xl transition-all duration-300 
                          hover:translate-x-2 border border-transparent hover:shadow-md active:scale-95
                          hover:bg-gray-100/80 
                          text-gray-700 hover:text-blue-600"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm
                               bg-gray-100 group-hover:bg-blue-100">
                  {index === 0 && <Home className="w-5 h-5" />}
                  {index === 1 && <BookOpen className="w-5 h-5" />}
                  {index === 2 && <Code className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm transition-colors duration-300">{item}</div>
                </div>
                <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform duration-300 text-gray-400" />
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Image
                src='/logo.png'
                width={128}
                height={99}
                alt="Logo"
                className="rounded-lg opacity-80 shadow-sm"
              />
              <div className="text-sm">
                <div className="font-semibold text-gray-900 transition-colors duration-300">MrDeveloper Platform</div>
                <div className="text-xs text-gray-600 transition-colors duration-300">Learn. Practice. Excel.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}