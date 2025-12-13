'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    Instagram,
    Mail,
    Phone,
    MapPin,
    Heart,
    ChevronUp,
} from 'lucide-react';

const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/sobre-nos', label: 'Sobre Nós' },
    { href: '/#agenda', label: 'Agenda' },
    { href: '/#contato', label: 'Contato' },
];

const knowledgeLinks = [
    { href: '/estudos', label: 'Estudos e Reflexões' },
    { href: '/blog', label: 'Blog' },
];

import { SiteSettings } from '@/lib/database.types';

interface FooterProps {
    settings?: SiteSettings | null;
}

export default function Footer({ settings }: FooterProps) {
    const contactInfo = [
        {
            icon: MapPin,
            label: 'Endereço',
            value: settings?.church_address || 'Rua Carlos R da Cunha n° 90, Sacramento - MG',
        },
        {
            icon: Phone,
            label: 'WhatsApp',
            value: settings?.phone ? `(34) ${settings.phone.replace(/(\d{2})(\d{5})(\d{4})/, '$1 $2-$3')}` : '(34) 98432-7019',
            href: settings?.phone ? `https://wa.me/55${settings.phone.replace(/\D/g, '')}` : 'https://wa.me/5534984327019',
        },
        {
            icon: Mail,
            label: 'E-mail',
            value: settings?.email || 'contato@assembleiasacramento.com.br',
            href: settings?.email ? `mailto:${settings.email}` : 'mailto:contato@assembleiasacramento.com.br',
        },
    ];

    const socialLinks = [
        {
            icon: Instagram,
            label: settings?.instagram_handle || '@assembleiasacramento',
            href: settings?.instagram_url || 'https://www.instagram.com/assembleiasacramento/',
        },
    ];
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[var(--color-accent)] text-white overflow-hidden">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <div className="container-custom relative">
                {/* Main Footer Content */}
                <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-1"
                    >
                        <Link href="/" className="inline-flex items-center gap-3 mb-6">
                            <div className="relative w-14 h-14 rounded-[10px] overflow-hidden border-2 border-white/30 shadow-lg">
                                <Image
                                    src="/images/logo-igreja.png"
                                    alt="Logo Assembleia de Deus Missão"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl">AD Missão</h3>
                                <p className="text-white/70 text-sm">Sacramento/MG</p>
                            </div>
                        </Link>
                        <p className="text-white/80 mb-6 leading-relaxed">
                            Igreja evangélica comprometida com a pregação do Evangelho, o ensino bíblico
                            e o serviço cristão. Estamos abertos para receber você e sua família.
                        </p>
                        <div className="flex flex-col gap-2">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.href}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-white/80 hover:text-[var(--color-primary)] transition-colors"
                                >
                                    <social.icon className="w-5 h-5" />
                                    <span className="text-sm">{social.label}</span>
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-[var(--color-primary)]" />
                            Links Rápidos
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/80 hover:text-[var(--color-primary)] transition-colors hover:translate-x-1 inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Knowledge Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-[var(--color-primary)]" />
                            Conhecimento
                        </h4>
                        <ul className="space-y-3">
                            {knowledgeLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/80 hover:text-[var(--color-primary)] transition-colors hover:translate-x-1 inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    href="/#doacoes"
                                    className="text-white/80 hover:text-[var(--color-primary)] transition-colors hover:translate-x-1 inline-block"
                                >
                                    Dízimos e Ofertas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#galeria"
                                    className="text-white/80 hover:text-[var(--color-primary)] transition-colors hover:translate-x-1 inline-block"
                                >
                                    Galeria de Fotos
                                </Link>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-[var(--color-primary)]" />
                            Contato
                        </h4>
                        <ul className="space-y-4">
                            {contactInfo.map((item) => (
                                <li key={item.label} className="flex items-start gap-3">
                                    <item.icon className="w-5 h-5 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-white/60 text-xs uppercase tracking-wider">
                                            {item.label}
                                        </p>
                                        {item.href ? (
                                            <a
                                                href={item.href}
                                                className="text-white/90 hover:text-[var(--color-primary)] transition-colors"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {item.value}
                                            </a>
                                        ) : (
                                            <p className="text-white/90">{item.value}</p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-white/60 text-sm text-center md:text-left">
                            © {currentYear} Assembleia de Deus Missão - Sacramento/MG. Todos os
                            direitos reservados.
                        </p>
                        <p className="text-white/60 text-sm flex items-center gap-1">
                            Feito com <Heart className="w-4 h-4 text-red-400 fill-red-400" /> para
                            a glória de Deus
                        </p>
                    </div>
                </div>
            </div>

            {/* Back to Top Button */}
            <button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 w-12 h-12 bg-[var(--color-primary)] text-[var(--color-accent)] rounded-[10px] shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40"
                aria-label="Voltar ao topo"
            >
                <ChevronUp className="w-6 h-6" />
            </button>
        </footer>
    );
}
