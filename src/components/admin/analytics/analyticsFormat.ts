const COUNTRY_NAMES: Record<string, string> = {
    BR: 'Brasil',
    US: 'Estados Unidos',
    PT: 'Portugal',
    AR: 'Argentina',
    PY: 'Paraguai',
    UY: 'Uruguai',
    CL: 'Chile',
    BO: 'Bolívia',
    PE: 'Peru',
    CO: 'Colômbia',
    VE: 'Venezuela',
    MX: 'México',
    CA: 'Canadá',
    GB: 'Reino Unido',
    DE: 'Alemanha',
    FR: 'França',
    IT: 'Itália',
    ES: 'Espanha',
};

export function formatNumber(num: number): string {
    return new Intl.NumberFormat('pt-BR').format(num);
}

export function formatCountry(code: string | null | undefined): string {
    if (!code || code === '—' || code.trim() === '') return '—';
    const upper = code.trim().toUpperCase();
    return COUNTRY_NAMES[upper] || code;
}
