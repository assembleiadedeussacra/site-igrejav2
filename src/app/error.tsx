'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by error boundary:', error);
    }
    
    // TODO: Send to error tracking service (Sentry, etc) in production
    // if (process.env.NODE_ENV === 'production') {
    //   // Send to error tracking
    // }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-6">
          <svg
            className="w-24 h-24 mx-auto text-[var(--color-accent)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-[var(--color-accent)] mb-4">
          Ops! Algo deu errado
        </h1>
        
        <p className="text-[var(--color-text-secondary)] mb-6 text-lg">
          Pedimos desculpas pelo inconveniente. Nossa equipe foi notificada e está trabalhando para resolver o problema.
        </p>
        
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[10px] text-left">
            <p className="text-sm text-red-800 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-[10px] hover:bg-[var(--color-accent-light)] transition-colors font-semibold"
          >
            Tentar Novamente
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-white border-2 border-[var(--color-accent)] text-[var(--color-accent)] rounded-[10px] hover:bg-[var(--color-primary-light)] transition-colors font-semibold"
          >
            Ir para Home
          </button>
        </div>
      </div>
    </div>
  );
}
