'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Save, Loader2, Sparkles, Trash2, ExternalLink } from 'lucide-react';
import { AdminPageHeader, AdminPanel } from '@/components/admin';
import { api } from '@/services/api';
import { fetchDailyVerse } from '@/services/verse-api';
import { triggerContentRevalidation } from '@/lib/admin/triggerRevalidation';
import type { Verse } from '@/lib/database.types';
import toast from 'react-hot-toast';

function getBrasiliaDateString(): string {
    const now = new Date();
    const brasiliaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    return brasiliaTime.toISOString().split('T')[0];
}

function formatDisplayDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}

export default function AdminVersiculoPage() {
    const [verses, setVerses] = useState<Verse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        active_date: getBrasiliaDateString(),
        text: '',
        reference: '',
        bible_link: '',
    });

    const today = getBrasiliaDateString();
    const todayVerse = verses.find((v) => v.active_date === today);

    const loadVerses = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.getAdminVerses();
            const list = data as Verse[];
            setVerses(list);
            const todayDate = getBrasiliaDateString();
            const forDate = list.find((v) => v.active_date === todayDate);
            if (forDate) {
                setFormData({
                    active_date: forDate.active_date,
                    text: forDate.text,
                    reference: forDate.reference,
                    bible_link: forDate.bible_link || '',
                });
            }
        } catch (error) {
            console.error('Error loading verses:', error);
            toast.error('Erro ao carregar versículos.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadVerses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDateChange = (date: string) => {
        setFormData((prev) => {
            const existing = verses.find((v) => v.active_date === date);
            if (existing) {
                return {
                    active_date: date,
                    text: existing.text,
                    reference: existing.reference,
                    bible_link: existing.bible_link || '',
                };
            }
            return { ...prev, active_date: date, text: '', reference: '', bible_link: '' };
        });
    };

    const handleSuggest = async () => {
        const suggestion = await fetchDailyVerse();
        if (!suggestion) {
            toast.error('Não foi possível obter sugestão.');
            return;
        }
        setFormData((prev) => ({
            ...prev,
            text: suggestion.text,
            reference: suggestion.reference,
            bible_link: suggestion.bible_link || '',
        }));
        toast.success('Sugestão aplicada ao formulário.');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.text.trim() || !formData.reference.trim()) {
            toast.error('Texto e referência são obrigatórios.');
            return;
        }

        setIsSaving(true);
        try {
            await api.upsertVerseForDate({
                active_date: formData.active_date,
                text: formData.text.trim(),
                reference: formData.reference.trim(),
                bible_link: formData.bible_link.trim() || null,
            });
            toast.success('Versículo salvo com sucesso!');
            await loadVerses();
            await triggerContentRevalidation();
        } catch (error) {
            console.error('Error saving verse:', error);
            toast.error('Erro ao salvar versículo.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir este versículo?')) return;
        try {
            await api.deleteVerse(id);
            toast.success('Versículo excluído.');
            await loadVerses();
            await triggerContentRevalidation();
        } catch (error) {
            console.error('Error deleting verse:', error);
            toast.error('Erro ao excluir versículo.');
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Versículo do Dia"
                description="Defina o versículo exibido na página inicial por data"
            />

            <AdminPanel isLoading={isLoading} loadingMessage="Carregando versículos...">
                <div className="p-6 grid lg:grid-cols-2 gap-8">
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                        <h2 className="admin-section-title mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5" /> Hoje no site
                        </h2>
                        {todayVerse ? (
                            <div className="admin-verse-preview bg-gradient-to-br from-[var(--color-primary)]/20 to-white rounded-[10px] p-6 mb-4">
                                <blockquote className="text-lg italic text-[var(--color-accent)] mb-2">
                                    &ldquo;{todayVerse.text}&rdquo;
                                </blockquote>
                                <cite className="text-[var(--color-accent)] font-bold not-italic">
                                    {todayVerse.reference}
                                </cite>
                                {todayVerse.bible_link && (
                                    <a
                                        href={todayVerse.bible_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 mt-3 admin-help hover:underline"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" /> Ver na Bíblia
                                    </a>
                                )}
                            </div>
                        ) : (
                            <div className="admin-empty-text rounded-[10px] border border-dashed border-gray-200 p-6 mb-4">
                                Nenhum versículo cadastrado para hoje ({formatDisplayDate(today)}).
                                O site usa a rotação automática até você definir um.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="admin-label mb-1">Data</label>
                                <input
                                    type="date"
                                    value={formData.active_date}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none admin-input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="admin-label mb-1">Texto *</label>
                                <textarea
                                    value={formData.text}
                                    onChange={(e) => setFormData((p) => ({ ...p, text: e.target.value }))}
                                    rows={4}
                                    className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none resize-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="admin-label mb-1">Referência *</label>
                                <input
                                    type="text"
                                    value={formData.reference}
                                    onChange={(e) => setFormData((p) => ({ ...p, reference: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none"
                                    placeholder="Ex: João 3:16"
                                    required
                                />
                            </div>
                            <div>
                                <label className="admin-label mb-1">Link da Bíblia (opcional)</label>
                                <input
                                    type="url"
                                    value={formData.bible_link}
                                    onChange={(e) => setFormData((p) => ({ ...p, bible_link: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none"
                                    placeholder="https://www.bible.com/..."
                                />
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={handleSuggest}
                                    className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-accent)] text-[var(--color-accent)] rounded-[30px] hover:bg-[var(--color-accent)]/10"
                                >
                                    <Sparkles className="w-4 h-4" /> Sugestão automática
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)] disabled:opacity-70"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" /> Salvar versículo
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <h2 className="admin-section-title mb-4">Versículos cadastrados</h2>
                        {verses.length === 0 ? (
                            <p className="admin-empty-text">Nenhum versículo no banco ainda.</p>
                        ) : (
                            <ul className="space-y-3 max-h-[32rem] overflow-y-auto">
                                {verses.map((v) => (
                                    <li
                                        key={v.id}
                                        className="flex items-start justify-between gap-3 p-4 rounded-[10px] border border-gray-100 bg-gray-50/50"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="admin-card-title">{formatDisplayDate(v.active_date)}</p>
                                            <p className="admin-card-meta truncate">{v.reference}</p>
                                            <p className="admin-card-desc line-clamp-2 mt-1">{v.text}</p>
                                        </div>
                                        <div className="flex shrink-0 gap-1">
                                            <button
                                                type="button"
                                                onClick={() => handleDateChange(v.active_date)}
                                                className="p-2 rounded-[10px] text-[var(--color-accent)] hover:bg-[var(--color-primary)]/20"
                                                title="Editar"
                                            >
                                                <BookOpen className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(v.id)}
                                                className="p-2 rounded-[10px] text-red-600 hover:bg-red-50"
                                                title="Excluir"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                </div>
            </AdminPanel>
        </div>
    );
}
