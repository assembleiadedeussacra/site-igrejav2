'use client';

import { motion } from 'framer-motion';
import {
    Mail,

    MapPin,
    Navigation,
    MessageCircle,
    ExternalLink,
} from 'lucide-react';

import { SiteSettings } from '@/lib/database.types';

interface ContactSectionProps {
    settings: SiteSettings | null;
}

export default function ContactSection({ settings }: ContactSectionProps) {
    const contactItems = [
        {
            icon: Mail,
            title: 'E-mail',
            value: settings?.email || 'contato@assembleiasacramento.com.br',
            href: settings?.email ? `mailto:${settings.email}` : 'mailto:contato@assembleiasacramento.com.br',
            color: 'from-blue-500 to-blue-600',
        },
        {
            icon: MessageCircle,
            title: 'WhatsApp',
            value: settings?.phone ? `(34) ${settings.phone.replace(/(\d{2})(\d{5})(\d{4})/, '$1 $2-$3')}` : '(34) 98432-7019',
            href: settings?.phone ? `https://wa.me/55${settings.phone.replace(/\D/g, '')}` : 'https://wa.me/5534984327019',
            color: 'from-green-500 to-green-600',
        },
        {
            icon: MapPin,
            title: 'Endereço',
            value: settings?.church_address
                ? `${settings.church_address}${settings.church_cep ? `, CEP ${settings.church_cep}` : ''}`
                : 'Rua Carlos R da Cunha n° 90, Sacramento - MG, CEP 38190-000',
            href: null,
            color: 'from-red-500 to-red-600',
        },
    ];

    const googleMapsEmbedUrl = settings?.google_maps_embed ||
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3752.297051983325!2d-47.4459403247695!3d-19.87005303788077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b07700307bd919%3A0x3a9f5477d084270e!2sIgreja%20evang%C3%A9lica%20Assembl%C3%A9ia%20de%20Deus%20Miss%C3%A3o%20Sacramento!5e0!3m2!1spt-BR!2sbr!4v1678886000000!5m2!1spt-BR!2sbr';

    const routesUrl =
        'https://www.google.com/maps/dir/?api=1&destination=Rua+Carlos+R+da+Cunha+90,Sacramento,MG';

    return (
        <section id="contato" className="section-padding bg-[var(--color-background)]">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-4 section-title">
                        Contato
                    </h2>
                    <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">
                        Entre em contato conosco ou venha nos visitar!
                    </p>
                </motion.div>

                {/* Contact Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {contactItems.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {item.href ? (
                                <a
                                    href={item.href}
                                    target={item.href.startsWith('http') ? '_blank' : undefined}
                                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    className="block bg-white rounded-[20px] p-6 shadow-lg hover:shadow-xl transition-all duration-300 group card-hover h-full"
                                >
                                    <div
                                        className={`w-14 h-14 rounded-[20px] bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}
                                    >
                                        <item.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="font-bold text-lg text-[var(--color-accent)] mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] transition-colors">
                                        {item.value}
                                    </p>
                                    <div className="mt-4 flex items-center gap-1 text-sm text-[var(--color-accent)] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        Entrar em contato
                                        <ExternalLink className="w-4 h-4" />
                                    </div>
                                </a>
                            ) : (
                                <div className="bg-white rounded-[20px] p-6 shadow-lg h-full">
                                    <div
                                        className={`w-14 h-14 rounded-[20px] bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 text-white`}
                                    >
                                        <item.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="font-bold text-lg text-[var(--color-accent)] mb-2">
                                        {item.title}
                                    </h3>
                                    <address className="text-[var(--color-text-secondary)] not-italic">
                                        {item.value}
                                    </address>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Map Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <MapPin className="w-8 h-8 text-[var(--color-primary)]" />
                        <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-accent)]">
                            Nossa Localização
                        </h3>
                    </div>

                    <div className="relative bg-white rounded-[20px] shadow-lg overflow-hidden">
                        <div className="aspect-[16/9] md:aspect-[21/9]">
                            <iframe
                                src={googleMapsEmbedUrl}
                                className="w-full h-full border-0"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Mapa da localização da igreja"
                                aria-label="Mapa mostrando a localização da Assembleia de Deus Missão em Sacramento MG"
                            />
                        </div>

                        {/* Routes Button */}
                        <div className="p-4 border-t border-gray-100 flex justify-center">
                            <a
                                href={routesUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)] text-white rounded-[30px] font-semibold hover:shadow-lg transition-all hover:scale-105"
                            >
                                <Navigation className="w-5 h-5 text-white" />
                                <span className="text-white">Obter Rotas</span>
                            </a>
                        </div>
                    </div>
                </motion.div>


            </div>
        </section>
    );
}
