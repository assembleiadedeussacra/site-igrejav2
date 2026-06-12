import { Calendar, Eye, Tag } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import type { Post } from '@/lib/database.types';

interface PostArticleHeaderProps {
    post: Post;
    formatDate: (dateString: string) => string;
}

export default function PostArticleHeader({ post, formatDate }: PostArticleHeaderProps) {
    return (
        <div className="mb-8">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--color-text-muted)] mb-5">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
                </div>
                {post.views !== undefined && (
                    <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" aria-hidden="true" />
                        {post.views} visualizações
                    </div>
                )}
                {post.author && <span>Por {post.author}</span>}
            </div>

            <PageHeader
                variant="article"
                align="left"
                title={post.title}
                description={post.excerpt || post.description}
                className="!mb-0"
            />

            {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--color-primary)]/20 text-[var(--color-accent)] rounded-full text-sm font-medium"
                        >
                            <Tag className="w-3 h-3" aria-hidden="true" />
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
