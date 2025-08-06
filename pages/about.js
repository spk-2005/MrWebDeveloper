import React from 'react';

export default function About() {
  return (
    <div style={{ maxWidth: '900px', margin: 'auto', padding: '30px 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#333' }}>👨‍💻 About MrDeveloper</h1>
      
      <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '20px' }}>
        Welcome to <strong>MrDeveloper</strong> — a platform crafted with passion, purpose, and pixel-perfect precision by <strong>Prasanna Kumar Simhadri</strong>.
      </p>

      <h2 style={{ fontSize: '1.8rem', marginTop: '30px', color: '#444' }}>🚀 Who Am I?</h2>
      <p style={{ fontSize: '1rem', lineHeight: '1.7' }}>
        I'm a Computer Science & Engineering student  specializing in <strong>Data Science</strong>. Hailing from Chirala, I bring a curious mind, a problem-solving attitude, and a love for turning ideas into interactive, functional web applications.
      </p>

      <h2 style={{ fontSize: '1.8rem', marginTop: '30px', color: '#444' }}>💡 What Is MrDeveloper?</h2>
      <p style={{ fontSize: '1rem', lineHeight: '1.7' }}>
        MrDeveloper is more than just a website — it’s a tech playground. From frontend designs to backend integrations, this is where I share my passion, build cool projects, and connect with like-minded creators.
      </p>

      <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
        <li>🎯 Hands-on Projects in React.js, MongoDB, and Next.js</li>
        <li>📚 Guides, tutorials, and beginner-friendly resources</li>
        <li>🧩 Experiments with modern UI/UX and responsive layouts</li>
      </ul>

      <h2 style={{ fontSize: '1.8rem', marginTop: '30px', color: '#444' }}>🛠 Tech Stack</h2>
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

      <h2 style={{ fontSize: '1.8rem', marginTop: '30px', color: '#444' }}>📬 Let’s Connect</h2>
      <p style={{ fontSize: '1rem', lineHeight: '1.7' }}>
        Got feedback, a collaboration idea, or just want to say hi? Don’t hesitate to reach out.
      </p>
      <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
        <li>📧 Email: <a href="mailto:prasannasimha5002@gmail.com">prasannasimha5002@gmail.com</a></li>
        <li>📱 WhatsApp: <a href="https://wa.me/918309179509" target="_blank" rel="noopener noreferrer">Message me</a></li>
        <li>🌐 Website: <a href="https://www.mrdeveloper.in" target="_blank">mrdeveloper.in</a></li>
      </ul>

      <p style={{ marginTop: '30px', fontStyle: 'italic', color: '#666' }}>
        Thanks for visiting — let’s build something amazing together! 🚀
      </p>
    </div>
  );
}
