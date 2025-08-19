import React from 'react';
import { FileText, Shield, Copyright, AlertCircle, Mail, Phone, ExternalLink, Link } from 'lucide-react';

export default function Terms() {
  // SEO Meta data
  React.useEffect(() => {
    document.title = 'Terms of Service - MrDeveloper | User Agreement & Legal Terms';
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Read MrDeveloper\'s Terms of Service including user agreements, intellectual property rights, and conditions for using our web development tutorials and programming courses.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Read MrDeveloper\'s Terms of Service including user agreements, intellectual property rights, and conditions for using our web development tutorials and programming courses.';
      document.head.appendChild(meta);
    }
    
    // Keywords meta tag
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'MrDeveloper terms of service, user agreement, web development tutorials terms, programming courses legal, intellectual property, website terms');
    } else {
      const keywords = document.createElement('meta');
      keywords.name = 'keywords';
      keywords.content = 'MrDeveloper terms of service, user agreement, web development tutorials terms, programming courses legal, intellectual property, website terms';
      document.head.appendChild(keywords);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-blue-300" />
            <h1 className="text-4xl md:text-5xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-xl text-indigo-200 mb-2">User Agreement for MrDeveloper</p>
          <p className="text-sm text-indigo-300">Last updated: August 06, 2025</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Introduction */}
            <section className="mb-10">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-xl mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Welcome to MrDeveloper</h2>
                <p className="text-lg leading-relaxed text-gray-800">
                  Please read these Terms of Service (&quot;Terms&quot;, &quot;Terms of Service&quot;) carefully before using the 
                  <strong> MrDeveloper</strong> website and educational services. These terms govern your use of our 
                  web development tutorials, programming courses, and educational content.
                </p>
                <p className="mt-4 text-gray-700 font-medium">
                  By accessing or using our Service, you agree to be bound by these Terms. 
                  If you disagree with any part of these terms, you may not access the Service.
                </p>
              </div>
            </section>

            {/* Interpretation and Definitions */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                Interpretation and Definitions
              </h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Key Definitions</h3>
                <p className="text-gray-700 mb-4">
                  For the purposes of these Terms of Service, the following definitions apply to 
                  <strong> MrDeveloper</strong> and its educational platform:
                </p>
                
                <div className="grid gap-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-800">Company (MrDeveloper):</p>
                    <p className="text-gray-700">
                      Refers to the educational platform owned and operated by <strong>Prasanna Kumar Simhadri</strong>, 
                      providing web development tutorials, programming courses, and technical educational content.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="font-semibold text-gray-800">Service:</p>
                    <p className="text-gray-700">
                      The MrDeveloper website, educational content, tutorials, code examples, and all related services 
                      accessible from <a href="https://www.mrdeveloper.in" className="text-blue-600 hover:underline">mrdeveloper.in</a>
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-4">
                    <p className="font-semibold text-gray-800">User/You:</p>
                    <p className="text-gray-700">
                      Any individual or entity accessing or using the Service for educational purposes, 
                      including students, developers, and educational institutions.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Conditions of Use */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                Conditions of Use
              </h2>
              
              <div className="bg-green-50 p-6 rounded-lg mb-4">
                <p className="text-gray-800 font-medium mb-3">
                  By accessing MrDeveloper, you agree to:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    Comply with all applicable local, national, and international laws and regulations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    Use the educational content responsibly and for legitimate learning purposes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    Respect intellectual property rights and licensing terms
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    Provide accurate information when interacting with our services
                  </li>
                </ul>
              </div>
              
              <p className="text-gray-700">
                You are responsible for compliance with any applicable local laws regarding online education, 
                data protection, and internet usage in your jurisdiction.
              </p>
            </section>

            {/* Intellectual Property */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Copyright className="h-5 w-5 text-indigo-600" />
                </div>
                Intellectual Property Rights
              </h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Our Content</h3>
                  <p className="text-gray-700 mb-3">
                    All content published on MrDeveloper, including but not limited to:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                    <li>Written tutorials and educational articles</li>
                    <li>Video content and demonstrations</li>
                    <li>Code examples and project templates</li>
                    <li>Images, graphics, and visual designs</li>
                    <li>Website layout and user interface</li>
                    <li>Logos and branding materials</li>
                  </ul>
                  <p className="text-gray-700 font-medium">
                    Is the intellectual property of <strong>MrDeveloper (Prasanna Kumar Simhadri)</strong> 
                    and is protected by copyright and other intellectual property laws.
                  </p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Usage Rights</h3>
                  <p className="text-gray-700 mb-3">You may:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                    <li>Use code examples for personal learning and educational purposes</li>
                    <li>Modify and adapt code examples for your own projects</li>
                    <li>Reference our tutorials with proper attribution</li>
                  </ul>
                  <p className="text-gray-700 font-medium">
                    <strong>You may not:</strong> Redistribute, sell, or claim ownership of our original content 
                    without explicit written permission.
                  </p>
                </div>
              </div>
            </section>

            {/* Prohibited Activities */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                Prohibited Activities
              </h2>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-gray-800 font-medium mb-4">
                  The following activities are strictly prohibited when using MrDeveloper:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Security & Technical:</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Attempting unauthorized access to our systems or servers</li>
                      <li>• Distributing viruses, malware, or malicious code</li>
                      <li>• Attempting to reverse engineer our platform</li>
                      <li>• Overloading our servers through automated requests</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Content & Usage:</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Using the website for unlawful or fraudulent purposes</li>
                      <li>• Plagiarizing or copying content without attribution</li>
                      <li>• Creating competing educational platforms using our content</li>
                      <li>• Harassment or inappropriate behavior toward other users</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Educational Content License */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Educational Content License</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  MrDeveloper grants you a limited, non-exclusive, non-transferable license to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  <li>Access and view our educational content for personal learning</li>
                  <li>Use code examples in your personal and commercial projects</li>
                  <li>Share links to our tutorials with proper attribution</li>
                  <li>Use our content for educational purposes in non-commercial settings</li>
                </ul>
                <p className="text-gray-700 font-medium">
                  This license does not grant you any rights to our trademarks, service marks, or logos.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  <strong>MrDeveloper</strong> and <strong>Prasanna Kumar Simhadri</strong> shall not be liable for any 
                  direct, indirect, incidental, consequential, or punitive damages arising from:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Use or inability to use our educational content</li>
                  <li>Errors or inaccuracies in tutorials or code examples</li>
                  <li>Security vulnerabilities in implemented code</li>
                  <li>Loss of data or business opportunities</li>
                  <li>Third-party actions or content</li>
                </ul>
                <p className="text-gray-700 mt-4 font-medium">
                  Our total liability shall not exceed the amount you paid for accessing our services (if any).
                </p>
              </div>
            </section>

            {/* Service Availability */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Availability</h2>
              <p className="text-gray-700 mb-4">
                While we strive to maintain continuous service availability, we reserve the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Temporarily suspend service for maintenance or updates</li>
                <li>Modify or discontinue features without prior notice</li>
                <li>Implement security measures that may affect access</li>
                <li>Update our content and course materials</li>
              </ul>
            </section>

            {/* Changes to Terms */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to These Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to update or change our Terms of Service at any time. When we make changes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>We will update the &quot;Last updated&quot; date at the top of this page</li>
                <li>We may notify users via email or website notice for significant changes</li>
                <li>Continued use of the site constitutes acceptance of the updated terms</li>
                <li>Previous versions will be archived for reference</li>
              </ul>
            </section>

            {/* Contact Information */}
            <section className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                <p className="text-gray-700 mb-4">
                  If you have any questions about these Terms of Service, need clarification about your rights and obligations, 
                  or want to report violations, please contact us:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Support</p>
                      <a 
                        href="mailto:prasannasimha5002@gmail.com" 
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        aria-label="Email MrDeveloper support"
                      >
                        prasannasimha5002@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Support</p>
                      <a 
                        href="tel:+918309179509" 
                        className="text-green-600 hover:text-green-800 font-medium"
                        aria-label="Call MrDeveloper support"
                      >
                        +91 8309179509
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <ExternalLink className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
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

                  <div className="flex items-center gap-3 md:col-span-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Business Address</p>
                      <p className="text-gray-700 font-medium">Andhra Pradesh, India</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600">
                    <strong>Response Time:</strong> We typically respond to inquiries within 24-48 hours during business days. 
                    For urgent matters related to Terms violations, please mark your message as &quot;Urgent - Terms Violation&quot;.
                  </p>
                </div>
              </div>
            </section>

            {/* Governing Law */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law and Jurisdiction</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  These Terms of Service shall be governed by and construed in accordance with the laws of India, 
                  specifically the Information Technology Act, 2000 and related regulations governing online services and digital content.
                </p>
                <p className="text-gray-700 mb-4">
                  Any disputes arising from these terms or your use of MrDeveloper shall be subject to the 
                  exclusive jurisdiction of the courts in Andhra Pradesh, India.
                </p>
                <p className="text-gray-700 font-medium">
                  We encourage users to resolve disputes through direct communication before pursuing legal action.
                </p>
              </div>
            </section>

            {/* Severability */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Severability</h2>
              <p className="text-gray-700">
                If any provision of these Terms is held to be invalid or unenforceable by a court, 
                the remaining provisions will remain in full force and effect. The invalid provision 
                will be replaced with a valid provision that most closely reflects the original intent.
              </p>
            </section>

            {/* Entire Agreement */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Entire Agreement</h2>
              <p className="text-gray-700 mb-4">
                These Terms of Service, together with our Privacy Policy and Disclaimer, constitute the 
                entire agreement between you and MrDeveloper regarding your use of our services.
              </p>
              <p className="text-gray-700">
                These terms supersede any prior agreements, communications, or understandings between 
                you and MrDeveloper, whether written or oral, regarding the subject matter herein.
              </p>
            </section>

            {/* Acknowledgment */}
            <section className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Acknowledgment</h2>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 p-6 rounded-xl">
                <p className="text-gray-800 font-medium mb-3">
                  By using MrDeveloper, you acknowledge that:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    You have read, understood, and agree to these Terms of Service
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    You have the legal capacity to enter into this agreement
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    You will comply with all applicable laws and regulations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    You understand the educational nature of our content and services
                  </li>
                </ul>
              </div>
            </section>

            {/* Footer Navigation */}
            <div className="text-center pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                This Terms of Service document is part of <strong>MrDeveloper</strong>&apos;s legal framework.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/PrivacyPolicy" className="text-blue-600 hover:underline flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  Privacy Policy
                </Link>
                <Link href="/Disclaimer" className="text-blue-600 hover:underline flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Disclaimer
                </Link>
                <Link href="/Contact" className="text-blue-600 hover:underline flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Contact Us
                </Link>
                <Link href="/" className="text-blue-600 hover:underline flex items-center gap-1">
                  <ExternalLink className="h-4 w-4" />
                  Back to Home
                </Link>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">
                  MrDeveloper - Web Development Education Platform<br />
                  Owned and operated by Prasanna Kumar Simhadri<br />
                  Making web development accessible to everyone since 2024
                </p>
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
          "name": "Terms of Service - MrDeveloper",
          "description": "Terms of Service for MrDeveloper web development tutorials and programming courses platform",
          "url": "https://www.mrdeveloper.in/terms-of-service",
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
          }
        })}
      </script>
    </div>
  );
}