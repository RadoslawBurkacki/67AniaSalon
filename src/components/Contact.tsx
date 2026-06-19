'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useSiteConfig } from '@/components/SiteConfigProvider'

export default function Contact() {
  const cfg = useSiteConfig()

  const hours = [
    { days: 'Monday – Friday', times: cfg.hoursMon },
    { days: 'Saturday', times: cfg.hoursSat },
    { days: 'Sunday', times: cfg.hoursSun },
  ]

  const phoneHref = `tel:${cfg.phone.replace(/\s/g, '')}`
  const emailHref = `mailto:${cfg.email}`

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
                  { Icon: MapPin, label: 'Address', value: cfg.address },
                  { Icon: Phone, label: 'Phone', value: cfg.phone, href: phoneHref },
                  { Icon: Mail, label: 'Email', value: cfg.email, href: emailHref },
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

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative min-h-[400px] bg-elevated border border-border overflow-hidden"
          >
            <iframe
              src={cfg.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              className="absolute inset-0 map-iframe"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Salon location map"
            />
            <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm border border-gold/30 px-4 py-2 pointer-events-none">
              <p className="text-gold text-xs tracking-wider uppercase">Anya&apos;s Salon</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
