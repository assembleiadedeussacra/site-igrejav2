'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, RefreshCw, Share2 } from 'lucide-react';

import { Verse } from '@/lib/database.types';

interface VerseSectionProps {
    verse: Verse | null;
}

export default function VerseSection({ verse }: VerseSectionProps) {
    // If no verse is passed (e.g. error or no data), we can hide the section or show a fallback.
    // However, for this refactor, let's assume valid data or handle null in render.

    const shareVerse = async () => {
        if (!verse) return;

        const shareData = {
            title: 'Versículo do Dia',
            text: `"${verse.text}" - ${verse.reference}`,
            url: verse.bible_link || '',
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch {
                // User cancelled or share failed
            }
        } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(
                `"${verse.text}" - ${verse.reference}\n${verse.bible_link || ''}`
            );
            alert('Versículo copiado para a área de transferência!');
        }
    };

    return (
        <section id="versiculo" className="section-padding bg-[var(--color-surface)]">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-4 section-title">
                        Versículo do Dia
                    </h2>
                    <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                        Meditação diária da Palavra de Deus para edificação espiritual
                    </p>
                </motion.div>

                {/* Verse Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="relative bg-gradient-to-br from-[var(--color-primary)]/20 via-white to-[var(--color-primary)]/10 rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-accent)]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--color-primary)]/30 rounded-full translate-y-1/2 -translate-x-1/2" />

                        {/* Quote Icon */}
                        <div className="absolute top-6 left-6 text-[var(--color-accent)]/10">
                            <svg
                                className="w-16 h-16 md:w-24 md:h-24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                        </div>


                        {/* Content */}
                        <div className="relative z-10">
                            {verse ? (
                                <motion.div
                                    key={verse.reference}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium text-[var(--color-accent)] text-center leading-relaxed mb-6 italic">
                                        &ldquo;{verse.text}&rdquo;
                                    </blockquote>
                                    <cite className="block text-center text-lg md:text-xl font-bold text-[var(--color-accent)] not-italic">
                                        {verse.reference}
                                    </cite>
                                </motion.div>
                            ) : (
                                <div className="text-center text-[var(--color-text-secondary)]">
                                    <p>Nenhum versículo disponível para hoje.</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                                {verse && verse.bible_link && (
                                    <a
                                        href={verse.bible_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white rounded-full font-medium hover:bg-[var(--color-accent-light)] transition-colors shadow-lg"
                                    >
                                        <BookOpen className="w-5 h-5" />
                                        Ler na Bíblia
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}

                                <button
                                    onClick={shareVerse}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-[var(--color-accent)] rounded-full font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
                                >
                                    <Share2 className="w-5 h-5" />
                                    Compartilhar
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
