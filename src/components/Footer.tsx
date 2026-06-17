'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Instagram, Facebook } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-background border-t border-border py-16">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div>
            <div className="font-serif text-2xl mb-4">
              <span className="gold-text">Ania</span>
              <span className="text-cream/40 text-sm tracking-[0.25em] ml-2 uppercase font-sans">Salon</span>
            </div>
            <p className="text-cream/40 text-sm leading-relaxed max-w-xs">
              Expert nail artistry and restorative massage. Your moment of calm awaits.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" aria-label="Instagram" className="w-9 h-9 border border-gold/20 hover:border-gold flex items-center justify-center text-gold/50 hover:text-gold transition-all duration-300">
                <Instagram size={15} />
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 border border-gold/20 hover:border-gold flex items-center justify-center text-gold/50 hover:text-gold transition-all duration-300">
                <Facebook size={15} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-cream text-xs tracking-[0.2em] uppercase mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Services', href: '#services' },
                { label: 'Gallery', href: '#gallery' },
                { label: 'About', href: '#about' },
                { label: 'Contact', href: '#contact' },
                { label: 'Book Appointment', href: '/booking' },
              ].map(({ label, href }) => (
                <li key={label}>
                  {href.startsWith('#') ? (
                    <button
                      onClick={() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })}
                      className="text-cream/40 hover:text-gold text-sm transition-colors duration-300"
                    >
                      {label}
                    </button>
                  ) : (
                    <Link href={href} className="text-cream/40 hover:text-gold text-sm transition-colors duration-300">
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Booking CTA */}
          <div>
            <h4 className="text-cream text-xs tracking-[0.2em] uppercase mb-5">Book Online</h4>
            <p className="text-cream/40 text-sm mb-6 leading-relaxed">
              Ready to treat yourself? Book your appointment online — it only takes a minute.
            </p>
            <Link href="/booking" className="btn-outline text-xs py-3 px-6">
              Book Now
            </Link>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-cream/25 text-xs">&copy; {year} Ania&apos;s Salon. All rights reserved.</p>
          <Link href="/admin" className="text-cream/20 hover:text-cream/40 text-xs transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
