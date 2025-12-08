'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Image as ImageIcon,
    BookOpen,
    Users,
    FileText,
    Calendar,
    TrendingUp,
    ArrowRight,
    RefreshCw,
} from 'lucide-react';
import { api } from '@/services/api';

interface Stats {
    banners: number;
    leaders: number;
    posts: number;
    events: number;
}

const statCards = [
    {
        key: 'banners',
        label: 'Banners',
        icon: ImageIcon,
        href: '/admin/banners',
        color: 'from-blue-500 to-blue-600',
    },
    {
        key: 'leaders',
        label: 'Líderes',
        icon: Users,
        href: '/admin/lideranca',
        color: 'from-green-500 to-green-600',
    },
    {
        key: 'posts',
        label: 'Posts',
        icon: FileText,
        href: '/admin/posts',
        color: 'from-purple-500 to-purple-600',
    },
    {
        key: 'events',
        label: 'Eventos',
        icon: Calendar,
        href: '/admin/eventos',
        color: 'from-orange-500 to-orange-600',
    },
];

const quickActions = [
    {
        label: 'Novo Banner',
        href: '/admin/banners?action=new',
        icon: ImageIcon,
    },
    {
        label: 'Novo Post/Estudo',
        href: '/admin/posts?action=new',
        icon: FileText,
    },
    {
        label: 'Novo Líder',
        href: '/admin/lideranca?action=new',
        icon: Users,
    },
    {
        label: 'Atualizar Versículo',
        href: '/admin/versiculo',
        icon: BookOpen,
    },
];

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats>({
        banners: 0,
        leaders: 0,
        posts: 0,
        events: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const [banners, leaders, posts, events] = await Promise.all([
                    api.getAdminBanners().catch(() => []),
                    api.getAdminLeaders().catch(() => []),
                    api.getAdminPosts().catch(() => []),
                    api.getAdminEvents().catch(() => []),
                ]);

                setStats({
                    banners: banners.length || 0,
                    leaders: leaders.length || 0,
                    posts: posts.length || 0,
                    events: events.length || 0,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)] rounded-[20px] p-6 md:p-8 text-white"
            >
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    Bem-vindo ao Painel Administrativo
                </h1>
                <p className="text-white/80">
                    Gerencie o conteúdo do site da Assembleia de Deus Missão - Sacramento/MG
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {statCards.map((card, index) => (
                    <motion.div
                        key={card.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link
                            href={card.href}
                            className="block bg-white rounded-[20px] p-6 shadow-lg hover:shadow-xl transition-all group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div
                                    className={`w-12 h-12 rounded-[20px] bg-gradient-to-br ${card.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}
                                >
                                    <card.icon className="w-6 h-6" />
                                </div>
                                <TrendingUp className="w-5 h-5 text-green-500" />
                            </div>
                            {isLoading ? (
                                <div className="skeleton h-8 w-16 mb-1" />
                            ) : (
                                <p className="text-3xl font-bold text-[var(--color-accent)]">
                                    {stats[card.key as keyof Stats]}
                                </p>
                            )}
                            <p className="text-[var(--color-text-secondary)]">{card.label}</p>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-[20px] p-6 shadow-lg"
            >
                <h2 className="text-xl font-bold text-[var(--color-accent)] mb-4 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Ações Rápidas
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                            className="flex items-center gap-3 p-4 rounded-[20px] border border-gray-200 hover:border-[var(--color-accent)] hover:bg-[var(--color-primary)]/10 transition-all group"
                        >
                            <action.icon className="w-5 h-5 text-[var(--color-accent)]" />
                            <span className="font-medium text-[var(--color-text)]">
                                {action.label}
                            </span>
                            <ArrowRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-[var(--color-accent)] group-hover:translate-x-1 transition-all" />
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Posts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-[20px] p-6 shadow-lg"
                >
                    <h2 className="text-xl font-bold text-[var(--color-accent)] mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Posts Recentes
                    </h2>
                    <div className="space-y-4">
                        {[
                            { title: 'Celebração de Natal 2024', type: 'Blog', date: '05/12' },
                            { title: 'A Importância da Oração', type: 'Estudo', date: '01/12' },
                            { title: 'Retiro de Jovens', type: 'Blog', date: '28/11' },
                        ].map((post, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-[20px] bg-gray-50"
                            >
                                <div>
                                    <p className="font-medium text-[var(--color-text)]">
                                        {post.title}
                                    </p>
                                    <span className="text-xs text-[var(--color-text-muted)]">
                                        {post.type} • {post.date}
                                    </span>
                                </div>
                                <Link
                                    href="/admin/posts"
                                    className="text-sm text-[var(--color-accent)] hover:underline"
                                >
                                    Editar
                                </Link>
                            </div>
                        ))}
                    </div>
                    <Link
                        href="/admin/posts"
                        className="inline-flex items-center gap-2 mt-4 text-[var(--color-accent)] font-medium hover:underline"
                    >
                        Ver todos <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

                {/* Programação da Semana */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-[20px] p-6 shadow-lg"
                >
                    <h2 className="text-xl font-bold text-[var(--color-accent)] mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Programação Fixa
                    </h2>
                    <div className="space-y-4">
                        {[
                            { day: 'Terça', event: 'Culto de Ensino', time: '19:30' },
                            { day: 'Quinta', event: 'Círculo de Oração', time: '19:30' },
                            { day: 'Domingo', event: 'EBD', time: '09:00' },
                            { day: 'Domingo', event: 'Culto da Noite', time: '19:00' },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-[20px] bg-gray-50"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-[var(--color-accent)] w-16">
                                        {item.day}
                                    </span>
                                    <span className="text-[var(--color-text)]">{item.event}</span>
                                </div>
                                <span className="text-[var(--color-text-muted)] text-sm">
                                    {item.time}
                                </span>
                            </div>
                        ))}
                    </div>
                    <Link
                        href="/admin/eventos"
                        className="inline-flex items-center gap-2 mt-4 text-[var(--color-accent)] font-medium hover:underline"
                    >
                        Gerenciar <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
