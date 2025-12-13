import {
  Header,
  Footer,
  ContactSection,
} from '@/components';
import AboutPageSection from '@/components/sections/AboutPageSection';
import { serverApi } from '@/services/server';
import type {
  SiteSettings,
  AboutPageCover,
  Department,
  DepartmentMember,
  Leader,
} from '@/lib/database.types';

export default async function SobreNosPage() {
  let cover: AboutPageCover | null = null;
  let departments: Department[] = [];
  let departmentMembers: Record<string, DepartmentMember[]> = {};
  let leaders: Leader[] = [];
  let settings: SiteSettings | null = null;

  try {
    const results = await Promise.allSettled([
      serverApi.getAboutPageCover(),
      serverApi.getDepartments(),
      serverApi.getLeaders(),
      serverApi.getSettings(),
    ]);

    cover = results[0].status === 'fulfilled' ? results[0].value : null;
    departments = results[1].status === 'fulfilled' ? results[1].value : [];
    leaders = results[2].status === 'fulfilled' ? results[2].value : [];
    settings = results[3].status === 'fulfilled' ? results[3].value : null;

    // Load members for each department
    if (departments.length > 0) {
      const memberPromises = departments.map(async (dept) => {
        try {
          const members = await serverApi.getDepartmentMembers(dept.id);
          return { departmentId: dept.id, members };
        } catch (error) {
          console.error(`Error loading members for department ${dept.id}:`, error);
          return { departmentId: dept.id, members: [] };
        }
      });

      const memberResults = await Promise.allSettled(memberPromises);
      memberResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          departmentMembers[result.value.departmentId] = result.value.members;
        }
      });
    }
  } catch (error) {
    console.error('Error loading page data:', error);
  }

  return (
    <>
      <Header settings={settings} />
      <main>
        <AboutPageSection
          cover={cover}
          departments={departments}
          departmentMembers={departmentMembers}
          leaders={leaders}
        />
        <ContactSection settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}

