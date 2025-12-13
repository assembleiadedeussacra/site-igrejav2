'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initGA, trackPageView } from '@/lib/analytics';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Inicializar GA apenas uma vez
    if (GA_MEASUREMENT_ID && typeof window !== 'undefined') {
      if (!window.gtag) {
        initGA(GA_MEASUREMENT_ID);
      }
    }
  }, []);

  useEffect(() => {
    // Rastrear mudanças de página
    if (GA_MEASUREMENT_ID && pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  // Não renderiza nada
  return null;
}
