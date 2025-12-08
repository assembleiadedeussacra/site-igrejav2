'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { ChevronDown, MapPin, Info } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import { Banner } from '@/lib/database.types';

interface HeroSectionProps {
    banners: Banner[];
}

export default function HeroSection({ banners = [] }: HeroSectionProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const scrollToContent = () => {
        const verseSection = document.getElementById('versiculo');
        if (verseSection) {
            verseSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="inicio" className="relative h-screen min-h-[600px] max-h-[900px]">
            {/* Background Slider */}
            <div className="absolute inset-0">
                <Swiper
                    modules={[Autoplay, Pagination, EffectFade]}
                    effect="fade"
                    autoplay={{
                        delay: 6000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    loop={banners.length > 1}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                    className="h-full w-full"
                >
                    {banners.map((banner, index) => (
                        <SwiperSlide key={banner.id}>
                            <div className="relative h-full w-full">
                                <Image
                                    src={isMobile ? banner.image_mobile_url : banner.image_desktop_url}
                                    alt={banner.alt_text}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                    sizes="100vw"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent)]/40 via-[var(--color-accent)]/30 to-[var(--color-accent)]/80" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
                <AnimatePresence mode="wait">
                    {banners.length > 0 && banners[activeIndex] && (() => {
                        const currentBanner = banners[activeIndex];
                        const hasLogo = currentBanner.logo_url;
                        const hasTitle = currentBanner.title;
                        const hasDescription = currentBanner.description;
                        const hasButton1 = currentBanner.button1_text && currentBanner.button1_link;
                        const hasButton2 = currentBanner.button2_text && currentBanner.button2_link;

                        return (
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.6 }}
                                className="max-w-4xl mx-auto"
                            >
                                {/* Logo Animation */}
                                {hasLogo && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.5 }}
                                        className="mb-8"
                                    >
                                        <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto rounded-[20px] overflow-hidden border-4 border-white/30 shadow-2xl">
                                            <Image
                                                src={currentBanner.logo_url}
                                                alt="Logo"
                                                fill
                                                className="object-contain"
                                                priority
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {/* Title */}
                                {hasTitle ? (
                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                                    >
                                        {currentBanner.title}
                                    </motion.h1>
                                ) : (
                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                                    >
                                        Assembleia de Deus{' '}
                                        <span className="text-[var(--color-primary)]">
                                            Missão
                                        </span>
                                    </motion.h1>
                                )}

                                {/* Subtitle */}
                                {hasDescription ? (
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.5 }}
                                        className="text-xl md:text-2xl text-white/95 mb-10 max-w-2xl mx-auto font-light"
                                    >
                                        {currentBanner.description}
                                    </motion.p>
                                ) : (
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.5 }}
                                        className="text-xl md:text-2xl text-white/95 mb-10 max-w-2xl mx-auto font-light"
                                    >
                                        Uma igreja comprometida com a Palavra de Deus, a adoração e o serviço cristão
                                    </motion.p>
                                )}

                                {/* CTA Buttons */}
                                {(hasButton1 || hasButton2) ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                        className="flex flex-col sm:flex-row gap-4 justify-center"
                                    >
                                        {hasButton1 && (
                                            <Link
                                                href={currentBanner.button1_link!}
                                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-primary)] text-[var(--color-accent)] font-semibold rounded-[30px] hover:bg-white transition-all shadow-lg hover:shadow-xl"
                                            >
                                                {currentBanner.button1_text}
                                            </Link>
                                        )}
                                        {hasButton2 && (
                                            <Link
                                                href={currentBanner.button2_link!}
                                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-[30px] border-2 border-white/30 hover:bg-white/20 transition-all"
                                            >
                                                {currentBanner.button2_text}
                                            </Link>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                        className="flex flex-col sm:flex-row gap-4 justify-center"
                                    >
                                        <Link
                                            href="#contato"
                                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-primary)] text-[var(--color-accent)] font-semibold rounded-[30px] hover:bg-white transition-all shadow-lg hover:shadow-xl"
                                        >
                                            <MapPin className="w-5 h-5" />
                                            Visite-nos
                                        </Link>
                                        <Link
                                            href="#sobre"
                                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-[30px] border-2 border-white/30 hover:bg-white/20 transition-all"
                                        >
                                            <Info className="w-5 h-5" />
                                            Conheça Nossa História
                                        </Link>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })()}
                </AnimatePresence>

                {/* Scroll Indicator */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    onClick={scrollToContent}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 hover:text-white transition-colors"
                    aria-label="Rolar para baixo"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <ChevronDown className="w-10 h-10" />
                    </motion.div>
                </motion.button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-background)] to-transparent z-10" />
        </section>
    );
}
