import { unstable_cache } from 'next/cache';
import { serverApi } from '@/services/server';
import { CACHE_TAGS } from '@/lib/cacheTags';
import type { Post } from '@/lib/database.types';

export { CACHE_TAGS } from '@/lib/cacheTags';

function brasiliaDateKey(): string {
  const now = new Date();
  const brasiliaTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
  );
  return brasiliaTime.toISOString().split('T')[0];
}

export async function getCachedBlogPosts(limit?: number, offset?: number) {
  return unstable_cache(
    async () => serverApi.getPostsByType('blog', limit, offset),
    ['blog-posts', `limit-${limit}`, `offset-${offset}`],
    {
      revalidate: 3600,
      tags: [CACHE_TAGS.posts, CACHE_TAGS.blog],
    }
  )();
}

export async function getCachedStudyPosts(limit?: number, offset?: number) {
  return unstable_cache(
    async () => serverApi.getPostsByType('study', limit, offset),
    ['study-posts', `limit-${limit}`, `offset-${offset}`],
    {
      revalidate: 3600,
      tags: [CACHE_TAGS.posts, CACHE_TAGS.study],
    }
  )();
}

export async function getCachedAllPostsByType(type: 'blog' | 'study') {
  return unstable_cache(
    async () => serverApi.getAllPostsByType(type),
    ['all-posts', type],
    {
      revalidate: 3600,
      tags: [CACHE_TAGS.posts, type],
    }
  )();
}

export async function getCachedPostBySlug(
  slug: string,
  type?: 'blog' | 'study'
): Promise<Post | null> {
  return unstable_cache(
    async () => serverApi.getPostBySlug(slug, type),
    ['post', slug, type || 'any'],
    {
      revalidate: 3600,
      tags: [CACHE_TAGS.posts, `post-${slug}`],
    }
  )();
}

export async function getCachedTopPosts(
  type: 'blog' | 'study',
  limit: number = 8
) {
  return unstable_cache(
    async () => serverApi.getTopPostsThisMonth(type, limit),
    ['top-posts', type, `limit-${limit}`],
    {
      revalidate: 1800,
      tags: [CACHE_TAGS.posts, CACHE_TAGS.topPosts, type],
    }
  )();
}

export async function getCachedRelatedPosts(
  postId: string,
  type: 'blog' | 'study',
  limit: number = 3
) {
  return unstable_cache(
    async () => serverApi.getRelatedPosts(postId, type, limit),
    ['related-posts', postId, type, `limit-${limit}`],
    {
      revalidate: 3600,
      tags: [CACHE_TAGS.posts, CACHE_TAGS.relatedPosts, `post-${postId}`],
    }
  )();
}

export async function getCachedPageBanner(pageType: 'estudos' | 'blog') {
  return unstable_cache(
    async () => serverApi.getPageBanner(pageType),
    ['page-banner', pageType],
    {
      revalidate: 1800,
      tags: [CACHE_TAGS.pageBanners, CACHE_TAGS.banners],
    }
  )();
}

export async function getCachedBanners() {
  return unstable_cache(
    async () => serverApi.getBanners(),
    ['banners'],
    {
      revalidate: 1800,
      tags: [CACHE_TAGS.banners],
    }
  )();
}

export async function getCachedSettings() {
  return unstable_cache(
    async () => serverApi.getSettings(),
    ['settings'],
    {
      revalidate: 3600,
      tags: [CACHE_TAGS.settings],
    }
  )();
}

export async function getCachedDailyVerse() {
  const dateKey = brasiliaDateKey();
  return unstable_cache(
    async () => serverApi.getDailyVerse(),
    ['daily-verse', dateKey],
    {
      revalidate: 3600,
      tags: [CACHE_TAGS.verses],
    }
  )();
}

export async function getCachedEvents() {
  return unstable_cache(
    async () => serverApi.getEvents(),
    ['events'],
    {
      revalidate: 1800,
      tags: [CACHE_TAGS.events],
    }
  )();
}

export async function getCachedTestimonials() {
  return unstable_cache(
    async () => serverApi.getTestimonials(),
    ['testimonials'],
    {
      revalidate: 1800,
      tags: [CACHE_TAGS.testimonials],
    }
  )();
}

export async function getCachedFinancials() {
  return unstable_cache(
    async () => serverApi.getFinancials(),
    ['financials'],
    {
      revalidate: 3600,
      tags: [CACHE_TAGS.financials],
    }
  )();
}

export async function getCachedGalleryLinks() {
  return unstable_cache(
    async () => serverApi.getGalleryLinks(),
    ['gallery-links'],
    {
      revalidate: 1800,
      tags: [CACHE_TAGS.gallery],
    }
  )();
}

export async function getCachedHomePosts(limit = 3) {
  return unstable_cache(
    async () => serverApi.getPosts(limit),
    ['home-posts', `limit-${limit}`],
    {
      revalidate: 3600,
      tags: [CACHE_TAGS.posts],
    }
  )();
}

export async function getCachedLeaders() {
  return unstable_cache(
    async () => serverApi.getLeaders(),
    ['leaders'],
    {
      revalidate: 3600,
      tags: [CACHE_TAGS.leaders],
    }
  )();
}

export async function getCachedAboutPageCover() {
  return unstable_cache(
    async () => serverApi.getAboutPageCover(),
    ['about-page-cover'],
    {
      revalidate: 3600,
      tags: [CACHE_TAGS.about],
    }
  )();
}

export async function getCachedDepartments() {
  return unstable_cache(
    async () => serverApi.getDepartments(),
    ['departments'],
    {
      revalidate: 3600,
      tags: [CACHE_TAGS.departments],
    }
  )();
}

export async function getCachedDepartmentMembers(departmentId: string) {
  return unstable_cache(
    async () => serverApi.getDepartmentMembers(departmentId),
    ['department-members', departmentId],
    {
      revalidate: 3600,
      tags: [CACHE_TAGS.departments, `dept-${departmentId}`],
    }
  )();
}
