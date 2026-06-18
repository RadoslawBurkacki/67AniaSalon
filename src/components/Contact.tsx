'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const hours = [
  { days: 'Monday – Friday', times: '9:00 AM – 6:00 PM' },
  { days: 'Saturday', times: '9:00 AM – 5:00 PM' },
  { days: 'Sunday', times: 'Closed' },
]

export default function Contact() {
  return (
    <section id="contact" className="py-28 bg-surface">
      <div className="section-container">

        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label mb-4"
          >
            Find Us
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="heading-lg"
          >
            Get in <span className="gold-text">Touch</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Contact details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-serif text-xl text-cream mb-6">Contact Information</h3>
              <div className="space-y-5">
                {[
                  { Icon: MapPin, label: 'Address', value: '123 Beauty Lane\nYour Town, AB12 3CD' },
                  { Icon: Phone, label: 'Phone', value: '+44 7700 000000', href: 'tel:+447700000000' },
                  { Icon: Mail, label: 'Email', value: 'hello@aniasalon.com', href: 'mailto:hello@aniasalon.com' },
                ].map(({ Icon, label, value, href }) => (
                  <div key={label} className="flex gap-4 group">
                    <div className="w-10 h-10 border border-gold/20 group-hover:border-gold/50 flex items-center justify-center shrink-0 transition-colors duration-300">
                      <Icon size={16} className="text-gold" />
                    </div>
                    <div>
                      <div className="text-cream/40 text-xs tracking-wider uppercase mb-0.5">{label}</div>
                      {href ? (
                        <a href={href} className="text-cream/80 hover:text-gold transition-colors whitespace-pre-line text-sm">
                          {value}
                        </a>
                      ) : (
                        <p className="text-cream/80 whitespace-pre-line text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opening hours */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Clock size={16} className="text-gold" />
                <h3 className="font-serif text-xl text-cream">Opening Hours</h3>
              </div>
              <div className="space-y-3">
                {hours.map(({ days, times }) => (
                  <div key={days} className="flex justify-between border-b border-border pb-3">
                    <span className="text-cream/60 text-sm">{days}</span>
                    <span className={`text-sm ${times === 'Closed' ? 'text-cream/30' : 'text-gold'}`}>{times}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative min-h-[400px] bg-elevated border border-border overflow-hidden"
          >
            {/* Replace this iframe src with your actual Google Maps embed URL */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.944!2d-0.1276!3d51.5074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDMwJzI2LjYiTiAwwrAwNyc0MS43Ilc!5e0!3m2!1sen!2suk!4v0"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              className="absolute inset-0 map-iframe"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Salon location map"
            />

            {/* Overlay label */}
            <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm border border-gold/30 px-4 py-2 pointer-events-none">
              <p className="text-gold text-xs tracking-wider uppercase">Anya&apos;s Salon</p>
              <p className="text-cream/60 text-xs mt-0.5">Update map URL in Contact.tsx</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
