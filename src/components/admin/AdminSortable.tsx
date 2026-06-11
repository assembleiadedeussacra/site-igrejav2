'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { reorderById } from '@/lib/admin/reorder';

export interface SortableItemRenderProps {
    index: number;
    isDragging: boolean;
    layout: 'list' | 'grid';
    dragHandle: React.ReactNode;
    orderBadge: React.ReactNode;
}

interface AdminSortableProps<T> {
    items: T[];
    getItemId: (item: T) => string;
    onReorder: (reorderedItems: T[]) => Promise<void>;
    renderItem: (item: T, props: SortableItemRenderProps) => ReactNode;
    layout?: 'list' | 'grid';
    className?: string;
}

function SortableItemShell<T>({
    id,
    index,
    layout,
    children,
}: {
    id: string;
    index: number;
    layout: 'list' | 'grid';
    children: (props: SortableItemRenderProps) => ReactNode;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const dragHandle = (
        <button
            type="button"
            className="admin-drag-handle p-2 rounded-[10px] text-gray-400 hover:text-[var(--color-accent)] hover:bg-[var(--color-primary)]/20 cursor-grab active:cursor-grabbing transition-colors touch-none"
            {...attributes}
            {...listeners}
            aria-label={`Arrastar item ${index + 1}`}
        >
            <GripVertical className="w-5 h-5" />
        </button>
    );

    const orderBadge = (
        <span className="inline-flex items-center justify-center min-w-[1.75rem] h-7 px-2 rounded-full bg-[var(--color-accent)] text-white text-xs font-bold tabular-nums">
            {index + 1}
        </span>
    );

    const shellClass =
        layout === 'grid'
            ? `admin-sortable-card h-full ${isDragging ? 'admin-sortable-dragging' : ''}`
            : `admin-sortable-row ${isDragging ? 'admin-sortable-dragging' : ''}`;

    return (
        <div ref={setNodeRef} style={style} className={shellClass}>
            {children({ index, isDragging, layout, dragHandle, orderBadge })}
        </div>
    );
}

export default function AdminSortable<T>({
    items,
    getItemId,
    onReorder,
    renderItem,
    layout = 'list',
    className = '',
}: AdminSortableProps<T>) {
    const [isSaving, setIsSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id || isSaving) return;

        const reordered = reorderById(
            items,
            String(active.id),
            String(over.id),
            getItemId
        );

        if (reordered === items) return;

        setIsSaving(true);
        try {
            await onReorder(reordered);
        } finally {
            setIsSaving(false);
        }
    };

    const ids = items.map(getItemId);
    const strategy = layout === 'grid' ? rectSortingStrategy : verticalListSortingStrategy;

    const containerClass =
        layout === 'grid'
            ? `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4 ${className}`
            : `divide-y divide-gray-100 ${className}`;

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={ids} strategy={strategy}>
                <div className={containerClass} data-saving={isSaving || undefined}>
                    {items.map((item, index) => (
                        <SortableItemShell
                            key={getItemId(item)}
                            id={getItemId(item)}
                            index={index}
                            layout={layout}
                        >
                            {(props) => renderItem(item, props)}
                        </SortableItemShell>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
