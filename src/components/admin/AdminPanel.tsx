'use client';

import { Loader2, LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface AdminPanelProps {
    isLoading?: boolean;
    isEmpty?: boolean;
    emptyIcon?: LucideIcon;
    emptyMessage?: string;
    loadingMessage?: string;
    children: ReactNode;
    hint?: string;
}

export default function AdminPanel({
    isLoading,
    isEmpty,
    emptyIcon: EmptyIcon,
    emptyMessage = 'Nenhum item cadastrado',
    loadingMessage = 'Carregando...',
    children,
    hint,
}: AdminPanelProps) {
    return (
        <div className="admin-card bg-white rounded-[10px] shadow-lg overflow-hidden border border-gray-100">
            {hint && !isLoading && !isEmpty && (
                <div className="px-4 py-3 bg-[var(--color-primary)]/10 border-b border-gray-100 admin-panel-hint flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/80 text-[var(--color-accent)] font-bold text-xs shadow-sm">
                        ⋮⋮
                    </span>
                    {hint}
                </div>
            )}
            {isLoading ? (
                <div className="p-12 text-center">
                    <Loader2 className="w-10 h-10 mx-auto mb-3 text-[var(--color-accent)] animate-spin" />
                    <p className="admin-empty-text">{loadingMessage}</p>
                </div>
            ) : isEmpty ? (
                <div className="p-12 text-center">
                    {EmptyIcon && <EmptyIcon className="w-14 h-14 mx-auto mb-4 text-gray-300" />}
                    <p className="admin-empty-text">{emptyMessage}</p>
                </div>
            ) : (
                children
            )}
        </div>
    );
}
