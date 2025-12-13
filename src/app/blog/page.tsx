import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header, Footer } from '@/components';
import {
    FileText,
    Calendar,
    Tag,
    ArrowRight,
    ArrowLeft,
    Search,
} from 'lucide-react';
import { serverApi } from '@/services/server';

export const metadata: Metadata = {
    title: 'Blog',
    description:
        'Notícias, eventos e artigos sobre a vida da nossa comunidade cristã.',
};

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

export default async function BlogPage() {
    let posts: Array<{
        id: string;
        title: string;
        description: string;
        cover_image: string | null;
        tags: string[];
        created_at: string;
    }> = [];

    try {
        const allPosts = (await serverApi.getPosts(100)) as any[];
        posts = allPosts
            .filter((post) => post.type === 'blog' && post.published)
            .map((post) => ({
                id: post.id,
                title: post.title,
                description: post.description,
                cover_image: post.cover_image,
                tags: post.tags || [],
                created_at: post.created_at,
            }));
    } catch (error) {
        console.error('Erro ao carregar posts do blog:', error);
    }
    return (
        <>
            <Header />
            <main className="pt-24">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] py-16 md:py-24">
                    <div className="container-custom text-center text-white">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-[10px] bg-white/10 flex items-center justify-center">
                            <FileText className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto">
                            Fique por dentro das notícias, eventos e artigos sobre a vida da
                            nossa comunidade cristã.
                        </p>
                    </div>
                </section>

                {/* Search Section */}
                <section className="py-8 bg-white border-b">
                    <div className="container-custom">
                        <div className="max-w-xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar artigos..."
                                    className="w-full pl-12 pr-4 py-3 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Posts Grid */}
                <section className="section-padding bg-[var(--color-background)]">
                    <div className="container-custom">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-white rounded-[10px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 card-hover group"
                                >
                                    {post.cover_image && (
                                        <div className="relative h-48 overflow-hidden">
                                            <Image
                                                src={post.cover_image}
                                                alt={post.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {post.tags.slice(0, 2).map((tag) => (
                                                        <span key={tag} className="tag">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {!post.cover_image && (
                                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)]">
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {post.tags.slice(0, 2).map((tag) => (
                                                        <span key={tag} className="tag">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-3">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(post.created_at)}
                                        </div>

                                        <h2 className="font-bold text-xl text-[var(--color-accent)] mb-3 line-clamp-2 group-hover:text-[var(--color-accent-light)] transition-colors">
                                            {post.title}
                                        </h2>

                                        <p className="text-[var(--color-text-secondary)] mb-4 line-clamp-3">
                                            {post.description}
                                        </p>

                                        <Link
                                            href={`/blog/${post.id}`}
                                            className="inline-flex items-center gap-2 text-[var(--color-accent)] font-semibold hover:gap-3 transition-all"
                                        >
                                            Ler Artigo
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Back Link */}
                        <div className="text-center mt-12">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-[var(--color-accent)] font-semibold hover:gap-3 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar para Home
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
