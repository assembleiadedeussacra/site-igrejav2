import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { page_path, page_title, referrer, user_agent, session_id } = body;

        if (!page_path) {
            return NextResponse.json(
                { error: 'page_path is required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        
        // Get client IP address
        const ip_address = request.headers.get('x-forwarded-for') || 
                          request.headers.get('x-real-ip') || 
                          'unknown';

        // Insert page view
        const { error } = await supabase
            .from('page_views')
            .insert({
                page_path,
                page_title: page_title || null,
                referrer: referrer || null,
                user_agent: user_agent || null,
                ip_address,
                session_id: session_id || null,
            });

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
