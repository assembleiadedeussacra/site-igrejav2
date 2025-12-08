'use client';

import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    BookOpen,
    Cross,
    HandHelping,
    GraduationCap,
    Info,
} from 'lucide-react';

import { Event as DBEvent } from '@/lib/database.types';

interface ScheduleSectionProps {
    events: DBEvent[];
}

export default function ScheduleSection({ events = [] }: ScheduleSectionProps) {
    // If no events provided, maybe fall back to empty or hardcoded?
    // Let's assume passed events or empty array.

    // Sort events by day/time if needed? The database query already orders by created_at.
    // Ideally we order by day of week but that's complex since it's string.
    // Let's trust the input order or simple map.

    const googleCalendarUrl =
        'https://calendar.google.com/calendar/embed?height=400&wkst=1&ctz=America%2FSao_Paulo&showPrint=0&mode=WEEK&hl=pt_BR&showCalendars=0&showTitle=0&title=Cronograma%20ADDMS&src=YXNzZW1ibGVpYWRlZGV1c3NhY3JhMjBAZ21haWwuY29t&color=%23232d82';

    const eventTypeConfig = {
        culto: {
            icon: Cross,
            badge: 'badge-culto',
            label: 'Culto',
        },
        estudo: {
            icon: BookOpen,
            badge: 'badge-estudo',
            label: 'Estudo',
        },
        oracao: {
            icon: HandHelping,
            badge: 'badge-oracao',
            label: 'Oração',
        },
        ebd: {
            icon: GraduationCap,
            badge: 'badge-ebd',
            label: 'EBD',
        },
    };

    return (
        <section id="agenda" className="section-padding bg-[var(--color-background)]">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-4 section-title">
                        Agenda
                    </h2>
                    <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
                        Fique por dentro dos nossos cultos e eventos
                    </p>
                </motion.div>

                {/* Google Calendar Embed */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="aspect-[16/9] md:aspect-[21/9]">
                            <iframe
                                src={googleCalendarUrl}
                                className="w-full h-full border-0"
                                title="Calendário de Eventos da Igreja"
                                loading="lazy"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-4 text-[var(--color-text-secondary)] text-sm">
                        <Info className="w-4 h-4" />
                        <span>
                            A agenda pode sofrer alterações. Confirme os detalhes nos cultos ou
                            entre em contato.
                        </span>
                    </div>
                </motion.div>

                {/* Fixed Schedule */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <Clock className="w-8 h-8 text-[var(--color-primary)]" />
                        <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-accent)]">
                            Programação Fixa
                        </h3>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {events.map((event, index) => {
                            const config = eventTypeConfig[event.type];
                            const IconComponent = config.icon;

                            return (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 card-hover group"
                                >
                                    {/* Badge */}
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.badge} mb-4`}
                                    >
                                        <IconComponent className="w-3.5 h-3.5" />
                                        {config.label}
                                    </span>

                                    {/* Title */}
                                    <h4 className="font-bold text-lg text-[var(--color-accent)] mb-2 group-hover:text-[var(--color-accent-light)] transition-colors">
                                        {event.title}
                                    </h4>

                                    {/* Day */}
                                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)] mb-2">
                                        <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                                        <span className="font-medium">{event.day_of_week}</span>
                                    </div>

                                    {/* Time */}
                                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)] mb-4">
                                        <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                                        <span>
                                            {event.time_start}
                                            {event.time_end && ` - ${event.time_end}`}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    {event.description && (
                                        <p className="text-sm text-[var(--color-text-muted)]">
                                            {event.description}
                                        </p>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
