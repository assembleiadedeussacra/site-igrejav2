import type { Post } from '@/lib/database.types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://assembleiasacramento.com.br';

/**
 * Generates Schema.org structured data for an article
 */
export function generateArticleSchema(post: Post): object {
    const schemaType = post.schema_type || 'Article';
    const url = `${SITE_URL}/${post.type === 'study' ? 'estudos' : 'blog'}/${post.slug || post.id}`;
    const image = post.og_image || post.cover_image || `${SITE_URL}/images/og-image.jpg`;

    const baseSchema: any = {
        '@context': 'https://schema.org',
        '@type': schemaType,
        headline: post.title,
        description: post.excerpt || post.description,
        image: image,
        datePublished: post.created_at,
        dateModified: post.updated_at,
        author: post.author
            ? {
                  '@type': 'Person',
                  name: post.author,
              }
            : {
                  '@type': 'Organization',
                  name: 'Assembleia de Deus Missão - Sacramento/MG',
              },
        publisher: {
            '@type': 'Organization',
            name: 'Assembleia de Deus Missão - Sacramento/MG',
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/images/logo-igreja.jpg`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
        },
        url: url,
    };

    // Add keywords if available
    if (post.keywords && post.keywords.length > 0) {
        baseSchema.keywords = post.keywords.join(', ');
    } else if (post.tags && post.tags.length > 0) {
        baseSchema.keywords = post.tags.join(', ');
    }

    // Add articleBody for BlogPosting
    if (schemaType === 'BlogPosting' && post.content) {
        // Strip HTML tags for articleBody (basic approach)
        const textContent = post.content.replace(/<[^>]*>/g, '').substring(0, 5000);
        baseSchema.articleBody = textContent;
    }

    // Add wordCount if content is available
    if (post.content) {
        const textContent = post.content.replace(/<[^>]*>/g, '');
        const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;
        if (wordCount > 0) {
            baseSchema.wordCount = wordCount;
        }
    }

    // Add inLanguage
    baseSchema.inLanguage = 'pt-BR';

    return baseSchema;
}
