import { Header, Footer } from '@/components';
import PostsPageContent from '@/components/posts/PostsPageContent';
import {
  getCachedAllPostsByType,
  getCachedPageBanner,
  getCachedTopPosts,
  getCachedSettings,
} from '@/lib/cache';
import { generatePageMetadata } from '@/lib/seo/pageMetadata';
import type { Post, PageBanner, SiteSettings } from '@/lib/database.types';

export const revalidate = 300;

export const metadata = generatePageMetadata({
    title: 'Blog',
    description:
        'Notícias, eventos e artigos sobre a vida da comunidade da Assembleia de Deus Missão em Sacramento/MG.',
    path: '/blog',
    keywords: ['blog igreja', 'notícias evangélicas', 'Sacramento MG', 'Assembleia de Deus'],
});

export default async function BlogPage() {
    let posts: Post[] = [];
    let banner: PageBanner | null = null;
    let topPosts: Post[] = [];
    let settings: SiteSettings | null = null;

    try {
        const results = await Promise.allSettled([
            getCachedAllPostsByType('blog'),
            getCachedPageBanner('blog'),
            getCachedTopPosts('blog', 8),
            getCachedSettings(),
        ]);

        posts = results[0].status === 'fulfilled' ? results[0].value : [];
        banner = results[1].status === 'fulfilled' ? results[1].value : null;
        topPosts = results[2].status === 'fulfilled' ? results[2].value : [];
        settings = results[3].status === 'fulfilled' ? results[3].value : null;
    } catch (error) {
        console.error('Erro ao carregar dados da página de blog:', error);
    }

    return (
        <>
            <Header settings={settings} />
            <main id="main">
                <PostsPageContent
                    initialPosts={posts}
                    pageType="blog"
                    banner={banner}
                    topPosts={topPosts}
                />
            </main>
            <Footer settings={settings} />
        </>
    );
}
