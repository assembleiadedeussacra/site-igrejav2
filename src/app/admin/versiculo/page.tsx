'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, RefreshCw, ExternalLink, Save, Loader2 } from 'lucide-react';

interface Verse {
    text: string;
    reference: string;
    bible_link: string;
}

const fallbackVerses: Verse[] = [
    { text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.', reference: 'João 3:16', bible_link: 'https://www.bible.com/pt/bible/211/JHN.3.16' },
    { text: 'O Senhor é o meu pastor; nada me faltará.', reference: 'Salmos 23:1', bible_link: 'https://www.bible.com/pt/bible/211/PSA.23.1' },
    { text: 'Tudo posso naquele que me fortalece.', reference: 'Filipenses 4:13', bible_link: 'https://www.bible.com/pt/bible/211/PHP.4.13' },
];

export default function AdminVersiculoPage() {
    const [verse, setVerse] = useState<Verse>(fallbackVerses[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({ text: verse.text, reference: verse.reference, bible_link: verse.bible_link });

    const refreshVerse = () => {
        setIsLoading(true);
        setTimeout(() => {
            const randomVerse = fallbackVerses[Math.floor(Math.random() * fallbackVerses.length)];
            setVerse(randomVerse);
            setFormData({ text: randomVerse.text, reference: randomVerse.reference, bible_link: randomVerse.bible_link });
            setIsLoading(false);
        }, 500);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await new Promise((r) => setTimeout(r, 1000));
        setVerse(formData);
        setIsSaving(false);
        alert('Versículo salvo com sucesso!');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-accent)]">Versículo do Dia</h1>
                <p className="text-[var(--color-text-secondary)]">Configure o versículo exibido na página inicial</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-[var(--color-accent)] mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" /> Versículo Atual
                    </h2>
                    <div className="bg-gradient-to-br from-[var(--color-primary)]/20 to-white rounded-xl p-6 mb-4">
                        <blockquote className="text-lg italic text-[var(--color-accent)] mb-2">&ldquo;{verse.text}&rdquo;</blockquote>
                        <cite className="text-[var(--color-accent)] font-bold not-italic">{verse.reference}</cite>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={refreshVerse} disabled={isLoading} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-accent)] rounded-lg hover:bg-[var(--color-primary-dark)] disabled:opacity-70">
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Sortear Novo
                        </button>
                        <a href={verse.bible_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-accent)] text-[var(--color-accent)] rounded-lg hover:bg-[var(--color-accent)]/10">
                            <ExternalLink className="w-4 h-4" /> Ver na Bíblia
                        </a>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-[var(--color-accent)] mb-4">Editar Versículo</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Texto do Versículo *</label>
                            <textarea value={formData.text} onChange={(e) => setFormData((p) => ({ ...p, text: e.target.value }))} rows={4} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none resize-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Referência *</label>
                            <input type="text" value={formData.reference} onChange={(e) => setFormData((p) => ({ ...p, reference: e.target.value }))} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none" placeholder="Ex: João 3:16" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Link Bible.com</label>
                            <input type="url" value={formData.bible_link} onChange={(e) => setFormData((p) => ({ ...p, bible_link: e.target.value }))} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none" placeholder="https://www.bible.com/..." />
                        </div>
                        <button type="submit" disabled={isSaving} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-light)] disabled:opacity-70">
                            {isSaving ? <><Loader2 className="w-5 h-5 animate-spin" />Salvando...</> : <><Save className="w-5 h-5" />Salvar Versículo</>}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
