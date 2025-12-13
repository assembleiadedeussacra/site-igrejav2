'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    FileText,
    Calendar,
    Tag,
    ArrowRight,
    GraduationCap,
} from 'lucide-react';

import { Post } from '@/lib/database.types';

interface KnowledgeSectionProps {
    posts: Post[];
}

const tabs = [
    {
        id: 'studies',
        label: 'Estudos e Reflexões',
        icon: GraduationCap,
    },
    {
        id: 'blog',
        label: 'Blog',
        icon: FileText,
    },
];

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function KnowledgeSection({ posts = [] }: KnowledgeSectionProps) {
    const [activeTab, setActiveTab] = useState<'studies' | 'blog'>('studies');

    const studies = posts.filter(p => p.type === 'study');
    const blogPosts = posts.filter(p => p.type === 'blog');
    const currentPosts = activeTab === 'studies' ? studies : blogPosts;

    return (
        <section id="conhecimento" className="section-padding bg-[var(--color-surface)]">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-4 section-title">
                        Conhecimento
                    </h2>
                    <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
                        Estudos bíblicos, reflexões teológicas e artigos para crescimento espiritual e
                        aprofundamento na Palavra de Deus.
                    </p>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-center gap-4 mb-12"
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as 'studies' | 'blog')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-[30px] font-semibold transition-all ${activeTab === tab.id
                                ? 'bg-[var(--color-accent)] text-white shadow-lg'
                                : 'bg-white text-[var(--color-accent)] hover:bg-[var(--color-primary)]/20 border border-[var(--color-accent)]/20'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </motion.div>

                {/* Content Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {currentPosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                {activeTab === 'blog' && post.cover_image ? (
                                    // Blog Card with Image
                                    <div className="bg-white rounded-[10px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
                                        <div className="relative h-48 overflow-hidden">
                                            <Image
                                                src={post.cover_image}
                                                alt={`Imagem de capa do artigo: ${post.title}`}
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
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-3">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(post.created_at)}
                                            </div>
                                            <h3 className="font-bold text-lg text-[var(--color-accent)] mb-2 line-clamp-2 group-hover:text-[var(--color-accent-light)] transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-[var(--color-text-secondary)] text-sm mb-4 line-clamp-3">
                                                {post.description}
                                            </p>
                                            <Link
                                                href={`/blog/${post.slug || post.id}`}
                                                className="inline-flex items-center gap-2 text-[var(--color-accent)] font-semibold hover:gap-3 transition-all"
                                            >
                                                Ler Artigo
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    // Study Card (no image)
                                    <div className="bg-white rounded-[10px] p-6 shadow-lg hover:shadow-xl transition-all duration-300 card-hover h-full flex flex-col">
                                        <div className="w-12 h-12 rounded-[10px] bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] flex items-center justify-center mb-4 text-white">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-3">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(post.created_at)}
                                        </div>
                                        <h3 className="font-bold text-lg text-[var(--color-accent)] mb-2 group-hover:text-[var(--color-accent-light)] transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-[var(--color-text-secondary)] text-sm mb-4 flex-1">
                                            {post.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center gap-1 text-xs text-[var(--color-accent)] bg-[var(--color-primary)]/20 px-2 py-1 rounded-[10px]"
                                                >
                                                    <Tag className="w-3 h-3" />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <Link
                                            href={`/estudos/${post.slug || post.id}`}
                                            className="inline-flex items-center gap-2 text-[var(--color-accent)] font-semibold hover:gap-3 transition-all"
                                        >
                                            Ler Estudo
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* View All Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <Link
                        href={activeTab === 'studies' ? '/estudos' : '/blog'}
                        className="btn-secondary"
                    >
                        Ver Todos os {activeTab === 'studies' ? 'Estudos' : 'Artigos'}
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
