'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useRef } from 'react';
import { Search, Tag, Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/services/api';
import type { Post, PageBanner } from '@/lib/database.types';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface PostsPageContentProps {
    initialPosts: Post[];
    pageType: 'blog' | 'study';
    banner: PageBanner | null;
    topPosts: Post[];
}

const POSTS_PER_PAGE = 8;

export default function PostsPageContent({
    initialPosts,
    pageType,
    banner,
    topPosts,
}: PostsPageContentProps) {
    const [allPosts, setAllPosts] = useState<Post[]>(initialPosts);
    const [displayedPosts, setDisplayedPosts] = useState<Post[]>(initialPosts.slice(0, POSTS_PER_PAGE));
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialPosts.length > POSTS_PER_PAGE);

    // Get all unique tags from initial posts (not filtered)
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        initialPosts.forEach((post) => {
            post.tags?.forEach((tag) => tags.add(tag));
        });
        return Array.from(tags).sort();
    }, [initialPosts]);

    // Filter posts based on search and tag
    const filteredPosts = useMemo(() => {
        let filtered = allPosts;

        // Filter by tag
        if (selectedTag) {
            filtered = filtered.filter((post) => post.tags?.includes(selectedTag));
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (post) =>
                    post.title.toLowerCase().includes(query) ||
                    post.description.toLowerCase().includes(query) ||
                    post.content.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [allPosts, selectedTag, searchQuery]);

    // Update displayed posts when filters change
    useEffect(() => {
        setDisplayedPosts(filteredPosts.slice(0, POSTS_PER_PAGE));
        setHasMore(filteredPosts.length > POSTS_PER_PAGE);
    }, [filteredPosts]);

    const handleLoadMore = () => {
        const currentCount = displayedPosts.length;
        const nextPosts = filteredPosts.slice(currentCount, currentCount + POSTS_PER_PAGE);
        setDisplayedPosts((prev) => [...prev, ...nextPosts]);
        setHasMore(currentCount + nextPosts.length < filteredPosts.length);
    };

    // Debounced search
    useEffect(() => {
        if (searchQuery.trim()) {
            const timeoutId = setTimeout(() => {
                setIsLoading(true);
                api.searchPosts(pageType, searchQuery)
                    .then((results) => {
                        setAllPosts(results);
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        console.error('Error searching posts:', error);
                        setIsLoading(false);
                    });
            }, 500); // 500ms delay

            return () => clearTimeout(timeoutId);
        } else if (!selectedTag) {
            setAllPosts(initialPosts);
        }
    }, [searchQuery, pageType, selectedTag, initialPosts]);

    const handleTagClick = async (tag: string) => {
        if (selectedTag === tag) {
            setSelectedTag(null);
            setSearchQuery('');
            setAllPosts(initialPosts);
        } else {
            setSelectedTag(tag);
            setSearchQuery('');
            setIsLoading(true);
            try {
                const posts = await api.getPostsByTag(pageType, tag);
                setAllPosts(posts);
            } catch (error) {
                console.error('Error loading posts by tag:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

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
            {/* Banner Section */}
            {banner && (
                <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={banner.image_url}
                            alt={pageType === 'blog' ? 'Blog' : 'Estudos e Reflexões'}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-10" />
                    <div className="relative z-20 container-custom text-center px-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold text-white mb-4"
                        >
                            {pageType === 'blog' ? 'Blog' : 'Estudos & Reflexões'}
                        </motion.h1>
                    </div>
                </section>
            )}

            {/* Search Section */}
            <section className="py-8 bg-white border-b">
                <div className="container-custom">
                    <div className="max-w-xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={`Buscar ${pageType === 'blog' ? 'artigos' : 'estudos'}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Tags Filter */}
            {allTags.length > 0 && (
                <section className="py-6 bg-[var(--color-background)] border-b">
                    <div className="container-custom">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {allTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagClick(tag)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        selectedTag === tag
                                            ? 'bg-[var(--color-accent)] text-white shadow-lg'
                                            : 'bg-white text-[var(--color-accent)] border-2 border-[var(--color-accent)]/30 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5'
                                    }`}
                                >
                                    <Tag className="w-3 h-3 inline mr-1" />
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Posts Grid */}
            <section className="section-padding bg-[var(--color-background)]">
                <div className="container-custom">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-accent)]"></div>
                        </div>
                    ) : (
                        <>
                            {displayedPosts.length > 0 ? (
                                <>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {displayedPosts.map((post) => (
                                            <PostCard key={post.id} post={post} pageType={pageType} formatDate={formatDate} />
                                        ))}
                                    </div>

                                    {/* Load More Button */}
                                    {hasMore && (
                                        <div className="text-center mt-12">
                                            <button
                                                onClick={handleLoadMore}
                                                className="px-8 py-3 bg-[var(--color-accent)] text-white rounded-[10px] hover:bg-[var(--color-accent-light)] transition-colors font-semibold"
                                            >
                                                Ver Mais
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-[var(--color-text-secondary)] text-lg">
                                        Nenhum {pageType === 'blog' ? 'artigo' : 'estudo'} encontrado.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Top Posts Carousel */}
            {topPosts.length > 0 && (
                <section className="section-padding bg-white">
                    <div className="container-custom">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-4 section-title">
                                Mais Acessados do Mês
                            </h2>
                            <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
                                Os {pageType === 'blog' ? 'artigos' : 'estudos'} mais populares deste mês
                            </p>
                        </motion.div>

                        <TopPostsCarousel posts={topPosts} pageType={pageType} formatDate={formatDate} />
                    </div>
                </section>
            )}
        </>
    );
}

function PostCard({
    post,
    pageType,
    formatDate,
}: {
    post: Post;
    pageType: 'blog' | 'study';
    formatDate: (date: string) => string;
}) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
                    {post.tags && post.tags.length > 0 && (
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex flex-wrap gap-2">
                                {post.tags.slice(0, 2).map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-[10px] text-xs font-medium text-[var(--color-accent)]"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
            {!post.cover_image && (
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)]">
                    {post.tags && post.tags.length > 0 && (
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex flex-wrap gap-2">
                                {post.tags.slice(0, 2).map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-[10px] text-xs font-medium text-[var(--color-accent)]"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
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
                    href={`/${pageType === 'study' ? 'estudos' : 'blog'}/${post.id}`}
                    className="inline-flex items-center gap-2 text-[var(--color-accent)] font-semibold hover:gap-3 transition-all"
                >
                    Ler {pageType === 'blog' ? 'Artigo' : 'Sobre'}
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </motion.article>
    );
}

function TopPostsCarousel({
    posts,
    pageType,
    formatDate,
}: {
    posts: Post[];
    pageType: 'blog' | 'study';
    formatDate: (date: string) => string;
}) {
    const swiperRef = useRef<any>(null);

    return (
        <div className="relative">
            {posts.length > 3 && (
                <div className="hidden md:flex absolute -left-4 -right-4 top-1/2 -translate-y-1/2 justify-between pointer-events-none z-10">
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="w-12 h-12 rounded-[10px] bg-white shadow-lg flex items-center justify-center text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-colors pointer-events-auto"
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        className="w-12 h-12 rounded-[10px] bg-white shadow-lg flex items-center justify-center text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-colors pointer-events-auto"
                        aria-label="Próximo"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            )}

            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={24}
                slidesPerView={1}
                pagination={{ clickable: true, dynamicBullets: true }}
                onBeforeInit={(swiper) => {
                    swiperRef.current = swiper;
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 24,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 24,
                    },
                }}
                className="pb-12"
            >
                {posts.map((post) => (
                    <SwiperSlide key={post.id}>
                        <PostCard post={post} pageType={pageType} formatDate={formatDate} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}


