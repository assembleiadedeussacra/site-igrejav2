import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header, Footer } from '@/components';
import PostViewTracker from '@/components/posts/PostViewTracker';
import { serverApi } from '@/services/server';
import { generatePostMetadata } from '@/lib/seo/generateMetadata';
import { generateArticleSchema } from '@/lib/seo/schema';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import RelatedPosts from '@/components/posts/RelatedPosts';
import type { Post, SiteSettings } from '@/lib/database.types';
import { Calendar, Tag, ArrowLeft, Eye } from 'lucide-react';

interface EstudoPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata(
    { params }: EstudoPostPageProps
): Promise<Metadata> {
    const { slug } = await params;
    const post = await serverApi.getPostBySlug(slug, 'study');
    
    if (!post) {
        return {
            title: 'Estudo não encontrado',
        };
    }

    return generatePostMetadata(post, 'study');
}

// ISR: Revalidate every hour
export const revalidate = 3600;

// SSG: Generate static pages for top posts at build time
export async function generateStaticParams() {
    try {
        // Get top 20 most viewed study posts of all time for static generation
        // Use build client (no cookies needed)
        const topPosts = await serverApi.getTopPostsAllTime('study', 20, true);
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
        serverApi.getPostBySlug(slug, 'study'),
        serverApi.getSettings(),
        serverApi.getPostBySlug(slug, 'study').then((p: Post | null) => 
            p ? serverApi.getRelatedPosts(p.id, 'study', 3) : []
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

    // Enhanced Schema with BreadcrumbList
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: item.href.startsWith('http') ? item.href : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://assembleiasacramento.com.br'}${item.href}`,
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <Header settings={settings} />
                <PostViewTracker post={post} />
            <main className="pt-24">
                <article>
                    {/* Cover Image */}
                    {post.cover_image && (
                        <div className="relative h-[50vh] min-h-[400px] overflow-hidden -mt-24">
                            <Image
                                src={post.cover_image}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
                        </div>
                    )}

                    <div className="container-custom py-12 bg-[var(--color-background)]">
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

                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-muted)] mb-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(post.created_at)}
                                    </div>
                                    {post.views !== undefined && (
                                        <div className="flex items-center gap-2">
                                            <Eye className="w-4 h-4" />
                                            {post.views} visualizações
                                        </div>
                                    )}
                                    {post.author && (
                                        <span>Por {post.author}</span>
                                    )}
                                </div>

                                <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-accent)] mb-4">
                                    {post.title}
                                </h1>

                                <p className="text-xl text-[var(--color-text-secondary)] mb-6">
                                    {post.excerpt || post.description}
                                </p>

                                {post.tags && post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--color-primary)]/20 text-[var(--color-accent)] rounded-full text-sm font-medium"
                                            >
                                                <Tag className="w-3 h-3" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="prose prose-lg max-w-none bg-white rounded-[10px] p-8 md:p-12 shadow-sm">
                                <div
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                    className="text-[var(--color-text-secondary)] leading-relaxed"
                                />
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
