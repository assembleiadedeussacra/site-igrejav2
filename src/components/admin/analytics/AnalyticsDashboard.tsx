'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
    Smartphone,
    Monitor,
    MapPin,
    Globe,
    FileText,
    X,
    Radio,
    Pause,
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from 'recharts';
import { api } from '@/services/api';
import { AdminPageHeader } from '@/components/admin';
import AnalyticsLiveFeed from '@/components/admin/analytics/AnalyticsLiveFeed';
import { useAdminTheme } from '@/contexts/AdminThemeContext';
import { useAnalyticsRealtime, ANALYTICS_LIVE_INTERVAL_MS } from '@/hooks/useAnalyticsRealtime';
import { getChartTheme } from '@/lib/analytics/chartTheme';
import { formatLastUpdated } from '@/lib/analytics/formatRelativeTime';
import type {
    PageViewStats,
    DailyPageViews,
    AnalyticsSummary,
    DeviceBreakdown,
    LocationBreakdown,
    RecentPageView,
} from '@/lib/database.types';
import {
    DEFAULT_ANALYTICS_FILTERS,
    matchesPageCategory,
    type AnalyticsFilters,
    type AnalyticsPeriod,
    type PageCategory,
    type DeviceFilter,
    getPageName,
} from '@/lib/analytics/filters';
import { deviceTypeLabel } from '@/lib/analytics/userAgent';
import toast from 'react-hot-toast';

const PERIODS: { value: AnalyticsPeriod; label: string }[] = [
    { value: '7', label: '7 dias' },
    { value: '30', label: '30 dias' },
    { value: '90', label: '90 dias' },
    { value: '365', label: '1 ano' },
];

const PAGE_CATEGORIES: { value: PageCategory; label: string }[] = [
    { value: 'all', label: 'Todas as páginas' },
    { value: 'home', label: 'Home' },
    { value: 'blog', label: 'Blog' },
    { value: 'estudos', label: 'Estudos' },
    { value: 'sobre', label: 'Sobre Nós' },
    { value: 'other', label: 'Outras' },
];

const DEVICE_FILTERS: { value: DeviceFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'tablet', label: 'Tablet' },
    { value: 'desktop', label: 'Desktop' },
];

const DEVICE_COLORS: Record<string, string> = {
    mobile: '#3b82f6',
    tablet: '#8b5cf6',
    desktop: '#10b981',
    unknown: '#94a3b8',
};

const PANEL =
    'admin-analytics-panel admin-card rounded-[10px] p-5 md:p-6 shadow-lg border border-gray-100';

function formatNumber(num: number) {
    return new Intl.NumberFormat('pt-BR').format(num);
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
    });
}

function formatDateFull(dateString: string) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

function aggregateDevices(devices: DeviceBreakdown[]) {
    const map = new Map<string, { name: string; value: number; unique: number }>();
    for (const row of devices) {
        const key = row.device_type || 'unknown';
        const existing = map.get(key) || {
            name: deviceTypeLabel(key),
            value: 0,
            unique: 0,
        };
        existing.value += Number(row.view_count);
        existing.unique += Number(row.unique_views);
        map.set(key, existing);
    }
    return Array.from(map.entries()).map(([type, data]) => ({
        type,
        ...data,
        fill: DEVICE_COLORS[type] || DEVICE_COLORS.unknown,
    }));
}

function aggregateBrowsers(devices: DeviceBreakdown[]) {
    const map = new Map<string, number>();
    for (const row of devices) {
        const browser = row.browser || 'Desconhecido';
        map.set(browser, (map.get(browser) || 0) + Number(row.view_count));
    }
    return Array.from(map.entries())
        .map(([name, views]) => ({ name, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 6);
}

function exportCsv(
    pageStats: PageViewStats[],
    dailyViews: DailyPageViews[],
    filters: AnalyticsFilters
) {
    const lines: string[] = [];
    lines.push('Relatório de Análises');
    lines.push(`Período;${filters.period} dias`);
    lines.push(`Seção;${filters.pageCategory}`);
    lines.push(`Dispositivo;${filters.device}`);
    lines.push(`Cidade;${filters.city || 'Todas'}`);
    lines.push('');
    lines.push('Página;Caminho;Visualizações;Visitantes Únicos;Última visita');
    for (const row of pageStats) {
        lines.push(
            `"${getPageName(row.page_path)}";"${row.page_path}";${row.view_count};${row.unique_views};"${formatDateFull(row.last_viewed)}"`
        );
    }
    lines.push('');
    lines.push('Data;Visualizações;Visitantes Únicos');
    for (const row of dailyViews) {
        lines.push(`${row.date};${row.view_count};${row.unique_views}`);
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${filters.period}d-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

export default function AnalyticsDashboard() {
    const { theme } = useAdminTheme();
    const chartTheme = useMemo(() => getChartTheme(theme), [theme]);

    const [filters, setFilters] = useState<AnalyticsFilters>(DEFAULT_ANALYTICS_FILTERS);
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [pageStats, setPageStats] = useState<PageViewStats[]>([]);
    const [dailyViews, setDailyViews] = useState<DailyPageViews[]>([]);
    const [devices, setDevices] = useState<DeviceBreakdown[]>([]);
    const [locations, setLocations] = useState<LocationBreakdown[]>([]);
    const [cityOptions, setCityOptions] = useState<string[]>([]);
    const [recentActivity, setRecentActivity] = useState<RecentPageView[]>([]);
    const [totalViewsAllTime, setTotalViewsAllTime] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [liveEnabled, setLiveEnabled] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [, setClockTick] = useState(0);

    const refreshData = useCallback(
        async (silent = false) => {
            if (!silent) setIsLoading(true);
            else setIsRefreshing(true);

            try {
                const [data, recent] = await Promise.all([
                    api.getAnalyticsDashboard(filters),
                    api.getRecentPageViews(40),
                ]);

                setSummary(data.summary);
                setPageStats(data.pageStats as PageViewStats[]);
                setDailyViews(data.dailyViews as DailyPageViews[]);
                setDevices(data.devices);
                setLocations(data.locations);
                setCityOptions(data.cities);
                setTotalViewsAllTime(data.totalViewsAllTime);
                setRecentActivity(recent);
                setLastUpdated(new Date());

                if (!silent && data.errors.length > 0) {
                    toast.error(
                        'Alguns dados não carregaram. Execute migration_analytics_enrichment.sql no Supabase.'
                    );
                }
            } catch (error) {
                console.error('Error loading analytics:', error);
                if (!silent) toast.error('Erro ao carregar análises.');
            } finally {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        },
        [filters]
    );

    useEffect(() => {
        void refreshData(false);
    }, [refreshData]);

    useAnalyticsRealtime(liveEnabled, () => refreshData(true));

    useEffect(() => {
        const id = window.setInterval(() => setClockTick((t) => t + 1), 5000);
        return () => window.clearInterval(id);
    }, []);

    const filteredRecent = useMemo(() => {
        return recentActivity.filter((view) => {
            if (!matchesPageCategory(view.page_path, filters.pageCategory)) return false;
            if (filters.device !== 'all' && view.device_type !== filters.device) return false;
            if (
                filters.city.trim() &&
                view.city?.toLowerCase() !== filters.city.trim().toLowerCase()
            ) {
                return false;
            }
            return true;
        });
    }, [recentActivity, filters]);

    const deviceChartData = useMemo(() => aggregateDevices(devices), [devices]);
    const browserChartData = useMemo(() => aggregateBrowsers(devices), [devices]);
    const topPagesChart = useMemo(
        () =>
            pageStats.slice(0, 8).map((s) => ({
                name: getPageName(s.page_path).slice(0, 28),
                views: s.view_count,
                unique: s.unique_views,
            })),
        [pageStats]
    );
    const locationChart = useMemo(
        () =>
            locations.slice(0, 10).map((l) => ({
                name:
                    l.city === 'Desconhecida'
                        ? 'Desconhecida'
                        : `${l.city}${l.region !== '—' ? `, ${l.region}` : ''}`,
                views: l.view_count,
                unique: l.unique_views,
            })),
        [locations]
    );
    const dailyChart = useMemo(
        () =>
            [...dailyViews]
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((d) => ({
                    ...d,
                    label: formatDate(d.date),
                })),
        [dailyViews]
    );

    const axisTick = { fill: chartTheme.axis, fontSize: 11 };
    const legendStyle = { color: chartTheme.legend };

    const hasActiveFilters =
        filters.pageCategory !== 'all' ||
        filters.device !== 'all' ||
        filters.city.trim() !== '';

    const clearFilters = () => {
        setFilters((prev) => ({
            ...prev,
            pageCategory: 'all',
            device: 'all',
            city: '',
        }));
    };

    const showEmpty = !isLoading && dailyChart.length === 0 && pageStats.length === 0;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Análises e Estatísticas"
                description="Dados reais do site — atualização automática a cada 12 segundos"
                action={
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => exportCsv(pageStats, dailyViews, filters)}
                            disabled={isLoading || pageStats.length === 0}
                            className="admin-analytics-btn-secondary inline-flex items-center gap-2 px-4 py-2 rounded-[30px] transition-colors disabled:opacity-50"
                        >
                            <Download className="w-4 h-4" />
                            Exportar CSV
                        </button>
                        <button
                            type="button"
                            onClick={() => refreshData(true)}
                            disabled={isLoading}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)] transition-colors disabled:opacity-50"
                        >
                            <RefreshCw
                                className={`w-4 h-4 ${isLoading || isRefreshing ? 'animate-spin' : ''}`}
                            />
                            Atualizar
                        </button>
                    </div>
                }
            />

            {/* Barra ao vivo */}
            <div className="admin-analytics-live-bar rounded-[10px] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span
                        className={`admin-analytics-live-dot w-2.5 h-2.5 rounded-full ${!liveEnabled ? 'paused' : ''}`}
                        aria-hidden
                    />
                    <span className="admin-label-inline font-semibold">
                        {liveEnabled ? 'Ao vivo' : 'Pausado'}
                    </span>
                    <span className="admin-help hidden sm:inline">
                        {liveEnabled
                            ? `Atualiza a cada ${ANALYTICS_LIVE_INTERVAL_MS / 1000}s + instantâneo via Realtime`
                            : 'Atualização automática desligada'}
                    </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <span className="admin-card-meta">
                        Última sync:{' '}
                        <strong className="admin-list-item-title">{formatLastUpdated(lastUpdated)}</strong>
                    </span>
                    <button
                        type="button"
                        onClick={() => setLiveEnabled((v) => !v)}
                        className="admin-analytics-btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-sm font-medium"
                    >
                        {liveEnabled ? (
                            <>
                                <Pause className="w-3.5 h-3.5" /> Pausar
                            </>
                        ) : (
                            <>
                                <Radio className="w-3.5 h-3.5" /> Retomar ao vivo
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className={`${PANEL} space-y-4`}>
                <div className="flex flex-wrap items-center gap-3">
                    <Filter className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
                    <span className="admin-label-inline">Período</span>
                    <div className="flex flex-wrap gap-2">
                        {PERIODS.map((period) => (
                            <button
                                key={period.value}
                                type="button"
                                onClick={() =>
                                    setFilters((p) => ({ ...p, period: period.value }))
                                }
                                className={`admin-analytics-chip px-3 py-1.5 rounded-[10px] text-sm font-medium transition-colors ${
                                    filters.period === period.value
                                        ? 'admin-analytics-chip-active'
                                        : ''
                                }`}
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="admin-label mb-1.5 block">Seção do site</label>
                        <select
                            value={filters.pageCategory}
                            onChange={(e) =>
                                setFilters((p) => ({
                                    ...p,
                                    pageCategory: e.target.value as PageCategory,
                                }))
                            }
                            className="admin-input w-full px-3 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] outline-none text-sm"
                        >
                            {PAGE_CATEGORIES.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="admin-label mb-1.5 block">Dispositivo</label>
                        <select
                            value={filters.device}
                            onChange={(e) =>
                                setFilters((p) => ({
                                    ...p,
                                    device: e.target.value as DeviceFilter,
                                }))
                            }
                            className="admin-input w-full px-3 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] outline-none text-sm"
                        >
                            {DEVICE_FILTERS.map((d) => (
                                <option key={d.value} value={d.value}>
                                    {d.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label className="admin-label mb-1.5 block">Cidade</label>
                        <input
                            type="text"
                            list="analytics-cities"
                            value={filters.city}
                            onChange={(e) =>
                                setFilters((p) => ({ ...p, city: e.target.value }))
                            }
                            placeholder="Todas as cidades"
                            className="admin-input w-full px-3 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] outline-none text-sm"
                        />
                        <datalist id="analytics-cities">
                            {cityOptions.map((city) => (
                                <option key={city} value={city} />
                            ))}
                        </datalist>
                    </div>
                </div>

                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-accent)] hover:underline"
                    >
                        <X className="w-4 h-4" />
                        Limpar filtros avançados
                    </button>
                )}
            </div>

            {/* Cards resumo */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    { icon: Eye, color: 'from-blue-500 to-blue-600', value: summary?.period_views ?? 0, label: `Visualizações (${filters.period}d)` },
                    { icon: Users, color: 'from-purple-500 to-purple-600', value: summary?.unique_visitors ?? 0, label: 'Visitantes únicos' },
                    { icon: FileText, color: 'from-green-500 to-green-600', value: summary?.unique_pages ?? 0, label: 'Páginas acessadas' },
                    { icon: TrendingUp, color: 'from-amber-500 to-orange-500', value: summary?.avg_daily_views ?? 0, label: 'Média diária', decimal: true },
                ].map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="admin-analytics-stat rounded-[10px] p-5 shadow-lg"
                    >
                        <div className={`w-11 h-11 rounded-[10px] bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-3`}>
                            <card.icon className="w-5 h-5" />
                        </div>
                        {isLoading ? (
                            <div className="h-8 w-24 bg-gray-200 dark:bg-slate-600 rounded animate-pulse" />
                        ) : (
                            <p className="admin-stat-value mb-0.5">
                                {'decimal' in card && card.decimal
                                    ? Number(card.value).toLocaleString('pt-BR', { maximumFractionDigits: 1 })
                                    : formatNumber(Number(card.value))}
                            </p>
                        )}
                        <p className="admin-stat-label">{card.label}</p>
                        {i === 0 && !isLoading && (
                            <p className="admin-help mt-2">Total histórico: {formatNumber(totalViewsAllTime)}</p>
                        )}
                    </motion.div>
                ))}
            </div>

            {isLoading ? (
                <div className="grid lg:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`${PANEL} h-72 animate-pulse`} />
                    ))}
                </div>
            ) : showEmpty ? (
                <div className={`${PANEL} p-12 text-center`}>
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300 admin-icon-muted" />
                    <p className="font-medium mb-2">Nenhum dado para os filtros selecionados</p>
                    <p className="admin-help max-w-md mx-auto">
                        Navegue pelo site público para gerar acessos reais. Execute{' '}
                        <code className="text-xs px-1 rounded">migration_analytics_enrichment.sql</code> e{' '}
                        <code className="text-xs px-1 rounded">migration_analytics_realtime.sql</code> no Supabase.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid xl:grid-cols-3 gap-6">
                        <div className="xl:col-span-1">
                            <AnalyticsLiveFeed items={filteredRecent} isRefreshing={isRefreshing} />
                        </div>

                        {dailyChart.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`${PANEL} xl:col-span-2`}
                            >
                                <h2 className="admin-section-title mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Evolução do tráfego
                                </h2>
                                <div className="h-80 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={dailyChart}>
                                            <defs>
                                                <linearGradient id={chartTheme.gradientId} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={chartTheme.primary} stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor={chartTheme.primary} stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                                            <XAxis dataKey="label" tick={axisTick} />
                                            <YAxis tick={axisTick} allowDecimals={false} />
                                            <Tooltip contentStyle={chartTheme.tooltip} />
                                            <Legend wrapperStyle={legendStyle} />
                                            <Area
                                                type="monotone"
                                                dataKey="view_count"
                                                name="Visualizações"
                                                stroke={chartTheme.primary}
                                                fill={`url(#${chartTheme.gradientId})`}
                                                strokeWidth={2}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="unique_views"
                                                name="Visitantes únicos"
                                                stroke={chartTheme.secondary}
                                                fill="transparent"
                                                strokeWidth={2}
                                                strokeDasharray="4 4"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={PANEL}>
                            <h2 className="admin-section-title mb-4 flex items-center gap-2">
                                <Smartphone className="w-5 h-5" />
                                Dispositivos
                            </h2>
                            {deviceChartData.length === 0 ? (
                                <p className="admin-empty-text py-8 text-center">Sem dados de dispositivo</p>
                            ) : (
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={deviceChartData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={85}
                                                paddingAngle={3}
                                                label={({ name, percent }) =>
                                                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                                                }
                                            >
                                                {deviceChartData.map((entry) => (
                                                    <Cell key={entry.type} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={chartTheme.tooltip} />
                                            <Legend wrapperStyle={legendStyle} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={PANEL}>
                            <h2 className="admin-section-title mb-4 flex items-center gap-2">
                                <Monitor className="w-5 h-5" />
                                Navegadores
                            </h2>
                            {browserChartData.length === 0 ? (
                                <p className="admin-empty-text py-8 text-center">Sem dados de navegador</p>
                            ) : (
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={browserChartData} layout="vertical" margin={{ left: 8 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={chartTheme.grid} />
                                            <XAxis type="number" tick={axisTick} allowDecimals={false} />
                                            <YAxis type="category" dataKey="name" width={72} tick={axisTick} />
                                            <Tooltip contentStyle={chartTheme.tooltip} />
                                            <Bar dataKey="views" name="Visualizações" fill={chartTheme.primary} radius={[0, 6, 6, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={PANEL}>
                        <h2 className="admin-section-title mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Acessos por cidade
                        </h2>
                        {locationChart.length === 0 ? (
                            <p className="admin-empty-text py-8 text-center">
                                Localização registrada em novos acessos (IP). Registros antigos: &quot;Desconhecida&quot;.
                            </p>
                        ) : (
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={locationChart} margin={{ bottom: 48 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                                        <XAxis dataKey="name" tick={axisTick} angle={-28} textAnchor="end" height={70} />
                                        <YAxis tick={axisTick} allowDecimals={false} />
                                        <Tooltip
                                            contentStyle={chartTheme.tooltip}
                                            formatter={(value: number, name: string) => [
                                                formatNumber(value),
                                                name === 'views' ? 'Visualizações' : 'Únicos',
                                            ]}
                                        />
                                        <Legend wrapperStyle={legendStyle} />
                                        <Bar dataKey="views" name="Visualizações" fill={chartTheme.accent} radius={[6, 6, 0, 0]} />
                                        <Bar dataKey="unique" name="Visitantes únicos" fill={chartTheme.accentAlt} radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {locations.length > 0 && (
                            <div className="mt-6 overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-2 admin-table-head">Cidade</th>
                                            <th className="text-left py-2 admin-table-head">Estado/Região</th>
                                            <th className="text-left py-2 admin-table-head">País</th>
                                            <th className="text-right py-2 admin-table-head">Views</th>
                                            <th className="text-right py-2 admin-table-head">Únicos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {locations.slice(0, 15).map((loc) => (
                                            <tr
                                                key={`${loc.city}-${loc.region}-${loc.country}`}
                                                className="admin-analytics-table-row border-b border-gray-50"
                                            >
                                                <td className="py-2.5">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Globe className="w-3.5 h-3.5 admin-icon-muted shrink-0" />
                                                        {loc.city}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 admin-card-meta">{loc.region}</td>
                                                <td className="py-2.5 admin-card-meta">{loc.country}</td>
                                                <td className="py-2.5 text-right font-medium">{formatNumber(loc.view_count)}</td>
                                                <td className="py-2.5 text-right">{formatNumber(loc.unique_views)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>

                    {topPagesChart.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={PANEL}>
                            <h2 className="admin-section-title mb-4 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                Páginas mais acessadas
                            </h2>
                            <div className="h-72 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topPagesChart}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                                        <XAxis dataKey="name" tick={axisTick} angle={-20} textAnchor="end" height={60} />
                                        <YAxis tick={axisTick} allowDecimals={false} />
                                        <Tooltip contentStyle={chartTheme.tooltip} />
                                        <Legend wrapperStyle={legendStyle} />
                                        <Bar dataKey="views" name="Visualizações" fill={chartTheme.primary} radius={[6, 6, 0, 0]} />
                                        <Bar dataKey="unique" name="Únicos" fill={chartTheme.primarySoft} radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-3 admin-table-head">#</th>
                                            <th className="text-left py-3 px-3 admin-table-head">Página</th>
                                            <th className="text-right py-3 px-3 admin-table-head">Views</th>
                                            <th className="text-right py-3 px-3 admin-table-head">Únicos</th>
                                            <th className="text-right py-3 px-3 admin-table-head">Última visita</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pageStats.map((stat, index) => (
                                            <tr key={stat.page_path} className="admin-analytics-table-row border-b border-gray-100">
                                                <td className="py-3 px-3">
                                                    <span className="w-7 h-7 rounded-lg bg-[var(--color-accent)] text-white inline-flex items-center justify-center text-xs font-bold">
                                                        {index + 1}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-3">
                                                    <p className="admin-list-item-title">{getPageName(stat.page_path)}</p>
                                                    <p className="admin-card-meta">{stat.page_path}</p>
                                                </td>
                                                <td className="py-3 px-3 text-right font-medium">{formatNumber(stat.view_count)}</td>
                                                <td className="py-3 px-3 text-right">{formatNumber(stat.unique_views)}</td>
                                                <td className="py-3 px-3 text-right text-sm admin-card-meta">
                                                    {formatDateFull(stat.last_viewed)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </>
            )}
        </div>
    );
}
