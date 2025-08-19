import React from 'react';
import { Shield, Lock, Eye, Database, Users, Globe, Mail, Phone, FileText, AlertCircle, Cookie, Settings } from 'lucide-react';

export default function PrivacyPolicy() {
  // SEO Meta data
  React.useEffect(() => {
    document.title = 'Privacy Policy - MrDeveloper | Data Protection & User Privacy Rights';
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Read MrDeveloper\'s comprehensive Privacy Policy covering data collection, usage, cookies, and your privacy rights for our web development educational platform.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Read MrDeveloper\'s comprehensive Privacy Policy covering data collection, usage, cookies, and your privacy rights for our web development educational platform.';
      document.head.appendChild(meta);
    }
    
    // Keywords meta tag
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'MrDeveloper privacy policy, data protection, user privacy, cookies policy, personal data, web development education privacy, GDPR compliance');
    } else {
      const keywords = document.createElement('meta');
      keywords.name = 'keywords';
      keywords.content = 'MrDeveloper privacy policy, data protection, user privacy, cookies policy, personal data, web development education privacy, GDPR compliance';
      document.head.appendChild(keywords);
    }
  }, []);

  const dataTypes = [
    {
      icon: Eye,
      title: 'Usage Data',
      description: 'Information about how you use our website, including pages visited, time spent, and browsing patterns'
    },
    {
      icon: Globe,
      title: 'Device Information',
      description: 'IP address, browser type, device identifiers, and operating system information'
    },
    {
      icon: Cookie,
      title: 'Cookies & Tracking',
      description: 'Small files stored on your device to improve functionality and analyze website usage'
    }
  ];

  const cookieTypes = [
    {
      type: 'Essential Cookies',
      purpose: 'Required for basic website functionality and security',
      duration: 'Session',
      color: 'green'
    },
    {
      type: 'Functionality Cookies',
      purpose: 'Remember your preferences and settings for better user experience',
      duration: 'Persistent',
      color: 'blue'
    },
    {
      type: 'Analytics Cookies',
      purpose: 'Help us understand how visitors use our website to improve our services',
      duration: 'Persistent',
      color: 'purple'
    }
  ];

  const userRights = [
    'Access your personal data we have collected',
    'Request correction of inaccurate personal data',
    'Request deletion of your personal data',
    'Object to processing of your personal data',
    'Request restriction of processing',
    'Data portability (receive your data in a structured format)'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-blue-300" />
            <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-xl text-blue-200 mb-2">Your Privacy & Data Protection Rights</p>
          <p className="text-sm text-blue-300">Last updated: August 06, 2025</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Introduction */}
            <section className="mb-12">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-8 rounded-xl mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Lock className="h-6 w-6 text-blue-600" />
                  Your Privacy Matters to Us
                </h2>
                <p className="text-lg leading-relaxed text-gray-800 mb-4">
                  This Privacy Policy describes how <strong>MrDeveloper</strong> ("we", "us", or "our") 
                  collects, uses, and protects your information when you use our educational platform and web development services.
                </p>
                <p className="text-gray-700 font-medium">
                  We are committed to protecting your privacy and ensuring transparency about our data practices. 
                  By using our Service, you agree to the collection and use of information in accordance with this Privacy Policy.
                </p>
              </div>
            </section>

            {/* Key Definitions */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FileText className="h-6 w-6 text-purple-600" />
                Interpretation and Definitions
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Terms</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-blue-600">Company (MrDeveloper):</span>
                      <p className="text-gray-700 text-sm mt-1">Educational platform owned by Prasanna Kumar Simhadri</p>
                    </div>
                    <div>
                      <span className="font-medium text-green-600">Service:</span>
                      <p className="text-gray-700 text-sm mt-1">The MrDeveloper website accessible from <a href="https://www.mrdeveloper.in" className="text-blue-600 hover:underline">mrdeveloper.in</a></p>
                    </div>
                    <div>
                      <span className="font-medium text-orange-600">Personal Data:</span>
                      <p className="text-gray-700 text-sm mt-1">Any information that relates to an identified or identifiable individual</p>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Geographic Scope</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-purple-600">Country:</span>
                      <p className="text-gray-700 text-sm mt-1">Andhra Pradesh, India</p>
                    </div>
                    <div>
                      <span className="font-medium text-indigo-600">You/User:</span>
                      <p className="text-gray-700 text-sm mt-1">Individual accessing our educational content and services</p>
                    </div>
                    <div>
                      <span className="font-medium text-red-600">Device:</span>
                      <p className="text-gray-700 text-sm mt-1">Computer, mobile phone, tablet, or any device accessing our Service</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Collection */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Database className="h-6 w-6 text-green-600" />
                What Data We Collect
              </h2>
              
              <p className="text-lg text-gray-700 mb-6">
                MrDeveloper is designed to be privacy-friendly. We collect minimal data necessary to provide 
                and improve our educational services:
              </p>
              
              <div className="grid gap-6 mb-8">
                {dataTypes.map((type, index) => (
                  <div key={type.title} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <type.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.title}</h3>
                        <p className="text-gray-700">{type.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Important Note</h3>
                </div>
                <p className="text-gray-700">
                  <strong>We do NOT collect:</strong> Personally identifiable information like names, email addresses, 
                  phone numbers, or payment information unless you voluntarily provide them through our contact forms. 
                  Our educational content is freely accessible without requiring account creation or personal data submission.
                </p>
              </div>
            </section>

            {/* Cookies and Tracking */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Cookie className="h-6 w-6 text-orange-600" />
                Cookies and Tracking Technologies
              </h2>
              
              <p className="text-lg text-gray-700 mb-6">
                We use cookies and similar technologies to enhance your browsing experience, 
                analyze website traffic, and improve our educational content delivery.
              </p>
              
              <div className="space-y-4 mb-8">
                {cookieTypes.map((cookie, index) => (
                  <div key={cookie.type} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{cookie.type}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        cookie.color === 'green' ? 'bg-green-100 text-green-800' :
                        cookie.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {cookie.duration}
                      </span>
                    </div>
                    <p className="text-gray-700">{cookie.purpose}</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Cookie Management</h3>
                <p className="text-gray-700 mb-4">
                  You can control cookies through your browser settings. However, disabling certain cookies 
                  may limit your ability to use some features of our website. Most browsers allow you to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>View and delete cookies</li>
                  <li>Block cookies from specific websites</li>
                  <li>Block third-party cookies</li>
                  <li>Delete all cookies when closing the browser</li>
                </ul>
              </div>
            </section>

            {/* How We Use Data */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Settings className="h-6 w-6 text-blue-600" />
                How We Use Your Data
              </h2>
              
              <p className="text-lg text-gray-700 mb-6">
                MrDeveloper uses collected data exclusively for legitimate educational and operational purposes:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Service Improvement</h4>
                    <p className="text-gray-700 text-sm">Analyze usage patterns to enhance our tutorials and educational content</p>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Website Functionality</h4>
                    <p className="text-gray-700 text-sm">Ensure proper functioning of interactive features and responsive design</p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Content Optimization</h4>
                    <p className="text-gray-700 text-sm">Understand which topics and formats are most helpful for learners</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Security & Performance</h4>
                    <p className="text-gray-700 text-sm">Monitor for security threats and optimize website performance</p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Communication</h4>
                    <p className="text-gray-700 text-sm">Respond to inquiries submitted through our contact forms</p>
                  </div>
                  
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h4 className="font-semibold text-gray-900">Legal Compliance</h4>
                    <p className="text-gray-700 text-sm">Comply with applicable laws and protect our legal rights</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Users className="h-6 w-6 text-red-600" />
                Data Sharing and Third Parties
              </h2>
              
              <div className="bg-red-50 border border-red-200 p-6 rounded-xl mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Commitment</h3>
                <p className="text-gray-800 font-medium">
                  <strong>We do NOT sell, rent, or trade your personal information to third parties for marketing purposes.</strong>
                </p>
              </div>
              
              <p className="text-gray-700 mb-4">We may share limited data only in these specific circumstances:</p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Service Providers</h4>
                  <p className="text-gray-700 text-sm">
                    With trusted third-party services that help us operate our website (hosting, analytics, CDNs) 
                    under strict data protection agreements.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Legal Requirements</h4>
                  <p className="text-gray-700 text-sm">
                    When required by law, court order, or government request, or to protect our rights and safety.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Business Transfers</h4>
                  <p className="text-gray-700 text-sm">
                    In case of merger, acquisition, or sale of assets, with proper notice to users.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Retention */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Retention and Storage</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Retention Periods</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span><strong>Usage Data:</strong> Generally retained for 12-24 months for analytics purposes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span><strong>Contact Inquiries:</strong> Retained as long as necessary to address your request</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span><strong>Security Logs:</strong> May be retained longer if required for security or legal purposes</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Security</h3>
                  <p className="text-gray-700 mb-3">
                    We implement appropriate technical and organizational measures to protect your data:
                  </p>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• SSL/TLS encryption for data transmission</li>
                    <li>• Secure hosting infrastructure</li>
                    <li>• Regular security assessments</li>
                    <li>• Limited access controls</li>
                    <li>• Data minimization practices</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* User Rights */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Shield className="h-6 w-6 text-indigo-600" />
                Your Privacy Rights
              </h2>
              
              <p className="text-lg text-gray-700 mb-6">
                You have important rights regarding your personal data. Under applicable privacy laws, you may:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {userRights.map((right, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-indigo-600 text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700">{right}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Exercising Your Rights</h3>
                <p className="text-gray-700 mb-4">
                  To exercise any of these rights or if you have questions about your personal data, 
                  please contact us using the information provided at the end of this policy. 
                  We will respond to your request within 30 days.
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Note:</strong> Some requests may require verification of your identity to protect your privacy and security.
                </p>
              </div>
            </section>

            {/* Children's Privacy */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Children's Privacy Protection</h2>
              
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
                <p className="text-gray-800 mb-4">
                  <strong>Age Restriction:</strong> Our educational content is designed for users aged 13 and above. 
                  We do not knowingly collect personal information from children under 13.
                </p>
                <p className="text-gray-700 mb-4">
                  If you are a parent or guardian and believe your child under 13 has provided us with personal information, 
                  please contact us immediately. We will take steps to remove such information from our systems.
                </p>
                <p className="text-gray-700 text-sm">
                  For users between 13-18, we encourage parental guidance when using our educational resources.
                </p>
              </div>
            </section>

            {/* International Transfers */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">International Data Transfers</h2>
              
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in countries other than your own, 
                including servers located outside of India. These countries may have different data protection laws.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Safeguards</h3>
                <p className="text-gray-700">
                  We ensure appropriate safeguards are in place for international transfers, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-3 space-y-1">
                  <li>Using reputable service providers with strong data protection measures</li>
                  <li>Implementing appropriate technical and organizational security measures</li>
                  <li>Ensuring compliance with applicable privacy laws and regulations</li>
                </ul>
              </div>
            </section>

            {/* External Links */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Links to Other Websites</h2>
              
              <p className="text-gray-700 mb-4">
                Our educational content may contain links to third-party websites, tools, and resources 
                that are not operated by MrDeveloper. This includes:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Educational Resources</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Official documentation websites</li>
                    <li>• GitHub repositories</li>
                    <li>• CDN links for libraries and frameworks</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Third-Party Tools</h4>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Online code editors and playgrounds</li>
                    <li>• Additional learning platforms</li>
                    <li>• Development tools and utilities</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl">
                <p className="text-gray-800 font-medium">
                  <strong>Important:</strong> We have no control over and assume no responsibility for the 
                  privacy policies or practices of any third-party sites. We strongly advise you to review 
                  the privacy policy of every site you visit.
                </p>
              </div>
            </section>

            {/* Policy Updates */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Changes to This Privacy Policy</h2>
              
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices, 
                technology, legal requirements, or other factors.
              </p>
              
              <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How We Notify You</h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    Update the "Last updated" date at the top of this policy
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    Post prominent notices on our website for significant changes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    Send email notifications for material changes (if we have your email)
                  </li>
                </ul>
                <p className="text-gray-700 mt-4">
                  We encourage you to review this Privacy Policy periodically to stay informed about our privacy practices.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us About Privacy</h2>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl">
                <p className="text-gray-700 mb-6">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our 
                  data practices, please don't hesitate to contact us:
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Privacy Email</p>
                      <a 
                        href="mailto:prasannasimha5002@gmail.com?subject=Privacy Policy Inquiry" 
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        aria-label="Email MrDeveloper about privacy concerns"
                      >
                        prasannasimha5002@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a 
                        href="tel:+918309179509" 
                        className="text-green-600 hover:text-green-800 font-medium"
                        aria-label="Call MrDeveloper about privacy"
                      >
                        +91 8309179509
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Globe className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact Page</p>
                      <a 
                        href="https://www.mrdeveloper.in/contact" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 font-medium"
                        aria-label="Visit MrDeveloper contact page"
                      >
                        Contact Form
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-white rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600">
                    <strong>Response Time:</strong> We typically respond to privacy-related inquiries within 
                    24-48 hours during business days. For urgent privacy matters, please mark your message as "Urgent - Privacy Request".
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="text-center pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                This Privacy Policy is part of <strong>MrDeveloper</strong>'s commitment to transparency and user privacy.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <a href="/terms-of-service" className="text-blue-600 hover:underline flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Terms of Service
                </a>
                <a href="/disclaimer" className="text-blue-600 hover:underline flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Disclaimer
                </a>
                <a href="/contact" className="text-blue-600 hover:underline flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Schema.org JSON-LD for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Privacy Policy - MrDeveloper",
          "description": "Comprehensive Privacy Policy for MrDeveloper educational platform covering data collection, usage, and user privacy rights",
          "url": "https://www.mrdeveloper.in/privacy-policy",
          "publisher": {
            "@type": "Organization",
            "name": "MrDeveloper",
            "url": "https://www.mrdeveloper.in",
            "founder": {
              "@type": "Person",
              "name": "Prasanna Kumar Simhadri"
            }
          },
          "dateModified": "2025-08-06",
          "inLanguage": "en-US",
          "isPartOf": {
            "@type": "WebSite",
            "name": "MrDeveloper",
            "url": "https://www.mrdeveloper.in"
          },
          "about": {
            "@type": "Thing",
            "name": "Privacy Policy",
            "description": "Data protection and privacy rights for web development educational platform"
          }
        })}
      </script>
    </div>
  );
}