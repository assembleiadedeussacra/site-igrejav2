import {
  Header,
  Footer,
  HeroSection,
  VerseSection,
  AboutSection,
  KnowledgeSection,
  ScheduleSection,
  GivingSection,
  GallerySection,
  TestimonialsSection,
  ContactSection,
} from '@/components';
import JsonLd from '@/components/seo/JsonLd';
import {
  getCachedBanners,
  getCachedDailyVerse,
  getCachedEvents,
  getCachedTestimonials,
  getCachedFinancials,
  getCachedSettings,
  getCachedGalleryLinks,
  getCachedHomePosts,
} from '@/lib/cache';
import { generateEventsSchema } from '@/lib/seo/schema';
import type {
  Banner,
  Verse,
  Event,
  Testimonial,
  Financial,
  SiteSettings,
  GalleryLink,
  Post,
} from '@/lib/database.types';

export const revalidate = 300;

export default async function Home() {
  // Tratamento de erros para evitar falhas no build
  let banners: Banner[] = [];
  let verse: Verse | null = null;
  let events: Event[] = [];
  let testimonials: Testimonial[] = [];
  let financials: Financial | null = null;
  let settings: SiteSettings | null = null;
  let galleryLinks: GalleryLink[] = [];
  let posts: Post[] = [];

  try {
    const results = await Promise.allSettled([
      getCachedBanners(),
      getCachedDailyVerse(),
      getCachedEvents(),
      getCachedTestimonials(),
      getCachedFinancials(),
      getCachedSettings(),
      getCachedGalleryLinks(),
      getCachedHomePosts(),
    ]);

    banners = results[0].status === 'fulfilled' ? results[0].value : [];
    verse = results[1].status === 'fulfilled' ? results[1].value : null;
    events = results[2].status === 'fulfilled' ? results[2].value : [];
    testimonials = results[3].status === 'fulfilled' ? results[3].value : [];
    financials = results[4].status === 'fulfilled' ? results[4].value : null;
    settings = results[5].status === 'fulfilled' ? results[5].value : null;
    galleryLinks = results[6].status === 'fulfilled' ? results[6].value : [];
    posts = results[7].status === 'fulfilled' ? results[7].value : [];
  } catch (error) {
    // Log do erro em produção (não quebra o build)
    console.error('Error loading page data:', error);
  }

  const eventsSchema = generateEventsSchema(events, settings);

  return (
    <>
      {eventsSchema.length > 0 && <JsonLd data={eventsSchema} />}
      <Header settings={settings} />
      <main id="main">
        <HeroSection
          banners={banners}
          autoplaySeconds={settings?.hero_autoplay_seconds ?? 6}
        />
        <VerseSection verse={verse} />
        <AboutSection />
        <KnowledgeSection posts={posts} />
        <ScheduleSection events={events} googleCalendarEmbed={settings?.google_calendar_embed} />
        <GivingSection financials={financials} />
        <GallerySection items={galleryLinks} />
        <TestimonialsSection testimonials={testimonials} />
        <ContactSection settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
