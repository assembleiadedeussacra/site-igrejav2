import { z } from 'zod';

/**
 * Schema de validação para posts (blog e estudos)
 */
export const postSchema = z.object({
  title: z
    .string()
    .min(10, 'Título deve ter no mínimo 10 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens')
    .min(3, 'Slug deve ter no mínimo 3 caracteres')
    .max(200, 'Slug deve ter no máximo 200 caracteres'),
  
  content: z
    .string()
    .min(100, 'Conteúdo deve ter no mínimo 100 caracteres'),
  
  excerpt: z
    .string()
    .max(300, 'Resumo deve ter no máximo 300 caracteres')
    .optional()
    .nullable(),
  
  meta_title: z
    .string()
    .max(60, 'Meta título deve ter no máximo 60 caracteres (ideal para SEO)')
    .optional()
    .nullable(),
  
  meta_description: z
    .string()
    .max(160, 'Meta descrição deve ter no máximo 160 caracteres (ideal para SEO)')
    .optional()
    .nullable(),
  
  keywords: z
    .string()
    .optional()
    .nullable(),
  
  tags: z
    .array(z.string())
    .max(10, 'Máximo de 10 tags permitidas')
    .default([]),
  
  type: z.enum(['blog', 'study']),
  
  published: z.boolean().default(false),
  
  cover_image: z
    .string()
    .url('URL da imagem de capa inválida')
    .optional()
    .nullable(),
  
  canonical_url: z
    .string()
    .url('URL canônica inválida')
    .optional()
    .nullable(),
  
  og_title: z
    .string()
    .max(60, 'OG título deve ter no máximo 60 caracteres')
    .optional()
    .nullable(),
  
  og_description: z
    .string()
    .max(160, 'OG descrição deve ter no máximo 160 caracteres')
    .optional()
    .nullable(),
  
  og_image: z
    .string()
    .url('URL da imagem OG inválida')
    .optional()
    .nullable(),
  
  noindex: z.boolean().default(false),
  nofollow: z.boolean().default(false),
  
  schema_type: z
    .enum(['Article', 'BlogPosting', 'Study'])
    .optional()
    .nullable(),
});

/**
 * Valida dados de post e retorna resultado formatado
 */
export function validatePost(data: unknown): {
  success: true;
  data: z.infer<typeof postSchema>;
} | {
  success: false;
  errors: Array<{ field: string; message: string }>;
} {
  try {
    const validated = postSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((e) => ({
          field: e.path.join('.') || 'root',
          message: e.message,
        })),
      };
    }
    throw error;
  }
}

/**
 * Valida apenas campos obrigatórios (para updates parciais)
 */
export const postPartialSchema = postSchema.partial().extend({
  title: postSchema.shape.title.optional(),
  slug: postSchema.shape.slug.optional(),
  content: postSchema.shape.content.optional(),
});

export function validatePostPartial(data: unknown): {
  success: true;
  data: z.infer<typeof postPartialSchema>;
} | {
  success: false;
  errors: Array<{ field: string; message: string }>;
} {
  try {
    const validated = postPartialSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((e) => ({
          field: e.path.join('.') || 'root',
          message: e.message,
        })),
      };
    }
    throw error;
  }
}
