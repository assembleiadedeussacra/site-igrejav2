import { createClient } from '../lib/supabase/server';

export const serverApi = {
    getBanners: async () => {
        const supabase = await createClient();
        const { data } = await supabase
            .from('banners')
            .select('*')
            .eq('active', true)
            .order('position', { ascending: true });
        return data || [];
    },

    getDailyVerse: async () => {
        const supabase = await createClient();
        // Usar data no fuso horário de Brasília para garantir consistência
        const now = new Date();
        const brasiliaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
        const today = brasiliaTime.toISOString().split('T')[0];

        // Buscar versículo específico para o dia atual
        const { data: specificContent } = await supabase
            .from('verses')
            .select('*')
            .eq('active_date', today)
            .single();

        if (specificContent) return specificContent;

        // Se não houver versículo específico para hoje, buscar o mais recente
        const { data } = await supabase
            .from('verses')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        return data || null;
    },

    getEvents: async () => {
        const supabase = await createClient();
        const { data } = await supabase
            .from('events')
            .select('*')
            .eq('active', true)
            .order('created_at', { ascending: true });
        return data || [];
    },

    getTestimonials: async () => {
        const supabase = await createClient();
        const { data } = await supabase
            .from('testimonials')
            .select('*')
            .eq('active', true)
            .order('created_at', { ascending: false });
        return data || [];
    },

    getFinancials: async () => {
        const supabase = await createClient();
        const { data } = await supabase
            .from('financials')
            .select('*')
            .eq('active', true)
            .limit(1)
            .single();
        return data || null;
    },

    getSettings: async () => {
        const supabase = await createClient();
        const { data } = await supabase
            .from('site_settings')
            .select('*')
            .limit(1)
            .single();
        return data || null;
    },

    getGalleryLinks: async () => {
        const supabase = await createClient();
        const { data } = await supabase
            .from('gallery_links')
            .select('*')
            .eq('active', true)
            .order('order', { ascending: true });
        return data || [];
    },

    getPosts: async (limit = 3) => {
        const supabase = await createClient();
        const { data } = await supabase
            .from('posts')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false })
            .limit(limit);
        return data || [];
    },

    getLeaders: async () => {
        const supabase = await createClient();
        const { data } = await supabase
            .from('leaders')
            .select('*')
            .eq('active', true)
            .order('order', { ascending: true });
        return data || [];
    }
};
