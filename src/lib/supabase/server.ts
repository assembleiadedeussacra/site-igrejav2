import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database } from '../database.types';

export async function createClient() {
    const cookieStore = await cookies();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
        // Return a mock client that will fail gracefully
        // This prevents the build from failing but will cause runtime errors
        // The caller should handle this case
        throw new Error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }

    return createServerClient<Database>(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if middleware refreshes user sessions.
                    }
                },
            },
        }
    );
}

/**
 * Creates a Supabase client without cookies for build-time operations
 * (e.g., generateStaticParams, generateMetadata)
 * This client doesn't require a request context
 */
export function createClientForBuild() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }

    return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
}
