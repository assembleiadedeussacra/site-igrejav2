/**
 * Sistema de monitoramento de performance
 * Rastreia Core Web Vitals e métricas customizadas
 */

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  
  // Métricas customizadas
  pageLoadTime?: number;
  domContentLoaded?: number;
  timeToInteractive?: number;
}

/**
 * Rastreia Core Web Vitals
 */
export function trackWebVitals(metric: any) {
  // Enviar para analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Log em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Web Vital:', metric.name, Math.round(metric.value), 'ms');
  }
}

/**
 * Rastreia tempo de carregamento da página
 */
export function trackPageLoad() {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;

    if (navigation) {
      const metrics = {
        pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        ttfb: navigation.responseStart - navigation.requestStart,
        fcp: 0, // Será preenchido pelo web-vitals
      };

      // Enviar para analytics
      if (window.gtag) {
        window.gtag('event', 'page_load', {
          page_load_time: Math.round(metrics.pageLoadTime),
          dom_content_loaded: Math.round(metrics.domContentLoaded),
          ttfb: Math.round(metrics.ttfb),
        });
      }

      // Log em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Page Load Metrics:', metrics);
      }
    }
  });
}

/**
 * Hook para rastrear performance de componentes
 */
export function measureComponentPerformance(componentName: string) {
  if (typeof window === 'undefined') return () => {};

  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (window.gtag) {
      window.gtag('event', 'component_render', {
        component_name: componentName,
        render_time: Math.round(duration),
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${componentName} render:`, Math.round(duration), 'ms');
    }
  };
}
