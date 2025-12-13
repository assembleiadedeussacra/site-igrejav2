/**
 * Script para executar a migração de índices no Supabase
 * 
 * Uso:
 *   node scripts/run-migration-indexes.js
 * 
 * Requer variáveis de ambiente:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY (ou SUPABASE_ANON_KEY se tiver permissões)
 */

const fs = require('fs');
const path = require('path');

async function runMigration() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Erro: Variáveis de ambiente não configuradas');
    console.error('');
    console.error('Configure no .env.local:');
    console.error('  SUPABASE_URL=sua_url_do_supabase');
    console.error('  SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key');
    console.error('');
    console.error('Ou use NEXT_PUBLIC_SUPABASE_URL e SUPABASE_ANON_KEY');
    console.error('');
    console.error('⚠️  NOTA: Para executar via API, você precisa da SERVICE_ROLE_KEY');
    console.error('   (não a ANON_KEY). A SERVICE_ROLE_KEY tem permissões completas.');
    console.error('');
    console.error('💡 Alternativa: Execute o SQL manualmente no Supabase SQL Editor');
    console.error('   Arquivo: supabase/migrations/add_performance_indexes.sql');
    process.exit(1);
  }

  // Ler o arquivo SQL
  const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', 'add_performance_indexes.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  console.log('📦 Executando migração de índices...');
  console.log('');

  try {
    // Usar a API REST do Supabase para executar SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ sql }),
    });

    if (!response.ok) {
      // Tentar método alternativo: usar pg REST API diretamente
      console.log('⚠️  Método RPC não disponível, tentando método alternativo...');
      console.log('');
      console.log('❌ Não foi possível executar via API automática.');
      console.log('');
      console.log('📝 Por favor, execute manualmente:');
      console.log('   1. Acesse o Supabase Dashboard');
      console.log('   2. Vá em SQL Editor');
      console.log('   3. Cole o conteúdo de: supabase/migrations/add_performance_indexes.sql');
      console.log('   4. Execute o SQL');
      console.log('');
      process.exit(1);
    }

    const result = await response.json();
    console.log('✅ Migração executada com sucesso!');
    console.log('');
    console.log('Resultado:', result);
  } catch (error) {
    console.error('❌ Erro ao executar migração:', error.message);
    console.error('');
    console.error('📝 Execute manualmente no Supabase SQL Editor:');
    console.error('   Arquivo: supabase/migrations/add_performance_indexes.sql');
    process.exit(1);
  }
}

// Verificar se estamos executando diretamente
if (require.main === module) {
  runMigration().catch(console.error);
}

module.exports = { runMigration };
