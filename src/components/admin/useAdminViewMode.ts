'use client';

import { useCallback, useEffect, useState } from 'react';

export type AdminViewMode = 'list' | 'grid';

export function useAdminViewMode(pageKey: string, defaultMode: AdminViewMode = 'list') {
    const storageKey = `admin-view-${pageKey}`;
    const [viewMode, setViewModeState] = useState<AdminViewMode>(defaultMode);

    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored === 'list' || stored === 'grid') {
            setViewModeState(stored);
        }
    }, [storageKey]);

    const setViewMode = useCallback(
        (mode: AdminViewMode) => {
            setViewModeState(mode);
            localStorage.setItem(storageKey, mode);
        },
        [storageKey]
    );

    return { viewMode, setViewMode };
}
