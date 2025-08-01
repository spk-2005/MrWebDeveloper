// components/RightSidenavbar.js (Revert to original responsive form)
import React from 'react';
import { Link } from 'lucide-react';

export default function RightSidenavbar({ activeSection, activeItem }) {
  return (
    <aside
      className="
        w-full lg:w-72            
        flex-shrink-0             
        bg-gray-50 border-gray-200 
        py-8 px-6                 
        lg:border-l lg:sticky lg:top-[120px] lg:h-[calc(100vh-120px)] lg:overflow-y-auto // Original class
        border-t lg:border-t-0    
      "
    >
      <div className="space-y-8">
        {/* Ad Space Section */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Sponsor Content</h3>
          <div className="bg-blue-100 text-blue-700 p-4 rounded-md text-center">
            <p className="text-sm font-semibold mb-2">Your Ad Here!</p>
            <p className="text-xs">Promote your coding tools, courses, or services.</p>
            <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm">
                <Link className="w-4 h-4 mr-2" />
                Explore More Tutorials
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm">
                <Link className="w-4 h-4 mr-2" />
                Join Our Community
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm">
                <Link className="w-4 h-4 mr-2" />
                Submit a Tutorial
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm">
                <Link className="w-4 h-4 mr-2" />
                Support CodeLearn
              </a>
            </li>
          </ul>
        </div>

        {/* Contextual Link Example (Optional) */}
        {activeSection && activeItem && (
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Related to {activeItem}</h3>
            <p className="text-sm text-gray-600 mb-3">
              Check out external resources or advanced topics on {activeSection} {activeItem}.
            </p>
            <a href="#" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm">
              <Link className="w-4 h-4 mr-2" />
              Advanced {activeSection} Topics
            </a>
          </div>
        )}
      </div>
    </aside>
  );
}