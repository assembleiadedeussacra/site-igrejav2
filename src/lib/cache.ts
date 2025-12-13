import { unstable_cache } from 'next/cache';
import { serverApi } from '@/services/server';
import type { Post } from '@/lib/database.types';

/**
 * Cache inteligente para posts
 * Usa Next.js unstable_cache para cachear resultados de queries
 */

/**
 * Obtém posts do blog com cache
 */
export async function getCachedBlogPosts(limit?: number, offset?: number) {
  return unstable_cache(
    async () => {
      return await serverApi.getPostsByType('blog', limit, offset);
    },
    ['blog-posts', `limit-${limit}`, `offset-${offset}`],
    {
      revalidate: 3600, // 1 hora
      tags: ['posts', 'blog'],
    }
  )();
}

/**
 * Obtém posts de estudos com cache
 */
export async function getCachedStudyPosts(limit?: number, offset?: number) {
  return unstable_cache(
    async () => {
      return await serverApi.getPostsByType('study', limit, offset);
    },
    ['study-posts', `limit-${limit}`, `offset-${offset}`],
    {
      revalidate: 3600, // 1 hora
      tags: ['posts', 'study'],
    }
  )();
}

/**
 * Obtém post por slug com cache
 */
export async function getCachedPostBySlug(
  slug: string,
  type?: 'blog' | 'study'
): Promise<Post | null> {
  return unstable_cache(
    async () => {
      return await serverApi.getPostBySlug(slug, type);
    },
    ['post', slug, type || 'any'],
    {
      revalidate: 3600, // 1 hora
      tags: ['posts', `post-${slug}`],
    }
  )();
}

/**
 * Obtém posts mais visualizados com cache
 */
export async function getCachedTopPosts(
  type: 'blog' | 'study',
  limit: number = 8
) {
  return unstable_cache(
    async () => {
      return await serverApi.getTopPostsThisMonth(type, limit);
    },
    ['top-posts', type, `limit-${limit}`],
    {
      revalidate: 1800, // 30 minutos (posts populares mudam mais frequentemente)
      tags: ['posts', 'top-posts', type],
    }
  )();
}

/**
 * Obtém posts relacionados com cache
 */
export async function getCachedRelatedPosts(
  postId: string,
  type: 'blog' | 'study',
  limit: number = 3
) {
  return unstable_cache(
    async () => {
      return await serverApi.getRelatedPosts(postId, type, limit);
    },
    ['related-posts', postId, type, `limit-${limit}`],
    {
      revalidate: 3600, // 1 hora
      tags: ['posts', 'related-posts', `post-${postId}`],
    }
  )();
}

/**
 * Obtém banners com cache
 */
export async function getCachedBanners() {
  return unstable_cache(
    async () => {
      return await serverApi.getBanners();
    },
    ['banners'],
    {
      revalidate: 1800, // 30 minutos
      tags: ['banners'],
    }
  )();
}

/**
 * Obtém configurações do site com cache
 */
export async function getCachedSettings() {
  return unstable_cache(
    async () => {
      return await serverApi.getSettings();
    },
    ['settings'],
    {
      revalidate: 3600, // 1 hora (configurações mudam raramente)
      tags: ['settings'],
    }
  )();
}
