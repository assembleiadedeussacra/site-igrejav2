import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, OG_IMAGE } from './constants';

interface PageMetadataOptions {
    title: string;
    description: string;
    path: string;
    keywords?: string[];
    ogType?: 'website' | 'article';
}

export function generatePageMetadata({
    title,
    description,
    path,
    keywords = [],
    ogType = 'website',
}: PageMetadataOptions): Metadata {
    const canonicalUrl = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

    return {
        title,
        description,
        keywords: keywords.length > 0 ? keywords : undefined,
        openGraph: {
            type: ogType,
            locale: 'pt_BR',
            url: canonicalUrl,
            siteName: SITE_NAME,
            title: `${title} | ${SITE_NAME}`,
            description,
            images: [
                {
                    url: OG_IMAGE,
                    width: 1200,
                    height: 630,
                    alt: SITE_NAME,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} | ${SITE_NAME}`,
            description,
            images: [OG_IMAGE],
        },
        alternates: {
            canonical: canonicalUrl,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}
