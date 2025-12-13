'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, Pagination, EffectFade, Navigation } from 'swiper/modules';
import { ChevronDown, MapPin, Info, ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

import { Banner } from '@/lib/database.types';

interface HeroSectionProps {
    banners: Banner[];
}

// Helper function to get button styles
const getButtonStyles = (
    banner: Banner,
    buttonNumber: 1 | 2
): {
    className: string;
    style: React.CSSProperties;
} => {
    const isButton1 = buttonNumber === 1;
    const prefix = isButton1 ? 'button1' : 'button2';
    
    // Get values or use defaults
    const bgColor = banner[`${prefix}_bg_color` as keyof Banner] as string || (isButton1 ? '#ffffff' : 'rgba(255, 255, 255, 0.1)');
    const textColor = banner[`${prefix}_text_color` as keyof Banner] as string || (isButton1 ? '#1a1a1a' : '#ffffff');
    const hoverBgColor = banner[`${prefix}_hover_bg_color` as keyof Banner] as string || (isButton1 ? '#f0f0f0' : 'rgba(255, 255, 255, 0.2)');
    const hoverTextColor = banner[`${prefix}_hover_text_color` as keyof Banner] as string || textColor;
    const size = (banner[`${prefix}_size` as keyof Banner] as 'sm' | 'md' | 'lg') || 'md';
    const style = (banner[`${prefix}_style` as keyof Banner] as 'solid' | 'outline' | 'ghost') || (isButton1 ? 'solid' : 'outline');
    
    // Size classes
    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-8 py-4 text-base',
        lg: 'px-12 py-6 text-lg',
    };
    
    // Base classes (border-radius será aplicado via inline style)
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold transition-all';
    
    // Style-specific classes
    let styleClasses = '';
    if (style === 'solid') {
        styleClasses = 'shadow-lg hover:shadow-xl';
    } else if (style === 'outline') {
        styleClasses = 'border-2 backdrop-blur-sm';
    } else if (style === 'ghost') {
        styleClasses = 'bg-transparent';
    }
    
    // Get border radius
    const borderRadius = (banner[`${prefix}_border_radius` as keyof Banner] as number) || 10;
    
    const className = `${baseClasses} ${sizeClasses[size]} ${styleClasses}`;
    
    // Inline styles
    const inlineStyle: React.CSSProperties & {
        '--hover-bg'?: string;
        '--hover-text'?: string;
    } = {
        backgroundColor: style === 'ghost' ? 'transparent' : bgColor,
        color: textColor,
        borderColor: style === 'outline' ? (bgColor.includes('rgba') ? bgColor : `${bgColor}80`) : 'transparent',
        borderRadius: `${borderRadius}px`,
        '--hover-bg': hoverBgColor,
        '--hover-text': hoverTextColor,
    };
    
    return { className, style: inlineStyle };
};

export default function HeroSection({ banners = [] }: HeroSectionProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef<SwiperType | null>(null);

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
                    modules={[Autoplay, Pagination, EffectFade, Navigation]}
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
                    onBeforeInit={(swiper) => {
                        swiperRef.current = swiper;
                    }}
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
                                {(() => {
                                    const opacity = banner.overlay_opacity || 50;
                                    const overlayColor = banner.overlay_color || '#232d82';
                                    
                                    // Converter cor hex para RGB
                                    const hexToRgb = (hex: string) => {
                                        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                                        return result ? {
                                            r: parseInt(result[1], 16),
                                            g: parseInt(result[2], 16),
                                            b: parseInt(result[3], 16)
                                        } : { r: 35, g: 45, b: 130 }; // fallback para cor padrão
                                    };
                                    
                                    const rgb = hexToRgb(overlayColor);
                                    
                                    // Converter 0-100 para 0-1 e aplicar nas opacidades do gradient
                                    const opacityValue = opacity / 100;
                                    // Topo: 40% da opacidade configurada
                                    const fromOpacity = 0.4 * opacityValue;
                                    // Meio: 30% da opacidade configurada
                                    const viaOpacity = 0.3 * opacityValue;
                                    // Base: 80% da opacidade configurada
                                    const toOpacity = 0.8 * opacityValue;
                                    
                                    return (
                                        <div 
                                            className="absolute inset-0"
                                            style={{
                                                background: `linear-gradient(to bottom, 
                                                    rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${fromOpacity}) 0%, 
                                                    rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${viaOpacity}) 50%, 
                                                    rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${toOpacity}) 100%)`
                                            }}
                                        />
                                    );
                                })()}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                
                {/* Custom Navigation Arrows */}
                {banners.length > 1 && (
                    <>
                        <button
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all flex items-center justify-center text-white border-2 border-white/30 hover:border-white/50"
                            aria-label="Slide anterior"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => swiperRef.current?.slideNext()}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all flex items-center justify-center text-white border-2 border-white/30 hover:border-white/50"
                            aria-label="Próximo slide"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}
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
                                        {currentBanner.logo_url && (
                                            <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto rounded-[10px] overflow-hidden border-4 border-white/30 shadow-2xl">
                                                <Image
                                                    src={currentBanner.logo_url}
                                                    alt="Logo"
                                                    fill
                                                    className="object-contain"
                                                    priority
                                                />
                                            </div>
                                        )}
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
                                        {hasButton1 && (() => {
                                            const buttonStyles = getButtonStyles(currentBanner, 1);
                                            const prefix = 'button1';
                                            const bgColor = currentBanner[`${prefix}_bg_color` as keyof Banner] as string || '#ffffff';
                                            const textColor = currentBanner[`${prefix}_text_color` as keyof Banner] as string || '#1a1a1a';
                                            const hoverBgColor = currentBanner[`${prefix}_hover_bg_color` as keyof Banner] as string || '#f0f0f0';
                                            const hoverTextColor = currentBanner[`${prefix}_hover_text_color` as keyof Banner] as string || textColor;
                                            const style = (currentBanner[`${prefix}_style` as keyof Banner] as 'solid' | 'outline' | 'ghost') || 'solid';
                                            const openNewTab = currentBanner.button1_open_new_tab || false;
                                            
                                            return (
                                                <Link
                                                    href={currentBanner.button1_link!}
                                                    className={buttonStyles.className}
                                                    style={buttonStyles.style}
                                                    target={openNewTab ? '_blank' : undefined}
                                                    rel={openNewTab ? 'noopener noreferrer' : undefined}
                                                    onMouseEnter={(e) => {
                                                        const target = e.currentTarget;
                                                        target.style.backgroundColor = style === 'ghost' ? 'transparent' : hoverBgColor;
                                                        target.style.color = hoverTextColor;
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        const target = e.currentTarget;
                                                        target.style.backgroundColor = style === 'ghost' ? 'transparent' : bgColor;
                                                        target.style.color = textColor;
                                                    }}
                                                >
                                                    {currentBanner.button1_text}
                                                </Link>
                                            );
                                        })()}
                                        {hasButton2 && (() => {
                                            const globalStyle = currentBanner.buttons_global_style || 'individual';
                                            const buttonStyles = globalStyle === 'unified' 
                                                ? getButtonStyles(currentBanner, 1) 
                                                : getButtonStyles(currentBanner, 2);
                                            
                                            const prefix = globalStyle === 'unified' ? 'button1' : 'button2';
                                            const bgColor = currentBanner[`${prefix}_bg_color` as keyof Banner] as string || (globalStyle === 'unified' ? '#ffffff' : 'rgba(255, 255, 255, 0.1)');
                                            const textColor = currentBanner[`${prefix}_text_color` as keyof Banner] as string || (globalStyle === 'unified' ? '#1a1a1a' : '#ffffff');
                                            const hoverBgColor = currentBanner[`${prefix}_hover_bg_color` as keyof Banner] as string || (globalStyle === 'unified' ? '#f0f0f0' : 'rgba(255, 255, 255, 0.2)');
                                            const hoverTextColor = currentBanner[`${prefix}_hover_text_color` as keyof Banner] as string || textColor;
                                            const style = (currentBanner[`${prefix}_style` as keyof Banner] as 'solid' | 'outline' | 'ghost') || (globalStyle === 'unified' ? 'solid' : 'outline');
                                            const openNewTab = currentBanner.button2_open_new_tab || false;
                                            
                                            // Se unificado, usar border-radius do botão 1, senão usar do botão 2
                                            const borderRadius = globalStyle === 'unified' 
                                                ? (currentBanner.button1_border_radius || 10)
                                                : (currentBanner.button2_border_radius || 10);
                                            
                                            return (
                                                <Link
                                                    href={currentBanner.button2_link!}
                                                    className={buttonStyles.className}
                                                    style={{ ...buttonStyles.style, borderRadius: `${borderRadius}px` }}
                                                    target={openNewTab ? '_blank' : undefined}
                                                    rel={openNewTab ? 'noopener noreferrer' : undefined}
                                                    onMouseEnter={(e) => {
                                                        const target = e.currentTarget;
                                                        target.style.backgroundColor = style === 'ghost' ? 'transparent' : hoverBgColor;
                                                        target.style.color = hoverTextColor;
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        const target = e.currentTarget;
                                                        target.style.backgroundColor = style === 'ghost' ? 'transparent' : bgColor;
                                                        target.style.color = textColor;
                                                    }}
                                                >
                                                    {currentBanner.button2_text}
                                                </Link>
                                            );
                                        })()}
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
