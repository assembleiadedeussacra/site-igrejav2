import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import type { Post } from '@/lib/database.types';

interface RelatedPostsProps {
    posts: Post[];
    type: 'blog' | 'study';
}

export default function RelatedPosts({ posts, type }: RelatedPostsProps) {
    if (!posts || posts.length === 0) return null;

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <section className="mt-12 pt-12 border-t border-gray-200">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-accent)] mb-6">
                {type === 'blog' ? 'Artigos Relacionados' : 'Estudos Relacionados'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/${type === 'study' ? 'estudos' : 'blog'}/${post.slug || post.id}`}
                        className="group bg-white rounded-[10px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 card-hover"
                    >
                        {post.cover_image && (
                            <div className="relative h-40 overflow-hidden">
                                <Image
                                    src={post.cover_image}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    loading="lazy"
                                />
                            </div>
                        )}
                        <div className="p-4">
                            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-2">
                                <Calendar className="w-3 h-3" />
                                {formatDate(post.created_at)}
                            </div>
                            <h3 className="font-bold text-base text-[var(--color-accent)] mb-2 line-clamp-2 group-hover:text-[var(--color-accent-light)] transition-colors">
                                {post.title}
                            </h3>
                            <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-3">
                                {post.excerpt || post.description}
                            </p>
                            <span className="inline-flex items-center gap-1 text-sm text-[var(--color-accent)] font-semibold group-hover:gap-2 transition-all">
                                Ler {type === 'blog' ? 'Artigo' : 'Estudo'}
                                <ArrowRight className="w-4 h-4" />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
