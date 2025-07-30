import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navlists = ['Home', 'How To Learn', 'Practice Field'];
  const navLinks = ['/', '/Howtolearn', 'Practicefield'];

  return (
    <>
      <nav
        style={{ backgroundColor: '#AED6F1' }}
        className="flex items-center justify-between p-4 text-black shadow-md sticky top-0 z-500 transition-all duration-300"
      >
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src='/logo.png'
            width={100}
            height={100}
            alt="Logo"
            className="rounded transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          {navlists.map((item, index) => (
            <a
              key={index}
              href={navLinks[index]}
              className="relative px-4 py-2 font-medium text-gray-800 transition-all duration-300 hover:text-blue-600 group"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg transition-all duration-300 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <div className="relative w-6 h-6">
              {/* Using conditional rendering for clarity, or keep current for smooth icon transition */}
              {isOpen ? (
                <X size={24} className="absolute transition-all duration-300 opacity-100 rotate-0" />
              ) : (
                <Menu size={24} className="absolute transition-all duration-300 opacity-100 rotate-0" />
              )}
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        style={{ backgroundColor: '#AED6F1' }}
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex justify-between items-center p-4 border-b border-blue-200">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg transition-all duration-300 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mobile Menu Items */}
        <div className="flex flex-col p-4"> {/* Removed 'zindex-1' here */}
          {navlists.map((item, index) => (
            <a
              key={index}
              href={navLinks[index]}
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 font-medium text-gray-800 rounded-lg transition-all duration-300 hover:bg-blue-200 hover:text-blue-700 hover:translate-x-2 border-b border-blue-100 last:border-b-0"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Mobile Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-200">
          <div className="flex items-center justify-center">
            {/* Note: As above, consider using Next.js <Image> component for optimization. */}
            <img
              src='/logo.png'
              width={60}
              height={60}
              alt="Logo"
              className="rounded opacity-70"
            />
          </div>
        </div>
      </div>
    </>
  );
}