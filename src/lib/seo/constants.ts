/** URL pública definitiva do site (com www, sem barra final) */
export const PRODUCTION_SITE_URL = 'https://www.assembleiadedeussacramento.com.br';

export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_SITE_URL
).replace(/\/+$/, '');

export const SITE_NAME = 'AD Missão Sacramento';
export const CHURCH_NAME = 'Assembleia de Deus Missão de Sacramento MG';
export const DEFAULT_DESCRIPTION =
    'Website oficial da Igreja Assembleia de Deus Missão de Sacramento MG. Cultos, estudos bíblicos, eventos e departamentos.';

export const OG_IMAGE = '/images/og-image.jpg';
