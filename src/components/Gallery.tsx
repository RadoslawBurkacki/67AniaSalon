'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const galleryItems = [
  { id: 1, src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80', alt: 'Gel nail design', category: 'Nails', span: 'col-span-1 row-span-2' },
  { id: 2, src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80', alt: 'Nail art close-up', category: 'Nails', span: 'col-span-1 row-span-1' },
  { id: 3, src: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80', alt: 'Relaxation massage', category: 'Massage', span: 'col-span-1 row-span-1' },
  { id: 4, src: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80', alt: 'Hot stone therapy', category: 'Massage', span: 'col-span-1 row-span-2' },
  { id: 5, src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80', alt: 'Acrylic nail set', category: 'Nails', span: 'col-span-1 row-span-1' },
  { id: 6, src: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80', alt: 'Pedicure treatment', category: 'Nails', span: 'col-span-1 row-span-1' },
  { id: 7, src: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80', alt: 'Deep tissue massage', category: 'Massage', span: 'col-span-2 row-span-1' },
  { id: 8, src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80', alt: 'Nail design detail', category: 'Nails', span: 'col-span-1 row-span-1' },
]

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [filter, setFilter] = useState<'All' | 'Nails' | 'Massage'>('All')

  const filtered = filter === 'All' ? galleryItems : galleryItems.filter(i => i.category === filter)

  const prev = () => setLightboxIndex(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null)
  const next = () => setLightboxIndex(i => i !== null ? (i + 1) % filtered.length : null)

  return (
    <section id="gallery" className="py-28 bg-surface">
      <div className="section-container">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label mb-4"
          >
            Portfolio
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="heading-lg"
          >
            Our <span className="gold-text">Work</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-16 h-px bg-gold mx-auto mt-6"
          />
        </div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center gap-2 mb-10"
        >
          {(['All', 'Nails', 'Massage'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 text-xs tracking-wider uppercase transition-all duration-300 ${
                filter === cat
                  ? 'text-gold border-b border-gold'
                  : 'text-cream/40 hover:text-cream/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Gallery grid */}
        <AnimatePresence>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 auto-rows-[200px]">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`relative overflow-hidden cursor-pointer group bg-elevated ${
                  i === 0 ? 'row-span-2' : i === 3 ? 'row-span-2' : i === 6 ? 'col-span-2' : ''
                }`}
                onClick={() => setLightboxIndex(i)}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-all duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-xs text-gold tracking-wider uppercase border border-gold/50 px-3 py-1">{item.category}</span>
                  <span className="text-cream/80 text-sm mt-2">{item.alt}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-cream/30 text-xs mt-8 tracking-wider"
        >
          Replace with your own photos — see the setup guide
        </motion.p>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full aspect-[4/3]"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={filtered[lightboxIndex].src.replace('w=400', 'w=1200').replace('w=600', 'w=1200')}
                alt={filtered[lightboxIndex].alt}
                fill
                className="object-contain"
              />
            </motion.div>

            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 text-cream/60 hover:text-gold transition-colors"
            >
              <X size={28} />
            </button>
            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/60 hover:text-gold transition-colors">
              <ChevronLeft size={36} />
            </button>
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/60 hover:text-gold transition-colors">
              <ChevronRight size={36} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-cream/40 text-sm">
              {lightboxIndex + 1} / {filtered.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
