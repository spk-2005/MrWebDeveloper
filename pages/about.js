import React from 'react';
import Head from 'next/head'; // if using Next.js
// If CRA -> import { Helmet } from "react-helmet";

export default function About() {
  return (
    <>
      <Head>
        <title>About MrDeveloper | Prasanna Kumar Simhadri</title>
        <meta
          name="description"
          content="Learn more about MrDeveloper, a tech playground by Prasanna Kumar Simhadri. Explore React.js, MongoDB, Node.js, tutorials, and modern web development projects."
        />
        <meta
          name="keywords"
          content="MrDeveloper,Mr Developer, Prasanna Kumar, web development, React, MongoDB, Node.js, full stack developer, data science, coding tutorials"
        />
        <meta name="author" content="Prasanna Kumar Simhadri" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.mrdeveloper.in/about" />

        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "MrDeveloper",
              url: "https://www.mrdeveloper.in",
              logo: "https://www.mrdeveloper.in/logo.png",
              founder: {
                "@type": "Person",
                name: "Prasanna Kumar Simhadri",
              },
              sameAs: [
                "mailto:prasannasimha5002@gmail.com",
                "https://wa.me/918309179509",
                "https://www.mrdeveloper.in",
              ],
            }),
          }}
        />
      </Head>

      <div
        style={{
          maxWidth: '900px',
          margin: 'auto',
          padding: '30px 20px',
          fontFamily: 'sans-serif',
        }}
      >
        <h1
          style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#333' }}
        >
          👨‍💻 About MrDeveloper
        </h1>

        <p
          style={{
            fontSize: '1.1rem',
            lineHeight: '1.8',
            marginBottom: '20px',
          }}
        >
          Welcome to <strong>MrDeveloper</strong> — a platform crafted with
          passion, purpose, and pixel-perfect precision by{' '}
          <strong>Prasanna Kumar Simhadri</strong>.
        </p>

        <h2 style={{ fontSize: '1.8rem', marginTop: '30px', color: '#444' }}>
          🚀 Who Am I?
        </h2>
        <p style={{ fontSize: '1rem', lineHeight: '1.7' }}>
          I&apos;m a Computer Science & Engineering student specializing in{' '}
          <strong>Data Science</strong>. Hailing from Chirala, I bring a curious
          mind, a problem-solving attitude, and a love for turning ideas into
          interactive, functional web applications.
        </p>

        <h2 style={{ fontSize: '1.8rem', marginTop: '30px', color: '#444' }}>
          💡 What Is MrDeveloper?
        </h2>
        <p style={{ fontSize: '1rem', lineHeight: '1.7' }}>
          MrDeveloper is more than just a website — it&apos;s a tech playground.
          From frontend designs to backend integrations, this is where I share
          my passion, build cool projects, and connect with like-minded
          creators.
        </p>

        <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>🎯 Hands-on Projects in React.js, MongoDB, and Next.js</li>
          <li>📚 Guides, tutorials, and beginner-friendly resources</li>
          <li>🧩 Experiments with modern UI/UX and responsive layouts</li>
        </ul>

        <h2 style={{ fontSize: '1.8rem', marginTop: '30px', color: '#444' }}>
          🛠 Tech Stack
        </h2>
        <p style={{ fontSize: '1rem', lineHeight: '1.7' }}>
          I work with modern tools and libraries including:
        </p>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>React.js ⚛️</li>
          <li>MongoDB 🍃</li>
          <li>Node.js & Express ⚙️</li>
          <li>Tailwind CSS 🎨</li>
          <li>Vercel for Deployment 🚀</li>
          <li>Airtable for data management 📊</li>
          <li>And many more...</li>
        </ul>

        <h2 style={{ fontSize: '1.8rem', marginTop: '30px', color: '#444' }}>
          📬 Let&apos;s Connect
        </h2>
        <p style={{ fontSize: '1rem', lineHeight: '1.7' }}>
          Got feedback, a collaboration idea, or just want to say hi? Don&apos;t
          hesitate to reach out.
        </p>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>
            📧 Email:{' '}
            <a href="mailto:prasannasimha5002@gmail.com">
              prasannasimha5002@gmail.com
            </a>
          </li>
          <li>
            📱 WhatsApp:{' '}
            <a
              href="https://wa.me/918309179509"
              target="_blank"
              rel="noopener noreferrer"
            >
              Message me
            </a>
          </li>
          <li>
            🌐 Website:{' '}
            <a href="https://www.mrdeveloper.in" target="_blank">
              mrdeveloper.in
            </a>
          </li>
        </ul>

        <p
          style={{ marginTop: '30px', fontStyle: 'italic', color: '#666' }}
        >
          Thanks for visiting — let&apos;s build something amazing together! 🚀
        </p>
      </div>
    </>
  );
}
