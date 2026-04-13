import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    template: '%s | SEC-593',
    default:  'SEC-593 — Alexander González',
  },
  description:
    'Pentesting, write-ups HTB/TryHackMe, investigación ML/IA y metodologías de ciberseguridad.',
  keywords: ['pentesting', 'ciberseguridad', 'machine learning', 'HTB', 'TryHackMe', 'write-ups'],
  authors: [{ name: 'Alexander González' }],
  openGraph: {
    type:        'website',
    locale:      'es_EC',
    url:         'https://alexandergrg.github.io',
    siteName:    'SEC-593',
    title:       'SEC-593 — Alexander González',
    description: 'Pentesting · ML Research · Security Engineering',
  },
  twitter: {
    card:  'summary_large_image',
    title: 'SEC-593 — Alexander González',
  },
  robots: { index: true, follow: true },
  icons: {
    icon:    '/logos/sec593-favicon.svg',
    apple:   '/logos/sec593-avatar.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col" style={{ backgroundColor: '#09090b', color: '#f4f4f5' }}>
        <Nav />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
