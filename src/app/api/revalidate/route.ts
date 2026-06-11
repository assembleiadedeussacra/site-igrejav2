import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { checkRateLimit } from '@/lib/rate-limit';
import { Errors, handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { revalidatePublicContent } from '@/lib/revalidateContent';

/**
 * Webhook endpoint for revalidating pages when content is updated
 * POST /api/revalidate?secret=...
 *
 * Body:
 * - path: string (optional) - Specific path to revalidate
 * - tag: string (optional) - Tag to revalidate
 * - type: 'blog' | 'study' (optional) - Type of content updated
 * - slug: string (optional) - Post slug when type is set
 */
export async function POST(request: NextRequest) {
    try {
        const ip =
            request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';
        if (!checkRateLimit(`revalidate:${ip}`, 10)) {
            logger.warn('Rate limit exceeded for revalidate endpoint', { ip });
            return NextResponse.json(Errors.RATE_LIMIT_EXCEEDED(), { status: 429 });
        }

        const secret = request.nextUrl.searchParams.get('secret');
        const expectedSecret = process.env.REVALIDATE_SECRET;

        if (!expectedSecret || secret !== expectedSecret) {
            logger.warn('Invalid secret provided for revalidate endpoint', { ip });
            return NextResponse.json(Errors.UNAUTHORIZED(), { status: 401 });
        }

        const body = await request.json().catch(() => ({}));
        const { path, tag, type, slug } = body;

        if (path) {
            revalidatePath(path);
            revalidatePublicContent();
            return NextResponse.json({ revalidated: true, path, now: Date.now() });
        }

        if (tag) {
            const { revalidateTag } = await import('next/cache');
            revalidateTag(tag, 'max');
            revalidatePublicContent();
            return NextResponse.json({ revalidated: true, tag, now: Date.now() });
        }

        if (type === 'blog' || type === 'study') {
            revalidatePublicContent({ type, slug });
            return NextResponse.json({
                revalidated: true,
                type,
                slug: slug ?? null,
                now: Date.now(),
            });
        }

        revalidatePublicContent();

        return NextResponse.json({
            revalidated: true,
            message: 'All content pages revalidated',
            now: Date.now(),
        });
    } catch (error) {
        const appError = handleApiError(error);
        logger.error('Error in /api/revalidate', error, {
            path: request.nextUrl.pathname,
        });

        return NextResponse.json(
            {
                error: appError.message,
                code: appError.code,
            },
            { status: appError.statusCode }
        );
    }
}
