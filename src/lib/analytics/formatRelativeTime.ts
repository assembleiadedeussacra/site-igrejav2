export function formatRelativeTime(isoDate: string): string {
    const date = new Date(isoDate);
    const diffMs = Date.now() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 10) return 'agora';
    if (diffSec < 60) return `há ${diffSec}s`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `há ${diffMin} min`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `há ${diffHour}h`;
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function formatLastUpdated(date: Date | null): string {
    if (!date) return '—';
    return formatRelativeTime(date.toISOString());
}
