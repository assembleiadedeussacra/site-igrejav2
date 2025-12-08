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

export default async function Home() {
  const [
    banners,
    verse,
    events,
    testimonials,
    financials,
    settings,
    galleryLinks,
    posts,
    leaders
  ] = await Promise.all([
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
