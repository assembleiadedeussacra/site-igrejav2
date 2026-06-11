import { LRUCache } from 'lru-cache';

export interface GeoLocation {
    city: string | null;
    region: string | null;
    country: string | null;
}

const geoCache = new LRUCache<string, GeoLocation>({
    max: 500,
    ttl: 1000 * 60 * 60 * 24,
});

function isPrivateIp(ip: string): boolean {
    if (!ip || ip === 'unknown') return true;
    if (ip === '::1' || ip.startsWith('127.')) return true;
    if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('169.254.')) return true;
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return true;
    return false;
}

export function geoFromRequestHeaders(headers: Headers): GeoLocation | null {
    const city = headers.get('x-vercel-ip-city');
    const region = headers.get('x-vercel-ip-country-region');
    const country = headers.get('x-vercel-ip-country');

    if (city || region || country) {
        return {
            city: city ? decodeURIComponent(city) : null,
            region: region || null,
            country: country || null,
        };
    }

    return null;
}

export async function resolveGeoFromIp(ip: string): Promise<GeoLocation> {
    const fallback: GeoLocation = { city: null, region: null, country: null };

    if (isPrivateIp(ip)) return fallback;

    const cached = geoCache.get(ip);
    if (cached) return cached;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2500);

        const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
            signal: controller.signal,
            next: { revalidate: 86400 },
        });

        clearTimeout(timeout);

        if (!res.ok) return fallback;

        const data = (await res.json()) as {
            success?: boolean;
            city?: string;
            region?: string;
            country?: string;
        };

        if (!data.success) return fallback;

        const location: GeoLocation = {
            city: data.city || null,
            region: data.region || null,
            country: data.country || null,
        };

        geoCache.set(ip, location);
        return location;
    } catch {
        return fallback;
    }
}

export async function resolveGeo(
    ip: string,
    headers: Headers
): Promise<GeoLocation> {
    const fromHeaders = geoFromRequestHeaders(headers);
    if (fromHeaders?.city || fromHeaders?.region) {
        return fromHeaders;
    }

    return resolveGeoFromIp(ip);
}
