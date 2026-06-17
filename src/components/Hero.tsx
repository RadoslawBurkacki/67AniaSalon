'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

const floatingParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 4,
  duration: Math.random() * 6 + 8,
}))

const wordVariants = {
  hidden: { opacity: 0, y: 60, skewY: 3 },
  visible: (i: number) => ({
    opacity: 1, y: 0, skewY: 0,
    transition: { delay: 0.1 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  const scrollToServices = () => {
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">

      {/* Background gradient — adapts to theme via CSS class */}
      <div className="absolute inset-0 hero-bg" />

      {/* Gold horizontal line accents */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 0.8, ease: 'easeInOut' }}
        className="absolute top-1/3 left-0 right-0 h-px bg-gold/10 origin-left"
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 1.0, ease: 'easeInOut' }}
        className="absolute bottom-1/3 left-0 right-0 h-px bg-gold/10 origin-right"
      />

      {/* Floating gold particles */}
      {floatingParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold/20 pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            y: [-15, 15, -15],
            opacity: [0.1, 0.5, 0.1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Corner ornaments */}
      <div className="absolute top-24 left-6 md:left-12 w-16 h-16 border-t border-l border-gold/20" />
      <div className="absolute top-24 right-6 md:right-12 w-16 h-16 border-t border-r border-gold/20" />
      <div className="absolute bottom-16 left-6 md:left-12 w-16 h-16 border-b border-l border-gold/20" />
      <div className="absolute bottom-16 right-6 md:right-12 w-16 h-16 border-b border-r border-gold/20" />

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">

        {/* Pre-label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="section-label mb-8"
        >
          Nails &amp; Massage Salon
        </motion.p>

        {/* Main heading */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            className="heading-xl"
            aria-label="Where Beauty Meets Tranquility"
          >
            {['Where', 'Beauty', 'Meets'].map((word, i) => (
              <motion.span
                key={word}
                custom={i}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                className="inline-block mr-[0.3em] last:mr-0"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        <div className="overflow-hidden mb-10">
          <motion.div
            custom={3}
            variants={wordVariants}
            initial="hidden"
            animate="visible"
            className="heading-xl gold-text"
          >
            Tranquility
          </motion.div>
        </div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-cream/50 text-base md:text-lg max-w-md mx-auto leading-relaxed mb-12 font-light"
        >
          Expert nail artistry and restorative massage in a calm, elegant space crafted just for you.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/booking" className="btn-primary">
            Book Appointment
          </Link>
          <button
            onClick={() => document.querySelector('#gallery')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-outline"
          >
            View Our Work
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex justify-center gap-12 mt-20"
        >
          {[
            { value: '500+', label: 'Happy Clients' },
            { value: '5★', label: 'Average Rating' },
            { value: '10+', label: 'Years Experience' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-2xl md:text-3xl text-gold font-light">{stat.value}</div>
              <div className="text-cream/40 text-xs tracking-wider uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToServices}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/50 hover:text-gold transition-colors"
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.button>
    </section>
  )
}
