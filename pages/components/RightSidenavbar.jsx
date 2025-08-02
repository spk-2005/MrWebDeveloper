import React, { useState, useEffect } from 'react';
import { 
  Link, 
  X, 
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
      description: "Discover additional learning resources"
    },
    {
      icon: Users,
      title: "Join Our Community",
      description: "Connect with fellow developers"
    },
    {
      icon: MessageCircle,
      title: "Get Help & Support",
      description: "Ask questions and get answers"
    },
    {
      icon: Heart,
      title: "Support CodeLearn",
      description: "Help us create more content"
    }
  ];

  const stats = [
    { label: "Daily Learners", value: "2.5K+", icon: Users },
    { label: "Completion Rate", value: "94%", icon: Award },
    { label: "Avg. Study Time", value: "45min", icon: Clock }
  ];

  const relatedTopics = activeSection ? {
    'HTML': ['HTML5 Features', 'Semantic Elements', 'Accessibility', 'SEO Basics'],
    'CSS': ['Advanced Animations', 'CSS Grid Mastery', 'Responsive Design', 'Modern CSS'],
    'JavaScript': ['ES6+ Features', 'Async Programming', 'DOM Advanced', 'API Integration'],
    'Tailwind': ['Custom Components', 'Plugin Development', 'Design Systems', 'Performance']
  }[activeSection] || [] : [];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 right-0 h-screen lg:h-[calc(100vh-120px)] lg:top-[120px]
          w-80 max-w-[85vw] lg:w-72 xl:w-80
          backdrop-blur-md
          border-l
          shadow-2xl lg:shadow-none
          overflow-y-auto scrollbar-thin scrollbar-thumb-300 scrollbar-track-transparent
          z-50 lg:z-10
          transform transition-transform duration-300 ease-out
          ${isOpen || !isMobile ? 'translate-x-0' : 'translate-x-full'}
          ${isMobile ? 'lg:translate-x-0' : ''}
        `}
      >
        {/* Mobile Header */}
        {isMobile && (
          <div className="sticky top-0 backdrop-blur-md border-b p-4 lg:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold">Quick Access</h2>
                  <p className="text-xs">{formatTime(currentTime)}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:opacity-70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="p-4 lg:p-6 space-y-6">
          {/* Learning Stats */}
          <div className="rounded-2xl shadow-lg border p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Learning Stats</h3>
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm">{stat.label}</span>
                  </div>
                  <span className="font-bold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Learning Context */}
          {activeSection && activeItem && (
            <div className="rounded-2xl shadow-lg border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">Currently Learning</h3>
                  <p className="text-sm">{activeSection} • {activeItem}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-semibold">75%</span>
                </div>
                <div className="w-full rounded-full h-2 overflow-hidden">
                  <div className="w-3/4 h-full rounded-full transition-all duration-1000"></div>
                </div>
                <p className="text-xs rounded-lg p-2">
                  Keep going! You're making great progress in {activeSection}.
                </p>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="rounded-2xl shadow-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Quick Actions</h3>
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="group flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm">
                    <link.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">
                      {link.title}
                    </div>
                    <p className="text-xs truncate">{link.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>
          </div>

          {/* Related Topics */}
          {activeSection && relatedTopics.length > 0 && (
            <div className="rounded-2xl shadow-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Explore More</h3>
                <div className="flex items-center space-x-1 text-xs">
                  <Globe className="w-3 h-3" />
                  <span>{activeSection}</span>
                </div>
              </div>
              <div className="space-y-3">
                {relatedTopics.map((topic, index) => (
                  <a
                    key={index}
                    href="#"
                    className="group flex items-center justify-between p-3 rounded-xl hover:opacity-70 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full"></div>
                      <span className="text-sm font-medium">
                        {topic}
                      </span>
                    </div>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <a
                  href="#"
                  className="flex items-center justify-center space-x-2 text-sm font-medium py-2 px-4 rounded-xl transition-all duration-200"
                >
                  <span>View All {activeSection} Topics</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Sponsor/Ad Section */}
          <div className="rounded-2xl shadow-lg border p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Support CodeLearn</h3>
                <Coffee className="w-5 h-5" />
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">Love our content?</p>
                  <p className="text-xs mb-4">
                    Help us create more amazing tutorials and keep the platform free for everyone.
                  </p>
                </div>
                <button className="w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>Buy us a coffee</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center py-4 border-t">
            <div className="flex items-center justify-center space-x-4 text-xs mb-2">
              <span>Made with ❤️ for developers</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-xs">
              <Code2 className="w-3 h-3" />
              <span>CodeLearn Platform</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
} 