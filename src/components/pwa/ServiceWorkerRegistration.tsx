'use client';

import { useEffect } from 'react';

/**
 * Componente para registrar Service Worker
 * Permite funcionalidade offline e PWA
 */
export default function PwaServiceWorker() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      // Registrar service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado com sucesso:', registration.scope);
          
          // Verificar atualizações periodicamente
          setInterval(() => {
            registration.update();
          }, 60000); // A cada minuto
        })
        .catch((error) => {
          console.error('Erro ao registrar Service Worker:', error);
        });

      // Escutar mensagens do service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Mensagem do Service Worker:', event.data);
      });
    }
  }, []);

  return null;
}
