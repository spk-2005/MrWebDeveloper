import { Content, Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Navbar2 from "./components/Navbar2";
import { useState, useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sidebarData = {
  'HTML': ['Prerequisites', 'HTML Introduction', 'HTML Elements', 'HTML Attributes', 'HTML Forms'],
  'CSS': ['CSS Basics', 'CSS Selectors', 'CSS Properties', 'CSS Flexbox', 'CSS Grid'],
  'JavaScript': ['JS Introduction', 'Variables', 'Functions', 'DOM Manipulation', 'Events'],
  'Tailwind': ['Installation', 'Utility Classes', 'Responsive Design', 'Components', 'Customization']
};

export default function Home() {
  // For home page, we don't need active section/item states
  // The Navbar2 will handle redirecting to specific pages
  
  return (
    <>
      <Head>
        <title>Learn Web Development - HTML, CSS, JavaScript, Tailwind CSS</title>
        <meta name="description" content="Complete web development tutorials covering HTML, CSS, JavaScript, and Tailwind CSS. Learn programming with practical examples and step-by-step guides." />
        <meta name="keywords" content="web development, HTML tutorial, CSS tutorial, JavaScript tutorial, Tailwind CSS, programming tutorials" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com/" />
        <meta property="og:title" content="Learn Web Development - HTML, CSS, JavaScript, Tailwind CSS" />
        <meta property="og:description" content="Complete web development tutorials covering HTML, CSS, JavaScript, and Tailwind CSS." />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://yourwebsite.com/" />
      </Head>

      <Navbar />
      <Navbar2
        activeSection={null} // No active section on home page
        setActiveSection={() => {}} // Empty function since home page doesn't manage state
        setIsSidebarOpen={() => {}} // Empty function since no sidebar on home page
      />

      {/* Home Page Content */}
      <main className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Learn <span className="text-blue-600">Web Development</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Master the fundamentals of web development with our comprehensive tutorials covering HTML, CSS, JavaScript, and Tailwind CSS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/html/prerequisites"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Start Learning HTML
              </a>
              <a 
                href="/css/css-basics"
                className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Explore CSS
              </a>
            </div>
          </div>

          {/* Learning Paths Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {Object.entries(sidebarData).map(([section, items]) => {
              const firstItem = items[0];
              const sectionSlug = section.toLowerCase();
              const itemSlug = firstItem.toLowerCase().replace(/\s+/g, '-');
              const href = `/${sectionSlug}/${itemSlug}`;
              
              const sectionIcons = {
                'HTML': '🏗️',
                'CSS': '🎨',
                'JavaScript': '⚡',
                'Tailwind': '💨'
              };

              const sectionColors = {
                'HTML': 'from-orange-500 to-red-500',
                'CSS': 'from-blue-500 to-indigo-500',
                'JavaScript': 'from-yellow-500 to-orange-500',
                'Tailwind': 'from-green-500 to-teal-500'
              };

              return (
                <a
                  key={section}
                  href={href}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 text-center group"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${sectionColors[section]} flex items-center justify-center text-2xl text-white group-hover:scale-110 transition-transform`}>
                    {sectionIcons[section]}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{section}</h3>
                  <p className="text-gray-600 mb-4">
                    {items.length} topics to master
                  </p>
                  <div className="text-sm text-gray-500">
                    Start with: <span className="font-medium text-blue-600">{firstItem}</span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose Our Tutorials?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Comprehensive Content</h3>
                <p className="text-gray-600">
                  Detailed explanations with practical examples and real-world applications.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Progressive Learning</h3>
                <p className="text-gray-600">
                  Structured learning path from basics to advanced concepts.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Hands-on Practice</h3>
                <p className="text-gray-600">
                  Interactive examples and exercises to reinforce your learning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}