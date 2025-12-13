import type { Metadata } from 'next';
import { Header, Footer } from '@/components';
import PostsPageContent from '@/components/posts/PostsPageContent';
import { serverApi } from '@/services/server';
import type { Post, PageBanner } from '@/lib/database.types';

export const metadata: Metadata = {
    title: 'Estudos e Reflexões',
    description:
        'Estudos bíblicos e reflexões para fortalecer sua fé. Aprofunde seu conhecimento da Palavra de Deus.',
};

export default async function EstudosPage() {
    let posts: Post[] = [];
    let banner: PageBanner | null = null;
    let topPosts: Post[] = [];

    try {
        const results = await Promise.allSettled([
            serverApi.getAllPostsByType('study'),
            serverApi.getPageBanner('estudos'),
            serverApi.getTopPostsThisMonth('study', 8),
        ]);

        posts = results[0].status === 'fulfilled' ? results[0].value : [];
        banner = results[1].status === 'fulfilled' ? results[1].value : null;
        topPosts = results[2].status === 'fulfilled' ? results[2].value : [];
    } catch (error) {
        console.error('Erro ao carregar dados da página de estudos:', error);
    }

    return (
        <>
            <Header settings={null} />
            <main className="pt-24">
                <PostsPageContent
                    initialPosts={posts}
                    pageType="study"
                    banner={banner}
                    topPosts={topPosts}
                />
            </main>
            <Footer settings={null} />
        </>
    );
}
