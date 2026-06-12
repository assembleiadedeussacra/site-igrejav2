'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

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
        <section
            id="doacoes"
            className="section-padding bg-[var(--color-surface)] border-t border-[var(--color-primary)]/20 scroll-mt-20"
        >
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <SectionHeader
                        title="Dízimos e Ofertas"
                        description="Contribua com a obra da igreja através do PIX"
                        className="mb-8 sm:mb-10"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 }}
                    className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
                >
                    {/* Coluna 1 — Chave PIX */}
                    <div className="text-center md:text-left">
                        <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                            Chave PIX · Telefone
                        </p>

                        <div className="flex items-stretch gap-2 max-w-md mx-auto md:mx-0">
                            <div className="flex-1 min-w-0 flex items-center px-4 py-3 rounded-[10px] bg-[var(--color-background)] border border-[var(--color-primary)]/20">
                                <span className="contact-value text-[var(--color-accent)] font-mono font-medium break-all">
                                    {financials.pix_key}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={copyPixKey}
                                className={`px-3 rounded-[10px] border transition-colors flex-shrink-0 ${
                                    copied
                                        ? 'bg-green-50 border-green-200 text-green-700'
                                        : 'bg-[var(--color-background)] border-[var(--color-primary)]/20 text-[var(--color-accent)] hover:border-[var(--color-accent)]/25'
                                }`}
                                aria-label={copied ? 'Chave PIX copiada' : 'Copiar chave PIX'}
                                aria-pressed={copied}
                            >
                                {copied ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </button>
                        </div>

                        {copied && (
                            <p className="text-xs text-green-600 mt-2">Chave copiada</p>
                        )}

                        <p className="text-sm text-[var(--color-text-secondary)] mt-4 leading-relaxed max-w-md mx-auto md:mx-0">
                            Copie a chave ou escaneie o QR Code ao lado no aplicativo do seu banco.
                        </p>

                        <p className="text-xs text-[var(--color-text-muted)] italic mt-5 max-w-md mx-auto md:mx-0">
                            &ldquo;Deus ama ao que dá com alegria.&rdquo; — 2 Coríntios 9:7
                        </p>
                    </div>

                    {/* Coluna 2 — QR Code */}
                    <div className="flex justify-center md:justify-end">
                        <div className="rounded-[10px] bg-[var(--color-background)] border border-[var(--color-primary)]/20 p-4">
                            <div className="relative w-36 h-36 sm:w-40 sm:h-40">
                                <Image
                                    src={financials.pix_qrcode_url}
                                    alt="QR Code PIX para doações"
                                    fill
                                    className="object-contain"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
