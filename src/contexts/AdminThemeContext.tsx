'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

export type AdminTheme = 'light' | 'dark';

const STORAGE_KEY = 'admin-theme';

interface AdminThemeContextValue {
    theme: AdminTheme;
    toggleTheme: () => void;
    setTheme: (theme: AdminTheme) => void;
}

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null);

function readStoredTheme(): AdminTheme {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' ? 'dark' : 'light';
}

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<AdminTheme>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setThemeState(readStoredTheme());
        document.documentElement.setAttribute('data-admin-theme', readStoredTheme());
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem(STORAGE_KEY, theme);
        document.documentElement.setAttribute('data-admin-theme', theme);
    }, [theme, mounted]);

    const setTheme = useCallback((next: AdminTheme) => {
        setThemeState(next);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
    }, []);

    const value = useMemo(
        () => ({ theme, toggleTheme, setTheme }),
        [theme, toggleTheme, setTheme]
    );

    return (
        <AdminThemeContext.Provider value={value}>
            {children}
        </AdminThemeContext.Provider>
    );
}

export function useAdminTheme() {
    const ctx = useContext(AdminThemeContext);
    if (!ctx) {
        throw new Error('useAdminTheme must be used within AdminThemeProvider');
    }
    return ctx;
}
