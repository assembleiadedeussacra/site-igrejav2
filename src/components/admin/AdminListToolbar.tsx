'use client';

import { ReactNode } from 'react';
import AdminViewToggle from './AdminViewToggle';
import type { AdminViewMode } from './useAdminViewMode';

interface AdminListToolbarProps {
    children?: ReactNode;
    viewMode: AdminViewMode;
    onViewModeChange: (mode: AdminViewMode) => void;
}

export default function AdminListToolbar({ children, viewMode, onViewModeChange }: AdminListToolbarProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            {children ? <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">{children}</div> : <div />}
            <AdminViewToggle value={viewMode} onChange={onViewModeChange} />
        </div>
    );
}
