'use client';

import { LayoutGrid, List } from 'lucide-react';
import type { AdminViewMode } from './useAdminViewMode';

interface AdminViewToggleProps {
    value: AdminViewMode;
    onChange: (mode: AdminViewMode) => void;
}

export default function AdminViewToggle({ value, onChange }: AdminViewToggleProps) {
    return (
        <div
            className="inline-flex items-center rounded-[10px] border border-gray-200 bg-white p-1 admin-card"
            role="group"
            aria-label="Modo de visualização"
        >
            <button
                type="button"
                onClick={() => onChange('list')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-sm font-medium transition-colors ${
                    value === 'list'
                        ? 'bg-[var(--color-accent)] text-white shadow-sm'
                        : 'text-[var(--color-text-secondary)] hover:bg-gray-50'
                }`}
                aria-pressed={value === 'list'}
                title="Visualização em lista"
            >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Lista</span>
            </button>
            <button
                type="button"
                onClick={() => onChange('grid')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-sm font-medium transition-colors ${
                    value === 'grid'
                        ? 'bg-[var(--color-accent)] text-white shadow-sm'
                        : 'text-[var(--color-text-secondary)] hover:bg-gray-50'
                }`}
                aria-pressed={value === 'grid'}
                title="Visualização em cards"
            >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Cards</span>
            </button>
        </div>
    );
}
