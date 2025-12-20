'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Leader } from '@/lib/database.types';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface LeadershipSectionProps {
    leaders: Leader[];
    title?: string;
    subtitle?: string;
}

export default function LeadershipSection({ 
    leaders, 
    title = 'Nossa Liderança',
    subtitle = 'Liderança espiritual comprometida com o serviço cristão'
}: LeadershipSectionProps) {
    const swiperRef = useRef<SwiperType | undefined>(undefined);
    const [showNavigation, setShowNavigation] = useState(true);

    // Função para verificar se todas as slides estão visíveis
    const checkIfAllVisible = (swiper: SwiperType | undefined) => {
        if (!swiper) return;
        
        // Obter o número de slides visíveis baseado no breakpoint atual
        let slidesPerView = 2; // padrão mobile
        const width = window.innerWidth;
        
        if (width >= 1280) {
            slidesPerView = 6;
        } else if (width >= 1024) {
            slidesPerView = 5;
        } else if (width >= 768) {
            slidesPerView = 4;
        } else if (width >= 640) {
            slidesPerView = 3;
        }
        
        const totalSlides = leaders.length;
        
        // Se o número de slides visíveis é maior ou igual ao total, esconder navegação
        setShowNavigation(slidesPerView < totalSlides);
    };

    // Verificar quando o componente monta ou quando a janela redimensiona
    useEffect(() => {
        const handleResize = () => {
            if (swiperRef.current) {
                checkIfAllVisible(swiperRef.current);
            }
        };

        // Verificar inicialmente
        setTimeout(() => {
            if (swiperRef.current) {
                checkIfAllVisible(swiperRef.current);
            }
        }, 100);

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [leaders.length]);

    if (leaders.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mt-20"
        >
            {/* Header */}
            <div className="text-center mb-12">
                <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-4 section-title flex items-center justify-center gap-3"
                >
                    <Users className="w-8 h-8 text-[var(--color-primary)]" />
                    {title}
                </motion.h3>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg"
                >
                    {subtitle}
                </motion.p>
            </div>

            {/* Cards Container */}
            <div className="relative">
                {/* Navigation Buttons - Só aparece se nem todos os líderes estão visíveis */}
                {showNavigation && (
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
                    modules={[Navigation, Pagination, FreeMode]}
                    spaceBetween={16}
                    slidesPerView={2}
                    freeMode={{ enabled: true, sticky: true }}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    onBeforeInit={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    onInit={(swiper) => {
                        setTimeout(() => checkIfAllVisible(swiper), 100);
                    }}
                    onResize={(swiper) => {
                        checkIfAllVisible(swiper);
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 3,
                            spaceBetween: 16,
                        },
                        768: {
                            slidesPerView: 4,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 5,
                            spaceBetween: 24,
                        },
                        1280: {
                            slidesPerView: 6,
                            spaceBetween: 24,
                        },
                    }}
                    className="pb-12"
                >
                    {leaders.map((leader, index) => (
                        <SwiperSlide key={leader.id}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-[12px] overflow-visible shadow-md hover:shadow-lg transition-all duration-300 group h-full flex flex-col"
                            >
                                <div className="relative w-full aspect-[5/6] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-[12px]">
                                    <Image
                                        src={leader.image_url}
                                        alt={leader.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 220px"
                                        loading={index < 4 ? 'eager' : 'lazy'}
                                        placeholder="blur"
                                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                <div className="p-3 md:p-4 text-center flex-1 flex flex-col justify-center bg-gradient-to-b from-white to-gray-50/50 rounded-b-[12px]">
                                    <h4 className="font-bold text-[var(--color-accent)] text-base md:text-lg mb-1 line-clamp-2 min-h-[2.5rem] group-hover:text-[var(--color-accent-light)] transition-colors">
                                        {leader.name}
                                    </h4>
                                    <p className="text-[var(--color-text-secondary)] text-sm md:text-base mb-1">
                                        {leader.title}
                                    </p>
                                    {leader.department && (
                                        <span className="inline-block mt-2 px-3 py-1 bg-[var(--color-primary-light)] text-[var(--color-accent)] text-xs rounded-full font-medium">
                                            {leader.department}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </motion.div>
    );
}
