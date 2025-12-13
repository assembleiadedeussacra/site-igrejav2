import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://assembleiasacramento.vercel.app';

export default function robots(): MetadataRoute.Robots {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/_next/',
                    '/static/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                ],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
