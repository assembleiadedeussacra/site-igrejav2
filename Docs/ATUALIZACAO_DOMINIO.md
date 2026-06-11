# Domínio oficial do site

URL canônica definitiva:

**https://www.assembleiadedeussacramento.com.br**

## Onde está configurado

- `src/lib/seo/constants.ts` — fallback `PRODUCTION_SITE_URL` (sitemap, Open Graph, Schema.org, canonical)
- `NEXT_PUBLIC_SITE_URL` — variável de ambiente (`.env.local` / Vercel)
- `CORS_ORIGIN` — API `/api/content/posts`
- `next.config.ts` — redirect 301 de `assembleiadedeussacramento.com.br` → `www`

## Vercel (produção)

```env
NEXT_PUBLIC_SITE_URL=https://www.assembleiadedeussacramento.com.br
CORS_ORIGIN=https://www.assembleiadedeussacramento.com.br
```

## SEO

- Sitemap: https://www.assembleiadedeussacramento.com.br/sitemap.xml
- Robots: https://www.assembleiadedeussacramento.com.br/robots.txt

Configure a mesma URL no [Google Search Console](https://search.google.com/search-console).
