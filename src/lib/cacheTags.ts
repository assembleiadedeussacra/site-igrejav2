/** Tags do unstable_cache — invalidadas em revalidatePublicContent */
export const CACHE_TAGS = {
  posts: 'posts',
  blog: 'blog',
  study: 'study',
  banners: 'banners',
  settings: 'settings',
  events: 'events',
  testimonials: 'testimonials',
  financials: 'financials',
  gallery: 'gallery',
  leaders: 'leaders',
  verses: 'verses',
  departments: 'departments',
  about: 'about',
  pageBanners: 'page-banners',
  topPosts: 'top-posts',
  relatedPosts: 'related-posts',
} as const;

export const ALL_CONTENT_TAGS = Object.values(CACHE_TAGS);
