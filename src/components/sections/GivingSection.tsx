'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Copy, Check, QrCode } from 'lucide-react';

import { Financial } from '@/lib/database.types';
import SectionHeader from '@/components/ui/SectionHeader';

interface GivingSectionProps {
    financials: Financial | null;
}

export default function GivingSection({ financials }: GivingSectionProps) {
    const [copied, setCopied] = useState(false);

    if (!financials) return null;

    const copyPixKey = async () => {
        try {
            await navigator.clipboard.writeText(financials.pix_key);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = financials.pix_key;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <section id="doacoes" className="section-padding bg-[var(--color-surface)]">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <SectionHeader
                        eyebrow="Contribua"
                        title="Dízimos e Ofertas"
                        description="Contribua com a obra missionária e ministerial através de dízimos e ofertas"
                    />
                </motion.div>

                {/* Giving Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="relative bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] rounded-[10px] p-5 sm:p-8 md:p-12 shadow-2xl overflow-hidden">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-[10px] -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-[10px] translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="flex items-center justify-center gap-3 mb-8">
                                <Heart className="w-8 h-8 text-[var(--color-primary)]" />
                                <h3 className="text-2xl md:text-3xl font-bold text-white">
                                    Contribua via PIX
                                </h3>
                            </div>

                            {/* Content Grid */}
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                {/* PIX Key */}
                                <div className="space-y-6">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-[10px] p-4 sm:p-6">
                                        <p className="text-white/80 text-sm uppercase tracking-wider mb-2">
                                            Chave PIX (Telefone)
                                        </p>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                            <span className="text-base sm:text-2xl md:text-3xl font-semibold sm:font-bold text-white font-mono break-all leading-snug">
                                                {financials.pix_key}
                                            </span>
                                            <motion.button
                                                onClick={copyPixKey}
                                                whileTap={{ scale: 0.95 }}
                                                className={`p-3 rounded-[10px] transition-all ${copied
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-white/20 text-white hover:bg-white/30'
                                                    }`}
                                                aria-label={copied ? "Chave PIX copiada" : "Copiar chave PIX"}
                                                aria-pressed={copied}
                                            >
                                                {copied ? (
                                                    <Check className="w-5 h-5" />
                                                ) : (
                                                    <Copy className="w-5 h-5" />
                                                )}
                                            </motion.button>
                                        </div>
                                        {copied && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-green-300 text-sm mt-2"
                                            >
                                                Chave copiada!
                                            </motion.p>
                                        )}
                                    </div>

                                    <p className="text-white/80 text-sm">
                                        <span className="hidden sm:inline">Escaneie o QR Code ao lado utilizando o aplicativo do seu banco ou copie a chave PIX acima.</span>
                                        <span className="sm:hidden">Escaneie o QR Code abaixo no app do seu banco ou copie a chave PIX acima.</span>
                                    </p>
                                </div>

                                {/* QR Code */}
                                <div className="flex justify-center">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white rounded-[10px] p-6 shadow-xl"
                                    >
                                        <div className="flex items-center gap-2 text-[var(--color-accent)] mb-4">
                                            <QrCode className="w-5 h-5" />
                                            <span className="font-semibold">QR Code PIX</span>
                                        </div>
                                        <div className="relative w-48 h-48">
                                            <Image
                                                src={financials.pix_qrcode_url}
                                                alt="QR Code PIX para doações"
                                                fill
                                                className="object-contain"
                                                loading="lazy"
                                            />
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Verse */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="mt-10 pt-8 border-t border-white/20"
                            >
                                <blockquote className="text-center">
                                    <p className="text-lg md:text-xl text-white/90 italic mb-3">
                                        &ldquo;Cada um contribua segundo propôs no seu coração; não com
                                        tristeza, ou por necessidade; porque Deus ama ao que dá com
                                        alegria.&rdquo;
                                    </p>
                                    <cite className="text-[var(--color-primary)] font-bold not-italic">
                                        2 Coríntios 9:7
                                    </cite>
                                </blockquote>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
