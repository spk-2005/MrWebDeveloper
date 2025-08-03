import React, { useState, useEffect } from 'react';
import { 
  Link, 
  Users, 
  BookOpen, 
  MessageCircle, 
  Heart, 
  ExternalLink, 
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  Coffee,
  Star,
  ArrowRight,
  ChevronRight,
  Target,
  Clock,
  Code2,
  Globe
} from 'lucide-react';

export default function RightSidenavbar({ 
  activeSection, 
  activeItem, 
  isOpen, 
  onClose, 
  isMobile 
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const quickLinks = [
    {
      icon: BookOpen,
      title: "Explore More Tutorials",
      description: "Discover additional learning resources",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      icon: Users,
      title: "Join Our Community",
      description: "Connect with fellow developers",
      gradient: "from-blue-400 to-indigo-500"
    },
    {
      icon: MessageCircle,
      title: "Get Help & Support",
      description: "Ask questions and get answers",
      gradient: "from-green-400 to-emerald-500"
    },
    {
      icon: Heart,
      title: "Support CodeLearn",
      description: "Help us create more content",
      gradient: "from-red-400 to-pink-500"
    }
  ];

  const stats = [
    { label: "Daily Learners", value: "2.5K+", icon: Users, gradient: "from-blue-400 to-blue-600" },
    { label: "Completion Rate", value: "94%", icon: Award, gradient: "from-yellow-400 to-orange-500" },
    { label: "Avg. Study Time", value: "45min", icon: Clock, gradient: "from-green-400 to-emerald-500" }
  ];

  const relatedTopics = activeSection ? {
    'HTML': ['HTML5 Features', 'Semantic Elements', 'Accessibility', 'SEO Basics'],
    'CSS': ['Advanced Animations', 'CSS Grid Mastery', 'Responsive Design', 'Modern CSS'],
    'JavaScript': ['ES6+ Features', 'Async Programming', 'DOM Advanced', 'API Integration'],
    'Tailwind': ['Custom Components', 'Plugin Development', 'Design Systems', 'Performance']
  }[activeSection] || [] : [];

  const sectionGradients = {
    'HTML': 'from-orange-400 to-red-500',
    'CSS': 'from-blue-400 to-cyan-500',
    'JavaScript': 'from-yellow-400 to-orange-500',
    'Tailwind': 'from-emerald-400 to-teal-500'
  };

  return (
    <aside
      className={`
        ${isMobile 
          ? 'w-full mt-6 mb-8' 
          : 'sticky top-[120px] h-[calc(100vh-120px)] w-72 xl:w-80'
        }
        backdrop-blur-md border-l border-gray-200/50 shadow-2xl lg:shadow-none
        overflow-y-auto scrollbar-thin scrollbar-thumb-300 scrollbar-track-transparent
        ${isOpen || !isMobile ? 'block' : 'hidden'}
      `}
      style={{
        background: isMobile 
          ? 'transparent' 
          : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.90) 50%, rgba(255,255,255,0.95) 100%)'
      }}
    >
      <div className={`${isMobile ? 'p-0' : 'p-4 lg:p-6'} space-y-6`}>
        {/* Learning Stats */}
        <div className="rounded-2xl shadow-lg border border-gray-200/50 p-6 backdrop-blur-sm relative overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 opacity-50"
               style={{
                 background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%)'
               }}></div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Learning Stats</h3>
              <div className="w-10 h-10 rounded-xl shadow-lg flex items-center justify-center border border-indigo-200/50"
                   style={{
                     background: 'linear-gradient(135deg, rgb(99,102,241) 0%, rgb(139,92,246) 100%)'
                   }}>
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-gray-100/50 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                         style={{
                           background: `linear-gradient(135deg, ${stat.gradient.includes('blue') ? 'rgb(59,130,246), rgb(37,99,235)' : 
                                                                stat.gradient.includes('yellow') ? 'rgb(245,158,11), rgb(217,119,6)' :
                                                                'rgb(34,197,94), rgb(21,128,61)'
                                      })`
                         }}>
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-700">{stat.label}</span>
                  </div>
                  <span className="font-bold text-gray-800">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current Learning Context */}
        {activeSection && activeItem && (
          <div className="rounded-2xl shadow-lg border border-gray-200/50 p-6 relative overflow-hidden">
            {/* Section-specific gradient background */}
            <div className="absolute inset-0 opacity-10"
                 style={{
                   background: `linear-gradient(135deg, ${
                     activeSection === 'HTML' ? 'rgb(251,146,60), rgb(239,68,68)' :
                     activeSection === 'CSS' ? 'rgb(59,130,246), rgb(6,182,212)' :
                     activeSection === 'JavaScript' ? 'rgb(245,158,11), rgb(251,146,60)' :
                     'rgb(52,211,153), rgb(20,184,166)'
                   })`
                 }}></div>
            
            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border border-gray-200/50"
                     style={{
                       background: `linear-gradient(135deg, ${
                         activeSection === 'HTML' ? 'rgb(251,146,60), rgb(239,68,68)' :
                         activeSection === 'CSS' ? 'rgb(59,130,246), rgb(6,182,212)' :
                         activeSection === 'JavaScript' ? 'rgb(245,158,11), rgb(251,146,60)' :
                         'rgb(52,211,153), rgb(20,184,166)'
                       })`
                     }}>
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Currently Learning</h3>
                  <p className="text-sm text-gray-600">{activeSection} • {activeItem}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold text-gray-800">75%</span>
                </div>
                <div className="w-full rounded-full h-2 overflow-hidden border border-gray-200/50 shadow-inner"
                     style={{ background: 'rgba(243,244,246,0.8)' }}>
                  <div className="w-3/4 h-full rounded-full transition-all duration-1000 relative shadow-sm"
                       style={{
                         background: `linear-gradient(90deg, ${
                           activeSection === 'HTML' ? 'rgb(251,146,60), rgb(239,68,68)' :
                           activeSection === 'CSS' ? 'rgb(59,130,246), rgb(6,182,212)' :
                           activeSection === 'JavaScript' ? 'rgb(245,158,11), rgb(251,146,60)' :
                           'rgb(52,211,153), rgb(20,184,166)'
                         })`
                       }}>
                    <div className="absolute inset-0 rounded-full animate-pulse"
                         style={{ background: 'rgba(255,255,255,0.3)' }}></div>
                  </div>
                </div>
                <div className="text-xs rounded-lg p-2 border border-gray-200/50 shadow-sm"
                     style={{ background: 'linear-gradient(135deg, rgba(249,250,251,0.8) 0%, rgba(243,244,246,0.6) 100%)' }}>
                  Keep going! You're making great progress in {activeSection}.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="rounded-2xl shadow-lg border border-gray-200/50 p-6 backdrop-blur-sm relative overflow-hidden">
          {/* Subtle background */}
          <div className="absolute inset-0 opacity-30"
               style={{
                 background: 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(59,130,246,0.1) 100%)'
               }}></div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
              <div className="w-10 h-10 rounded-xl shadow-lg flex items-center justify-center border border-cyan-200/50"
                   style={{
                     background: 'linear-gradient(135deg, rgb(6,182,212) 0%, rgb(59,130,246) 100%)'
                   }}>
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="group flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 border border-gray-100/50 hover:border-gray-200/80"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(249,250,251,0.5) 100%)'
                  }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300"
                       style={{
                         background: `linear-gradient(135deg, ${
                           link.gradient.includes('purple') ? 'rgb(168,85,247), rgb(236,72,153)' :
                           link.gradient.includes('blue') ? 'rgb(59,130,246), rgb(99,102,241)' :
                           link.gradient.includes('green') ? 'rgb(34,197,94), rgb(16,185,129)' :
                           'rgb(239,68,68), rgb(236,72,153)'
                         })`
                       }}>
                    <link.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-800">
                      {link.title}
                    </div>
                    <p className="text-xs text-gray-600 truncate">{link.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-gray-600 transition-all" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Related Topics */}
        {activeSection && relatedTopics.length > 0 && (
          <div className="rounded-2xl shadow-lg border border-gray-200/50 p-6 relative overflow-hidden">
            {/* Section-specific background */}
            <div className="absolute inset-0 opacity-10"
                 style={{
                   background: `linear-gradient(135deg, ${
                     activeSection === 'HTML' ? 'rgb(251,146,60), rgb(239,68,68)' :
                     activeSection === 'CSS' ? 'rgb(59,130,246), rgb(6,182,212)' :
                     activeSection === 'JavaScript' ? 'rgb(245,158,11), rgb(251,146,60)' :
                     'rgb(52,211,153), rgb(20,184,166)'
                   })`
                 }}></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Explore More</h3>
                <div className="flex items-center space-x-1 text-xs px-3 py-1 rounded-full border border-gray-200/50 shadow-sm"
                     style={{
                       background: 'linear-gradient(135deg, rgba(249,250,251,0.8) 0%, rgba(243,244,246,0.6) 100%)'
                     }}>
                  <Globe className="w-3 h-3 text-gray-600" />
                  <span className="text-gray-700 font-medium">{activeSection}</span>
                </div>
              </div>
              <div className="space-y-3">
                {relatedTopics.map((topic, index) => (
                  <a
                    key={index}
                    href="#"
                    className="group flex items-center justify-between p-3 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200/50 shadow-sm hover:shadow-md"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(249,250,251,0.4) 100%)'
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full shadow-sm"
                           style={{
                             background: `linear-gradient(135deg, ${
                               activeSection === 'HTML' ? 'rgb(251,146,60), rgb(239,68,68)' :
                               activeSection === 'CSS' ? 'rgb(59,130,246), rgb(6,182,212)' :
                               activeSection === 'JavaScript' ? 'rgb(245,158,11), rgb(251,146,60)' :
                               'rgb(52,211,153), rgb(20,184,166)'
                             })`
                           }}></div>
                      <span className="text-sm font-medium text-gray-700">
                        {topic}
                      </span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200/50">
                <a
                  href="#"
                  className="flex items-center justify-center space-x-2 text-sm font-medium py-2 px-4 rounded-xl transition-all duration-200 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${
                      activeSection === 'HTML' ? 'rgb(251,146,60), rgb(239,68,68)' :
                      activeSection === 'CSS' ? 'rgb(59,130,246), rgb(6,182,212)' :
                      activeSection === 'JavaScript' ? 'rgb(245,158,11), rgb(251,146,60)' :
                      'rgb(52,211,153), rgb(20,184,166)'
                    })`
                  }}
                >
                  <span>View All {activeSection} Topics</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Sponsor/Ad Section */}
        <div className="rounded-2xl shadow-lg border border-gray-200/50 p-6 relative overflow-hidden">
          {/* Gradient background */}
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-10 translate-x-10 opacity-20"
               style={{
                 background: 'linear-gradient(135deg, rgb(236,72,153) 0%, rgb(239,68,68) 100%)'
               }}></div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Support CodeLearn</h3>
              <div className="w-10 h-10 rounded-xl shadow-lg flex items-center justify-center border border-pink-200/50"
                   style={{
                     background: 'linear-gradient(135deg, rgb(236,72,153) 0%, rgb(239,68,68) 100%)'
                   }}>
                <Coffee className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl relative"
                   style={{
                     background: 'linear-gradient(135deg, rgb(236,72,153) 0%, rgb(239,68,68) 100%)'
                   }}>
                <Heart className="w-8 h-8 text-white relative z-10" />
                <div className="absolute inset-0 rounded-2xl animate-pulse"
                     style={{ background: 'rgba(255,255,255,0.2)' }}></div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1 text-gray-800">Love our content?</p>
                <p className="text-xs mb-4 text-gray-600">
                  Help us create more amazing tutorials and keep the platform free for everyone.
                </p>
              </div>
              <button className="w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-white border border-white/20 relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, rgb(236,72,153) 0%, rgb(239,68,68) 100%)'
                      }}>
                {/* Glass overlay */}
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 hover:opacity-100"
                     style={{ background: 'rgba(255,255,255,0.1)' }}></div>
                <Star className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Buy us a coffee</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center py-4 border-t border-gray-200/50">
          <div className="flex items-center justify-center space-x-4 text-xs mb-2">
            <span className="text-gray-600">Made with ❤️ for developers</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs">
            <div className="w-6 h-6 rounded-lg shadow-sm flex items-center justify-center border border-blue-200/50"
                 style={{
                   background: 'linear-gradient(135deg, rgb(59,130,246) 0%, rgb(99,102,241) 100%)'
                 }}>
              <Code2 className="w-3 h-3 text-white" />
            </div>
            <span className="text-gray-700 font-medium">CodeLearn Platform</span>
          </div>
        </div>
      </div>
    </aside>
  );
}