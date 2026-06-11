import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePublicContent } from '@/lib/revalidateContent';

/**
 * POST /api/admin/revalidate
 * Revalida páginas públicas e sitemap após alterações no painel admin.
 * Requer sessão autenticada do Supabase.
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const body = await request.json().catch(() => ({}));
        const { type, slug } = body as { type?: 'blog' | 'study'; slug?: string };

        if (type && type !== 'blog' && type !== 'study') {
            return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
        }

        revalidatePublicContent({ type, slug });

        return NextResponse.json({
            revalidated: true,
            type: type ?? 'all',
            slug: slug ?? null,
            now: Date.now(),
        });
    } catch (error) {
        console.error('Error in /api/admin/revalidate:', error);
        return NextResponse.json({ error: 'Erro ao revalidar conteúdo' }, { status: 500 });
    }
}
