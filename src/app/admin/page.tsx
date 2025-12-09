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

interface RecentPost {
    id: string;
    title: string;
    type: 'blog' | 'study';
    created_at: string;
}

interface RecentEvent {
    id: string;
    title: string;
    day_of_week: string;
    time_start: string;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats>({
        banners: 0,
        leaders: 0,
        posts: 0,
        events: 0,
    });
    const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
    const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [banners, leaders, posts, events] = await Promise.all([
                    api.getAdminBanners().catch(() => []) as Promise<any[]>,
                    api.getAdminLeaders().catch(() => []) as Promise<any[]>,
                    api.getAdminPosts().catch(() => []) as Promise<any[]>,
                    api.getAdminEvents().catch(() => []) as Promise<any[]>,
                ]);

                setStats({
                    banners: banners.length || 0,
                    leaders: leaders.length || 0,
                    posts: posts.length || 0,
                    events: events.length || 0,
                });

                // Posts recentes (últimos 3)
                const sortedPosts = (posts as any[])
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 3)
                    .map((p) => ({
                        id: p.id,
                        title: p.title,
                        type: p.type,
                        created_at: p.created_at,
                    }));
                setRecentPosts(sortedPosts);

                // Eventos ativos (máximo 4)
                const activeEvents = (events as any[])
                    .filter((e) => e.active)
                    .slice(0, 4)
                    .map((e) => ({
                        id: e.id,
                        title: e.title,
                        day_of_week: e.day_of_week,
                        time_start: e.time_start,
                    }));
                setRecentEvents(activeEvents);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)] rounded-[20px] p-6 md:p-8 text-white shadow-lg"
            >
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-base md:text-lg font-bold mb-2" style={{ fontSize: '18px' }}>
                            Bem-vindo ao Painel Administrativo
                        </h1>
                        <p className="text-white/90 text-xs">
                            Gerencie o conteúdo do site da Assembleia de Deus Missão - Sacramento/MG
                        </p>
                    </div>
                    <Link
                        href="/"
                        target="_blank"
                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-[30px] text-white text-sm font-medium transition-colors backdrop-blur-sm"
                    >
                        Ver Site
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
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
                            className="block bg-white rounded-[20px] p-6 shadow-lg hover:shadow-xl transition-all group border border-gray-100 hover:border-[var(--color-accent)]/20"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div
                                    className={`w-12 h-12 rounded-[20px] bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                                >
                                    <card.icon className="w-6 h-6" />
                                </div>
                                {!isLoading && stats[card.key as keyof Stats] > 0 && (
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                )}
                            </div>
                            {isLoading ? (
                                <div className="h-8 w-12 bg-gray-200 rounded-[20px] animate-pulse mb-2" />
                            ) : (
                                <p className="text-2xl font-bold text-[var(--color-accent)] mb-1">
                                    {stats[card.key as keyof Stats]}
                                </p>
                            )}
                            <p className="text-xs text-[var(--color-text-secondary)] font-medium">{card.label}</p>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-[20px] p-6 shadow-lg border border-gray-100"
            >
                <h2 className="text-lg font-bold text-[var(--color-accent)] mb-5 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Ações Rápidas
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {quickActions.map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                            className="flex items-center gap-3 p-4 rounded-[20px] border-2 border-gray-200 hover:border-[var(--color-accent)] hover:bg-[var(--color-primary)]/5 transition-all group bg-gray-50/50"
                        >
                            <div className="w-10 h-10 rounded-[20px] bg-[var(--color-accent)]/10 flex items-center justify-center group-hover:bg-[var(--color-accent)] group-hover:scale-110 transition-all">
                                <action.icon className="w-5 h-5 text-[var(--color-accent)] group-hover:text-white transition-colors" />
                            </div>
                            <span className="font-medium text-[var(--color-text)] text-sm flex-1">
                                {action.label}
                            </span>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[var(--color-accent)] group-hover:translate-x-1 transition-all flex-shrink-0" />
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
                    <h2 className="text-lg font-bold text-[var(--color-accent)] mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Posts Recentes
                    </h2>
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-16 bg-gray-100 rounded-[20px] animate-pulse" />
                            ))}
                        </div>
                    ) : recentPosts.length === 0 ? (
                        <div className="text-center py-8 text-[var(--color-text-secondary)]">
                            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">Nenhum post cadastrado</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {recentPosts.map((post) => {
                                    const date = new Date(post.created_at);
                                    const formattedDate = date.toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                    });
                                    return (
                                        <Link
                                            key={post.id}
                                            href="/admin/posts"
                                            className="flex items-center justify-between p-3 rounded-[20px] bg-gray-50 hover:bg-gray-100 transition-colors group"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-[var(--color-text)] truncate group-hover:text-[var(--color-accent)] transition-colors">
                                                    {post.title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-xs px-2 py-0.5 rounded-[20px] ${
                                                        post.type === 'blog'
                                                            ? 'bg-blue-100 text-blue-600'
                                                            : 'bg-green-100 text-green-600'
                                                    }`}>
                                                        {post.type === 'blog' ? 'Blog' : 'Estudo'}
                                                    </span>
                                                    <span className="text-xs text-[var(--color-text-muted)]">
                                                        {formattedDate}
                                                    </span>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[var(--color-accent)] group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    );
                                })}
                            </div>
                            <Link
                                href="/admin/posts"
                                className="inline-flex items-center gap-2 mt-4 text-[var(--color-accent)] font-medium hover:underline"
                            >
                                Ver todos <ArrowRight className="w-4 h-4" />
                            </Link>
                        </>
                    )}
                </motion.div>

                {/* Programação da Semana */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-[20px] p-6 shadow-lg"
                >
                    <h2 className="text-lg font-bold text-[var(--color-accent)] mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Programação Fixa
                    </h2>
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-14 bg-gray-100 rounded-[20px] animate-pulse" />
                            ))}
                        </div>
                    ) : recentEvents.length === 0 ? (
                        <div className="text-center py-8 text-[var(--color-text-secondary)]">
                            <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">Nenhum evento cadastrado</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {recentEvents.map((event) => {
                                    const dayShort = event.day_of_week.split('-')[0];
                                    return (
                                        <Link
                                            key={event.id}
                                            href="/admin/eventos"
                                            className="flex items-center justify-between p-3 rounded-[20px] bg-gray-50 hover:bg-gray-100 transition-colors group"
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <span className="font-bold text-[var(--color-accent)] w-20 text-sm flex-shrink-0">
                                                    {dayShort}
                                                </span>
                                                <span className="text-[var(--color-text)] truncate group-hover:text-[var(--color-accent)] transition-colors">
                                                    {event.title}
                                                </span>
                                            </div>
                                            <span className="text-[var(--color-text-muted)] text-sm font-medium flex-shrink-0">
                                                {event.time_start}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                            <Link
                                href="/admin/eventos"
                                className="inline-flex items-center gap-2 mt-4 text-[var(--color-accent)] font-medium hover:underline"
                            >
                                Gerenciar <ArrowRight className="w-4 h-4" />
                            </Link>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
