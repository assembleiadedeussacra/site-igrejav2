'use client';

import { Analytics } from '@vercel/analytics/next';
import { useAnalyticsConsent } from '@/components/layout/CookieConsent';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import PerformanceMonitor from '@/components/analytics/PerformanceMonitor';
import PageViewTracker from '@/components/analytics/PageViewTracker';

export default function ConsentAwareAnalytics() {
    const consented = useAnalyticsConsent();

    if (!consented) return null;

    return (
        <>
            <GoogleAnalytics />
            <PerformanceMonitor />
            <PageViewTracker />
            <Analytics />
        </>
    );
}
