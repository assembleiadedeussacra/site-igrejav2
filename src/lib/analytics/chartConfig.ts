import type { CSSProperties } from 'react';
import type { ChartTheme } from './chartTheme';

/** Margens padrão para evitar corte de eixos e legendas */
export const CHART_MARGINS = {
    area: { top: 12, right: 20, left: 4, bottom: 8 },
    barVertical: { top: 12, right: 16, left: 4, bottom: 4 },
    barHorizontal: { top: 12, right: 20, left: 4, bottom: 44 },
    pie: { top: 8, right: 8, left: 8, bottom: 8 },
} as const;

export function truncateLabel(text: string, max = 22): string {
    const t = text.trim();
    if (t.length <= max) return t;
    return `${t.slice(0, max - 1)}…`;
}

export function yAxisWidthForLabels(
    labels: string[],
    min = 72,
    max = 140
): number {
    if (labels.length === 0) return min;
    const longest = Math.max(...labels.map((l) => l.length));
    return Math.min(max, Math.max(min, longest * 6.5 + 16));
}

/** Altura do container conforme quantidade de linhas (grouped = 2 barras por linha) */
export function horizontalChartHeight(itemCount: number, grouped = false): number {
    const perRow = grouped ? 56 : 44;
    const base = grouped ? 72 : 52;
    return Math.max(200, itemCount * perRow + base);
}

export function formatChartTick(value: number): string {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 10_000) return `${(value / 1_000).toFixed(0)}k`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
    return String(value);
}

export function legendProps(theme: ChartTheme) {
    return {
        verticalAlign: 'bottom' as const,
        align: 'center' as const,
        wrapperStyle: {
            color: theme.legend,
            fontSize: 12,
            paddingTop: 12,
            lineHeight: '1.5',
        },
        iconSize: 10,
    };
}

export function axisTickStyle(theme: ChartTheme) {
    return { fill: theme.axis, fontSize: 11 };
}

export function tooltipContentStyle(theme: ChartTheme): CSSProperties {
    return {
        ...theme.tooltip,
        maxWidth: 320,
        whiteSpace: 'normal',
        wordBreak: 'break-word',
    };
}
