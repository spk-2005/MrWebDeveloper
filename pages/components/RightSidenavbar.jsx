// components/RightSidenavbar.js
import React, { useState } from 'react';
import { Link, X, Menu, ChevronRight, ChevronLeft } from 'lucide-react';

export default function RightSidenavbar({ activeSection, activeItem }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button - Fixed position */}
      <button
        onClick={toggleSidebar}
        className="fixed top-36 right-4 z-50 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-3 rounded-l-xl shadow-2xl transition-all duration-300 flex items-center justify-center group lg:hidden"
        aria-label={isOpen ? 'Close right sidebar' : 'Open right sidebar'}
      >
        {isOpen ? (
          <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
        ) : (
          <ChevronLeft className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Right Sidebar */}
      <aside
        className={`
            
          fixed lg:static
          top-0 lg:top-auto
          right-0 lg:right-auto
          h-full lg:h-auto
          w-80 lg:w-72
          bg-gray-50 border-l border-gray-200
          z-50 lg:z-auto
          transform lg:transform-none
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
       
          lg:flex-shrink-0 lg:sticky
          overflow-y-auto
          py-8 px-6
        `}
        style={{
          // Only apply these styles on larger screens
          top: window.innerWidth >= 1024 ? '120px' : '0',
          height: window.innerWidth >= 1024 ? 'calc(100vh - 120px)' : '100vh'
        }}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h2 className="text-xl font-bold text-gray-800">Resources</h2>
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 lg:space-y-8">
          {/* Ad Space Section */}
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Sponsor Content</h3>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 p-4 rounded-md text-center">
              <p className="text-sm font-semibold mb-2">Your Ad Here!</p>
              <p className="text-xs mb-3">Promote your coding tools, courses, or services.</p>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-md text-sm hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Learn More
              </button>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm p-2 rounded-lg hover:bg-blue-50"
                  onClick={toggleSidebar} // Close sidebar on mobile when link is clicked
                >
                  <Link className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Explore More Tutorials</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm p-2 rounded-lg hover:bg-blue-50"
                  onClick={toggleSidebar}
                >
                  <Link className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Join Our Community</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm p-2 rounded-lg hover:bg-blue-50"
                  onClick={toggleSidebar}
                >
                  <Link className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Submit a Tutorial</span>
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm p-2 rounded-lg hover:bg-blue-50"
                  onClick={toggleSidebar}
                >
                  <Link className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Support CodeLearn</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contextual Content Section */}
          {activeSection && activeItem && (
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Related to {activeItem}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Check out external resources or advanced topics on {activeSection} {activeItem}.
              </p>
              <div className="space-y-2">
                <a 
                  href="#" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm p-2 rounded-lg hover:bg-blue-50 w-full"
                  onClick={toggleSidebar}
                >
                  <Link className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Advanced {activeSection} Topics</span>
                </a>
                <a 
                  href="#" 
                  className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors text-sm p-2 rounded-lg hover:bg-green-50 w-full"
                  onClick={toggleSidebar}
                >
                  <Link className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{activeSection} Best Practices</span>
                </a>
                <a 
                  href="#" 
                  className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors text-sm p-2 rounded-lg hover:bg-purple-50 w-full"
                  onClick={toggleSidebar}
                >
                  <Link className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{activeSection} Examples</span>
                </a>
              </div>
            </div>
          )}

          {/* Progress Tracker Section (Mobile friendly) */}
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Your Progress</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Current Section:</span>
                <span className="font-medium text-blue-600">{activeSection}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Current Topic:</span>
                <span className="font-medium text-blue-600">{activeItem}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{width: '65%'}}></div>
              </div>
              <div className="text-xs text-gray-500 text-center">65% Complete</div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-md p-4 border border-yellow-200">
            <h3 className="text-lg font-bold text-orange-800 mb-3">Need Help?</h3>
            <p className="text-sm text-orange-700 mb-3">
              Stuck on something? Get help from our community or contact support.
            </p>
            <button 
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-md text-sm hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={toggleSidebar}
            >
              Get Help
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}