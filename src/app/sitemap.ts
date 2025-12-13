import { MetadataRoute } from 'next';
import { serverApi } from '@/services/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://assembleiasacramento.com.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Homepage
    sitemapEntries.push({
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
    });

    // Static pages
    const staticPages = [
        { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
        { path: '/estudos', priority: 0.8, changeFrequency: 'daily' as const },
        { path: '/sobre-nos', priority: 0.7, changeFrequency: 'monthly' as const },
        { path: '/#agenda', priority: 0.6, changeFrequency: 'weekly' as const },
        { path: '/#contato', priority: 0.6, changeFrequency: 'monthly' as const },
    ];

    staticPages.forEach((page) => {
        sitemapEntries.push({
            url: `${SITE_URL}${page.path}`,
            lastModified: new Date(),
            changeFrequency: page.changeFrequency,
            priority: page.priority,
        });
    });

    // Blog posts
    try {
        const blogPosts = await serverApi.getPostsByType('blog', 1000);
        blogPosts.forEach((post) => {
            if (post.published && post.slug) {
                sitemapEntries.push({
                    url: `${SITE_URL}/blog/${post.slug}`,
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
        studyPosts.forEach((post) => {
            if (post.published && post.slug) {
                sitemapEntries.push({
                    url: `${SITE_URL}/estudos/${post.slug}`,
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
