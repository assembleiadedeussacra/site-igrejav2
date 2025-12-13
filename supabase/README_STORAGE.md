# Como Criar os Buckets no Supabase Storage

Este guia explica como criar os buckets necessários para o sistema de upload de imagens.

## Método 1: Usando o SQL Editor (Recomendado)

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor** no menu lateral
4. Clique em **New Query**
5. Copie e cole o conteúdo do arquivo `create_storage_buckets.sql`
6. Clique em **Run** (ou pressione `Ctrl+Enter`)

O script irá:
- ✅ Criar os 5 buckets necessários
- ✅ Configurar políticas de acesso (RLS)
- ✅ Permitir leitura pública e escrita apenas para usuários autenticados

## Método 2: Usando a Interface Web

Se preferir criar manualmente:

1. Acesse **Storage** no menu lateral
2. Clique em **New bucket**
3. Para cada bucket, configure:

### Bucket: `leaders`
- **Name**: `leaders`
- **Public bucket**: ✅ Sim
- **File size limit**: `5 MB`
- **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp`

### Bucket: `posts`
- **Name**: `posts`
- **Public bucket**: ✅ Sim
- **File size limit**: `5 MB`
- **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp`

### Bucket: `gallery`
- **Name**: `gallery`
- **Public bucket**: ✅ Sim
- **File size limit**: `5 MB`
- **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp`

### Bucket: `financials`
- **Name**: `financials`
- **Public bucket**: ✅ Sim
- **File size limit**: `5 MB`
- **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp`

### Bucket: `testimonials`
- **Name**: `testimonials`
- **Public bucket**: ✅ Sim
- **File size limit**: `2 MB` (menor para avatares)
- **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp`

## Configurar Políticas de Acesso (RLS)

Após criar os buckets, você precisa configurar as políticas de acesso:

1. Vá em **Storage** → Selecione um bucket
2. Clique na aba **Policies**
3. Para cada bucket, adicione as seguintes políticas:

### Política de Leitura (SELECT)
- **Policy name**: `Public Access for [bucket-name]`
- **Allowed operation**: `SELECT`
- **Policy definition**: 
  ```sql
  bucket_id = '[bucket-name]'
  ```

### Política de Upload (INSERT)
- **Policy name**: `Authenticated users can upload to [bucket-name]`
- **Allowed operation**: `INSERT`
- **Policy definition**:
  ```sql
  bucket_id = '[bucket-name]' AND auth.role() = 'authenticated'
  ```

### Política de Atualização (UPDATE)
- **Policy name**: `Authenticated users can update [bucket-name]`
- **Allowed operation**: `UPDATE`
- **Policy definition**:
  ```sql
  bucket_id = '[bucket-name]' AND auth.role() = 'authenticated'
  ```

### Política de Exclusão (DELETE)
- **Policy name**: `Authenticated users can delete [bucket-name]`
- **Allowed operation**: `DELETE`
- **Policy definition**:
  ```sql
  bucket_id = '[bucket-name]' AND auth.role() = 'authenticated'
  ```

## Verificar se os Buckets Foram Criados

Execute esta query no SQL Editor para verificar:

```sql
SELECT id, name, public, file_size_limit, allowed_mime_types, created_at
FROM storage.buckets
WHERE id IN ('leaders', 'posts', 'gallery', 'financials', 'testimonials')
ORDER BY created_at;
```

Você deve ver 5 buckets listados.

## Troubleshooting

### Erro: "bucket already exists"
- Isso significa que o bucket já foi criado anteriormente
- O script usa `ON CONFLICT DO NOTHING`, então é seguro executar novamente

### Erro: "permission denied"
- Certifique-se de estar logado como administrador do projeto
- Verifique se você tem permissões de administrador no Supabase

### Imagens não aparecem após upload
- Verifique se o bucket está marcado como **Public**
- Verifique se as políticas RLS estão configuradas corretamente
- Verifique se a URL gerada está correta no código

## Próximos Passos

Após criar os buckets:
1. ✅ Teste o upload de uma imagem no módulo de Liderança
2. ✅ Teste o upload de capa no módulo de Posts
3. ✅ Teste o upload de capa no módulo de Galeria
4. ✅ Teste o upload de QR Code no módulo Financeiro
5. ✅ Teste o upload de avatar no módulo de Depoimentos

