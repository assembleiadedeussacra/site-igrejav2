'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';

import { Testimonial } from '@/lib/database.types';
import { hasValidImageUrl } from '@/lib/imageUtils';
import SectionHeader from '@/components/ui/SectionHeader';

interface TestimonialsSectionProps {
    testimonials: Testimonial[];
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) {
    const starClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
    return (
        <div className="flex gap-0.5" aria-label={`${rating} de 5 estrelas`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`${starClass} ${
                        star <= rating ? 'star-filled fill-current' : 'star-empty'
                    }`}
                />
            ))}
        </div>
    );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    return (
        <article className="surface-card p-6 md:p-8 hover:shadow-lg transition-shadow h-full flex flex-col min-h-[280px]">
            <div className="w-10 h-10 rounded-[10px] bg-[var(--color-primary)]/20 flex items-center justify-center mb-4 flex-shrink-0">
                <Quote className="w-5 h-5 text-[var(--color-accent)]" />
            </div>

            <StarRating rating={testimonial.rating} size="sm" />

            <blockquote className="text-[var(--color-text-secondary)] leading-relaxed flex-1 mt-4 mb-6">
                &ldquo;{testimonial.text}&rdquo;
            </blockquote>

            <footer className="flex items-center gap-3 pt-4 border-t border-gray-100 flex-shrink-0">
                {hasValidImageUrl(testimonial.avatar_url) ? (
                    <div className="relative w-12 h-12 rounded-[10px] overflow-hidden flex-shrink-0">
                        <Image
                            src={testimonial.avatar_url}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="48px"
                        />
                    </div>
                ) : (
                    <div
                        className="w-12 h-12 rounded-[10px] bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] flex items-center justify-center text-white font-bold flex-shrink-0"
                        aria-hidden
                    >
                        {getInitials(testimonial.name)}
                    </div>
                )}
                <div className="min-w-0">
                    <cite className="not-italic font-bold text-[var(--color-accent)] block truncate">
                        {testimonial.name}
                    </cite>
                    <p className="text-sm text-[var(--color-text-muted)]">Membro da Igreja</p>
                </div>
            </footer>
        </article>
    );
}

export default function TestimonialsSection({ testimonials = [] }: TestimonialsSectionProps) {
    const swiperRef = useRef<SwiperType | undefined>(undefined);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }, []);

    const activeTestimonials = useMemo(
        () => testimonials.filter((t) => t.active !== false),
        [testimonials]
    );

    if (activeTestimonials.length === 0) {
        return null;
    }

    const useGrid = activeTestimonials.length <= 3;

    return (
        <section id="depoimentos" className="section-padding bg-[var(--color-surface)]">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <SectionHeader
                        eyebrow="Testemunhos"
                        title="Depoimentos"
                        description="Testemunhos de membros sobre a experiência na comunidade"
                    />
                </motion.div>

                {useGrid ? (
                    <div
                        className={`grid gap-6 md:gap-8 ${
                            activeTestimonials.length === 1
                                ? 'max-w-2xl mx-auto'
                                : activeTestimonials.length === 2
                                  ? 'md:grid-cols-2'
                                  : 'md:grid-cols-2 lg:grid-cols-3'
                        }`}
                    >
                        {activeTestimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08 }}
                                className="h-full"
                            >
                                <TestimonialCard testimonial={testimonial} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative px-0 sm:px-4 md:px-8"
                    >
                        <div className="hidden md:flex absolute -left-2 -right-2 top-1/2 -translate-y-1/2 justify-between pointer-events-none z-10">
                            <button
                                type="button"
                                onClick={() => swiperRef.current?.slidePrev()}
                                className="w-12 h-12 rounded-[10px] bg-white shadow-lg flex items-center justify-center text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-colors pointer-events-auto"
                                aria-label="Anterior"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                type="button"
                                onClick={() => swiperRef.current?.slideNext()}
                                className="w-12 h-12 rounded-[10px] bg-white shadow-lg flex items-center justify-center text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-colors pointer-events-auto"
                                aria-label="Próximo"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>

                        <Swiper
                            modules={[Autoplay, Pagination]}
                            spaceBetween={24}
                            slidesPerView={1}
                            autoplay={
                                reducedMotion
                                    ? false
                                    : { delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }
                            }
                            pagination={{ clickable: true, dynamicBullets: true }}
                            onBeforeInit={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            breakpoints={{
                                640: { slidesPerView: 2, spaceBetween: 20 },
                                1024: { slidesPerView: 3, spaceBetween: 24 },
                            }}
                            className="testimonials-swiper pb-12"
                        >
                            {activeTestimonials.map((testimonial) => (
                                <SwiperSlide key={testimonial.id}>
                                    <div className="h-full mx-2">
                                        <TestimonialCard testimonial={testimonial} />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </motion.div>
                )}

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-8 text-sm text-[var(--color-text-muted)]"
                >
                    Depoimentos reais de membros e visitantes da igreja
                </motion.p>
            </div>
        </section>
    );
}
