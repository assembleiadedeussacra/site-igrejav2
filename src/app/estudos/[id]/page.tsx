'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header, Footer } from '@/components';
import PostViewTracker from '@/components/posts/PostViewTracker';
import { api } from '@/services/api';
import { serverApi } from '@/services/server';
import type { Post, SiteSettings } from '@/lib/database.types';
import { Calendar, Tag, ArrowLeft, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EstudoPostPage() {
    const params = useParams();
    const id = params.id as string;
    const [post, setPost] = useState<Post | null>(null);
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const results = await Promise.allSettled([
                    api.getPostById(id),
                    serverApi.getSettings(),
                ]);

                setPost(results[0].status === 'fulfilled' ? results[0].value : null);
                setSettings(results[1].status === 'fulfilled' ? results[1].value : null);
            } catch (error) {
                console.error('Error loading post:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            loadData();
        }
    }, [id]);

    if (isLoading) {
        return (
            <>
                <Header settings={settings} />
                <main className="pt-24 min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-accent)]"></div>
                    </div>
                </main>
                <Footer settings={settings} />
            </>
        );
    }

    if (!post) {
        return (
            <>
                <Header settings={settings} />
                <main className="pt-24 min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-4">
                            Estudo não encontrado
                        </h1>
                        <Link
                            href="/estudos"
                            className="text-[var(--color-accent)] hover:underline"
                        >
                            Voltar para Estudos
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
                                href="/estudos"
                                className="inline-flex items-center gap-2 text-[var(--color-accent)] mb-8 hover:gap-3 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar para Estudos
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
