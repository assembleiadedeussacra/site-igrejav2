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
import { serverApi } from '@/services/server';
import type {
  Banner,
  Verse,
  Event,
  Testimonial,
  Financial,
  SiteSettings,
  GalleryLink,
  Post,
  Leader,
} from '@/lib/database.types';

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
  let leaders: Leader[] = [];

  try {
    const results = await Promise.allSettled([
      serverApi.getBanners(),
      serverApi.getDailyVerse(),
      serverApi.getEvents(),
      serverApi.getTestimonials(),
      serverApi.getFinancials(),
      serverApi.getSettings(),
      serverApi.getGalleryLinks(),
      serverApi.getPosts(),
      serverApi.getLeaders()
    ]);

    banners = results[0].status === 'fulfilled' ? results[0].value : [];
    verse = results[1].status === 'fulfilled' ? results[1].value : null;
    events = results[2].status === 'fulfilled' ? results[2].value : [];
    testimonials = results[3].status === 'fulfilled' ? results[3].value : [];
    financials = results[4].status === 'fulfilled' ? results[4].value : null;
    settings = results[5].status === 'fulfilled' ? results[5].value : null;
    galleryLinks = results[6].status === 'fulfilled' ? results[6].value : [];
    posts = results[7].status === 'fulfilled' ? results[7].value : [];
    leaders = results[8].status === 'fulfilled' ? results[8].value : [];
  } catch (error) {
    // Log do erro em produção (não quebra o build)
    console.error('Error loading page data:', error);
  }

  return (
    <>
      <Header settings={settings} />
      <main>
        <HeroSection banners={banners} />
        <VerseSection verse={verse} />
        <AboutSection leaders={leaders} />
        <KnowledgeSection posts={posts} />
        <ScheduleSection events={events} />
        <GivingSection financials={financials} />
        <GallerySection items={galleryLinks} />
        <TestimonialsSection testimonials={testimonials} />
        <ContactSection settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
