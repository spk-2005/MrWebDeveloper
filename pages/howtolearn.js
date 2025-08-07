import React, { useState } from 'react';

export default function HowToLearn() {
  const [selectedPath, setSelectedPath] = useState('fullstack');
  const [expandedTopic, setExpandedTopic] = useState(null);

  const learningPaths = {
    fullstack: {
      title: "Full Stack Development",
      description: "Master complete web development with MrDeveloper's proven methodology",
      duration: "8-12 months",
      difficulty: "Beginner to Expert",
      icon: "🚀",
      color: "from-blue-600 to-cyan-600",
      topics: [
        {
          id: 1,
          title: "Web Development Foundations",
          duration: "3 weeks",
          lessons: 15,
          description: "Start your journey with solid fundamentals",
          difficulty: "Beginner",
          subtopics: [
            "HTML5 Semantic Structure",
            "CSS3 & Modern Layouts",
            "Responsive Design Principles",
            "Web Accessibility Standards",
            "Browser Developer Tools"
          ]
        },
        {
          id: 2,
          title: "JavaScript Mastery",
          duration: "5 weeks",
          lessons: 28,
          description: "From basics to advanced JavaScript concepts",
          difficulty: "Beginner to Intermediate",
          subtopics: [
            "ES6+ Modern JavaScript",
            "Async Programming & Promises",
            "DOM Manipulation & Events",
            "API Integration & Fetch",
            "Error Handling & Debugging"
          ]
        },
        {
          id: 3,
          title: "Frontend Frameworks",
          duration: "6 weeks",
          lessons: 35,
          description: "Build dynamic UIs with React.js",
          difficulty: "Intermediate",
          subtopics: [
            "React Components & JSX",
            "State Management (useState, useReducer)",
            "React Hooks & Custom Hooks",
            "Context API & Props",
            "React Router & Navigation"
          ]
        },
        {
          id: 4,
          title: "Backend Development",
          duration: "6 weeks",
          lessons: 32,
          description: "Server-side programming with Node.js",
          difficulty: "Intermediate",
          subtopics: [
            "Node.js & Express.js Framework",
            "RESTful API Design",
            "Database Integration (MongoDB/MySQL)",
            "Authentication & JWT",
            "File Upload & Email Integration"
          ]
        },
        {
          id: 5,
          title: "Database Management",
          duration: "4 weeks",
          lessons: 22,
          description: "Master data storage and retrieval",
          difficulty: "Intermediate",
          subtopics: [
            "SQL Fundamentals & Advanced Queries",
            "MongoDB & NoSQL Concepts",
            "Database Design & Normalization",
            "Data Migration & Backup",
            "Performance Optimization"
          ]
        },
        {
          id: 6,
          title: "DevOps & Deployment",
          duration: "3 weeks",
          lessons: 18,
          description: "Deploy applications professionally",
          difficulty: "Advanced",
          subtopics: [
            "Git Version Control Mastery",
            "Cloud Deployment (AWS, Heroku)",
            "Docker Containerization",
            "CI/CD Pipeline Setup",
            "Performance Monitoring"
          ]
        },
        {
          id: 7,
          title: "Professional Projects",
          duration: "4 weeks",
          lessons: 25,
          description: "Build portfolio-worthy applications",
          difficulty: "Advanced",
          subtopics: [
            "E-commerce Platform Development",
            "Social Media Application",
            "Real-time Chat Application",
            "Portfolio Website Creation",
            "Code Review & Best Practices"
          ]
        }
      ]
    },
    mobile: {
      title: "Mobile App Development",
      description: "Create native-quality mobile apps with React Native",
      duration: "6-8 months",
      difficulty: "Intermediate to Expert",
      icon: "📱",
      color: "from-green-600 to-emerald-600",
      topics: [
        {
          id: 1,
          title: "Mobile Development Basics",
          duration: "2 weeks",
          lessons: 12,
          description: "Understanding mobile app development",
          difficulty: "Beginner",
          subtopics: [
            "Mobile UI/UX Design Principles",
            "React Native Environment Setup",
            "iOS vs Android Development",
            "Mobile App Architecture",
            "Development Tools & Debugging"
          ]
        },
        {
          id: 2,
          title: "React Native Fundamentals",
          duration: "5 weeks",
          lessons: 30,
          description: "Master React Native framework",
          difficulty: "Intermediate",
          subtopics: [
            "Components & Navigation",
            "State Management with Redux",
            "Styling & Animations",
            "Platform-specific Code",
            "Performance Optimization"
          ]
        },
        {
          id: 3,
          title: "Native Device Features",
          duration: "4 weeks",
          lessons: 24,
          description: "Integrate with device capabilities",
          difficulty: "Intermediate",
          subtopics: [
            "Camera & Gallery Integration",
            "GPS & Location Services",
            "Push Notifications",
            "Local Storage & AsyncStorage",
            "Biometric Authentication"
          ]
        },
        {
          id: 4,
          title: "App Store Deployment",
          duration: "3 weeks",
          lessons: 16,
          description: "Publish apps to app stores",
          difficulty: "Advanced",
          subtopics: [
            "App Store Guidelines & Policies",
            "Code Signing & Certificates",
            "App Store Connect Setup",
            "Google Play Console",
            "App Store Optimization (ASO)"
          ]
        }
      ]
    },
    ecommerce: {
      title: "E-commerce Development",
      description: "Build complete online stores and payment systems",
      duration: "5-7 months",
      difficulty: "Intermediate to Advanced",
      icon: "🛒",
      color: "from-purple-600 to-pink-600",
      topics: [
        {
          id: 1,
          title: "E-commerce Fundamentals",
          duration: "2 weeks",
          lessons: 14,
          description: "Understanding online business models",
          difficulty: "Beginner",
          subtopics: [
            "E-commerce Business Models",
            "User Journey & Conversion",
            "Product Catalog Design",
            "Shopping Cart Logic",
            "Checkout Process Optimization"
          ]
        },
        {
          id: 2,
          title: "Frontend Store Development",
          duration: "6 weeks",
          lessons: 32,
          description: "Build beautiful online storefronts",
          difficulty: "Intermediate",
          subtopics: [
            "Product Listing & Search",
            "Shopping Cart Implementation",
            "User Authentication & Profiles",
            "Responsive E-commerce UI",
            "Product Image Gallery"
          ]
        },
        {
          id: 3,
          title: "Payment Integration",
          duration: "3 weeks",
          lessons: 18,
          description: "Secure payment processing",
          difficulty: "Advanced",
          subtopics: [
            "Payment Gateway Integration",
            "Stripe & PayPal APIs",
            "Security & PCI Compliance",
            "Order Management System",
            "Refund & Cancellation Logic"
          ]
        },
        {
          id: 4,
          title: "Admin Panel & Analytics",
          duration: "4 weeks",
          lessons: 22,
          description: "Backend management systems",
          difficulty: "Advanced",
          subtopics: [
            "Admin Dashboard Creation",
            "Inventory Management",
            "Order Tracking System",
            "Sales Analytics & Reports",
            "Customer Support Tools"
          ]
        }
      ]
    }
  };

  const toggleTopic = (topicId) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty.includes('Beginner')) return 'bg-green-100 text-green-700';
    if (difficulty.includes('Intermediate')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center mr-4">
                <span className="text-3xl">👨‍💻</span>
              </div>
              <h1 className="text-5xl font-bold">MrDeveloper.in</h1>
            </div>
            <h2 className="text-3xl font-bold mb-6">How to Learn with Us</h2>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Follow our industry-tested learning methodology. From zero to professional developer 
              with structured tutorials, real-world projects, and expert mentorship.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-lg rounded-lg px-4 py-2">
                <span className="text-white font-semibold">📧 prasannasimha5002@gmail.com</span>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-lg px-4 py-2">
                <span className="text-white font-semibold">📱 +91 8309179509</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Learning Methodology */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-12 border border-white/20">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">MrDeveloper&apos;s Learning Method</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">📖</span>
              </div>
              <h3 className="font-bold text-white text-xl mb-3">Structured Curriculum</h3>
              <p className="text-gray-300">Carefully designed learning paths based on industry standards</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="font-bold text-white text-xl mb-3">Step-by-Step</h3>
              <p className="text-gray-300">Master one topic completely before moving to the next</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">💼</span>
              </div>
              <h3 className="font-bold text-white text-xl mb-3">Real Projects</h3>
              <p className="text-gray-300">Build portfolio-worthy applications with real-world features</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">🎓</span>
              </div>
              <h3 className="font-bold text-white text-xl mb-3">Expert Mentorship</h3>
              <p className="text-gray-300">Get guidance from experienced developers</p>
            </div>
          </div>
        </div>

        {/* Learning Paths */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">Choose Your Development Track</h2>
          
          {/* Path Selection */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.entries(learningPaths).map(([key, path]) => (
              <button
                key={key}
                onClick={() => setSelectedPath(key)}
                className={`group px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  selectedPath === key
                    ? `bg-gradient-to-r ${path.color} text-white shadow-2xl`
                    : 'bg-white/20 text-gray-300 hover:bg-white/30 backdrop-blur-lg border border-white/20'
                }`}
              >
                <span className="text-2xl mr-3">{path.icon}</span>
                {path.title}
              </button>
            ))}
          </div>

          {/* Selected Path Details */}
          <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-8 mb-8 border border-white/20">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h3 className="text-3xl font-bold text-white mb-4 flex items-center">
                  <span className="text-4xl mr-4">{learningPaths[selectedPath].icon}</span>
                  {learningPaths[selectedPath].title}
                </h3>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  {learningPaths[selectedPath].description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <span className="px-4 py-2 bg-blue-500/30 text-blue-200 rounded-full font-semibold">
                    ⏱️ {learningPaths[selectedPath].duration}
                  </span>
                  <span className="px-4 py-2 bg-purple-500/30 text-purple-200 rounded-full font-semibold">
                    📊 {learningPaths[selectedPath].difficulty}
                  </span>
                  <span className="px-4 py-2 bg-green-500/30 text-green-200 rounded-full font-semibold">
                    📚 {learningPaths[selectedPath].topics.length} Modules
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center bg-white/10 rounded-2xl p-6 backdrop-blur-lg border border-white/20">
                  <div className="text-5xl font-bold text-white mb-2">
                    {learningPaths[selectedPath].topics.reduce((acc, topic) => acc + topic.lessons, 0)}
                  </div>
                  <div className="text-gray-300 text-lg">Total Lessons</div>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Modules */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white mb-8">Learning Modules</h3>
            {learningPaths[selectedPath].topics.map((topic, index) => (
              <div key={topic.id} className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300">
                <div 
                  className="p-8 cursor-pointer"
                  onClick={() => toggleTopic(topic.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${learningPaths[selectedPath].color} text-white font-bold text-xl shadow-lg`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-bold text-white mb-2">{topic.title}</h4>
                        <p className="text-gray-300 text-lg mb-3">{topic.description}</p>
                        <div className="flex items-center space-x-6">
                          <span className="text-blue-300 font-semibold">
                            📅 {topic.duration}
                          </span>
                          <span className="text-green-300 font-semibold">
                            📖 {topic.lessons} lessons
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(topic.difficulty)}`}>
                            {topic.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <svg 
                        className={`w-8 h-8 text-white transform transition-transform duration-300 ${
                          expandedTopic === topic.id ? 'rotate-180' : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {expandedTopic === topic.id && (
                  <div className="px-8 pb-8 bg-white/5">
                    <div className="pl-22">
                      <h5 className="font-bold text-white mb-4 text-xl">What You&apos;ll Master:</h5>
                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        {topic.subtopics.map((subtopic, subIndex) => (
                          <div key={subIndex} className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full"></div>
                            <span className="text-gray-300">{subtopic}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                          Start Module
                        </button>
                        <button className="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/20 backdrop-blur-lg">
                          Preview Content
                        </button>
                        <button className="px-6 py-3 bg-green-600/20 text-green-300 font-semibold rounded-xl hover:bg-green-600/30 transition-all duration-300 border border-green-400/20">
                          Download Resources
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Success Tips */}
        <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">MrDeveloper&apos;s Success Formula</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-400/30">
              <div className="text-6xl mb-6">⚡</div>
              <h3 className="text-2xl font-bold text-white mb-4">Daily Coding</h3>
              <p className="text-gray-300 leading-relaxed">Code for at least 2-3 hours daily. Consistency beats intensity in programming.</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-400/30">
              <div className="text-6xl mb-6">🏗️</div>
              <h3 className="text-2xl font-bold text-white mb-4">Build Projects</h3>
              <p className="text-gray-300 leading-relaxed">Apply what you learn immediately by building real applications and solving problems.</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-400/30">
              <div className="text-6xl mb-6">🤝</div>
              <h3 className="text-2xl font-bold text-white mb-4">Join Community</h3>
              <p className="text-gray-300 leading-relaxed">Connect with fellow learners, share progress, and get help when stuck.</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 text-center border border-blue-400/30 backdrop-blur-lg">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-gray-300 text-lg mb-6">Get personalized guidance and start building your future today!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="mailto:prasannasimha5002@gmail.com"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              📧 Email MrDeveloper
            </a>
            <a 
              href="https://wa.me/918309179509"
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              💬 WhatsApp Chat
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}