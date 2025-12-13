'use client';

import { useEffect } from 'react';
import { trackPageLoad } from '@/lib/performance';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Rastrear Core Web Vitals usando web-vitals library
    if (typeof window !== 'undefined') {
      // Carregar web-vitals dinamicamente
      import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        onCLS((metric) => {
          // Cumulative Layout Shift
          if (window.gtag) {
            window.gtag('event', 'web_vital', {
              event_category: 'Web Vitals',
              event_label: 'CLS',
              value: Math.round(metric.value * 1000),
              non_interaction: true,
            });
          }
        });

        onINP((metric) => {
          // Interaction to Next Paint (substitui FID na v3+)
          if (window.gtag) {
            window.gtag('event', 'web_vital', {
              event_category: 'Web Vitals',
              event_label: 'INP',
              value: Math.round(metric.value),
              non_interaction: true,
            });
          }
        });

        onFCP((metric) => {
          // First Contentful Paint
          if (window.gtag) {
            window.gtag('event', 'web_vital', {
              event_category: 'Web Vitals',
              event_label: 'FCP',
              value: Math.round(metric.value),
              non_interaction: true,
            });
          }
        });

        onLCP((metric) => {
          // Largest Contentful Paint
          if (window.gtag) {
            window.gtag('event', 'web_vital', {
              event_category: 'Web Vitals',
              event_label: 'LCP',
              value: Math.round(metric.value),
              non_interaction: true,
            });
          }
        });

        onTTFB((metric) => {
          // Time to First Byte
          if (window.gtag) {
            window.gtag('event', 'web_vital', {
              event_category: 'Web Vitals',
              event_label: 'TTFB',
              value: Math.round(metric.value),
              non_interaction: true,
            });
          }
        });
      }).catch(() => {
        // Se web-vitals não estiver disponível, usar fallback
        trackPageLoad();
      });

      // Fallback: rastrear page load básico
      trackPageLoad();
    }
  }, []);

  return null;
}
