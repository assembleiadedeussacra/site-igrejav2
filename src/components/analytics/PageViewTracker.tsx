'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnalyticsEvents } from '@/lib/analytics';

export default function PageViewTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Skip tracking for admin pages
        if (pathname?.startsWith('/admin')) {
            return;
        }

        // Generate or get session ID
        const getSessionId = () => {
            let sessionId = sessionStorage.getItem('session_id');
            if (!sessionId) {
                sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
                sessionStorage.setItem('session_id', sessionId);
            }
            return sessionId;
        };

        const trackPageView = async () => {
            try {
                const sessionId = getSessionId();
                const pageTitle = document.title;
                const referrer = document.referrer || null;
                const userAgent = navigator.userAgent;

                // Track in our database
                await fetch('/api/analytics/pageview', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        page_path: pathname,
                        page_title: pageTitle,
                        referrer,
                        user_agent: userAgent,
                        session_id: sessionId,
                        viewport_width: window.innerWidth,
                    }),
                });

                // Track in Google Analytics (if configured)
                AnalyticsEvents.pageView(pathname || '/', pageTitle);
            } catch (error) {
                // Silently fail - don't break the user experience
                console.error('Error tracking page view:', error);
            }
        };

        // Small delay to ensure page is fully loaded
        const timeoutId = setTimeout(trackPageView, 100);

        return () => clearTimeout(timeoutId);
    }, [pathname]);

    return null;
}
