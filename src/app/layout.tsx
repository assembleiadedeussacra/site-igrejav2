import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Toaster from '@/components/ui/Toaster';
import ConsentAwareAnalytics from '@/components/analytics/ConsentAwareAnalytics';
import CookieConsent from '@/components/layout/CookieConsent';
import PwaServiceWorker from '@/components/pwa/ServiceWorkerRegistration';
import ChurchStructuredData from '@/components/seo/ChurchStructuredData';
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION, OG_IMAGE } from '@/lib/seo/constants';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Assembleia de Deus Sacramento/MG`,
    template: `%s | ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
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
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Assembleia de Deus Sacramento/MG`,
    description: 'Uma comunidade de fé dedicada a adorar a Deus e servir ao próximo. Venha nos conhecer!',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Assembleia de Deus Missão - Sacramento/MG',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Assembleia de Deus Sacramento/MG`,
    description: 'Uma comunidade de fé dedicada a adorar a Deus e servir ao próximo.',
    images: [OG_IMAGE],
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/xml': `${SITE_URL}/sitemap.xml`,
    },
  },
  category: 'religion',
  icons: {
    icon: [
      { url: '/images/logo-igreja.png', type: 'image/png' },
      { url: '/images/logo-igreja.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/logo-igreja.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/images/logo-igreja.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/images/logo-igreja.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/images/logo-igreja.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#232d82" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AD Sacramento" />
        <meta name="application-name" content="AD Missão Sacramento" />
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--color-accent)] focus:text-white focus:rounded-[10px] focus:outline-none focus:ring-2 focus:ring-white"
        >
          Pular para o conteúdo
        </a>
        <ChurchStructuredData />
        {children}
        <Toaster />
        <CookieConsent />
        <ConsentAwareAnalytics />
        <PwaServiceWorker />
      </body>
    </html>
  );
}
