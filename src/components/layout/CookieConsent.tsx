'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';
import {
    COOKIE_CONSENT_EVENT,
    getCookieConsent,
    setCookieConsent,
    type CookieConsentValue,
} from '@/lib/cookieConsent';

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(getCookieConsent() === null);
    }, []);

    const respond = (value: CookieConsentValue) => {
        setCookieConsent(value);
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            role="dialog"
            aria-labelledby="cookie-consent-title"
            aria-describedby="cookie-consent-desc"
            className="fixed bottom-0 inset-x-0 z-[60] p-4 sm:p-6 safe-bottom"
        >
            <div className="container-custom max-w-4xl mx-auto">
                <div className="bg-white rounded-[10px] shadow-2xl border border-gray-100 p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
                    <div className="flex gap-4 flex-1">
                        <div className="hidden sm:flex w-12 h-12 rounded-[10px] bg-[var(--color-primary)]/20 items-center justify-center flex-shrink-0">
                            <Cookie className="w-6 h-6 text-[var(--color-accent)]" />
                        </div>
                        <div>
                            <h2
                                id="cookie-consent-title"
                                className="type-card-title text-[var(--color-accent)] mb-1"
                            >
                                Privacidade e cookies
                            </h2>
                            <p
                                id="cookie-consent-desc"
                                className="text-sm text-[var(--color-text-secondary)] leading-relaxed"
                            >
                                Utilizamos cookies e ferramentas de análise (Google Analytics e
                                Vercel Analytics) para melhorar sua experiência. Você pode aceitar
                                ou recusar o uso de cookies analíticos.{' '}
                                <Link
                                    href="/privacidade"
                                    className="text-[var(--color-accent)] underline hover:no-underline"
                                >
                                    Saiba mais
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:flex-shrink-0">
                        <button
                            type="button"
                            onClick={() => respond('rejected')}
                            className="px-5 py-2.5 rounded-[30px] border border-gray-200 text-[var(--color-text-secondary)] font-medium hover:bg-gray-50 transition-colors text-sm"
                        >
                            Recusar
                        </button>
                        <button
                            type="button"
                            onClick={() => respond('accepted')}
                            className="px-5 py-2.5 rounded-[30px] bg-[var(--color-accent)] text-white font-semibold hover:opacity-90 transition-opacity text-sm"
                        >
                            Aceitar cookies
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function useAnalyticsConsent(): boolean {
    const [consented, setConsented] = useState(false);

    useEffect(() => {
        setConsented(getCookieConsent() === 'accepted');

        const handler = (e: Event) => {
            const detail = (e as CustomEvent<CookieConsentValue>).detail;
            setConsented(detail === 'accepted');
        };

        window.addEventListener(COOKIE_CONSENT_EVENT, handler);
        return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handler);
    }, []);

    return consented;
}
