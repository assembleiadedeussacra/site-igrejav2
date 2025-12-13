import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { checkRateLimit } from '@/lib/rate-limit';
import { Errors, handleApiError } from '@/lib/errors';
import { logger } from '@/lib/logger';

/**
 * Webhook endpoint for revalidating pages when content is updated
 * POST /api/revalidate
 * 
 * Body:
 * - secret: string (required) - Secret token for authentication
 * - path: string (optional) - Specific path to revalidate
 * - tag: string (optional) - Tag to revalidate
 * - type: 'blog' | 'study' (optional) - Type of content updated
 */
export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const ip = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
        if (!checkRateLimit(`revalidate:${ip}`, 10)) {
            logger.warn('Rate limit exceeded for revalidate endpoint', { ip });
            return NextResponse.json(
                Errors.RATE_LIMIT_EXCEEDED(),
                { status: 429 }
            );
        }

        const secret = request.nextUrl.searchParams.get('secret');
        const expectedSecret = process.env.REVALIDATE_SECRET;

        // Verify secret
        if (!expectedSecret || secret !== expectedSecret) {
            logger.warn('Invalid secret provided for revalidate endpoint', { ip });
            return NextResponse.json(
                Errors.UNAUTHORIZED(),
                { status: 401 }
            );
        }

        const body = await request.json().catch(() => ({}));
        const { path, tag, type } = body;

        // Revalidate specific path if provided
        if (path) {
            revalidatePath(path);
            return NextResponse.json({
                revalidated: true,
                path,
                now: Date.now(),
            });
        }

        // Revalidate by tag if provided
        if (tag) {
            revalidateTag(tag, 'max');
            return NextResponse.json({
                revalidated: true,
                tag,
                now: Date.now(),
            });
        }

        // Revalidate based on type
        if (type === 'blog') {
            revalidatePath('/blog');
            revalidatePath('/blog/[slug]', 'page');
            return NextResponse.json({
                revalidated: true,
                type: 'blog',
                now: Date.now(),
            });
        }

        if (type === 'study') {
            revalidatePath('/estudos');
            revalidatePath('/estudos/[slug]', 'page');
            return NextResponse.json({
                revalidated: true,
                type: 'study',
                now: Date.now(),
            });
        }

        // Default: revalidate all content pages
        revalidatePath('/blog');
        revalidatePath('/estudos');
        revalidatePath('/blog/[slug]', 'page');
        revalidatePath('/estudos/[slug]', 'page');
        revalidatePath('/sitemap.xml');

        return NextResponse.json({
            revalidated: true,
            message: 'All content pages revalidated',
            now: Date.now(),
        });
    } catch (error) {
        const appError = handleApiError(error);
        logger.error('Error in /api/revalidate', error, { 
            path: request.nextUrl.pathname 
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
