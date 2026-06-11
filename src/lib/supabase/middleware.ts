import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    try {
        // Skip Supabase auth if credentials are not configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            // Allow all routes to pass through if Supabase is not configured
            return NextResponse.next({ request });
        }

        let supabaseResponse = NextResponse.next({
            request,
        });

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) =>
                            request.cookies.set(name, value)
                        );
                        supabaseResponse = NextResponse.next({
                            request,
                        });
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        // Refresh session if expired (only for admin routes)
        if (request.nextUrl.pathname.startsWith('/admin')) {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                const isLoginRoute = request.nextUrl.pathname.startsWith('/admin/login');

                // Protect admin routes
                if (!user && !isLoginRoute) {
                    const url = request.nextUrl.clone();
                    url.pathname = '/admin/login';
                    return NextResponse.redirect(url);
                }

                if (user && !isLoginRoute) {
                    const { data: isAdmin, error: adminError } = await supabase.rpc('is_site_admin');

                    if (adminError || !isAdmin) {
                        const url = request.nextUrl.clone();
                        url.pathname = '/admin/login';
                        url.searchParams.set('error', 'unauthorized');
                        return NextResponse.redirect(url);
                    }
                }
            } catch (authError) {
                // If auth check fails, allow access to login page only
                if (!request.nextUrl.pathname.startsWith('/admin/login')) {
                    const url = request.nextUrl.clone();
                    url.pathname = '/admin/login';
                    return NextResponse.redirect(url);
                }
            }
        }

        return supabaseResponse;
    } catch (error) {
        // If middleware fails completely, allow request to proceed
        console.error('Middleware error:', error);
        return NextResponse.next({ request });
    }
}
