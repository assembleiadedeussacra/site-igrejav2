import Link from 'next/link';
import type { Metadata } from 'next';
import { Home, BookOpen, GraduationCap, Users, Mail } from 'lucide-react';
import { Header, Footer } from '@/components';
import PageHeader from '@/components/ui/PageHeader';
import { getCachedSettings } from '@/lib/cache';
import { SITE_NAME } from '@/lib/seo/constants';

export const metadata: Metadata = {
  title: 'Página não encontrada',
  description: `A página solicitada não foi encontrada no site ${SITE_NAME}.`,
  robots: { index: false, follow: true },
};

const quickLinks = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/estudos', label: 'Estudos', icon: GraduationCap },
  { href: '/sobre-nos', label: 'Sobre Nós', icon: Users },
  { href: '/#contato', label: 'Contato', icon: Mail },
];

export default async function NotFound() {
  let settings = null;
  try {
    settings = await getCachedSettings();
  } catch {
    settings = null;
  }

  return (
    <>
      <Header settings={settings} />
      <main id="main" className="min-h-[60vh] flex items-center bg-[var(--color-background)] pt-20">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-8xl md:text-9xl font-bold text-[var(--color-accent)] opacity-15 leading-none select-none mb-2">
              404
            </p>
            <PageHeader
              eyebrow="Erro"
              title="Página não encontrada"
              description="O endereço pode estar incorreto ou a página foi removida. Use os links abaixo para continuar navegando."
              className="mb-8"
            />

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {quickLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-[10px] text-[var(--color-accent)] font-medium hover:border-[var(--color-accent)] hover:bg-[var(--color-primary)]/10 transition-colors shadow-sm"
                >
                  <Icon className="w-4 h-4" aria-hidden />
                  {label}
                </Link>
              ))}
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)] transition-colors font-semibold"
            >
              <Home className="w-4 h-4" aria-hidden />
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </main>
      <Footer settings={settings} />
    </>
  );
}
