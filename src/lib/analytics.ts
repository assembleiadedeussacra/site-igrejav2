/**
 * Sistema de Analytics
 * Suporta Google Analytics 4 e outros serviços
 */

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Inicializa Google Analytics 4
 */
export function initGA(measurementId: string) {
  if (typeof window === 'undefined') return;

  // Carregar script do GA4
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Inicializar dataLayer e gtag
  if (!window.dataLayer) {
    window.dataLayer = [];
  }
  window.gtag = function gtag(...args: any[]) {
    if (window.dataLayer) {
      window.dataLayer.push(args);
    }
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_path: window.location.pathname,
  });
}

/**
 * Rastreia um evento
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
) {
  if (typeof window === 'undefined' || !window.gtag) {
    // Em desenvolvimento, apenas loga
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Event:', eventName, properties);
    }
    return;
  }

  window.gtag('event', eventName, properties);
}

/**
 * Rastreia visualização de página
 */
export function trackPageView(path: string, title?: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
    page_path: path,
    page_title: title,
  });
}

/**
 * Eventos pré-definidos para facilitar o uso
 */
export const AnalyticsEvents = {
  // Navegação
  pageView: (path: string, title?: string) => trackPageView(path, title),
  
  // Posts
  postView: (postId: string, postTitle: string, postType: 'blog' | 'study') =>
    trackEvent('post_view', {
      post_id: postId,
      post_title: postTitle,
      post_type: postType,
    }),
  
  postShare: (postId: string, method: string) =>
    trackEvent('post_share', {
      post_id: postId,
      share_method: method,
    }),
  
  // Busca
  search: (query: string, resultsCount: number) =>
    trackEvent('search', {
      search_term: query,
      results_count: resultsCount,
    }),
  
  // Contato
  contactFormSubmit: () => trackEvent('contact_form_submit'),
  
  // Downloads
  download: (fileName: string, fileType: string) =>
    trackEvent('file_download', {
      file_name: fileName,
      file_type: fileType,
    }),
  
  // Conversões
  donationClick: (amount?: number) =>
    trackEvent('donation_click', { amount }),
  
  // Erros
  error: (errorMessage: string, errorType: string) =>
    trackEvent('error', {
      error_message: errorMessage,
      error_type: errorType,
    }),
};
