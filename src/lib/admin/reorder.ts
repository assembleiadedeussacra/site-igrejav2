import { arrayMove } from '@dnd-kit/sortable';

export function reorderById<T>(
    items: T[],
    activeId: string,
    overId: string,
    getId: (item: T) => string
): T[] {
    const oldIndex = items.findIndex((item) => getId(item) === activeId);
    const newIndex = items.findIndex((item) => getId(item) === overId);
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return items;
    }
    return arrayMove(items, oldIndex, newIndex);
}

export function toOrderUpdates<T>(
    items: T[],
    getId: (item: T) => string
): { id: string; order: number }[] {
    return items.map((item, index) => ({
        id: getId(item),
        order: index + 1,
    }));
}
