export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'unknown';

export interface ParsedUserAgent {
    device_type: DeviceType;
    browser: string;
    os: string;
}

export function parseUserAgent(
    userAgent: string | null | undefined,
    viewportWidth?: number | null
): ParsedUserAgent {
    const ua = (userAgent || '').toLowerCase();

    let device_type: DeviceType = 'unknown';

    if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(userAgent || '')) {
        device_type = 'tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(userAgent || '')) {
        device_type = 'mobile';
    } else if (ua) {
        device_type = 'desktop';
    }

    if (viewportWidth != null && viewportWidth > 0) {
        if (viewportWidth < 768) device_type = 'mobile';
        else if (viewportWidth < 1024 && device_type === 'desktop') device_type = 'tablet';
    }

    let browser = 'Desconhecido';
    if (ua.includes('edg/')) browser = 'Edge';
    else if (ua.includes('chrome/') && !ua.includes('chromium')) browser = 'Chrome';
    else if (ua.includes('firefox/')) browser = 'Firefox';
    else if (ua.includes('safari/') && !ua.includes('chrome')) browser = 'Safari';
    else if (ua.includes('opr/') || ua.includes('opera')) browser = 'Opera';

    let os = 'Desconhecido';
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('mac os') || ua.includes('macintosh')) os = 'macOS';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ios')) os = 'iOS';
    else if (ua.includes('linux')) os = 'Linux';

    return { device_type, browser, os };
}

export function deviceTypeLabel(type: string): string {
    switch (type) {
        case 'mobile':
            return 'Mobile';
        case 'tablet':
            return 'Tablet';
        case 'desktop':
            return 'Desktop';
        default:
            return 'Desconhecido';
    }
}
