'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';

import { Testimonial } from '@/lib/database.types';

interface TestimonialsSectionProps {
    testimonials: Testimonial[];
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? 'star-filled fill-current' : 'star-empty'
                        }`}
                />
            ))}
        </div>
    );
}

export default function TestimonialsSection({ testimonials = [] }: TestimonialsSectionProps) {
    const swiperRef = useRef<SwiperType | undefined>(undefined);

    return (
        <section className="section-padding bg-[var(--color-surface)]">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-4 section-title">
                        Depoimentos
                    </h2>
                    <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
                        O que nossos membros dizem sobre a igreja
                    </p>
                </motion.div>

                {/* Testimonials Carousel */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    {/* Navigation Buttons */}
                    <div className="hidden md:flex absolute -left-4 -right-4 top-1/2 -translate-y-1/2 justify-between pointer-events-none z-10">
                        <button
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-colors pointer-events-auto"
                            aria-label="Anterior"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => swiperRef.current?.slideNext()}
                            className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-colors pointer-events-auto"
                            aria-label="Próximo"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={24}
                        slidesPerView={1}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        onBeforeInit={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                        }}
                        className="pb-12"
                    >
                        {testimonials.map((testimonial, index) => (
                            <SwiperSlide key={testimonial.id}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="h-full"
                                >
                                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                                        {/* Quote Icon */}
                                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mb-4">
                                            <Quote className="w-5 h-5 text-[var(--color-accent)]" />
                                        </div>

                                        {/* Rating */}
                                        <div className="mb-4">
                                            <StarRating rating={testimonial.rating} />
                                        </div>

                                        {/* Text */}
                                        <p className="text-[var(--color-text-secondary)] italic flex-1 mb-6">
                                            &ldquo;{testimonial.text}&rdquo;
                                        </p>

                                        {/* Author */}
                                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                            {testimonial.avatar_url ? (
                                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={testimonial.avatar_url}
                                                        alt={testimonial.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] flex items-center justify-center text-white font-bold">
                                                    {getInitials(testimonial.name)}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-[var(--color-accent)]">
                                                    {testimonial.name}
                                                </p>
                                                <p className="text-sm text-[var(--color-text-muted)]">
                                                    Membro da Igreja
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>

                {/* Google Reviews Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-8"
                >
                    <p className="text-[var(--color-text-muted)] text-sm">
                        Avaliações inspiradas no estilo Google My Business
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
