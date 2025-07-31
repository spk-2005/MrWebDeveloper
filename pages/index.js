import { Content, Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Navbar2 from "./components/Navbar2";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Code, Palette, Zap, Wind, Star, Users, Trophy, Play } from "lucide-react";

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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  
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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <Navbar2
          activeSection={null}
          setActiveSection={() => {}}
          setIsSidebarOpen={() => {}}
        />

        {/* Hero Section */}
        <main className="relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            {/* Hero Content */}
            <div className={`text-center max-w-4xl mx-auto mb-20 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <Star className="w-4 h-4 mr-2" />
                Start Your Web Development Journey
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
                Master{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Web Development
                </span>
                <br />
                <span className="text-3xl sm:text-4xl lg:text-5xl text-slate-700">
                  From Zero to Hero
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                Master the fundamentals of web development with our comprehensive, hands-on tutorials. 
                Learn HTML, CSS, JavaScript, and Tailwind CSS through practical projects and real-world examples.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link href="/HTML/Prerequisites" className="group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl"></div>
                  <div className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold 
                                hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 
                                flex items-center space-x-2 min-w-[200px] justify-center">
                    <Play className="w-5 h-5" />
                    <span>Start Learning HTML</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
                
                <Link href="/CSS/CSS-Basics" className="group">
                  <div className="px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-700 border-2 border-slate-200 rounded-xl font-semibold 
                                hover:bg-white hover:border-blue-300 hover:text-blue-700 hover:shadow-xl transition-all duration-300 
                                transform hover:-translate-y-1 flex items-center space-x-2 min-w-[200px] justify-center">
                    <Palette className="w-5 h-5" />
                    <span>Explore CSS</span>
                  </div>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-2xl font-bold text-slate-900">10K+</span>
                  </div>
                  <p className="text-slate-600 text-sm">Active Learners</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <BookOpen className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-2xl font-bold text-slate-900">50+</span>
                  </div>
                  <p className="text-slate-600 text-sm">Tutorials</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Trophy className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="text-2xl font-bold text-slate-900">98%</span>
                  </div>
                  <p className="text-slate-600 text-sm">Success Rate</p>
                </div>
              </div>
            </div>

            {/* Learning Paths Grid */}
            <div className={`mb-20 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                  Choose Your Learning Path
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Start with any technology and progress at your own pace with our structured curriculum
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {Object.entries(sidebarData).map(([section, items], index) => {
                  const firstItem = items[0];
                  const sectionSlug = section;
                  const itemSlug = firstItem.toLowerCase().replace(/\s+/g, '-');
                  const href = `/${sectionSlug}/${itemSlug}`;

                  const sectionConfig = {
                    'HTML': {
                      icon: Code,
                      gradient: 'from-orange-500 to-red-500',
                      bgGradient: 'from-orange-50 to-red-50',
                      borderColor: 'border-orange-200',
                      textColor: 'text-orange-700'
                    },
                    'CSS': {
                      icon: Palette,
                      gradient: 'from-blue-500 to-indigo-500',
                      bgGradient: 'from-blue-50 to-indigo-50',
                      borderColor: 'border-blue-200',
                      textColor: 'text-blue-700'
                    },
                    'JavaScript': {
                      icon: Zap,
                      gradient: 'from-yellow-500 to-orange-500',
                      bgGradient: 'from-yellow-50 to-orange-50',
                      borderColor: 'border-yellow-200',
                      textColor: 'text-yellow-700'
                    },
                    'Tailwind': {
                      icon: Wind,
                      gradient: 'from-green-500 to-teal-500',
                      bgGradient: 'from-green-50 to-teal-50',
                      borderColor: 'border-green-200',
                      textColor: 'text-green-700'
                    }
                  };

                  const config = sectionConfig[section];
                  const IconComponent = config.icon;

                  return (
                    <Link
                      key={section}
                      href={href}
                      className={`group block transition-all duration-500 delay-${index * 100}`}
                    >
                      <div className={`relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl 
                                    transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 
                                    p-8 text-center border ${config.borderColor} h-full`}>
                        
                        {/* Background gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-0 
                                       group-hover:opacity-100 rounded-2xl transition-opacity duration-500`}></div>
                        
                        {/* Icon */}
                        <div className="relative z-10">
                          <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${config.gradient} 
                                        flex items-center justify-center text-white shadow-lg
                                        group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                            <IconComponent className="w-10 h-10" />
                          </div>
                          
                          <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-slate-800">
                            {section}
                          </h3>
                          
                          <p className="text-slate-600 mb-4 group-hover:text-slate-700">
                            {items.length} comprehensive topics
                          </p>
                          
                          <div className="text-sm text-slate-500 mb-6 group-hover:text-slate-600">
                            Start with: <span className={`font-semibold ${config.textColor}`}>{firstItem}</span>
                          </div>
                          
                          <div className={`inline-flex items-center text-sm font-medium ${config.textColor} 
                                        group-hover:translate-x-2 transition-transform duration-300`}>
                            Begin Journey
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Features Section */}
            <div className={`transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-16 border border-white/20">
                <div className="text-center mb-12">
                  <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                    Why Choose Our Platform?
                  </h2>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Experience the most effective way to learn web development with our proven methodology
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl 
                                  flex items-center justify-center mx-auto mb-6 shadow-lg
                                  group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Comprehensive Content</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Detailed explanations with practical examples, interactive demos, and real-world applications 
                      that prepare you for professional development.
                    </p>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl 
                                  flex items-center justify-center mx-auto mb-6 shadow-lg
                                  group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Progressive Learning</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Carefully structured learning path that takes you from absolute beginner to advanced concepts 
                      with confidence and mastery.
                    </p>
                  </div>
                  
                  <div className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl 
                                  flex items-center justify-center mx-auto mb-6 shadow-lg
                                  group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <Code className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Hands-on Practice</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Interactive coding exercises, live examples, and practical projects that reinforce 
                      your learning and build your portfolio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
} 