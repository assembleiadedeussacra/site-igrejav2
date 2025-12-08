'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import {
    Heart,
    BookOpen,
    HandHelping,
    Users,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
} from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Leader } from '@/lib/database.types';

interface AboutSectionProps {
    leaders: Leader[];
}

const features = [
    {
        icon: Heart,
        title: 'Comunhão Cristã',
        description: 'Uma comunidade unida em Cristo, fundamentada no amor e respeito mútuo.',
    },
    {
        icon: BookOpen,
        title: 'Ensino Bíblico',
        description: 'Pregação e ensino fundamentados nas Escrituras Sagradas para edificação espiritual.',
    },
    {
        icon: HandHelping,
        title: 'Adoração e Oração',
        description: 'Cultos de adoração e momentos de intercessão dedicados à busca da presença divina.',
    },
    {
        icon: Users,
        title: 'Ministérios e Departamentos',
        description: 'Estrutura organizada com diversos ministérios para atender todas as faixas etárias.',
    },
];

export default function AboutSection({ leaders = [] }: AboutSectionProps) {
    const swiperRef = useRef<SwiperType | undefined>(undefined);

    return (
        <section id="sobre" className="section-padding bg-[var(--color-background)]">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-4 section-title">
                        Sobre Nós
                    </h2>
                    <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
                        Conheça nossa história e missão
                    </p>
                </motion.div>

                {/* About Content */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed mb-6">
                            A <strong className="text-[var(--color-accent)]">Assembleia de Deus Missão</strong> em
                            Sacramento, Minas Gerais, é uma igreja evangélica comprometida com a pregação do Evangelho,
                            o ensino bíblico e o desenvolvimento espiritual de seus membros e visitantes.
                        </p>
                        <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed mb-8">
                            Nossa missão é proclamar a Palavra de Deus, promover a adoração genuína e servir a comunidade
                            com amor e dedicação. Estamos abertos a receber todos aqueles que buscam conhecer mais sobre
                            Jesus Cristo e crescer na fé cristã.
                        </p>

                        <Link
                            href="#contato"
                            className="inline-flex items-center gap-2 btn-primary"
                        >
                            Entre em Contato
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-[20px] p-6 shadow-lg hover:shadow-xl transition-shadow group"
                            >
                                <div className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-[var(--color-accent)] mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Leadership Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    {/* Leadership Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-accent)] flex items-center gap-3">
                                <Users className="w-8 h-8 text-[var(--color-primary)]" />
                                Nossa Liderança
                            </h3>
                            <p className="text-[var(--color-text-secondary)] mt-2">
                                Liderança espiritual comprometida com o serviço cristão
                            </p>
                        </div>

                        {/* Navigation Controls */}
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                onClick={() => swiperRef.current?.slidePrev()}
                                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-colors"
                                aria-label="Anterior"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => swiperRef.current?.slideNext()}
                                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-colors"
                                aria-label="Próximo"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Leaders Carousel */}
                    <Swiper
                        modules={[Navigation, Pagination, FreeMode]}
                        spaceBetween={24}
                        slidesPerView={2}
                        freeMode={{ enabled: true, sticky: true }}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        onBeforeInit={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                            },
                            768: {
                                slidesPerView: 3,
                            },
                            1024: {
                                slidesPerView: 4,
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
                                    className="bg-white rounded-[20px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                                >
                                    {/* Image */}
                                    <div className="relative h-56 md:h-64 overflow-hidden">
                                        <Image
                                            src={leader.image_url}
                                            alt={leader.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* Info */}
                                    <div className="p-4 text-center">
                                        <h4 className="font-bold text-[var(--color-accent)] text-lg truncate">
                                            {leader.name}
                                        </h4>
                                        <p className="text-[var(--color-text-secondary)] text-sm">
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
    );
}
