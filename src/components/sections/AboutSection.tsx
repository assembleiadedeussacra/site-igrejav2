'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Heart,
    BookOpen,
    HandHelping,
    Users,
    ArrowRight,
} from 'lucide-react';

import SectionHeader from '@/components/ui/SectionHeader';

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

export default function AboutSection() {
    return (
        <section id="sobre" className="section-padding bg-[var(--color-background)]">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <SectionHeader
                        eyebrow="Nossa igreja"
                        title="Sobre Nós"
                        description="Conheça nossa história e missão"
                    />
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
                        <p className="type-body-lg text-[var(--color-text-secondary)] mb-6">
                            A <strong className="text-[var(--color-accent)]">Assembleia de Deus Missão</strong> em
                            Sacramento, Minas Gerais, é uma igreja evangélica comprometida com a pregação do Evangelho,
                            o ensino bíblico e o desenvolvimento espiritual de seus membros e visitantes.
                        </p>
                        <p className="type-body-lg text-[var(--color-text-secondary)] mb-8">
                            Nossa missão é proclamar a Palavra de Deus, promover a adoração genuína e servir a comunidade
                            com amor e dedicação. Estamos abertos a receber todos aqueles que buscam conhecer mais sobre
                            Jesus Cristo e crescer na fé cristã.
                        </p>

                        <Link
                            href="/sobre-nos"
                            className="inline-flex items-center gap-2 btn-primary"
                        >
                            Saiba mais
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="surface-card p-6 hover:shadow-lg transition-shadow group"
                            >
                                <div className="w-12 h-12 rounded-[10px] bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="type-card-title mb-2">
                                    {feature.title}
                                </h3>
                                <p className="type-card-desc">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
