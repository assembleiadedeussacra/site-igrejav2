'use client';

import type { ChartTheme } from '@/lib/analytics/chartTheme';
import { formatNumber } from './analyticsFormat';

type PayloadItem = {
    name?: string | number;
    value?: unknown;
    color?: string;
    payload?: Record<string, unknown>;
};

interface AnalyticsChartTooltipProps {
    active?: boolean;
    payload?: readonly PayloadItem[] | PayloadItem[];
    label?: string | number;
    theme: ChartTheme;
    labelFormatter?: (label: string, payload: readonly PayloadItem[]) => string;
    valueFormatter?: (value: number, name: string) => [string, string];
}

export default function AnalyticsChartTooltip({
    active,
    payload,
    label,
    theme,
    labelFormatter,
    valueFormatter,
}: AnalyticsChartTooltipProps) {
    if (!active || !payload?.length) return null;

    const displayLabel = labelFormatter
        ? labelFormatter(String(label ?? ''), payload)
        : String(label ?? payload[0]?.name ?? '');

    return (
        <div
            className="admin-analytics-chart-tooltip rounded-[10px] px-3 py-2.5 text-sm shadow-lg"
            style={{
                backgroundColor: theme.tooltip.backgroundColor as string,
                border: theme.tooltip.border as string,
                color: theme.tooltip.color as string,
                maxWidth: 320,
            }}
        >
            {displayLabel && (
                <p className="font-semibold mb-1.5 leading-snug break-words whitespace-pre-line">
                    {displayLabel}
                </p>
            )}
            <ul className="space-y-1">
                {payload.map((entry, i) => {
                    const rawName = String(entry.name ?? '');
                    const value = Number(entry.value ?? 0);
                    const [formattedValue, formattedName] = valueFormatter
                        ? valueFormatter(value, rawName)
                        : [formatNumber(value), rawName];

                    return (
                        <li key={`${rawName}-${i}`} className="flex items-center gap-2">
                            <span
                                className="w-2.5 h-2.5 rounded-sm shrink-0"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="flex-1 min-w-0 break-words">{formattedName}</span>
                            <span className="font-semibold tabular-nums shrink-0">{formattedValue}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
