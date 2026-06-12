import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { Errors } from '@/lib/errors';

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VIEWS_PER_MINUTE = 30;

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!UUID_REGEX.test(id)) {
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        const ip =
            request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') ||
            'unknown';

        if (!checkRateLimit(`post-view:ip:${ip}`, VIEWS_PER_MINUTE)) {
            return NextResponse.json(Errors.RATE_LIMIT_EXCEEDED(), { status: 429 });
        }

        if (!checkRateLimit(`post-view:post:${id}`, VIEWS_PER_MINUTE * 2)) {
            return NextResponse.json(Errors.RATE_LIMIT_EXCEEDED(), { status: 429 });
        }

        const supabase = await createClient();
        const { error } = await supabase.rpc('increment_post_views', { post_id: id });

        if (error) {
            console.error('Error incrementing post views:', error);
            return NextResponse.json(
                { error: 'Failed to track view' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in post view route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
