/** Verifica se a URL é válida para uso em <Image src={...} /> */
export function hasValidImageUrl(url: string | null | undefined): url is string {
    return typeof url === 'string' && url.trim().length > 0;
}
