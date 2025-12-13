import { createClient, createClientForBuild } from '../lib/supabase/server';
import { fetchDailyVerse } from './verse-api';
import type { Post } from '../lib/database.types';

export const serverApi = {
    getBanners: async () => {
        try {
            const supabase = await createClient();
            const result = await supabase
                .from('banners')
                .select('*')
                .eq('active', true)
                .order('position', { ascending: true });
            return result.data || [];
        } catch (error) {
            console.error('Error fetching banners:', error);
            return [];
        }
    },

    getDailyVerse: async () => {
        try {
            const supabase = await createClient();
            // Usar data no fuso horário de Brasília para garantir consistência
            const now = new Date();
            const brasiliaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
            const today = brasiliaTime.toISOString().split('T')[0];

            // Buscar versículo específico para o dia atual no banco
            const { data: specificContent } = await supabase
                .from('verses')
                .select('*')
                .eq('active_date', today)
                .single();

            if (specificContent) return specificContent;

            // Se não houver versículo específico, buscar automaticamente da API
            const apiVerse = await fetchDailyVerse();
            
            if (apiVerse) {
                // Opcionalmente, salvar no banco para cache futuro
                // Mas não vamos salvar automaticamente para evitar poluir o banco
                return {
                    id: `api-${today}`,
                    text: apiVerse.text,
                    reference: apiVerse.reference,
                    bible_link: apiVerse.bible_link || null,
                    active_date: today,
                    created_at: new Date().toISOString(),
                };
            }

            // Fallback: buscar o mais recente do banco
            const { data } = await supabase
                .from('verses')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            return data || null;
        } catch (error) {
            console.error('Error fetching daily verse:', error);
            // Try API as last resort
            try {
                const apiVerse = await fetchDailyVerse();
                if (apiVerse) {
                    const today = new Date().toISOString().split('T')[0];
                    return {
                        id: `api-${today}`,
                        text: apiVerse.text,
                        reference: apiVerse.reference,
                        bible_link: apiVerse.bible_link,
                        active_date: today,
                        created_at: new Date().toISOString(),
                    };
                }
            } catch (apiError) {
                console.error('Error fetching from API:', apiError);
            }
            return null;
        }
    },

    getEvents: async () => {
        try {
            const supabase = await createClient();
            const { data } = await supabase
                .from('events')
                .select('*')
                .eq('active', true)
                .order('order', { ascending: true });
            return data || [];
        } catch (error) {
            console.error('Error fetching events:', error);
            return [];
        }
    },

    getTestimonials: async () => {
        try {
            const supabase = await createClient();
            const { data } = await supabase
                .from('testimonials')
                .select('*')
                .eq('active', true)
                .order('created_at', { ascending: false });
            return data || [];
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            return [];
        }
    },

    getFinancials: async () => {
        try {
            const supabase = await createClient();
            const { data } = await supabase
                .from('financials')
                .select('*')
                .eq('active', true)
                .limit(1)
                .single();
            return data || null;
        } catch (error) {
            console.error('Error fetching financials:', error);
            return null;
        }
    },

    getSettings: async () => {
        try {
            const supabase = await createClient();
            const { data } = await supabase
                .from('site_settings')
                .select('*')
                .limit(1)
                .single();
            return data || null;
        } catch (error) {
            console.error('Error fetching settings:', error);
            return null;
        }
    },

    getGalleryLinks: async () => {
        try {
            const supabase = await createClient();
            const { data } = await supabase
                .from('gallery_links')
                .select('*')
                .eq('active', true)
                .order('order', { ascending: true });
            return data || [];
        } catch (error) {
            console.error('Error fetching gallery links:', error);
            return [];
        }
    },

    getPosts: async (limit = 3) => {
        try {
            const supabase = await createClient();
            const { data } = await supabase
                .from('posts')
                .select('*')
                .eq('published', true)
                .order('created_at', { ascending: false })
                .limit(limit);
            return data || [];
        } catch (error) {
            console.error('Error fetching posts:', error);
            return [];
        }
    },

    getPostsByType: async (type: 'blog' | 'study', limit?: number, offset?: number) => {
        try {
            const supabase = await createClient();
            let query = supabase
                .from('posts')
                .select('*')
                .eq('type', type)
                .eq('published', true)
                .order('created_at', { ascending: false });

            if (limit) query = query.limit(limit);
            if (offset !== undefined && limit) {
                query = query.range(offset, offset + limit - 1);
            }

            const { data } = await query;
            return data || [];
        } catch (error) {
            console.error('Error fetching posts by type:', error);
            return [];
        }
    },

    getAllPostsByType: async (type: 'blog' | 'study') => {
        try {
            const supabase = await createClient();
            const { data } = await supabase
                .from('posts')
                .select('*')
                .eq('type', type)
                .eq('published', true)
                .order('created_at', { ascending: false });
            return data || [];
        } catch (error) {
            console.error('Error fetching all posts by type:', error);
            return [];
        }
    },

    getTopPostsThisMonth: async (type: 'blog' | 'study', limit = 8, useBuildClient = false) => {
        try {
            // Use build client if specified (for generateStaticParams)
            const supabase = useBuildClient ? createClientForBuild() : await createClient();
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const { data } = await supabase
                .from('posts')
                .select('*')
                .eq('type', type)
                .eq('published', true)
                .gte('created_at', startOfMonth.toISOString())
                .order('views', { ascending: false })
                .limit(limit);
            return data || [];
        } catch (error) {
            console.error('Error fetching top posts:', error);
            return [];
        }
    },

    getTopPostsAllTime: async (type: 'blog' | 'study', limit = 20, useBuildClient = false) => {
        try {
            // Use build client if specified (for generateStaticParams)
            const supabase = useBuildClient ? createClientForBuild() : await createClient();

            const { data } = await supabase
                .from('posts')
                .select('*')
                .eq('type', type)
                .eq('published', true)
                .order('views', { ascending: false })
                .limit(limit);
            return data || [];
        } catch (error) {
            console.error('Error fetching top posts all time:', error);
            return [];
        }
    },

    getPageBanner: async (pageType: 'estudos' | 'blog') => {
        try {
            const supabase = await createClient();
            const { data } = await supabase
                .from('page_banners')
                .select('*')
                .eq('page_type', pageType)
                .eq('active', true)
                .limit(1)
                .single();
            return data || null;
        } catch (error) {
            console.error('Error fetching page banner:', error);
            return null;
        }
    },

    getLeaders: async () => {
        try {
            const supabase = await createClient();
            const { data } = await supabase
                .from('leaders')
                .select('*')
                .eq('active', true)
                .order('order', { ascending: true });
            return data || [];
        } catch (error) {
            console.error('Error fetching leaders:', error);
            return [];
        }
    },

    getAboutPageCover: async () => {
        try {
            const supabase = await createClient();
            const { data } = await supabase
                .from('about_page_cover')
                .select('*')
                .eq('active', true)
                .limit(1)
                .single();
            return data || null;
        } catch (error) {
            console.error('Error fetching about page cover:', error);
            return null;
        }
    },

    getDepartments: async () => {
        try {
            const supabase = await createClient();
            const { data } = await supabase
                .from('departments')
                .select('*')
                .eq('active', true)
                .order('order', { ascending: true });
            return data || [];
        } catch (error) {
            console.error('Error fetching departments:', error);
            return [];
        }
    },

    getDepartmentMembers: async (departmentId: string) => {
        try {
            const supabase = await createClient();
            const { data } = await supabase
                .from('department_members')
                .select('*')
                .eq('department_id', departmentId)
                .eq('active', true)
                .order('order', { ascending: true });
            return data || [];
        } catch (error) {
            console.error('Error fetching department members:', error);
            return [];
        }
    },

    getPostById: async (id: string) => {
        try {
            const supabase = await createClient();
            const { data } = await supabase
                .from('posts')
                .select('*')
                .eq('id', id)
                .eq('published', true)
                .single();
            return data || null;
        } catch (error) {
            console.error('Error fetching post:', error);
            return null;
        }
    },

    getPostBySlug: async (slug: string, type?: 'blog' | 'study') => {
        try {
            const supabase = await createClient();
            let query = supabase
                .from('posts')
                .select('*')
                .eq('slug', slug)
                .eq('published', true);
            
            if (type) {
                query = query.eq('type', type);
            }
            
            const { data } = await query.single();
            return data || null;
        } catch (error) {
            console.error('Error fetching post by slug:', error);
            return null;
        }
    },

    // Helper function that tries slug first, then falls back to ID (for backward compatibility)
    getPostByIdOrSlug: async (identifier: string, type?: 'blog' | 'study') => {
        // Try slug first (more common case)
        const postBySlug = await serverApi.getPostBySlug(identifier, type);
        if (postBySlug) return postBySlug;
        
        // Fallback to ID (for backward compatibility)
        return await serverApi.getPostById(identifier);
    },

    // Get related posts by tags or explicit relations
    getRelatedPosts: async (postId: string, type: 'blog' | 'study', limit = 3) => {
        try {
            const supabase = await createClient();
            
            // First, get the current post to check its tags
            const { data: currentPostData } = await supabase
                .from('posts')
                .select('tags')
                .eq('id', postId)
                .single();

            const currentPost = currentPostData as { tags?: string[] } | null;
            const postTags = currentPost?.tags;

            if (!currentPost || !postTags || postTags.length === 0) {
                // If no tags, get recent posts of same type
                const { data } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('type', type)
                    .eq('published', true)
                    .neq('id', postId)
                    .order('created_at', { ascending: false })
                    .limit(limit);
                return (data as Post[]) || [];
            }

            // Find posts with matching tags
            const { data } = await supabase
                .from('posts')
                .select('*')
                .eq('type', type)
                .eq('published', true)
                .neq('id', postId)
                .overlaps('tags', postTags)
                .order('created_at', { ascending: false })
                .limit(limit);

            const postsData = (data as Post[]) || [];

            // If not enough posts with matching tags, fill with recent posts
            if (postsData.length < limit) {
                const excludeIds = [...postsData.map((p: Post) => p.id), postId];
                let query = supabase
                    .from('posts')
                    .select('*')
                    .eq('type', type)
                    .eq('published', true)
                    .neq('id', postId);
                
                // Exclude already found posts
                if (excludeIds.length > 1) {
                    query = query.not('id', 'in', `(${excludeIds.map(id => `'${id}'`).join(',')})`);
                }
                
                const { data: recentPosts } = await query
                    .order('created_at', { ascending: false })
                    .limit(limit - postsData.length);
                
                return [...postsData, ...((recentPosts as Post[]) || [])].slice(0, limit);
            }

            return postsData;
        } catch (error) {
            console.error('Error fetching related posts:', error);
            return [];
        }
    },
};
