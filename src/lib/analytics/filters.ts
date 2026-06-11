export type AnalyticsPeriod = '7' | '30' | '90' | '365';
export type PageCategory = 'all' | 'home' | 'blog' | 'estudos' | 'sobre' | 'other';
export type DeviceFilter = 'all' | 'mobile' | 'tablet' | 'desktop';

export interface AnalyticsFilters {
    period: AnalyticsPeriod;
    pageCategory: PageCategory;
    device: DeviceFilter;
    city: string;
}

export const DEFAULT_ANALYTICS_FILTERS: AnalyticsFilters = {
    period: '30',
    pageCategory: 'all',
    device: 'all',
    city: '',
};

export function filtersToRpcParams(filters: AnalyticsFilters) {
    return {
        days_back: parseInt(filters.period, 10),
        page_category:
            filters.pageCategory === 'all' ? null : filters.pageCategory,
        device_filter: filters.device === 'all' ? null : filters.device,
        city_filter: filters.city.trim() || null,
    };
}

export function getPageName(path: string): string {
    if (path === '/') return 'Página Inicial';
    if (path.startsWith('/blog/')) return `Blog: ${path.split('/').pop()}`;
    if (path.startsWith('/estudos/')) return `Estudo: ${path.split('/').pop()}`;
    if (path === '/sobre-nos') return 'Sobre Nós';
    if (path === '/blog') return 'Blog';
    if (path === '/estudos') return 'Estudos';
    return path;
}

export function matchesPageCategory(path: string, category: PageCategory): boolean {
    switch (category) {
        case 'all':
            return true;
        case 'home':
            return path === '/';
        case 'blog':
            return path === '/blog' || path.startsWith('/blog/');
        case 'estudos':
            return path === '/estudos' || path.startsWith('/estudos/');
        case 'sobre':
            return path === '/sobre-nos';
        case 'other':
            return (
                path !== '/' &&
                path !== '/blog' &&
                !path.startsWith('/blog/') &&
                path !== '/estudos' &&
                !path.startsWith('/estudos/') &&
                path !== '/sobre-nos'
            );
        default:
            return true;
    }
}
