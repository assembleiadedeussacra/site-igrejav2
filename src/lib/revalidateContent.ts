import { revalidatePath } from 'next/cache';

export interface RevalidateContentOptions {
    type?: 'blog' | 'study';
    slug?: string;
}

/**
 * Invalida o cache das páginas públicas para que novos posts apareçam
 * no site e no sitemap sem esperar o ISR expirar.
 */
export function revalidatePublicContent(options: RevalidateContentOptions = {}) {
    const { type, slug } = options;

    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/estudos');
    revalidatePath('/sobre-nos');
    revalidatePath('/sitemap.xml');

    if (slug && type) {
        const prefix = type === 'study' ? '/estudos' : '/blog';
        revalidatePath(`${prefix}/${slug}`);
    }

    if (type === 'blog' || !type) {
        revalidatePath('/blog/[slug]', 'page');
    }
    if (type === 'study' || !type) {
        revalidatePath('/estudos/[slug]', 'page');
    }
}
