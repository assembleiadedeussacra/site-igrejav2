'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AboutPageCover, Department, DepartmentMember, Leader } from '@/lib/database.types';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface AboutPageSectionProps {
    cover: AboutPageCover | null;
    departments: Department[];
    departmentMembers: Record<string, DepartmentMember[]>;
    leaders: Leader[];
}

export default function AboutPageSection({
    cover,
    departments,
    departmentMembers,
    leaders,
}: AboutPageSectionProps) {
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
        departments.length > 0 ? departments[0].id : null
    );
    const leadersSwiperRef = useRef<SwiperType | undefined>(undefined);

    return (
        <>
            {/* Cover Section */}
            {cover && (
                <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={cover.image_url}
                            alt={cover.title}
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
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                        >
                            {cover.title}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto"
                        >
                            {cover.description}
                        </motion.p>
                    </div>
                </section>
            )}

            {/* Church Content Section */}
            {cover && (cover.church_text_part1 || cover.church_image_url || cover.church_text_part2) && (
                <section className="section-padding bg-[var(--color-background)]">
                    <div className="container-custom">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="grid lg:grid-cols-2 gap-8 items-start"
                        >
                            {/* Part 1: Text */}
                            {cover.church_text_part1 && (
                                <div className="prose prose-lg max-w-none">
                                    <div 
                                        className="text-[var(--color-text-secondary)] leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: cover.church_text_part1 }}
                                    />
                                </div>
                            )}

                            {/* Image */}
                            {cover.church_image_url && (
                                <div className="relative w-full h-[400px] md:h-[500px] rounded-[10px] overflow-hidden">
                                    <Image
                                        src={cover.church_image_url}
                                        alt="Igreja"
                                        fill
                                        className="object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            )}

                            {/* Part 2: Continuation Text - Full Width */}
                            {cover.church_text_part2 && (
                                <div className="lg:col-span-2 prose prose-lg max-w-none mt-4">
                                    <div 
                                        className="text-[var(--color-text-secondary)] leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: cover.church_text_part2 }}
                                    />
                                </div>
                            )}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Leaders Section */}
            {leaders.length > 0 && (
                <section className="section-padding bg-white">
                    <div className="container-custom">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-4 section-title">
                                Liderança à Frente
                            </h2>
                            <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
                                Conheça os líderes que guiam nossa igreja
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative px-4 md:px-8"
                        >
                            {/* Navigation Buttons */}
                            {leaders.length > 3 && (
                                <div className="hidden md:flex absolute -left-2 -right-2 top-1/2 -translate-y-1/2 justify-between pointer-events-none z-10">
                                    <button
                                        onClick={() => leadersSwiperRef.current?.slidePrev()}
                                        className="w-12 h-12 rounded-[10px] bg-white shadow-lg flex items-center justify-center text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-colors pointer-events-auto"
                                        aria-label="Anterior"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => leadersSwiperRef.current?.slideNext()}
                                        className="w-12 h-12 rounded-[10px] bg-white shadow-lg flex items-center justify-center text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-colors pointer-events-auto"
                                        aria-label="Próximo"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>
                            )}

                            <Swiper
                                modules={[Navigation, Pagination, FreeMode]}
                                spaceBetween={20}
                                slidesPerView={1}
                                freeMode={{ enabled: true, sticky: true }}
                                pagination={{ clickable: true, dynamicBullets: true }}
                                onBeforeInit={(swiper) => {
                                    leadersSwiperRef.current = swiper;
                                }}
                                breakpoints={{
                                    640: {
                                        slidesPerView: 2,
                                        spaceBetween: 20,
                                    },
                                    768: {
                                        slidesPerView: 3,
                                        spaceBetween: 20,
                                    },
                                    1024: {
                                        slidesPerView: 4,
                                        spaceBetween: 24,
                                    },
                                    1280: {
                                        slidesPerView: 5,
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
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-white rounded-[10px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
                                        >
                                            <div className="relative h-48 md:h-56 overflow-hidden">
                                                <Image
                                                    src={leader.image_url}
                                                    alt={leader.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                            <div className="p-4 md:p-5 text-center">
                                                <h4 className="font-bold text-[var(--color-accent)] text-base md:text-lg mb-1 truncate">
                                                    {leader.name}
                                                </h4>
                                                <p className="text-[var(--color-text-secondary)] text-xs md:text-sm">
                                                    {leader.title}
                                                </p>
                                            </div>
                                        </motion.div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Departments Section */}
            <section id="departamentos" className="section-padding bg-[var(--color-background)] scroll-mt-20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-4 section-title">
                            Nossos Departamentos
                        </h2>
                        <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
                            Conheça os departamentos e ministérios da nossa igreja
                        </p>
                    </motion.div>

                    {/* Department Buttons */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {departments.map((department) => (
                            <motion.button
                                key={department.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                onClick={() => setSelectedDepartment(department.id)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                                    selectedDepartment === department.id
                                        ? 'bg-[var(--color-accent)] text-white shadow-lg scale-105'
                                        : 'bg-white text-[var(--color-accent)] border-2 border-[var(--color-accent)]/30 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 hover:shadow-md'
                                }`}
                            >
                                {department.name}
                            </motion.button>
                        ))}
                    </div>

                    {/* Selected Department Content */}
                    <AnimatePresence mode="wait">
                        {selectedDepartment && (
                            <motion.div
                                key={selectedDepartment}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {(() => {
                                    const department = departments.find((d) => d.id === selectedDepartment);
                                    if (!department) return null;

                                    const members = departmentMembers[department.id] || [];

                                    return (
                                        <div className="bg-white rounded-[10px] shadow-sm border border-gray-200 p-6 space-y-8">
                                            {/* Members Carousel */}
                                            {members.length > 0 && (
                                                <div>
                                                    <div className="flex items-center justify-between mb-6">
                                                        <h4 className="text-[24px] font-bold text-[var(--color-accent)]">
                                                            Liderança e Integrantes
                                                        </h4>
                                                        <span className="text-sm text-[var(--color-text-secondary)] bg-[var(--color-primary-light)] px-3 py-1 rounded-full">
                                                            {members.length} {members.length === 1 ? 'membro' : 'membros'}
                                                        </span>
                                                    </div>
                                                    <DepartmentMembersCarousel members={members} />
                                                </div>
                                            )}

                                            {/* Department Image - Full Display */}
                                            {department.image_url && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="relative w-full min-h-[400px] rounded-[10px] overflow-hidden bg-gray-100 flex items-center justify-center"
                                                >
                                                    <Image
                                                        src={department.image_url}
                                                        alt={department.name}
                                                        width={1200}
                                                        height={800}
                                                        className="w-full h-auto object-contain"
                                                        loading="lazy"
                                                    />
                                                </motion.div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </>
    );
}

function DepartmentMembersCarousel({ members }: { members: DepartmentMember[] }) {
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
        
        const totalSlides = members.length;
        
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
    }, [members.length]);

    return (
        <div className="relative">
            {/* Navigation Buttons - Só aparece se nem todos os membros estão visíveis */}
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
                        spaceBetween: 16,
                    },
                    1024: {
                        slidesPerView: 5,
                        spaceBetween: 20,
                    },
                    1280: {
                        slidesPerView: 6,
                        spaceBetween: 20,
                    },
                }}
                className="pb-12"
            >
                {members.map((member) => (
                    <SwiperSlide key={member.id}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[8px] shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                        >
                            <div className="relative w-full h-44 md:h-48 overflow-hidden">
                                <Image
                                    src={member.image_url}
                                    alt={member.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="p-2.5 md:p-3 text-center">
                                <h5 className="font-semibold text-[var(--color-accent)] mb-0.5 text-xs md:text-sm truncate">
                                    {member.name}
                                </h5>
                                <p className="text-[10px] md:text-xs text-[var(--color-text-secondary)] line-clamp-2">
                                    {member.role}
                                </p>
                            </div>
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
