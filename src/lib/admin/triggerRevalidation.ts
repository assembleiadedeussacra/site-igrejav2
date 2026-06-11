/**
 * Dispara revalidação do cache (sitemap + páginas públicas) após alterações no admin.
 * Falha silenciosamente para não bloquear o fluxo de salvamento.
 */
export async function triggerContentRevalidation(options?: {
    type?: 'blog' | 'study';
    slug?: string;
}): Promise<void> {
    try {
        const response = await fetch('/api/admin/revalidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(options ?? {}),
        });

        if (!response.ok) {
            console.warn('Revalidação de conteúdo falhou:', response.status);
        }
    } catch (error) {
        console.warn('Revalidação de conteúdo indisponível:', error);
    }
}
