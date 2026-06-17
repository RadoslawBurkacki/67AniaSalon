import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Gallery from '@/components/Gallery'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <About />

        {/* Booking CTA banner */}
        <section className="py-24 bg-background relative overflow-hidden">
          <div className="absolute inset-0 cta-bg" />
          <div className="relative section-container text-center">
            <p className="section-label mb-4">Ready?</p>
            <h2 className="heading-lg text-cream mb-6">
              Treat Yourself to<br /><span className="gold-text">Something Special</span>
            </h2>
            <p className="text-cream/40 max-w-sm mx-auto mb-10 text-sm leading-relaxed">
              Book your appointment online in minutes. We can&apos;t wait to welcome you.
            </p>
            <Link href="/booking" className="btn-primary text-sm">
              Book Your Appointment
            </Link>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </>
  )
}
