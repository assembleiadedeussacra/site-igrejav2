import { createClient } from '../lib/supabase/server';
import { fetchDailyVerse } from './verse-api';

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
                    bible_link: apiVerse.bible_link,
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
                .order('created_at', { ascending: true });
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
    }
};
