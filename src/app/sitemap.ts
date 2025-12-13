import { MetadataRoute } from 'next';
import { serverApi } from '@/services/server';
import type { Post } from '@/lib/database.types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://assembleiasacramento.com.br';

// Helper function to normalize URLs (remove trailing slashes and fix double slashes)
function normalizeUrl(baseUrl: string, path: string): string {
    // Remove trailing slash from base URL
    const cleanBase = baseUrl.replace(/\/+$/, '');
    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    // Combine and remove any double slashes (except after http:// or https://)
    return `${cleanBase}${cleanPath}`.replace(/([^:]\/)\/+/g, '$1');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Homepage - ensure no trailing slash
    const homepageUrl = SITE_URL.replace(/\/+$/, '');
    sitemapEntries.push({
        url: homepageUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
    });

    // Static pages (only actual pages, not anchors)
    const staticPages = [
        { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
        { path: '/estudos', priority: 0.8, changeFrequency: 'daily' as const },
        { path: '/sobre-nos', priority: 0.7, changeFrequency: 'monthly' as const },
    ];

    staticPages.forEach((page) => {
        sitemapEntries.push({
            url: normalizeUrl(SITE_URL, page.path),
            lastModified: new Date(),
            changeFrequency: page.changeFrequency,
            priority: page.priority,
        });
    });

    // Blog posts
    try {
        const blogPosts = await serverApi.getPostsByType('blog', 1000);
        (blogPosts as Post[]).forEach((post: Post) => {
            if (post.published && post.slug) {
                sitemapEntries.push({
                    url: normalizeUrl(SITE_URL, `/blog/${post.slug}`),
                    lastModified: new Date(post.updated_at),
                    changeFrequency: 'weekly',
                    priority: 0.7,
                });
            }
        });
    } catch (error) {
        console.error('Error fetching blog posts for sitemap:', error);
    }

    // Study posts
    try {
        const studyPosts = await serverApi.getPostsByType('study', 1000);
        (studyPosts as Post[]).forEach((post: Post) => {
            if (post.published && post.slug) {
                sitemapEntries.push({
                    url: normalizeUrl(SITE_URL, `/estudos/${post.slug}`),
                    lastModified: new Date(post.updated_at),
                    changeFrequency: 'weekly',
                    priority: 0.7,
                });
            }
        });
    } catch (error) {
        console.error('Error fetching study posts for sitemap:', error);
    }

    return sitemapEntries;
}
