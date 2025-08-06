import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Navbar2 from "./components/Navbar2";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  BookOpen, 
  Code, 
  Palette, 
  Zap, 
  Wind, 
  Star, 
  Users, 
  Trophy, 
  Play, 
  Sparkles, 
  TrendingUp, 
  Award,
  Target,
  Clock,
  CheckCircle,
  Globe,
  Rocket,
  Heart,
  Coffee,
  ChevronRight,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react";

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

function HomeContent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Frontend Developer",
      company: "TechCorp",
      content: "CodeLearn transformed my career! The structured approach and hands-on examples made complex concepts easy to understand.",
      avatar: "👩‍💻",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Full Stack Developer", 
      company: "StartupXYZ",
      content: "Best learning platform I've used. The progression from basics to advanced topics is perfectly paced.",
      avatar: "👨‍💻",
      rating: 5
    },
    {
      name: "Emma Wilson",
      role: "UI/UX Designer",
      company: "DesignStudio",
      content: "Even as a designer, understanding code basics helped me collaborate better with developers.",
      avatar: "👩‍🎨",
      rating: 5
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Auto-rotate testimonials
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearInterval(testimonialInterval);
    };
  }, [testimonials.length]);
  
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 
                    transition-all duration-500 ${geistSans.variable} ${geistMono.variable}`}>
      <Navbar />
      <Navbar2
        activeSection={null}
        setActiveSection={() => {}}
        setIsSidebarOpen={() => {}}
      />

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Enhanced Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          {/* Floating Code Elements */}
          <div className="absolute top-20 left-10 opacity-20">
            <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-gray-200">
              <code className="text-xs text-blue-600">&lt;html&gt;</code>
            </div>
          </div>
          <div className="absolute top-40 right-20 opacity-20 animate-bounce delay-500">
            <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-gray-200">
              <code className="text-xs text-green-600">.class</code>
            </div>
          </div>
          <div className="absolute bottom-40 left-20 opacity-20 animate-bounce delay-1000">
            <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-gray-200">
              <code className="text-xs text-purple-600">console.log()</code>
            </div>
          </div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12">
          {/* Hero Content */}
          <div className={`text-center max-w-6xl mx-auto mb-12 sm:mb-20 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-blue-100 to-purple-100 
                           text-blue-800 rounded-full text-sm font-medium mb-6 backdrop-blur-sm 
                           border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
              <Star className="w-4 h-4 mr-2 animate-spin" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                🚀 Start Your Web Development Journey Today
              </span>
              <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-slate-900 mb-6 leading-tight">
              Master{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                Web Development
              </span>
              <br />
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-slate-700 flex items-center justify-center mt-4">
                From Zero to Hero
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 ml-4 text-yellow-500 animate-bounce" />
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-8 leading-relaxed px-4">
              Master the fundamentals of web development with our comprehensive, hands-on tutorials. 
              Learn <span className="font-semibold text-orange-600">HTML</span>, <span className="font-semibold text-blue-600">CSS</span>, <span className="font-semibold text-yellow-600">JavaScript</span>, and <span className="font-semibold text-green-600">Tailwind CSS</span> through practical projects and real-world examples.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 px-4">
              <Link href="/HTML/Prerequisites" className="group relative overflow-hidden w-full sm:w-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl"></div>
                <div className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold 
                              hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 
                              flex items-center justify-center space-x-2 min-w-[220px] text-lg">
                  <Play className="w-5 h-5" />
                  <span>Start Learning HTML</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              </Link>
              
              <Link href="/CSS/CSS-Basics" className="group w-full sm:w-auto">
                <div className="px-8 py-4 bg-white/90 backdrop-blur-sm text-slate-700 
                              border-2 border-slate-200 rounded-xl font-semibold 
                              hover:bg-white hover:border-blue-300 
                              hover:text-blue-700 hover:shadow-xl transition-all duration-300 
                              transform hover:-translate-y-1 flex items-center justify-center space-x-2 min-w-[220px] text-lg">
                  <Palette className="w-5 h-5" />
                  <span>Explore CSS</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            {/* Enhanced Stats with Animations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto px-4">
              {[
                { icon: Users, value: "15K+", label: "Active Learners", color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200" },
                { icon: BookOpen, value: "50+", label: "Comprehensive Tutorials", color: "text-green-600", bg: "bg-green-100", border: "border-green-200" },
                { icon: Award, value: "98%", label: "Success Rate", color: "text-yellow-600", bg: "bg-yellow-100", border: "border-yellow-200" },
                { icon: Globe, value: "100+", label: "Countries", color: "text-purple-600", bg: "bg-purple-100", border: "border-purple-200" }
              ].map((stat, index) => (
                <div key={index} className={`text-center bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${stat.border} 
                                           hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.bg} rounded-full mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <p className="text-slate-600 text-sm leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Device Mockup Preview */}
          <div className={`mb-20 px-4 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Learn on Any Device
                </h2>
                <p className="text-lg text-slate-600">
                  Responsive design ensures perfect learning experience across all devices
                </p>
              </div>
              
              <div className="relative">
                {/* Desktop */}
                <div className="flex justify-center items-end space-x-8">
                  <div className="hidden lg:block">
                    <div className="bg-gray-800 rounded-t-2xl p-4 w-80 shadow-2xl">
                      <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 flex items-center justify-center">
                          <Monitor className="w-12 h-12 text-white" />
                        </div>
                        <div className="p-4 space-y-2">
                          <div className="h-2 bg-gray-200 rounded"></div>
                          <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800 w-80 h-6 rounded-b-3xl"></div>
                    <div className="bg-gray-700 w-20 h-8 mx-auto rounded-b-lg"></div>
                  </div>
                  
                  {/* Tablet */}
                  <div className="hidden md:block">
                    <div className="bg-gray-800 rounded-2xl p-3 w-56 shadow-2xl">
                      <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                        <div className="bg-gradient-to-r from-green-500 to-blue-500 h-40 flex items-center justify-center">
                          <Tablet className="w-10 h-10 text-white" />
                        </div>
                        <div className="p-3 space-y-2">
                          <div className="h-2 bg-gray-200 rounded"></div>
                          <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile */}
                  <div className="mb-8">
                    <div className="bg-gray-800 rounded-3xl p-2 w-32 shadow-2xl">
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-48 flex items-center justify-center">
                          <Smartphone className="w-8 h-8 text-white" />
                        </div>
                        <div className="p-2 space-y-1">
                          <div className="h-1 bg-gray-200 rounded"></div>
                          <div className="h-1 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Learning Paths Grid */}
          <div className={`mb-20 px-4 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                Choose Your Learning Path
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
                Start with any technology and progress at your own pace with our structured curriculum designed by industry experts
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
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
                    textColor: 'text-orange-700',
                    hoverShadow: 'hover:shadow-orange-500/25',
                    description: 'Structure & Markup Language',
                    difficulty: 'Beginner Friendly'
                  },
                  'CSS': {
                    icon: Palette,
                    gradient: 'from-blue-500 to-indigo-500',
                    bgGradient: 'from-blue-50 to-indigo-50',
                    borderColor: 'border-blue-200',
                    textColor: 'text-blue-700',
                    hoverShadow: 'hover:shadow-blue-500/25',
                    description: 'Styling & Visual Design',
                    difficulty: 'Beginner to Intermediate'
                  },
                  'JavaScript': {
                    icon: Zap,
                    gradient: 'from-yellow-500 to-orange-500',
                    bgGradient: 'from-yellow-50 to-orange-50',
                    borderColor: 'border-yellow-200',
                    textColor: 'text-yellow-700',
                    hoverShadow: 'hover:shadow-yellow-500/25',
                    description: 'Programming & Interactivity',
                    difficulty: 'Intermediate'
                  },
                  'Tailwind': {
                    icon: Wind,
                    gradient: 'from-green-500 to-teal-500',
                    bgGradient: 'from-green-50 to-teal-50',
                    borderColor: 'border-green-200',
                    textColor: 'text-green-700',
                    hoverShadow: 'hover:shadow-green-500/25',
                    description: 'Utility-First CSS Framework',
                    difficulty: 'Intermediate'
                  }
                };

                const config = sectionConfig[section];
                const IconComponent = config.icon;

                return (
                  <Link
                    key={section}
                    href={href}
                    className={`group block transition-all duration-500 delay-${index * 100} hover:scale-105`}
                  >
                    <div className={`relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl ${config.hoverShadow}
                                  transition-all duration-500 transform hover:-translate-y-3
                                  p-8 text-center border ${config.borderColor} h-full overflow-hidden`}>
                      
                      {/* Background gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-0 
                                     group-hover:opacity-100 rounded-3xl transition-opacity duration-500`}></div>
                      
                      {/* Content */}
                      <div className="relative z-10">
                        {/* Icon */}
                        <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${config.gradient} 
                                      flex items-center justify-center text-white shadow-lg
                                      group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                          <IconComponent className="w-10 h-10" />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-slate-800 transition-colors duration-300">
                          {section}
                        </h3>
                        
                        <p className="text-slate-600 mb-4 group-hover:text-slate-700 leading-relaxed transition-colors duration-300">
                          {config.description}
                        </p>
                        
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Lessons:</span>
                            <span className={`font-semibold ${config.textColor}`}>{items.length}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Level:</span>
                            <span className="text-slate-600 font-medium">{config.difficulty}</span>
                          </div>
                          <div className="text-xs text-slate-500">
                            Start with: <span className={`font-semibold ${config.textColor}`}>{firstItem}</span>
                          </div>
                        </div>
                        
                        <div className={`inline-flex items-center text-sm font-medium ${config.textColor} 
                                      group-hover:translate-x-2 transition-transform duration-300`}>
                          Begin Journey
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </div>

                        {/* Progress indicator */}
                        <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`bg-gradient-to-r ${config.gradient} h-2 rounded-full transition-all duration-1000 group-hover:w-full w-0`}></div>
                          </div>
                        </div>
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                        <IconComponent className="w-16 h-16 text-slate-400" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Testimonials Section */}
          <div className={`mb-20 px-4 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                What Our Students Say
              </h2>
              <p className="text-lg text-slate-600">
                Join thousands of successful developers who started their journey with CodeLearn
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-12 
                             border border-white/20 relative overflow-hidden transition-all duration-300">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 
                               rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
                
                <div className="relative">
                  <div className="text-6xl text-blue-600 mb-6">&quot;</div>
                  <div className="transition-all duration-500">
                    <blockquote className="text-xl lg:text-2xl text-slate-700 mb-8 leading-relaxed font-medium">
                      {testimonials[currentTestimonial].content}
                    </blockquote>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl">{testimonials[currentTestimonial].avatar}</div>
                        <div>
                          <div className="font-bold text-slate-900 text-lg">
                            {testimonials[currentTestimonial].name}
                          </div>
                          <div className="text-slate-600">
                            {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation dots */}
                <div className="flex justify-center space-x-2 mt-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentTestimonial 
                          ? 'bg-blue-600 w-8' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Features Section */}
          <div className={`px-4 transition-all duration-1000 delay-900 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-16 
                           border border-white/20 relative overflow-hidden max-w-6xl mx-auto transition-all duration-300">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500"></div>
              </div>

              <div className="relative z-10">
                <div className="text-center mb-16">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 flex items-center justify-center">
                    Why Choose CodeLearn?
                    <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 ml-4 text-green-500" />
                  </h2>
                  <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                    Experience the most effective way to learn web development with our proven methodology and comprehensive curriculum
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                  {[
                    {
                      icon: BookOpen,
                      title: "Comprehensive Content",
                      description: "Detailed explanations with practical examples, interactive demos, and real-world applications that prepare you for professional development careers.",
                      gradient: "from-blue-500 to-indigo-500",
                      bg: "bg-blue-50",
                      features: ["50+ Tutorials", "Interactive Examples", "Real Projects"]
                    },
                    {
                      icon: Target,
                      title: "Progressive Learning",
                      description: "Carefully structured learning path that takes you from absolute beginner to advanced concepts with confidence and complete mastery.",
                      gradient: "from-green-500 to-teal-500",
                      bg: "bg-green-50",
                      features: ["Structured Path", "Skill Building", "Progress Tracking"]
                    },
                    {
                      icon: Code,
                      title: "Hands-on Practice",
                      description: "Interactive coding exercises, live examples, and practical projects that reinforce your learning and build an impressive portfolio.",
                      gradient: "from-purple-500 to-pink-500",
                      bg: "bg-purple-50",
                      features: ["Live Coding", "Project Building", "Portfolio Ready"]
                    },
                    {
                      icon: Clock,
                      title: "Learn at Your Pace",
                      description: "Flexible learning schedule that adapts to your lifestyle. Study when you want, where you want, at the speed that works for you.",
                      gradient: "from-orange-500 to-red-500",
                      bg: "bg-orange-50",
                      features: ["24/7 Access", "Mobile Friendly", "Self-Paced"]
                    },
                    {
                      icon: Users,
                      title: "Community Support",
                      description: "Join a thriving community of learners and experienced developers. Get help, share knowledge, and grow together.",
                      gradient: "from-cyan-500 to-blue-500",
                      bg: "bg-cyan-50",
                      features: ["Active Community", "Peer Support", "Expert Guidance"]
                    },
                    {
                      icon: Rocket,
                      title: "Career Ready",
                      description: "Build real-world skills that employers want. Our curriculum is designed with input from industry professionals and hiring managers.",
                      gradient: "from-violet-500 to-purple-500",
                      bg: "bg-violet-50",
                      features: ["Industry Relevant", "Job Ready Skills", "Career Support"]
                    }
                  ].map((feature, index) => (
                    <div key={index} className={`text-center group hover:${feature.bg} rounded-2xl p-6 transition-all duration-300 
                                                hover:shadow-lg border border-gray-100 hover:border-gray-200
                                                bg-white/50`}>
                      <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl 
                                    flex items-center justify-center mx-auto mb-6 shadow-lg
                                    group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                      <p className="text-slate-600 leading-relaxed mb-6">
                        {feature.description}
                      </p>
                      <div className="space-y-2">
                        {feature.features.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-center space-x-2 text-sm text-slate-500">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Call to Action */}
                <div className="text-center mt-16 pt-12 border-t border-gray-200">
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
                    Ready to Start Your Journey?
                  </h3>
                  <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                    Join thousands of successful developers who chose CodeLearn to master web development. 
                    Your future in tech starts here!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                      href="/HTML/Prerequisites"
                      className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 flex items-center space-x-2 text-lg"
                    >
                      <Rocket className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Start Learning Now</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>Free Forever</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Coffee className="w-4 h-4 text-yellow-600" />
                        <span>No Setup Required</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function Home() {
  return (
     <> <Head>
        <title>MrDeveloper - Master Web Development | HTML, CSS, JavaScript, Python , C and more technologies</title>
        <meta name="description" content="Learn web development from scratch with MrDeveloper. Complete tutorials covering HTML, CSS, JavaScript, Python , C and more technologies. Interactive examples, structured learning path, and hands-on projects." />
        <meta name="keywords" content="web development, HTML tutorial, CSS tutorial, JavaScript tutorial, Tailwind CSS, programming tutorials, learn coding, frontend development" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mrdeveloper.in/" />
        <meta property="og:title" content="MrDeveloper - Master Web Development" />
        <meta property="og:description" content="Complete web development tutorials covering HTML, CSS, JavaScript, and Tailwind CSS with interactive examples." />
        <meta property="og:image" content="/og-image.jpg" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MrDeveloper - Master Web Development" />
        <meta name="twitter:description" content="Learn web development with structured tutorials and hands-on examples." />

        {/* Canonical URL */}
        <link rel="canonical" href="https://www.mrdeveloper.in/" />
        
        {/* Theme Color Meta */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "CodeLearn",
              "description": "Learn web development with comprehensive tutorials",
              "url": "https://www.mrdeveloper.in/",
              "sameAs": [
                "https://github.com/codelearn",
                "https://twitter.com/codelearn"
              ]
            })
          }}
        />
      </Head>

      <HomeContent />
      </>
  );
}