'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, RefreshCw, ExternalLink } from 'lucide-react';
import { AdminPageHeader, AdminPanel } from '@/components/admin';

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

    const refreshVerse = () => {
        setIsLoading(true);
        setTimeout(() => {
            const randomVerse = fallbackVerses[Math.floor(Math.random() * fallbackVerses.length)];
            setVerse(randomVerse);
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Versículo do Dia"
                description="Visualize o versículo exibido na página inicial"
            />

            <AdminPanel>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-2xl">
                <h2 className="admin-section-title mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" /> Versículo Atual
                </h2>
                <div className="admin-verse-preview bg-gradient-to-br from-[var(--color-primary)]/20 to-white rounded-[10px] p-6 mb-4">
                    <blockquote className="text-lg italic text-[var(--color-accent)] mb-2">&ldquo;{verse.text}&rdquo;</blockquote>
                    <cite className="text-[var(--color-accent)] font-bold not-italic">{verse.reference}</cite>
                </div>
                <div className="flex gap-3 mb-4">
                    <button onClick={refreshVerse} disabled={isLoading} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-[var(--color-accent)] rounded-[30px] hover:bg-[var(--color-primary-dark)] disabled:opacity-70">
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Sortear Novo
                    </button>
                    <a href={verse.bible_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-accent)] text-[var(--color-accent)] rounded-[30px] hover:bg-[var(--color-accent)]/10">
                        <ExternalLink className="w-4 h-4" /> Ver na Bíblia
                    </a>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4">
                    <p className="admin-panel-hint text-blue-800">
                        <strong>Nota:</strong> O versículo é atualizado automaticamente diariamente. Não é possível configurá-lo manualmente.
                    </p>
                </div>
                </motion.div>
            </AdminPanel>
        </div>
    );
}
