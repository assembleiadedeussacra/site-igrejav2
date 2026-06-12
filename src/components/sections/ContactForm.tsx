'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle, Heart, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { AnalyticsEvents } from '@/lib/analytics';
import { hasAnalyticsConsent } from '@/lib/cookieConsent';

type FormType = 'contact' | 'prayer';

export default function ContactForm() {
    const [formType, setFormType] = useState<FormType>('contact');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        website: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    type: formType,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao enviar mensagem');
            }

            setIsSuccess(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
                website: '',
            });

            if (hasAnalyticsConsent()) {
                AnalyticsEvents.contactFormSubmit();
            }

            toast.success('Mensagem enviada com sucesso!');
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : 'Erro ao enviar. Tente novamente.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[10px] p-8 shadow-lg text-center"
            >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="type-subsection-title mb-2">Mensagem recebida!</h3>
                <p className="text-[var(--color-text-secondary)] mb-6">
                    Obrigado pelo contato. Nossa equipe responderá o mais breve possível.
                </p>
                <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="text-[var(--color-accent)] font-medium hover:underline"
                >
                    Enviar outra mensagem
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[10px] p-6 sm:p-8 shadow-lg"
        >
            <div className="flex items-center gap-3 mb-6">
                <Mail className="w-7 h-7 text-[var(--color-accent)]" />
                <h3 className="type-subsection-title">Envie uma mensagem</h3>
            </div>

            <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-[10px]">
                <button
                    type="button"
                    onClick={() => setFormType('contact')}
                    className={`flex-1 py-2 px-4 rounded-[8px] text-sm font-medium transition-all ${
                        formType === 'contact'
                            ? 'bg-white text-[var(--color-accent)] shadow-sm'
                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]'
                    }`}
                >
                    Contato geral
                </button>
                <button
                    type="button"
                    onClick={() => setFormType('prayer')}
                    className={`flex-1 py-2 px-4 rounded-[8px] text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                        formType === 'prayer'
                            ? 'bg-white text-[var(--color-accent)] shadow-sm'
                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]'
                    }`}
                >
                    <Heart className="w-4 h-4" />
                    Pedido de oração
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={(e) => setFormData((p) => ({ ...p, website: e.target.value }))}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium mb-1">
                            Nome *
                        </label>
                        <input
                            id="contact-name"
                            type="text"
                            required
                            maxLength={100}
                            value={formData.name}
                            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] outline-none"
                            placeholder="Seu nome"
                        />
                    </div>
                    <div>
                        <label htmlFor="contact-phone" className="block text-sm font-medium mb-1">
                            Telefone / WhatsApp
                        </label>
                        <input
                            id="contact-phone"
                            type="tel"
                            maxLength={20}
                            value={formData.phone}
                            onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] outline-none"
                            placeholder="(34) 99999-9999"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium mb-1">
                        E-mail
                    </label>
                    <input
                        id="contact-email"
                        type="email"
                        maxLength={200}
                        value={formData.email}
                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] outline-none"
                        placeholder="seu@email.com"
                    />
                </div>

                {formType === 'contact' && (
                    <div>
                        <label htmlFor="contact-subject" className="block text-sm font-medium mb-1">
                            Assunto
                        </label>
                        <input
                            id="contact-subject"
                            type="text"
                            maxLength={200}
                            value={formData.subject}
                            onChange={(e) =>
                                setFormData((p) => ({ ...p, subject: e.target.value }))
                            }
                            className="w-full px-4 py-2.5 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] outline-none"
                            placeholder="Como podemos ajudar?"
                        />
                    </div>
                )}

                <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium mb-1">
                        {formType === 'prayer' ? 'Seu pedido de oração *' : 'Mensagem *'}
                    </label>
                    <textarea
                        id="contact-message"
                        required
                        rows={5}
                        maxLength={5000}
                        value={formData.message}
                        onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] outline-none resize-y min-h-[120px]"
                        placeholder={
                            formType === 'prayer'
                                ? 'Compartilhe seu pedido de oração conosco...'
                                : 'Escreva sua mensagem...'
                        }
                    />
                </div>

                <p className="text-xs text-[var(--color-text-secondary)]">
                    Ao enviar, você concorda com nossa{' '}
                    <a href="/privacidade" className="text-[var(--color-accent)] underline">
                        Política de Privacidade
                    </a>
                    .
                </p>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)] text-white rounded-[30px] font-semibold hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Enviando...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Enviar mensagem
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
}
