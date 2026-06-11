'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

export const ANALYTICS_LIVE_INTERVAL_MS = 12_000;

/** Polling + Supabase Realtime para atualizar o dashboard em tempo real */
export function useAnalyticsRealtime(
    enabled: boolean,
    onRefresh: () => void | Promise<void>
) {
    const refreshRef = useRef(onRefresh);
    refreshRef.current = onRefresh;

    useEffect(() => {
        if (!enabled) return;

        const refresh = () => {
            void refreshRef.current();
        };

        const intervalId = window.setInterval(refresh, ANALYTICS_LIVE_INTERVAL_MS);

        const supabase = createClient();
        const channel = supabase
            .channel('admin-analytics-live')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'page_views' },
                refresh
            )
            .subscribe();

        return () => {
            window.clearInterval(intervalId);
            void supabase.removeChannel(channel);
        };
    }, [enabled]);
}
