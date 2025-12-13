import { createClient } from '../lib/supabase/client';
import { Database } from '../lib/database.types';

export const api = {
    getBanners: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('banners')
            .select('*')
            .eq('active', true)
            .order('position', { ascending: true });

        if (error) {
            console.error('Error fetching banners:', error);
            return [];
        }
        return data;
    },

    getDailyVerse: async () => {
        const supabase = createClient();
        const today = new Date().toISOString().split('T')[0];

        // Try to get specific verse for today
        const { data: specificContent, error: specificError } = await supabase
            .from('verses')
            .select('*')
            .eq('active_date', today)
            .single();

        if (specificContent) return specificContent;

        // Fallback to random or latest active one if needed
        // For now let's just get the most recent created one
        const { data, error } = await supabase
            .from('verses')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            console.error('Error fetching verse:', error);
            return null;
        }
        return data;
    },

    getEvents: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('active', true)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching events:', error);
            return [];
        }
        return data;
    },

    getTestimonials: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .eq('active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching testimonials:', error);
            return [];
        }
        return data;
    },

    getFinancials: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('financials')
            .select('*')
            .eq('active', true)
            .limit(1)
            .single();

        if (error) {
            console.error('Error fetching financials:', error);
            return null;
        }
        return data;
    },

    getSettings: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .limit(1)
            .single();

        if (error) {
            console.error('Error fetching settings:', error);
            return null;
        }
        return data;
    },

    getGalleryLinks: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('gallery_links')
            .select('*')
            .eq('active', true)
            .order('order', { ascending: true });

        if (error) {
            console.error('Error fetching gallery links:', error);
            return [];
        }
        return data;
    },

    getPosts: async (limit = 3) => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching posts:', error);
            return [];
        }
        return data;
    },

    // Admin Banners
    getAdminBanners: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('banners')
            .select('*')
            .order('position', { ascending: true });

        if (error) throw error;
        return data;
    },

    createBanner: async (banner: Database['public']['Tables']['banners']['Insert']) => {
        const supabase = createClient();
        const { data, error } = await (supabase as any)
            .from('banners')
            .insert([banner])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    updateBanner: async (id: string, updates: Database['public']['Tables']['banners']['Update']) => {
        const supabase = createClient();
        const { data, error } = await (supabase as any)
            .from('banners')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    deleteBanner: async (id: string) => {
        const supabase = createClient();
        const { error } = await (supabase as any)
            .from('banners')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Admin - Get all (including inactive)
    getAdminLeaders: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('leaders')
            .select('*')
            .order('order', { ascending: true });

        if (error) throw error;
        return data;
    },

    createLeader: async (leader: Database['public']['Tables']['leaders']['Insert']) => {
        const supabase = createClient();
        const { data, error } = await (supabase as any)
            .from('leaders')
            .insert([leader])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    updateLeader: async (id: string, updates: Database['public']['Tables']['leaders']['Update']) => {
        const supabase = createClient();
        const { data, error } = await (supabase as any)
            .from('leaders')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    deleteLeader: async (id: string) => {
        const supabase = createClient();
        const { error } = await (supabase as any)
            .from('leaders')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    getAdminPosts: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    createPost: async (post: Database['public']['Tables']['posts']['Insert']) => {
        const supabase = createClient();
        const { data, error } = await (supabase as any)
            .from('posts')
            .insert([post])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    updatePost: async (id: string, updates: Database['public']['Tables']['posts']['Update']) => {
        const supabase = createClient();
        const { data, error } = await (supabase as any)
            .from('posts')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    deletePost: async (id: string) => {
        const supabase = createClient();
        const { error } = await (supabase as any)
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Post Relations
    getPostRelations: async (postId: string) => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('post_relations')
            .select(`
                *,
                related_post:posts!post_relations_related_post_id_fkey(
                    id,
                    title,
                    type,
                    description
                )
            `)
            .eq('post_id', postId);

        if (error) throw error;
        return data;
    },

    createPostRelation: async (postId: string, relatedPostId: string) => {
        const supabase = createClient();
        const { data, error } = await (supabase as any)
            .from('post_relations')
            .insert([{ post_id: postId, related_post_id: relatedPostId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    deletePostRelation: async (postId: string, relatedPostId: string) => {
        const supabase = createClient();
        const { error } = await (supabase as any)
            .from('post_relations')
            .delete()
            .eq('post_id', postId)
            .eq('related_post_id', relatedPostId);

        if (error) throw error;
    },

    deleteAllPostRelations: async (postId: string) => {
        const supabase = createClient();
        const { error } = await (supabase as any)
            .from('post_relations')
            .delete()
            .eq('post_id', postId);

        if (error) throw error;
    },

    getAdminEvents: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data;
    },

    createEvent: async (event: Database['public']['Tables']['events']['Insert']) => {
        const supabase = createClient();
        const { data, error } = await (supabase as any)
            .from('events')
            .insert([event])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    updateEvent: async (id: string, updates: Database['public']['Tables']['events']['Update']) => {
        const supabase = createClient();
        const { data, error } = await (supabase as any)
            .from('events')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    deleteEvent: async (id: string) => {
        const supabase = createClient();
        const { error } = await (supabase as any)
            .from('events')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Admin Gallery Links
    getAdminGalleryLinks: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('gallery_links')
            .select('*')
            .order('order', { ascending: true });

        if (error) throw error;
        return data;
    },

    createGalleryLink: async (link: Database['public']['Tables']['gallery_links']['Insert']) => {
        const supabase = createClient();
        const { data, error } = await (supabase as any)
            .from('gallery_links')
            .insert([link])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    updateGalleryLink: async (id: string, updates: Database['public']['Tables']['gallery_links']['Update']) => {
        const supabase = createClient();
        const { data, error } = await (supabase as any)
            .from('gallery_links')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    deleteGalleryLink: async (id: string) => {
        const supabase = createClient();
        const { error } = await (supabase as any)
            .from('gallery_links')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Admin Testimonials
    getAdminTestimonials: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    createTestimonial: async (testimonial: Database['public']['Tables']['testimonials']['Insert']) => {
        const supabase = createClient();
        const { data, error } = await (supabase as any)
            .from('testimonials')
            .insert([testimonial])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    updateTestimonial: async (id: string, updates: Database['public']['Tables']['testimonials']['Update']) => {
        const supabase = createClient();
        const { data, error } = await (supabase as any)
            .from('testimonials')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    deleteTestimonial: async (id: string) => {
        const supabase = createClient();
        const { error } = await (supabase as any)
            .from('testimonials')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Admin Financials
    getAdminFinancials: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('financials')
            .select('*')
            .limit(1)
            .single();

        if (error) throw error;
        return data;
    },

    updateFinancials: async (updates: Database['public']['Tables']['financials']['Update']) => {
        const supabase = createClient();
        // Get existing or create new
        const { data: existing } = await supabase
            .from('financials')
            .select('*')
            .limit(1)
            .single();

        if (existing) {
            const { data, error } = await (supabase as any)
                .from('financials')
                .update(updates)
                .eq('id', (existing as any).id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } else {
            const { data, error } = await (supabase as any)
                .from('financials')
                .insert([updates])
                .select()
                .single();

            if (error) throw error;
            return data;
        }
    },

    // Admin Settings
    getAdminSettings: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .limit(1)
            .single();

        if (error) throw error;
        return data;
    },

    updateSettings: async (updates: Database['public']['Tables']['site_settings']['Update']) => {
        const supabase = createClient();
        // Get existing or create new
        const { data: existing } = await supabase
            .from('site_settings')
            .select('*')
            .limit(1)
            .single();

        if (existing) {
            const { data, error } = await (supabase as any)
                .from('site_settings')
                .update(updates)
                .eq('id', (existing as any).id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } else {
            const { data, error } = await (supabase as any)
                .from('site_settings')
                .insert([updates])
                .select()
                .single();

            if (error) throw error;
            return data;
        }
    },
};
