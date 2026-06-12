'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Images, ExternalLink, Church, PartyPopper, Users } from 'lucide-react';

import { GalleryLink } from '@/lib/database.types';
import SectionHeader from '@/components/ui/SectionHeader';

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
                >
                    <SectionHeader
                        eyebrow="Momentos"
                        title="Galeria de Fotos"
                        description="Registros fotográficos de cultos, eventos e atividades ministeriais"
                    />
                </motion.div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                                className="group relative surface-card overflow-hidden hover:shadow-lg transition-all duration-300"
                            >
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={item.cover_image_url}
                                        alt={`Capa do álbum: ${item.title}`}
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
                                            <h3 className="type-card-title group-hover:text-[var(--color-accent-light)] transition-colors">
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
