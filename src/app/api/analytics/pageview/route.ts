import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { Errors } from '@/lib/errors';
import { parseUserAgent } from '@/lib/analytics/userAgent';
import { resolveGeo } from '@/lib/analytics/geo';

const MAX_PATH_LENGTH = 512;
const PAGE_VIEWS_PER_MINUTE = 60;

function getClientIp(request: NextRequest): string {
    return (
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'unknown'
    );
}

function isValidPagePath(path: unknown): path is string {
    if (typeof path !== 'string') return false;
    if (path.length === 0 || path.length > MAX_PATH_LENGTH) return false;
    if (!path.startsWith('/')) return false;
    if (path.includes('..')) return false;
    return true;
}

export async function POST(request: NextRequest) {
    try {
        const ip = getClientIp(request);

        if (!checkRateLimit(`pageview:ip:${ip}`, PAGE_VIEWS_PER_MINUTE)) {
            return NextResponse.json(Errors.RATE_LIMIT_EXCEEDED(), { status: 429 });
        }

        const body = await request.json();
        const { page_path, page_title, referrer, user_agent, session_id, viewport_width } = body;

        if (!isValidPagePath(page_path)) {
            return NextResponse.json(
                { error: 'page_path inválido' },
                { status: 400 }
            );
        }

        if (session_id && typeof session_id === 'string') {
            if (!checkRateLimit(`pageview:session:${session_id}`, PAGE_VIEWS_PER_MINUTE * 2)) {
                return NextResponse.json(Errors.RATE_LIMIT_EXCEEDED(), { status: 429 });
            }
        }

        const supabase = await createClient();

        const safeTitle =
            typeof page_title === 'string' ? page_title.slice(0, 500) : null;
        const safeReferrer =
            typeof referrer === 'string' ? referrer.slice(0, 2000) : null;
        const safeUserAgent =
            typeof user_agent === 'string' ? user_agent.slice(0, 1000) : null;
        const safeSessionId =
            typeof session_id === 'string' ? session_id.slice(0, 128) : null;
        const width =
            typeof viewport_width === 'number' && viewport_width > 0
                ? Math.min(viewport_width, 10000)
                : null;

        const { device_type, browser, os } = parseUserAgent(safeUserAgent, width);
        const geo = await resolveGeo(ip, request.headers);

        const { error } = await supabase.from('page_views').insert([
            {
                page_path,
                page_title: safeTitle,
                referrer: safeReferrer,
                user_agent: safeUserAgent,
                ip_address: ip,
                session_id: safeSessionId,
                device_type,
                browser,
                os,
                city: geo.city,
                region: geo.region,
                country: geo.country,
            },
        ]);

        if (error) {
            console.error('Error inserting page view:', error);
            return NextResponse.json(
                { error: 'Failed to track page view' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in pageview route:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
