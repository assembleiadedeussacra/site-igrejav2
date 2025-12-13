'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Images, ExternalLink, Church, PartyPopper, Users } from 'lucide-react';

import { GalleryLink } from '@/lib/database.types';

interface GallerySectionProps {
    items: GalleryLink[];
}

const iconMap = {
    church: Church,
    events: PartyPopper,
    departments: Users,
    default: Images,
};

const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('culto')) return iconMap.church;
    if (t.includes('evento')) return iconMap.events;
    if (t.includes('departamento') || t.includes('jovens') || t.includes('irmãs')) return iconMap.departments;
    return iconMap.default;
};

export default function GallerySection({ items = [] }: GallerySectionProps) {
    return (
        <section id="galeria" className="section-padding bg-[var(--color-background)]">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-4 section-title">
                        Galeria de Fotos
                    </h2>
                    <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
                        Registros fotográficos de cultos, eventos e atividades ministeriais
                    </p>
                </motion.div>

                {/* Gallery Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item, index) => {
                        const IconComponent = getIcon(item.title);

                        return (
                            <motion.a
                                key={item.id}
                                href={item.drive_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="group relative bg-white rounded-[10px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={item.cover_image_url}
                                        alt={item.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent)]/90 via-[var(--color-accent)]/40 to-transparent" />

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-[var(--color-accent)]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="text-center text-white">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-[10px] bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                                <Images className="w-8 h-8" />
                                            </div>
                                            <span className="font-semibold">Ver Álbum</span>
                                            <ExternalLink className="w-4 h-4 inline-block ml-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-[10px] bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] flex items-center justify-center text-white">
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-[var(--color-accent)] group-hover:text-[var(--color-accent-light)] transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-[var(--color-text-muted)]">
                                                Clique para ver as fotos
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
