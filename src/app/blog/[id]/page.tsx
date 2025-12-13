import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Header, Footer } from '@/components';
import PostViewTracker from '@/components/posts/PostViewTracker';
import { serverApi } from '@/services/server';
import type { Post, SiteSettings } from '@/lib/database.types';
import { Calendar, Tag, ArrowLeft, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface BlogPostPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { id } = await params;
    const post = await serverApi.getPostById(id);
    
    return {
        title: post?.title || 'Blog',
        description: post?.description || '',
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { id } = await params;
    let post: Post | null = null;
    let settings: SiteSettings | null = null;

    try {
        const results = await Promise.allSettled([
            serverApi.getPostById(id),
            serverApi.getSettings(),
        ]);

        post = results[0].status === 'fulfilled' ? results[0].value : null;
        settings = results[1].status === 'fulfilled' ? results[1].value : null;
    } catch (error) {
        console.error('Error loading post:', error);
    }

    if (!post) {
        return (
            <>
                <Header settings={settings} />
                <main className="pt-24 min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-4">
                            Post não encontrado
                        </h1>
                        <Link
                            href="/blog"
                            className="text-[var(--color-accent)] hover:underline"
                        >
                            Voltar para o Blog
                        </Link>
                    </div>
                </main>
                <Footer settings={settings} />
            </>
        );
    }

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <>
            <Header settings={settings} />
            <PostViewTracker postId={id} />
            <main className="pt-24">
                <article className="bg-[var(--color-background)]">
                    {/* Cover Image */}
                    {post.cover_image && (
                        <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
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

                    <div className="container-custom py-12">
                        <div className="max-w-4xl mx-auto">
                            {/* Back Link */}
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-[var(--color-accent)] mb-8 hover:gap-3 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar para o Blog
                            </Link>

                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8"
                            >
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
                                    {post.description}
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
                            </motion.div>

                            {/* Content */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="prose prose-lg max-w-none bg-white rounded-[10px] p-8 md:p-12 shadow-sm"
                            >
                                <div
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                    className="text-[var(--color-text-secondary)] leading-relaxed"
                                />
                            </motion.div>
                        </div>
                    </div>
                </article>
            </main>
            <Footer settings={settings} />
        </>
    );
}

