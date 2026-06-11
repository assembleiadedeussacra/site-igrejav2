'use client';

import { Activity, MapPin, Monitor, Smartphone, Tablet } from 'lucide-react';
import type { RecentPageView } from '@/lib/database.types';
import { getPageName } from '@/lib/analytics/filters';
import { deviceTypeLabel } from '@/lib/analytics/userAgent';
import { formatRelativeTime } from '@/lib/analytics/formatRelativeTime';

function DeviceIcon({ type }: { type: string | null }) {
    switch (type) {
        case 'mobile':
            return <Smartphone className="w-3.5 h-3.5 shrink-0" aria-hidden />;
        case 'tablet':
            return <Tablet className="w-3.5 h-3.5 shrink-0" aria-hidden />;
        case 'desktop':
            return <Monitor className="w-3.5 h-3.5 shrink-0" aria-hidden />;
        default:
            return <Activity className="w-3.5 h-3.5 shrink-0" aria-hidden />;
    }
}

interface AnalyticsLiveFeedProps {
    items: RecentPageView[];
    isRefreshing?: boolean;
}

export default function AnalyticsLiveFeed({ items, isRefreshing }: AnalyticsLiveFeedProps) {
    return (
        <div className="admin-analytics-panel admin-card rounded-[10px] p-5 md:p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="admin-section-title flex items-center gap-2 mb-0">
                    <Activity className="w-5 h-5" />
                    Acessos em tempo real
                </h2>
                {isRefreshing && (
                    <span className="admin-analytics-live-badge text-xs">Atualizando…</span>
                )}
            </div>

            {items.length === 0 ? (
                <p className="admin-empty-text py-6 text-center">
                    Aguardando novos acessos no site…
                </p>
            ) : (
                <ul className="admin-analytics-feed divide-y divide-gray-100 max-h-[420px] overflow-y-auto pr-1">
                    {items.map((item) => (
                        <li
                            key={item.id}
                            className="admin-analytics-feed-item py-3 first:pt-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="admin-list-item-title truncate">
                                    {getPageName(item.page_path)}
                                </p>
                                <p className="admin-card-meta truncate">{item.page_path}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
                                <span className="admin-analytics-tag inline-flex items-center gap-1">
                                    <DeviceIcon type={item.device_type} />
                                    {deviceTypeLabel(item.device_type || 'unknown')}
                                </span>
                                {item.city && (
                                    <span className="admin-analytics-tag inline-flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5" aria-hidden />
                                        {item.city}
                                        {item.region ? `, ${item.region}` : ''}
                                    </span>
                                )}
                                {item.browser && (
                                    <span className="admin-analytics-tag-muted">{item.browser}</span>
                                )}
                                <time
                                    className="admin-analytics-time tabular-nums"
                                    dateTime={item.created_at}
                                >
                                    {formatRelativeTime(item.created_at)}
                                </time>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
