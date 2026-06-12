/**
 * Verifica conexão e estrutura mínima do Supabase usando .env.local
 * Uso: node scripts/verify-supabase.mjs
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), '.env.local');
  const content = readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
  return env;
}

const env = loadEnvLocal();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY ausentes no .env.local');
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
};

const tables = [
  'banners',
  'verses',
  'posts',
  'post_relations',
  'site_settings',
  'page_views',
  'events',
  'page_banners',
  'about_page_cover',
  'departments',
  'department_members',
  'admin_users',
  'contact_messages',
];

/** Colunas críticas por tabela (select=id,col) */
const columnChecks = [
  { table: 'site_settings', column: 'hero_autoplay_seconds' },
  { table: 'site_settings', column: 'google_maps_embed' },
  { table: 'events', column: 'order' },
  { table: 'posts', column: 'slug' },
  { table: 'banners', column: 'overlay_opacity' },
  { table: 'testimonials', column: 'order' },
  { table: 'page_views', column: 'device_type' },
  { table: 'page_views', column: 'city' },
];

console.log('Verificando Supabase:', url);

let hasError = false;

for (const table of tables) {
  const res = await fetch(`${url}/rest/v1/${table}?select=id&limit=1`, { headers });

  if (res.ok) {
    console.log(`✅ tabela ${table}`);
  } else {
    const body = await res.text();
    console.error(`❌ tabela ${table} — HTTP ${res.status}: ${body.slice(0, 120)}`);
    hasError = true;
  }
}

for (const { table, column } of columnChecks) {
  const res = await fetch(`${url}/rest/v1/${table}?select=${column}&limit=1`, { headers });

  if (res.ok) {
    console.log(`✅ coluna ${table}.${column}`);
  } else {
    const body = await res.text();
    console.error(`❌ coluna ${table}.${column} — HTTP ${res.status}: ${body.slice(0, 120)}`);
    hasError = true;
  }
}

const rpcChecks = [
  'get_page_view_stats',
  'get_daily_page_views',
  'get_analytics_summary',
  'get_device_breakdown',
  'get_location_breakdown',
  'is_site_admin',
  'increment_post_views',
];
for (const fn of rpcChecks) {
  const body =
    fn === 'increment_post_views'
      ? JSON.stringify({ post_id: '00000000-0000-4000-8000-000000000000' })
      : fn === 'is_site_admin'
        ? JSON.stringify({})
        : JSON.stringify({ days_back: 1 });

  const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body,
  });

  if (res.ok || res.status === 200) {
    console.log(`✅ função ${fn}`);
  } else {
    const body = await res.text();
    console.error(`❌ função ${fn} — HTTP ${res.status}: ${body.slice(0, 120)}`);
    hasError = true;
  }
}

if (hasError) {
  console.log('\n💡 Execute as migrações em supabase/ ou o schema.sql consolidado no SQL Editor.');
  process.exit(1);
}

console.log('\n✅ Supabase OK — estrutura mínima verificada.');
process.exit(0);
