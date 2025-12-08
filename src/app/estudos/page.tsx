import type { Metadata } from 'next';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header, Footer } from '@/components';
import {
    BookOpen,
    Calendar,
    Tag,
    ArrowRight,
    ArrowLeft,
    Search,
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Estudos e Reflexões',
    description:
        'Estudos bíblicos e reflexões para fortalecer sua fé. Aprofunde seu conhecimento da Palavra de Deus.',
};

// Mock data - will be replaced by Supabase
const studies = [
    {
        id: '1',
        title: 'A Importância da Oração Diária',
        description:
            'Descubra como a oração pode transformar sua vida e fortalecer sua comunhão com Deus através de práticas simples e eficazes.',
        tags: ['Oração', 'Vida Cristã'],
        created_at: '2024-12-01',
    },
    {
        id: '2',
        title: 'Estudo sobre o Livro de Romanos',
        description:
            'Uma análise profunda das epístolas de Paulo e sua relevância para a igreja contemporânea.',
        tags: ['Bíblia', 'Paulo', 'Epístolas'],
        created_at: '2024-11-28',
    },
    {
        id: '3',
        title: 'Os Frutos do Espírito',
        description:
            'Reflexão sobre Gálatas 5:22-23 e como desenvolver os frutos do Espírito em nossa vida.',
        tags: ['Espírito Santo', 'Gálatas'],
        created_at: '2024-11-20',
    },
    {
        id: '4',
        title: 'A Armadura de Deus',
        description:
            'Entenda cada peça da armadura espiritual descrita em Efésios 6 e como aplicá-la no dia a dia.',
        tags: ['Efésios', 'Batalha Espiritual'],
        created_at: '2024-11-15',
    },
    {
        id: '5',
        title: 'Parábolas de Jesus',
        description:
            'Estudo sobre as principais parábolas de Jesus e seus ensinamentos para a vida cristã.',
        tags: ['Jesus', 'Parábolas', 'Evangelhos'],
        created_at: '2024-11-10',
    },
    {
        id: '6',
        title: 'O Sermão do Monte',
        description:
            'Análise detalhada de Mateus 5-7, considerado o maior sermão já pregado.',
        tags: ['Mateus', 'Sermão do Monte'],
        created_at: '2024-11-05',
    },
];

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

export default function EstudosPage() {
    return (
        <>
            <Header />
            <main className="pt-24">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] py-16 md:py-24">
                    <div className="container-custom text-center text-white">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/10 flex items-center justify-center">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Estudos e Reflexões
                        </h1>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto">
                            Aprofunde seu conhecimento da Palavra de Deus e fortaleça sua fé
                            através de nossos estudos bíblicos.
                        </p>
                    </div>
                </section>

                {/* Search Section */}
                <section className="py-8 bg-white border-b">
                    <div className="container-custom">
                        <div className="max-w-xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar estudos..."
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Studies Grid */}
                <section className="section-padding bg-[var(--color-background)]">
                    <div className="container-custom">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {studies.map((study, index) => (
                                <article
                                    key={study.id}
                                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 card-hover h-full flex flex-col group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
                                        <BookOpen className="w-6 h-6" />
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-3">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(study.created_at)}
                                    </div>

                                    <h2 className="font-bold text-xl text-[var(--color-accent)] mb-3 group-hover:text-[var(--color-accent-light)] transition-colors">
                                        {study.title}
                                    </h2>

                                    <p className="text-[var(--color-text-secondary)] mb-4 flex-1">
                                        {study.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {study.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1 text-xs text-[var(--color-accent)] bg-[var(--color-primary)]/20 px-2 py-1 rounded-full"
                                            >
                                                <Tag className="w-3 h-3" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <Link
                                        href={`/estudos/${study.id}`}
                                        className="inline-flex items-center gap-2 text-[var(--color-accent)] font-semibold hover:gap-3 transition-all"
                                    >
                                        Ler Estudo
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </article>
                            ))}
                        </div>

                        {/* Back Link */}
                        <div className="text-center mt-12">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-[var(--color-accent)] font-semibold hover:gap-3 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar para Home
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
