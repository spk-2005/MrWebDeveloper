import React, { useState, useEffect } from 'react';
import { Menu, X, Home, BookOpen, Code, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navlists = ['Home', 'How To Learn', 'Practice Field'];
  const navLinks = ['/', '/Howtolearn', '/Practicefield'];
  const navIcons = [Home, BookOpen, Code];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`flex items-center justify-between px-6 lg:px-8 py-4 text-slate-800 sticky top-0 z-50 transition-all duration-300 backdrop-blur-md ${
          scrolled 
            ? 'bg-white/95 shadow-lg border-b border-slate-200/50' 
            : 'bg-white/80 shadow-md'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <div className="relative overflow-hidden rounded-xl">
            <Image
              src='/logo.png'
              width={80}
              height={80}
              alt="CodeLearn Logo"
              className="rounded-xl transition-all duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          </div>
          <div className="ml-3 hidden sm:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CodeLearn
            </h1>
            <p className="text-xs text-slate-500">Master Web Development</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-2">
          {navlists.map((item, index) => {
            const IconComponent = navIcons[index];
            return (
              <Link
                key={index}
                href={navLinks[index]}
                className="group relative px-6 py-3 font-semibold text-slate-700 transition-all duration-300 hover:text-blue-600 rounded-xl hover:bg-blue-50"
              >
                <div className="flex items-center space-x-2">
                  <IconComponent className="w-4 h-4" />
                  <span>{item}</span>
                </div>
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-3/4 transform -translate-x-1/2 rounded-full"></span>
              </Link>
            );
          })}
          
          {/* CTA Button */}
          <Link
            href="/HTML/Prerequisites"
            className="ml-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Learning
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative p-3 rounded-xl transition-all duration-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 group"
          >
            <div className="relative w-6 h-6">
              {isOpen ? (
                <X size={24} className="absolute transition-all duration-300 opacity-100 rotate-0 text-slate-700 group-hover:text-blue-600" />
              ) : (
                <Menu size={24} className="absolute transition-all duration-300 opacity-100 rotate-0 text-slate-700 group-hover:text-blue-600" />
              )}
            </div>
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
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-md shadow-2xl transform transition-all duration-300 ease-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">CodeLearn</h2>
              <p className="text-xs text-slate-500">Navigation Menu</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg transition-all duration-300 hover:bg-red-50 text-slate-600 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400/50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile Menu Items */}
        <div className="flex flex-col p-6 space-y-2">
          {navlists.map((item, index) => {
            const IconComponent = navIcons[index];
            return (
              <Link
                key={index}
                href={navLinks[index]}
                onClick={() => setIsOpen(false)}
                className="group flex items-center space-x-4 p-4 font-semibold text-slate-700 rounded-xl transition-all duration-300 hover:bg-blue-50 hover:text-blue-700 hover:translate-x-2 border-b border-slate-100 last:border-b-0"
              >
                <div className="w-10 h-10 bg-slate-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-all duration-300">
                  <IconComponent className="w-5 h-5 group-hover:text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{item}</div>
                  <div className="text-xs text-slate-500 group-hover:text-blue-500">
                    {index === 0 && 'Return to homepage'}
                    {index === 1 && 'Learning resources'}
                    {index === 2 && 'Practice coding'}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            );
          })}
          
          {/* Mobile CTA */}
          <div className="pt-6 mt-6 border-t border-slate-200">
            <Link
              href="/HTML/Prerequisites"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <BookOpen className="w-5 h-5" />
              <span>Start Learning Now</span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200/50 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Image
                src='/logo.png'
                width={40}
                height={40}
                alt="Logo"
                className="rounded-lg opacity-80"
              />
              <div className="text-sm">
                <div className="font-semibold text-slate-900">CodeLearn Platform</div>
                <div className="text-slate-500">Learn. Practice. Excel.</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
              <span>🚀 50+ Tutorials</span>
              <span>•</span>
              <span>💯 Free Forever</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 opacity-20"></div>
    </>
  );
}