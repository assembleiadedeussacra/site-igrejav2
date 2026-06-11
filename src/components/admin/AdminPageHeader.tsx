'use client';

import { ReactNode } from 'react';

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
}

export default function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="admin-title admin-page-title">{title}</h1>
                {description && (
                    <p className="admin-desc">{description}</p>
                )}
            </div>
            {action}
        </div>
    );
}
