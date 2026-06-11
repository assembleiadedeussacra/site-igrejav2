'use client';

import { Moon, Sun } from 'lucide-react';
import { useAdminTheme } from '@/contexts/AdminThemeContext';

interface AdminThemeToggleProps {
    variant?: 'header' | 'sidebar' | 'login';
}

export default function AdminThemeToggle({ variant = 'header' }: AdminThemeToggleProps) {
    const { theme, toggleTheme } = useAdminTheme();
    const isDark = theme === 'dark';

    if (variant === 'login') {
        return (
            <button
                type="button"
                onClick={toggleTheme}
                className="admin-login-toggle p-2.5 rounded-[10px] transition-colors backdrop-blur-sm"
                aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
                title={isDark ? 'Modo claro' : 'Modo escuro'}
            >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
        );
    }

    if (variant === 'sidebar') {
        return (
            <button
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-[10px] hover:bg-white/20 transition-colors"
                aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {isDark ? 'Modo claro' : 'Modo escuro'}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-[10px] text-[var(--color-accent)] hover:bg-gray-100 dark-admin-hover transition-colors"
            aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
            title={isDark ? 'Modo claro' : 'Modo escuro'}
        >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
    );
}
