// Database types for Supabase tables
export interface Banner {
    id: string;
    image_desktop_url: string;
    image_mobile_url: string;
    position: number;
    link: string | null;
    alt_text: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Verse {
    id: string;
    text: string;
    reference: string;
    bible_link: string | null;
    active_date: string;
    created_at: string;
}

export interface Leader {
    id: string;
    name: string;
    title: string; // Pastor, Diácono, Presbítero, etc.
    image_url: string;
    order: number;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Post {
    id: string;
    title: string;
    description: string;
    cover_image: string | null;
    type: 'blog' | 'study';
    tags: string[];
    content: string; // Rich text/HTML content
    author: string | null;
    published: boolean;
    created_at: string;
    updated_at: string;
}

export interface Event {
    id: string;
    title: string;
    day_of_week: string;
    time_start: string;
    time_end: string | null;
    description: string | null;
    type: 'culto' | 'estudo' | 'oracao' | 'ebd';
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface GalleryLink {
    id: string;
    title: string;
    drive_link: string;
    cover_image_url: string;
    order: number;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Financial {
    id: string;
    pix_key: string;
    pix_qrcode_url: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Testimonial {
    id: string;
    name: string;
    text: string;
    rating: number;
    avatar_url: string | null;
    active: boolean;
    created_at: string;
}

export interface SiteSettings {
    id: string;
    church_name: string;
    church_address: string;
    church_cep: string;
    phone: string;
    email: string;
    instagram_url: string;
    instagram_handle: string;
    google_maps_embed: string;
    google_calendar_embed: string;
    created_at: string;
    updated_at: string;
}

// Database schema type
export interface Database {
    public: {
        Tables: {
            banners: {
                Row: Banner;
                Insert: Omit<Banner, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Banner, 'id' | 'created_at'>>;
            };
            verses: {
                Row: Verse;
                Insert: Omit<Verse, 'id' | 'created_at'>;
                Update: Partial<Omit<Verse, 'id' | 'created_at'>>;
            };
            leaders: {
                Row: Leader;
                Insert: Omit<Leader, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Leader, 'id' | 'created_at'>>;
            };
            posts: {
                Row: Post;
                Insert: Omit<Post, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Post, 'id' | 'created_at'>>;
            };
            events: {
                Row: Event;
                Insert: Omit<Event, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Event, 'id' | 'created_at'>>;
            };
            gallery_links: {
                Row: GalleryLink;
                Insert: Omit<GalleryLink, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<GalleryLink, 'id' | 'created_at'>>;
            };
            financials: {
                Row: Financial;
                Insert: Omit<Financial, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Financial, 'id' | 'created_at'>>;
            };
            testimonials: {
                Row: Testimonial;
                Insert: Omit<Testimonial, 'id' | 'created_at'>;
                Update: Partial<Omit<Testimonial, 'id' | 'created_at'>>;
            };
            site_settings: {
                Row: SiteSettings;
                Insert: Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<SiteSettings, 'id' | 'created_at'>>;
            };
        };
    };
}
