import type { Metadata, Viewport } from 'next'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import { SiteConfigProvider } from '@/components/SiteConfigProvider'
import { getSiteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Anya\'s Salon — Nails & Massage',
  description: 'Luxury nail and massage salon. Expert manicures, pedicures, gel nails, and therapeutic massage treatments. Book your appointment online.',
  keywords: 'nail salon, massage, manicure, pedicure, gel nails, acrylic nails, Swedish massage, deep tissue',
  openGraph: {
    title: 'Anya\'s Salon — Nails & Massage',
    description: 'Luxury nail and massage salon. Book your appointment online.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteConfig = await getSiteConfig()

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);})();`,
          }}
        />
      </head>
      <body className="bg-background text-cream antialiased">
        <ThemeProvider>
          <SiteConfigProvider initialConfig={siteConfig}>
            {children}
          </SiteConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
