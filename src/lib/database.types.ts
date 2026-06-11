// Database types for Supabase tables
export interface Banner {
    id: string;
    image_desktop_url: string;
    image_mobile_url: string;
    position: number;
    link: string | null;
    alt_text: string;
    logo_url: string | null;
    title: string | null;
    description: string | null;
    button1_text: string | null;
    button1_link: string | null;
    button1_bg_color?: string | null;
    button1_text_color?: string | null;
    button1_hover_bg_color?: string | null;
    button1_hover_text_color?: string | null;
    button1_size?: 'sm' | 'md' | 'lg' | null;
    button1_style?: 'solid' | 'outline' | 'ghost' | null;
    button1_open_new_tab?: boolean | null;
    button1_border_radius?: number | null;
    button2_text: string | null;
    button2_link: string | null;
    button2_bg_color?: string | null;
    button2_text_color?: string | null;
    button2_hover_bg_color?: string | null;
    button2_hover_text_color?: string | null;
    button2_size?: 'sm' | 'md' | 'lg' | null;
    button2_style?: 'solid' | 'outline' | 'ghost' | null;
    button2_open_new_tab?: boolean | null;
    button2_border_radius?: number | null;
    buttons_global_style?: 'individual' | 'unified' | null;
    overlay_opacity?: number | null;
    overlay_color?: string | null;
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
    department: string | null; // Departamento opcional
    order: number;
    active: boolean;
    created_at: string;
    updated_at: string;
}

// SEO-related type definitions
export interface SEOFields {
    slug: string | null;
    excerpt: string | null;
    meta_title: string | null;
    meta_description: string | null;
    keywords: string[];
    canonical_url: string | null;
    noindex: boolean;
    nofollow: boolean;
}

export interface OpenGraphFields {
    og_title: string | null;
    og_description: string | null;
    og_image: string | null;
}

export interface RobotsFields {
    noindex: boolean;
    nofollow: boolean;
}

export type SchemaType = 'Article' | 'BlogPosting' | 'Study';

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
    views: number;
    created_at: string;
    updated_at: string;
    related_posts?: Post[]; // Optional, for queries with relations
    
    // SEO fields
    slug: string | null;
    excerpt: string | null;
    meta_title: string | null;
    meta_description: string | null;
    keywords: string[];
    canonical_url: string | null;
    noindex: boolean;
    nofollow: boolean;
    og_title: string | null;
    og_description: string | null;
    og_image: string | null;
    schema_type: SchemaType;
}

export interface PageBanner {
    id: string;
    page_type: 'estudos' | 'blog';
    image_url: string;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface PostRelation {
    id: string;
    post_id: string;
    related_post_id: string;
    created_at: string;
}

export interface Event {
    id: string;
    title: string;
    day_of_week: string;
    time_start: string;
    time_end: string | null;
    description: string | null;
    type: 'culto' | 'estudo' | 'oracao' | 'ebd' | 'ensaio';
    active: boolean;
    order: number;
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
    order: number;
    created_at: string;
}

export interface SiteSettings {
    id: string;
    church_name: string;
    church_address: string;
    church_city: string;
    church_cep: string;
    phone: string;
    email: string;
    instagram_url: string;
    instagram_handle: string;
    google_maps_embed: string;
    google_calendar_embed: string;
    hero_autoplay_seconds: number;
    created_at: string;
    updated_at: string;
}

export interface AboutPageCover {
    id: string;
    title: string;
    description: string;
    image_url: string;
    church_text_part1?: string | null;
    church_image_url?: string | null;
    church_text_part2?: string | null;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Department {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    order: number;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface DepartmentMember {
    id: string;
    department_id: string;
    name: string;
    role: string;
    image_url: string;
    order: number;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface PageView {
    id: string;
    page_path: string;
    page_title: string | null;
    referrer: string | null;
    user_agent: string | null;
    ip_address: string | null;
    session_id: string | null;
    created_at: string;
}

export interface PageViewStats {
    page_path: string;
    page_title: string | null;
    view_count: number;
    unique_views: number;
    last_viewed: string;
}

export interface DailyPageViews {
    date: string;
    view_count: number;
    unique_views: number;
}

type TableDef<Row, Insert, Update> = {
    Row: Row & Record<string, unknown>;
    Insert: Insert & Record<string, unknown>;
    Update: Update & Record<string, unknown>;
    Relationships: [];
};

// Database schema type
export type Database = {
    public: {
        Tables: {
            banners: TableDef<
                Banner,
                Omit<Banner, 'id' | 'created_at' | 'updated_at'>,
                Partial<Omit<Banner, 'id' | 'created_at'>>
            >;
            verses: TableDef<
                Verse,
                Omit<Verse, 'id' | 'created_at'>,
                Partial<Omit<Verse, 'id' | 'created_at'>>
            >;
            leaders: TableDef<
                Leader,
                Omit<Leader, 'id' | 'created_at' | 'updated_at'>,
                Partial<Omit<Leader, 'id' | 'created_at'>>
            >;
            posts: TableDef<
                Post,
                Omit<Post, 'id' | 'created_at' | 'updated_at'>,
                Partial<Omit<Post, 'id' | 'created_at'>>
            >;
            events: TableDef<
                Event,
                Omit<Event, 'id' | 'created_at' | 'updated_at'>,
                Partial<Omit<Event, 'id' | 'created_at'>>
            >;
            gallery_links: TableDef<
                GalleryLink,
                Omit<GalleryLink, 'id' | 'created_at' | 'updated_at'>,
                Partial<Omit<GalleryLink, 'id' | 'created_at'>>
            >;
            financials: TableDef<
                Financial,
                Omit<Financial, 'id' | 'created_at' | 'updated_at'>,
                Partial<Omit<Financial, 'id' | 'created_at'>>
            >;
            testimonials: TableDef<
                Testimonial,
                Omit<Testimonial, 'id' | 'created_at'>,
                Partial<Omit<Testimonial, 'id' | 'created_at'>>
            >;
            site_settings: TableDef<
                SiteSettings,
                Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>,
                Partial<Omit<SiteSettings, 'id' | 'created_at'>>
            >;
            about_page_cover: TableDef<
                AboutPageCover,
                Omit<AboutPageCover, 'id' | 'created_at' | 'updated_at'>,
                Partial<Omit<AboutPageCover, 'id' | 'created_at'>>
            >;
            departments: TableDef<
                Department,
                Omit<Department, 'id' | 'created_at' | 'updated_at'>,
                Partial<Omit<Department, 'id' | 'created_at'>>
            >;
            department_members: TableDef<
                DepartmentMember,
                Omit<DepartmentMember, 'id' | 'created_at' | 'updated_at'>,
                Partial<Omit<DepartmentMember, 'id' | 'created_at'>>
            >;
            page_views: TableDef<
                PageView,
                Omit<PageView, 'id' | 'created_at'>,
                Partial<Omit<PageView, 'id' | 'created_at'>>
            >;
            page_banners: TableDef<
                PageBanner,
                Omit<PageBanner, 'id' | 'created_at' | 'updated_at'>,
                Partial<Omit<PageBanner, 'id' | 'created_at'>>
            >;
            post_relations: TableDef<
                PostRelation,
                Omit<PostRelation, 'id' | 'created_at'>,
                Partial<Omit<PostRelation, 'id' | 'created_at'>>
            >;
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            get_page_view_stats: {
                Args: { days_back?: number };
                Returns: PageViewStats[];
            };
            get_daily_page_views: {
                Args: { days_back?: number };
                Returns: DailyPageViews[];
            };
        };
    };
};
