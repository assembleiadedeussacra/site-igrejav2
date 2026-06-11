import type { CSSProperties } from 'react';
import type { AdminTheme } from '@/contexts/AdminThemeContext';

export interface ChartTheme {
    grid: string;
    axis: string;
    legend: string;
    tooltip: CSSProperties;
    primary: string;
    primarySoft: string;
    secondary: string;
    accent: string;
    accentAlt: string;
    gradientId: string;
}

export function getChartTheme(theme: AdminTheme): ChartTheme {
    const isDark = theme === 'dark';

    return {
        grid: isDark ? '#334155' : '#eef2f7',
        axis: isDark ? '#94a3b8' : '#64748b',
        legend: isDark ? '#cbd5e1' : '#475569',
        tooltip: {
            borderRadius: 10,
            border: isDark ? '1px solid #475569' : '1px solid #e5e7eb',
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#e2e8f0' : '#1e293b',
            fontSize: 13,
            boxShadow: isDark
                ? '0 8px 24px rgba(0,0,0,0.35)'
                : '0 4px 16px rgba(0,0,0,0.08)',
        },
        primary: isDark ? '#818cf8' : '#232d82',
        primarySoft: isDark ? 'rgba(129, 140, 248, 0.35)' : 'rgba(35, 45, 130, 0.25)',
        secondary: isDark ? '#c4b5fd' : '#8b5cf6',
        accent: isDark ? '#38bdf8' : '#0ea5e9',
        accentAlt: isDark ? '#6366f1' : '#3a4699',
        gradientId: isDark ? 'viewsGradDark' : 'viewsGradLight',
    };
}
