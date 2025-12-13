import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Toaster from '@/components/ui/Toaster';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import PerformanceMonitor from '@/components/analytics/PerformanceMonitor';
import PwaServiceWorker from '@/components/pwa/ServiceWorkerRegistration';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://assembleiasacramento.vercel.app'),
  title: {
    default: 'Assembleia de Deus Missão - Sacramento/MG',
    template: '%s | Assembleia de Deus Missão Sacramento',
  },
  description:
    'Website oficial da Igreja Assembleia de Deus Missão de Sacramento MG. Encontre informações sobre cultos, eventos, departamentos e mais. Uma comunidade de fé dedicada a adorar a Deus e servir ao próximo.',
  keywords: [
    'Assembleia de Deus',
    'Missão',
    'Sacramento MG',
    'Igreja',
    'Evangélica',
    'Cultos',
    'Eventos',
    'Igreja em Sacramento',
    'AD Missão',
  ],
  authors: [{ name: 'Assembleia de Deus Missão' }],
  creator: 'Assembleia de Deus Missão',
  publisher: 'Assembleia de Deus Missão',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://assembleiasacramento.vercel.app',
    siteName: 'Assembleia de Deus Missão - Sacramento/MG',
    title: 'Assembleia de Deus Missão - Sacramento/MG',
    description:
      'Uma comunidade de fé dedicada a adorar a Deus e servir ao próximo. Venha nos conhecer!',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Assembleia de Deus Missão - Sacramento/MG',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Assembleia de Deus Missão - Sacramento/MG',
    description:
      'Uma comunidade de fé dedicada a adorar a Deus e servir ao próximo.',
    images: ['/images/og-image.jpg'],
  },
  verification: {
    // google: 'your-google-verification-code',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://assembleiasacramento.vercel.app',
  },
  category: 'religion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <link rel="icon" href="/images/logo-igreja.jpg" type="image/jpeg" sizes="any" />
        <link rel="apple-touch-icon" href="/images/logo-igreja.jpg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#232d82" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AD Sacramento" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Church',
              name: 'Assembleia de Deus Missão de Sacramento MG',
              description:
                'Uma comunidade de fé dedicada a adorar a Deus e servir ao próximo.',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Rua Carlos R da Cunha n° 90',
                addressLocality: 'Sacramento',
                addressRegion: 'MG',
                postalCode: '38190-000',
                addressCountry: 'BR',
              },
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://assembleiasacramento.vercel.app',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://assembleiasacramento.vercel.app'}/images/logo-igreja.jpg`,
              sameAs: ['https://www.instagram.com/assembleiasacramento/'],
              telephone: '+55-34-98432-7019',
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: 'Tuesday',
                  opens: '19:30',
                  closes: '21:00',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: 'Thursday',
                  opens: '19:30',
                  closes: '21:00',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: 'Sunday',
                  opens: '09:00',
                  closes: '10:30',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: 'Sunday',
                  opens: '19:00',
                  closes: '21:00',
                },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Toaster />
        <GoogleAnalytics />
        <PerformanceMonitor />
        <PwaServiceWorker />
      </body>
    </html>
  );
}
