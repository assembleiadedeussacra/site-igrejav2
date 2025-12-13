import type { Metadata } from 'next';
import type { Post } from '@/lib/database.types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://assembleiasacramento.com.br';
const SITE_NAME = 'Assembleia de Deus Missão - Sacramento/MG';

/**
 * Generates optimized metadata for a post
 */
export function generatePostMetadata(
    post: Post,
    type: 'blog' | 'study'
): Metadata {
    // Use meta_title if available, otherwise use title
    const title = post.meta_title || post.title;
    // Use meta_description if available, otherwise use description or excerpt
    const description = post.meta_description || post.excerpt || post.description;
    
    // Optimize title length (50-60 chars recommended)
    const optimizedTitle = title.length > 60 
        ? title.substring(0, 57) + '...' 
        : title;
    
    // Optimize description length (150-160 chars recommended)
    const optimizedDescription = description.length > 160
        ? description.substring(0, 157) + '...'
        : description;

    // Build canonical URL
    const canonicalUrl = post.canonical_url || `${SITE_URL}/${type === 'study' ? 'estudos' : 'blog'}/${post.slug || post.id}`;
    
    // Open Graph image
    const ogImage = post.og_image || post.cover_image || `${SITE_URL}/images/og-image.jpg`;
    
    // Open Graph title and description
    const ogTitle = post.og_title || optimizedTitle;
    const ogDescription = post.og_description || optimizedDescription;

    // Robots directives
    const robots = {
        index: !post.noindex,
        follow: !post.nofollow,
        googleBot: {
            index: !post.noindex,
            follow: !post.nofollow,
            'max-video-preview': -1,
            'max-image-preview': 'large' as const,
            'max-snippet': -1,
        },
    };

    // Keywords array
    const keywords = post.keywords && post.keywords.length > 0
        ? post.keywords
        : post.tags || [];

    return {
        title: optimizedTitle,
        description: optimizedDescription,
        keywords: keywords,
        authors: post.author ? [{ name: post.author }] : undefined,
        openGraph: {
            type: 'article',
            locale: 'pt_BR',
            url: canonicalUrl,
            siteName: SITE_NAME,
            title: ogTitle,
            description: ogDescription,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
            publishedTime: post.created_at,
            modifiedTime: post.updated_at,
            authors: post.author ? [post.author] : undefined,
            tags: post.tags || [],
        },
        twitter: {
            card: 'summary_large_image',
            title: ogTitle,
            description: ogDescription,
            images: [ogImage],
        },
        robots: robots,
        alternates: {
            canonical: canonicalUrl,
        },
    };
}
