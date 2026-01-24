'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    Eye,
    Users,
    Calendar,
    RefreshCw,
    Download,
    Filter,
} from 'lucide-react';
import { api } from '@/services/api';
import { PageViewStats, DailyPageViews } from '@/lib/database.types';
import toast from 'react-hot-toast';

export default function AnalyticsPage() {
    const [pageStats, setPageStats] = useState<PageViewStats[]>([]);
    const [dailyViews, setDailyViews] = useState<DailyPageViews[]>([]);
    const [totalViews, setTotalViews] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [daysBack, setDaysBack] = useState<number>(30);
    const [selectedPeriod, setSelectedPeriod] = useState<'7' | '30' | '90' | '365'>('30');

    const loadAnalytics = async () => {
        setIsLoading(true);
        try {
            const days = parseInt(selectedPeriod);
            setDaysBack(days);

            const [stats, daily, total] = await Promise.allSettled([
                api.getPageViewStats(days),
                api.getDailyPageViews(days),
                api.getTotalPageViews(),
            ]);

            // Handle page stats
            if (stats.status === 'fulfilled') {
                setPageStats(stats.value as PageViewStats[]);
            } else {
                console.error('Error loading page stats:', stats.reason);
                setPageStats([]);
                toast.error('Erro ao carregar estatísticas de páginas. Verifique se a migration foi executada.');
            }

            // Handle daily views
            if (daily.status === 'fulfilled') {
                setDailyViews(daily.value as DailyPageViews[]);
            } else {
                console.error('Error loading daily views:', daily.reason);
                setDailyViews([]);
            }

            // Handle total views
            if (total.status === 'fulfilled') {
                setTotalViews(total.value);
            } else {
                console.error('Error loading total views:', total.reason);
                setTotalViews(0);
            }
        } catch (error) {
            console.error('Error loading analytics:', error);
            toast.error('Erro ao carregar estatísticas. Verifique se a tabela page_views existe no banco de dados.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAnalytics();
    }, [selectedPeriod]);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('pt-BR').format(num);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getPageName = (path: string) => {
        if (path === '/') return 'Página Inicial';
        if (path.startsWith('/blog/')) return `Blog: ${path.split('/').pop()}`;
        if (path.startsWith('/estudos/')) return `Estudo: ${path.split('/').pop()}`;
        if (path === '/sobre-nos') return 'Sobre Nós';
        if (path === '/blog') return 'Blog';
        if (path === '/estudos') return 'Estudos';
        return path;
    };

    const periods = [
        { value: '7', label: '7 dias' },
        { value: '30', label: '30 dias' },
        { value: '90', label: '90 dias' },
        { value: '365', label: '1 ano' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-[28px] font-bold text-[var(--color-accent)] flex items-center gap-2">
                        <BarChart3 className="w-7 h-7" />
                        Análises e Estatísticas
                    </h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">
                        Visualize as páginas mais acessadas e estatísticas de tráfego
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={loadAnalytics}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)] transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Atualizar
                    </button>
                </div>
            </div>

            {/* Period Filter */}
            <div className="bg-white rounded-[10px] p-4 shadow-lg border border-gray-100">
                <div className="flex items-center gap-4">
                    <Filter className="w-5 h-5 text-[var(--color-accent)]" />
                    <span className="font-medium text-[var(--color-text)]">Período:</span>
                    <div className="flex gap-2">
                        {periods.map((period) => (
                            <button
                                key={period.value}
                                onClick={() => setSelectedPeriod(period.value as '7' | '30' | '90' | '365')}
                                className={`px-4 py-2 rounded-[10px] font-medium transition-colors ${
                                    selectedPeriod === period.value
                                        ? 'bg-[var(--color-accent)] text-white'
                                        : 'bg-gray-100 text-[var(--color-text)] hover:bg-gray-200'
                                }`}
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[10px] p-6 shadow-lg border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-[10px] bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                            <Eye className="w-6 h-6" />
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="h-8 w-20 bg-gray-200 rounded-[10px] animate-pulse" />
                    ) : (
                        <p className="text-3xl font-bold text-[var(--color-accent)] mb-1">
                            {formatNumber(totalViews)}
                        </p>
                    )}
                    <p className="text-sm text-[var(--color-text-secondary)] font-medium">
                        Total de Visualizações
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[10px] p-6 shadow-lg border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-[10px] bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-md">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="h-8 w-20 bg-gray-200 rounded-[10px] animate-pulse" />
                    ) : (
                        <p className="text-3xl font-bold text-[var(--color-accent)] mb-1">
                            {formatNumber(pageStats.length)}
                        </p>
                    )}
                    <p className="text-sm text-[var(--color-text-secondary)] font-medium">
                        Páginas Únicas
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-[10px] p-6 shadow-lg border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-[10px] bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="h-8 w-20 bg-gray-200 rounded-[10px] animate-pulse" />
                    ) : (
                        <p className="text-3xl font-bold text-[var(--color-accent)] mb-1">
                            {formatNumber(
                                pageStats.reduce((sum, stat) => sum + stat.unique_views, 0)
                            )}
                        </p>
                    )}
                    <p className="text-sm text-[var(--color-text-secondary)] font-medium">
                        Visitantes Únicos
                    </p>
                </motion.div>
            </div>

            {/* Top Pages */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-[10px] p-6 shadow-lg border border-gray-100"
            >
                <h2 className="text-xl md:text-[24px] font-bold text-[var(--color-accent)] mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Páginas Mais Acessadas
                </h2>
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 bg-gray-100 rounded-[10px] animate-pulse" />
                        ))}
                    </div>
                ) : pageStats.length === 0 ? (
                    <div className="text-center py-12 text-[var(--color-text-secondary)]">
                        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-sm font-medium mb-2">Nenhum dado disponível para o período selecionado</p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                            {totalViews === 0 
                                ? 'Execute a migration "migration_create_page_views.sql" no Supabase para começar a coletar dados.'
                                : 'Tente selecionar um período diferente ou aguarde mais visualizações.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text)]">
                                        #
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text)]">
                                        Página
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-[var(--color-text)]">
                                        Visualizações
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-[var(--color-text)]">
                                        Visitantes Únicos
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-[var(--color-text)]">
                                        Última Visualização
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageStats.map((stat, index) => (
                                    <tr
                                        key={stat.page_path}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <span className="w-8 h-8 rounded-[10px] bg-[var(--color-accent)] text-white flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="font-medium text-[var(--color-text)]">
                                                    {getPageName(stat.page_path)}
                                                </p>
                                                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                                    {stat.page_path}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <span className="font-bold text-[var(--color-accent)]">
                                                {formatNumber(stat.view_count)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <span className="text-[var(--color-text)]">
                                                {formatNumber(stat.unique_views)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <span className="text-sm text-[var(--color-text-muted)]">
                                                {formatDate(stat.last_viewed)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            {/* Daily Views Chart */}
            {dailyViews.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-[10px] p-6 shadow-lg border border-gray-100"
                >
                    <h2 className="text-xl md:text-[24px] font-bold text-[var(--color-accent)] mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Visualizações por Dia
                    </h2>
                    <div className="space-y-4">
                        {dailyViews.slice(0, 14).reverse().map((day) => {
                            const maxViews = Math.max(...dailyViews.map((d) => d.view_count));
                            const percentage = (day.view_count / maxViews) * 100;
                            return (
                                <div key={day.date} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-[var(--color-text)]">
                                            {formatDate(day.date)}
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[var(--color-text-muted)]">
                                                {formatNumber(day.unique_views)} únicos
                                            </span>
                                            <span className="font-bold text-[var(--color-accent)]">
                                                {formatNumber(day.view_count)} visualizações
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)] rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
