import { MetadataRoute } from 'next';
import { createClientForBuild } from '@/lib/supabase/server';
import { SITE_URL } from '@/lib/seo/constants';
import type { Post } from '@/lib/database.types';

/** Atualiza o sitemap a cada 5 minutos; revalidação on-demand ao publicar posts */
export const revalidate = 300;

function normalizeUrl(baseUrl: string, path: string): string {
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`.replace(/([^:]\/)\/+/g, '$1');
}

async function getPublishedPostsByType(type: 'blog' | 'study'): Promise<Post[]> {
    try {
        const supabase = createClientForBuild();
        const { data, error } = await supabase
            .from('posts')
            .select('slug, updated_at, published, noindex')
            .eq('type', type)
            .eq('published', true)
            .not('slug', 'is', null)
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return (data as Post[]) || [];
    } catch (error) {
        console.error(`Error fetching ${type} posts for sitemap:`, error);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const sitemapEntries: MetadataRoute.Sitemap = [];
    const now = new Date();

    sitemapEntries.push({
        url: SITE_URL,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 1.0,
    });

    const staticPages = [
        { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
        { path: '/estudos', priority: 0.8, changeFrequency: 'daily' as const },
        { path: '/sobre-nos', priority: 0.7, changeFrequency: 'monthly' as const },
    ];

    staticPages.forEach((page) => {
        sitemapEntries.push({
            url: normalizeUrl(SITE_URL, page.path),
            lastModified: now,
            changeFrequency: page.changeFrequency,
            priority: page.priority,
        });
    });

    const [blogPosts, studyPosts] = await Promise.all([
        getPublishedPostsByType('blog'),
        getPublishedPostsByType('study'),
    ]);

    blogPosts.forEach((post) => {
        if (post.slug && !post.noindex) {
            sitemapEntries.push({
                url: normalizeUrl(SITE_URL, `/blog/${post.slug}`),
                lastModified: new Date(post.updated_at),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        }
    });

    studyPosts.forEach((post) => {
        if (post.slug && !post.noindex) {
            sitemapEntries.push({
                url: normalizeUrl(SITE_URL, `/estudos/${post.slug}`),
                lastModified: new Date(post.updated_at),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        }
    });

    return sitemapEntries;
}
