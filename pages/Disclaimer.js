import React from 'react';
import { AlertTriangle, ExternalLink, Link, Mail, Phone } from 'lucide-react';

export default function Disclaimer() {
  // SEO Meta data (you would typically set this in your document head)
  React.useEffect(() => {
    document.title = 'Disclaimer - MrDeveloper | Legal Information & Terms';
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Read MrDeveloper\'s disclaimer for important legal information about our educational content, external links, and liability limitations for web development tutorials.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Read MrDeveloper\'s disclaimer for important legal information about our educational content, external links, and liability limitations for web development tutorials.';
      document.head.appendChild(meta);
    }
    
    // Keywords meta tag
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'MrDeveloper disclaimer, legal information, web development tutorials, educational content, liability, external links, programming courses');
    } else {
      const keywords = document.createElement('meta');
      keywords.name = 'keywords';
      keywords.content = 'MrDeveloper disclaimer, legal information, web development tutorials, educational content, liability, external links, programming courses';
      document.head.appendChild(keywords);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold">Disclaimer</h1>
          </div>
          <p className="text-xl text-slate-300 mb-2">MrDeveloper Legal Information</p>
          <p className="text-sm text-slate-400">Last updated: August 06, 2025</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Introduction */}
            <section className="mb-10">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-6">
                <p className="text-lg leading-relaxed text-gray-800">
                  The information provided on <strong>MrDeveloper</strong> website is for general informational and educational purposes only. 
                  This disclaimer outlines important legal information regarding the use of our web development tutorials, 
                  programming courses, and educational content.
                </p>
              </div>
            </section>

            {/* No Legal or Professional Advice */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                No Legal or Professional Advice
              </h2>
              <div className="prose prose-lg text-gray-700">
                <p className="mb-4">
                  The content on this website, including but not limited to:
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Web development tutorials and guides</li>
                  <li>Programming language instructions (HTML, CSS, JavaScript, Python, C)</li>
                  <li>Technical documentation and code examples</li>
                  <li>Educational content and learning materials</li>
                </ul>
                <p>
                  <strong>Does not constitute legal, financial, professional, or technical advice.</strong> 
                  While we strive to provide accurate and up-to-date information, the rapidly evolving nature of 
                  web development technologies means that information may become outdated. Use all content at your own risk.
                </p>
              </div>
            </section>

            {/* External Links */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ExternalLink className="h-5 w-5 text-blue-600" />
                </div>
                External Links and Third-Party Content
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  MrDeveloper may contain links to third-party websites, tools, libraries, frameworks, and resources including:
                </p>
                <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">
                  <li>CDN links for CSS and JavaScript libraries</li>
                  <li>GitHub repositories and code examples</li>
                  <li>Documentation websites and official resources</li>
                  <li>Educational platforms and additional learning materials</li>
                </ul>
                <p className="text-gray-700 font-medium">
                  We are not responsible for the content, accuracy, availability, security, or practices of external sites. 
                  These links are provided for convenience and educational purposes only.
                </p>
              </div>
            </section>

            {/* Educational Content */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Educational Content Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                Our tutorials and code examples are designed for educational purposes. While we test our code examples, 
                we cannot guarantee they will work in all environments or meet all requirements. Always:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Test code thoroughly in your own development environment</li>
                <li>Follow security best practices for production applications</li>
                <li>Consult official documentation for the most current information</li>
                <li>Seek professional advice for commercial or critical applications</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                <p className="text-gray-800 font-medium mb-3">
                  <strong>Important Legal Notice:</strong>
                </p>
                <p className="text-gray-700">
                  MrDeveloper and its owner <strong>Prasanna Kumar Simhadri</strong> shall not be held liable for any direct, 
                  indirect, incidental, consequential, or punitive damages arising from or related to the use of our website, 
                  including but not limited to:
                </p>
                <ul className="list-disc list-inside mt-3 text-gray-700 space-y-1">
                  <li>Loss of data or corrupted files</li>
                  <li>Security vulnerabilities in implemented code</li>
                  <li>Downtime or performance issues</li>
                  <li>Commercial losses or missed opportunities</li>
                </ul>
              </div>
            </section>

            {/* Accuracy and Updates */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Content Accuracy and Updates</h2>
              <p className="text-gray-700">
                We make every effort to ensure the accuracy and relevance of our content. However, web development 
                technologies evolve rapidly, and information may become outdated. We reserve the right to modify, 
                update, or remove content without prior notice. Users are encouraged to verify information with 
                official sources and documentation.
              </p>
            </section>

            {/* Changes to Disclaimer */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Disclaimer</h2>
              <p className="text-gray-700">
                We may update this Disclaimer from time to time to reflect changes in our practices or legal requirements. 
                We will notify users of significant changes by updating the &quot;Last updated&quot; date at the top of this page. 
                Please review this disclaimer periodically.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Disclaimer or need clarification about our content, 
                  please contact us through any of the following methods:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a 
                        href="mailto:prasannasimha5002@gmail.com" 
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        aria-label="Send email to MrDeveloper"
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
                      <p className="text-sm text-gray-500">Phone</p>
                      <a 
                        href="tel:+918309179509" 
                        className="text-green-600 hover:text-green-800 font-medium"
                        aria-label="Call MrDeveloper"
                      >
                        +91 8309179509
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer Note */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                This disclaimer is part of <strong>MrDeveloper</strong>&apos;s legal documentation. 
                For more information, visit our <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link> and 
                <Link href="/terms-of-service" className="text-blue-600 hover:underline ml-1">Terms of Service</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}