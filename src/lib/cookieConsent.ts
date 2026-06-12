export const COOKIE_CONSENT_KEY = 'ad_sacramento_cookie_consent';
export const COOKIE_CONSENT_EVENT = 'cookie-consent-change';

export type CookieConsentValue = 'accepted' | 'rejected';

export function getCookieConsent(): CookieConsentValue | null {
    if (typeof window === 'undefined') return null;
    const value = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (value === 'accepted' || value === 'rejected') return value;
    return null;
}

export function setCookieConsent(value: CookieConsentValue): void {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: value }));
}

export function hasAnalyticsConsent(): boolean {
    return getCookieConsent() === 'accepted';
}
