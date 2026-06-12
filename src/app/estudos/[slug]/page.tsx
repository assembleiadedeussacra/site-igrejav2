import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header, Footer } from '@/components';
import PostViewTracker from '@/components/posts/PostViewTracker';
import {
  getCachedPostBySlug,
  getCachedSettings,
  getCachedRelatedPosts,
} from '@/lib/cache';
import { serverApi } from '@/services/server';
import { generatePostMetadata } from '@/lib/seo/generateMetadata';
import { generateArticleSchema } from '@/lib/seo/schema';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import ServerContent from '@/components/content/ServerContent';
import RelatedPosts from '@/components/posts/RelatedPosts';
import PostArticleHeader from '@/components/posts/PostArticleHeader';
import type { Post, SiteSettings } from '@/lib/database.types';
import { ArrowLeft } from 'lucide-react';

interface EstudoPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata(
    { params }: EstudoPostPageProps
): Promise<Metadata> {
    const { slug } = await params;
    const post = await getCachedPostBySlug(slug, 'study');
    
    if (!post) {
        return {
            title: 'Estudo não encontrado',
        };
    }

    return generatePostMetadata(post, 'study');
}

// ISR: Revalida a cada hora; novos posts são atualizados on-demand via /api/admin/revalidate
export const revalidate = 3600;

// Permite renderizar slugs criados após o build
export const dynamicParams = true;

// SSG: Generate static pages for top posts at build time
export async function generateStaticParams() {
    try {
        // Get top 20 most viewed study posts of all time for static generation
        // Use build client (no cookies needed)
        const topPosts = await serverApi.getTopPostsAllTime('study', 20);
        return (topPosts as Post[])
            .filter((post: Post) => post.published && post.slug)
            .map((post: Post) => ({
                slug: post.slug!,
            }));
    } catch (error) {
        console.error('Error generating static params for estudos:', error);
        return [];
    }
}

export default async function EstudoPostPage({ params }: EstudoPostPageProps) {
    const { slug } = await params;
    const [postResult, settings, relatedPosts] = await Promise.all([
        getCachedPostBySlug(slug, 'study'),
        getCachedSettings(),
        getCachedPostBySlug(slug, 'study').then((p: Post | null) =>
            p ? getCachedRelatedPosts(p.id, 'study', 3) : []
        ),
    ]);

    // If post not found, try to redirect from old ID-based URL
    if (!postResult) {
        // Check if slug is actually a UUID (old format)
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidPattern.test(slug)) {
            const postById = await serverApi.getPostById(slug);
            if (postById && (postById as Post).slug) {
                // Redirect to slug-based URL (301 permanent redirect for SEO)
                permanentRedirect(`/estudos/${(postById as Post).slug}`);
            }
        }
        notFound();
    }

    // TypeScript now knows post is not null
    const post: Post = postResult as Post;

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const schema = generateArticleSchema(post);

    // Breadcrumbs data
    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Estudos', href: '/estudos' },
        { label: post.title, href: `/estudos/${post.slug || post.id}` },
    ];

    return (
        <>
            <JsonLd data={schema} />
            <Header settings={settings} />
                <PostViewTracker post={post} />
            <main id="main" className="pt-20 sm:pt-24">
                <article>
                    {/* Cover Image */}
                    {post.cover_image && (
                        <div className="relative h-[35vh] min-h-[240px] sm:h-[50vh] sm:min-h-[400px] overflow-hidden -mt-20 sm:-mt-24">
                            <Image
                                src={post.cover_image}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                                sizes="100vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
                        </div>
                    )}

                    <div className="container-custom py-8 sm:py-12 bg-[var(--color-background)]">
                        <div className="max-w-4xl mx-auto">
                            {/* Breadcrumbs */}
                            <Breadcrumbs items={breadcrumbItems} />

                            {/* Back Link */}
                            <Link
                                href="/estudos"
                                className="inline-flex items-center gap-2 text-[var(--color-accent)] mb-8 hover:gap-3 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar para Estudos
                            </Link>

                            <PostArticleHeader post={post} formatDate={formatDate} />

                            {/* Content */}
                            <div className="prose prose-lg max-w-none bg-white rounded-[10px] p-4 sm:p-8 md:p-12 shadow-sm overflow-x-auto">
                                <ServerContent content={post.content} />
                            </div>

                            {/* Related Posts */}
                            {relatedPosts && relatedPosts.length > 0 && (
                                <RelatedPosts posts={relatedPosts} type="study" />
                            )}
                        </div>
                    </div>
                </article>
            </main>
            <Footer settings={settings} />
        </>
    );
}
