import React from 'react'
import { motion } from 'framer-motion'
import { Rocket, GraduationCap, Laptop, ShieldCheck, Code2, Sparkles } from 'lucide-react'

const pillars = [
  {
    title: 'Practical, Project‑First Learning',
    desc: 'Build real components and mini‑projects while you learn the fundamentals so concepts stick for the long run.',
    icon: Code2,
  },
  {
    title: 'Crystal‑Clear Explanations',
    desc: 'Short, focused lessons that explain the “why”, not just the “how”, so you can apply skills in real work.',
    icon: GraduationCap,
  },
  {
    title: 'Learn Anywhere',
    desc: 'Responsive layouts and examples designed to work great on mobile, tablet, and desktop for learning on the go.',
    icon: Laptop,
  },
  {
    title: 'Free Forever. No Setup.',
    desc: 'Jump straight into coding—no installations required. Explore, experiment, and grow at your pace.',
    icon: ShieldCheck,
  },
]
export default function Ouraim() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
      <div className="absolute -top-40 left-1/2 -z-10 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-200/70 via-fuchsia-200/60 to-cyan-200/60 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Our Aim at <span className="font-semibold">MrDeveloper</span>
        </motion.p>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl"
        >
          From <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Zero to Hero</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg"
        >
          We exist to make modern web development simple, practical and accessible to everyone. Our goal is to guide learners
          to master <strong>HTML</strong>, <strong>CSS</strong>, <strong>JavaScript</strong>, <strong>Tailwind CSS</strong>, <strong>Python</strong>, <strong>C</strong> and more—through
          hands‑on tutorials, real‑world examples, and clean explanations that work perfectly across devices.
        </motion.p>

        {/* Pillars */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 * i }}
              className="group relative h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 inline-flex rounded-xl bg-slate-50 p-3 ring-1 ring-inset ring-slate-200">
                <p.icon className="h-6 w-6 text-slate-700 transition group-hover:scale-110" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex flex-wrap items-center gap-3"
        >
          <a
            href="https://www.mrdeveloper.in/"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Start Learning Now
            <Rocket className="ml-2 h-4 w-4" />
          </a>

          <a
            href="https://www.mrdeveloper.in/about"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400"
          >
            About Us
          </a>

          <a
            href="https://www.mrdeveloper.in/contact"
            className="inline-flex items-center justify-center rounded-2xl border border-transparent bg-white px-5 py-3 text-sm font-medium text-slate-700 underline-offset-4 hover:underline"
          >
            Contact
          </a>
        </motion.div>
      </div>
    </section>
  )
}

