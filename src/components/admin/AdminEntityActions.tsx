'use client';

import { Pencil, Trash2 } from 'lucide-react';

interface AdminEntityActionsProps {
    onEdit: () => void;
    onDelete: () => void;
    editLabel?: string;
    deleteLabel?: string;
    size?: 'sm' | 'md';
}

export default function AdminEntityActions({
    onEdit,
    onDelete,
    editLabel = 'Editar',
    deleteLabel = 'Excluir',
    size = 'md',
}: AdminEntityActionsProps) {
    const iconClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
    const btnClass =
        size === 'sm'
            ? 'p-1.5 rounded-[8px]'
            : 'p-2 rounded-[10px]';

    return (
        <div className="flex items-center gap-1.5">
            <button
                type="button"
                onClick={onEdit}
                className={`${btnClass} text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors`}
                aria-label={editLabel}
                title={editLabel}
            >
                <Pencil className={iconClass} />
            </button>
            <button
                type="button"
                onClick={onDelete}
                className={`${btnClass} text-red-600 bg-red-50 hover:bg-red-100 transition-colors`}
                aria-label={deleteLabel}
                title={deleteLabel}
            >
                <Trash2 className={iconClass} />
            </button>
        </div>
    );
}
