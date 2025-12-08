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

    getAdminPosts: async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
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
                .eq('id', existing.id)
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
                .eq('id', existing.id)
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
