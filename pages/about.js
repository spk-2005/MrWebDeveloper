import React from 'react';
import { User, Code, Database, Smartphone, Mail, MessageCircle, Globe, MapPin, GraduationCap, Heart, Lightbulb, Target, Rocket } from 'lucide-react';

export default function About() {
  // SEO Meta data
  React.useEffect(() => {
    document.title = 'About MrDeveloper | Prasanna Kumar Simhadri - Full Stack Developer & Educator';
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Meet Prasanna Kumar Simhadri, founder of MrDeveloper. Learn about our mission to make web development accessible through React.js, MongoDB, Node.js tutorials and modern programming education.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Meet Prasanna Kumar Simhadri, founder of MrDeveloper. Learn about our mission to make web development accessible through React.js, MongoDB, Node.js tutorials and modern programming education.';
      document.head.appendChild(meta);
    }
    
    // Keywords meta tag
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'Prasanna Kumar Simhadri, MrDeveloper about, full stack developer, web development educator, React.js expert, MongoDB tutorials, Node.js courses, data science student, Chirala developer');
    } else {
      const keywords = document.createElement('meta');
      keywords.name = 'keywords';
      keywords.content = 'Prasanna Kumar Simhadri, MrDeveloper about, full stack developer, web development educator, React.js expert, MongoDB tutorials, Node.js courses, data science student, Chirala developer';
      document.head.appendChild(keywords);
    }

    // Author meta tag
    const metaAuthor = document.querySelector('meta[name="author"]');
    if (metaAuthor) {
      metaAuthor.setAttribute('content', 'Prasanna Kumar Simhadri');
    } else {
      const author = document.createElement('meta');
      author.name = 'author';
      author.content = 'Prasanna Kumar Simhadri';
      document.head.appendChild(author);
    }
  }, []);

  const techStack = [
    { name: 'React.js', icon: '⚛️', description: 'Modern frontend development' },
    { name: 'MongoDB', icon: '🍃', description: 'NoSQL database solutions' },
    { name: 'Node.js & Express', icon: '⚙️', description: 'Backend and API development' },
    { name: 'Tailwind CSS', icon: '🎨', description: 'Utility-first CSS framework' },
    { name: 'Next.js', icon: '▲', description: 'Full-stack React framework' },
    { name: 'Vercel', icon: '🚀', description: 'Modern deployment platform' },
    { name: 'Airtable', icon: '📊', description: 'Database and data management' },
    { name: 'TypeScript', icon: '📘', description: 'Type-safe JavaScript' }
  ];

  const achievements = [
    { title: 'Educational Content Creator', desc: 'Creating comprehensive web development tutorials' },
    { title: 'Full Stack Developer', desc: 'Building modern web applications with latest technologies' },
    { title: 'Data Science Student', desc: 'Specializing in Computer Science & Data Science' },
    { title: 'Community Builder', desc: 'Helping developers learn and grow together' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-800 to-indigo-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <User className="h-8 w-8 text-blue-300" />
                <span className="text-blue-200 font-medium">About MrDeveloper</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                👨‍💻 Prasanna Kumar Simhadri
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-6 leading-relaxed">
                Crafting digital experiences with passion, purpose, and pixel-perfect precision
              </p>
              <div className="flex items-center gap-4 text-blue-200">
                <MapPin className="h-5 w-5" />
                <span>Chirala, Andhra Pradesh, India</span>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="w-64 h-64 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚀</div>
                  <p className="text-lg font-semibold">MrDeveloper</p>
                  <p className="text-blue-200">Tech Playground</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Introduction */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Rocket className="h-8 w-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900">Who Am I?</h2>
            </div>
            
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p className="text-xl leading-relaxed mb-6">
                Welcome to <strong>MrDeveloper</strong> — a platform crafted with passion, purpose, 
                and pixel-perfect precision. I'm <strong>Prasanna Kumar Simhadri</strong>, and this is my 
                digital playground where technology meets creativity.
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                <p className="text-lg text-gray-800 mb-0">
                  I'm a <strong>Computer Science & Engineering student</strong> specializing in <strong>Data Science</strong>. 
                  Hailing from <strong>Chirala</strong>, I bring a curious mind, a problem-solving attitude, 
                  and a love for turning ideas into interactive, functional web applications that make a difference.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What is MrDeveloper */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="h-8 w-8 text-yellow-600" />
              <h2 className="text-3xl font-bold text-gray-900">What Is MrDeveloper?</h2>
            </div>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              <strong>MrDeveloper</strong> is more than just a website — it's a comprehensive tech playground 
              and educational platform. From frontend designs to backend integrations, this is where I share 
              my passion, build innovative projects, and connect with like-minded creators and learners.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hands-on Projects</h3>
                <p className="text-gray-700">React.js, MongoDB, Next.js applications with real-world functionality</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Educational Content</h3>
                <p className="text-gray-700">Comprehensive guides, tutorials, and beginner-friendly resources</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <div className="text-3xl mb-3">🧩</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Modern UI/UX</h3>
                <p className="text-gray-700">Experiments with cutting-edge design and responsive layouts</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Code className="h-8 w-8 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">🛠 Technology Stack</h2>
            </div>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              I work with modern, industry-standard tools and frameworks to build scalable, 
              performant applications. Here's my current technology arsenal:
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {techStack.map((tech, index) => (
                <div 
                  key={tech.name}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{tech.icon}</span>
                    <h3 className="font-semibold text-gray-900">{tech.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{tech.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Always Learning</h3>
              <p className="text-gray-700">
                The tech landscape evolves rapidly, and so do I. I'm constantly exploring new technologies, 
                frameworks, and best practices to deliver cutting-edge solutions and educational content.
              </p>
            </div>
          </div>
        </section>

        {/* Achievements & Focus Areas */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Target className="h-8 w-8 text-red-600" />
              <h2 className="text-3xl font-bold text-gray-900">Focus Areas & Achievements</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <div 
                  key={achievement.title}
                  className="border-l-4 border-blue-500 pl-6 py-4"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                  <p className="text-gray-700">{achievement.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-3 mb-3">
                <GraduationCap className="h-6 w-6 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Educational Mission</h3>
              </div>
              <p className="text-gray-700">
                My goal is to demystify web development and make it accessible to everyone, regardless of their background. 
                Through clear explanations, practical examples, and hands-on projects, I help aspiring developers 
                build real-world skills that matter in today's tech industry.
              </p>
            </div>
          </div>
        </section>

        {/* Connect Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 md:p-12 text-white">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="h-8 w-8 text-pink-300" />
              <h2 className="text-3xl font-bold">📬 Let's Connect & Collaborate</h2>
            </div>
            
            <p className="text-xl text-blue-100 leading-relaxed mb-8">
              Got feedback, a collaboration idea, or just want to say hi? I'm always excited to connect 
              with fellow developers, students, and tech enthusiasts. Don't hesitate to reach out!
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="h-6 w-6 text-blue-300" />
                  <h3 className="font-semibold">Email</h3>
                </div>
                <a 
                  href="mailto:prasannasimha5002@gmail.com" 
                  className="text-blue-200 hover:text-white transition-colors"
                  aria-label="Send email to Prasanna Kumar Simhadri"
                >
                  prasannasimha5002@gmail.com
                </a>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="h-6 w-6 text-green-300" />
                  <h3 className="font-semibold">WhatsApp</h3>
                </div>
                <a 
                  href="https://wa.me/918309179509" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-200 hover:text-white transition-colors"
                  aria-label="Chat with Prasanna Kumar Simhadri on WhatsApp"
                >
                  Message me directly
                </a>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <Globe className="h-6 w-6 text-purple-300" />
                  <h3 className="font-semibold">Website</h3>
                </div>
                <a 
                  href="https://www.mrdeveloper.in" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-200 hover:text-white transition-colors"
                  aria-label="Visit MrDeveloper website"
                >
                  mrdeveloper.in
                </a>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-lg text-blue-200 italic">
                "Thanks for visiting — let's build something amazing together!" 🚀
              </p>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                To make modern web development simple, practical, and accessible to everyone. 
                We believe that quality education should be free, comprehensive, and applicable 
                to real-world scenarios.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">Web Development</span>
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">Data Science</span>
                <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">Full Stack</span>
                <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">Education</span>
                <span className="bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm font-medium">Innovation</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Schema.org JSON-LD for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Prasanna Kumar Simhadri",
          "jobTitle": "Full Stack Developer & Educator",
          "affiliation": {
            "@type": "Organization",
            "name": "MrDeveloper"
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Chirala",
            "addressRegion": "Andhra Pradesh",
            "addressCountry": "India"
          },
          "email": "prasannasimha5002@gmail.com",
          "telephone": "+918309179509",
          "url": "https://www.mrdeveloper.in",
          "sameAs": [
            "https://www.mrdeveloper.in",
            "https://wa.me/918309179509"
          ],
          "knowsAbout": [
            "Web Development",
            "React.js",
            "Node.js",
            "MongoDB",
            "Data Science",
            "Full Stack Development",
            "JavaScript",
            "Programming Education"
          ],
          "alumniOf": "Computer Science & Engineering",
          "hasOccupation": {
            "@type": "Occupation",
            "name": "Web Developer and Educator",
            "description": "Creating educational content and web applications to help developers learn modern programming"
          }
        })}
      </script>
    </div>
  );
}