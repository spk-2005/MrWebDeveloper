import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white p-4 mt-10">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p>&copy; {new Date().getFullYear()} MrDeveloper. All rights reserved.</p>
        <div className="space-x-6">
          <Link href="/about" className="hover:underline">About Us</Link>
          <Link href="/Contact" className="hover:underline">Contact</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
          <Link href="/PrivacyPolicy" className="hover:underline">Privacy Policy</Link>
          <Link href="/Disclaimer" className="hover:underline">Disclaimer</Link>
        </div>
      </div>
    </footer>
  );
}
