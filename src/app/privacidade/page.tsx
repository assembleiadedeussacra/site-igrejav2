import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getCachedSettings } from '@/lib/cache';
import { SITE_URL, SITE_NAME } from '@/lib/seo/constants';

export const metadata: Metadata = {
    title: 'Política de Privacidade',
    description: `Política de privacidade e uso de cookies do site ${SITE_NAME}.`,
    alternates: { canonical: `${SITE_URL}/privacidade` },
    robots: { index: true, follow: true },
};

export const revalidate = 86400;

export default async function PrivacidadePage() {
    const settings = await getCachedSettings();

    return (
        <>
            <Header settings={settings} />
            <main id="main" className="section-padding bg-[var(--color-background)] min-h-[60vh]">
                <div className="container-custom max-w-3xl">
                    <h1 className="type-page-title text-[var(--color-accent)] mb-2">
                        Política de Privacidade
                    </h1>
                    <p className="text-[var(--color-text-secondary)] mb-8">
                        Última atualização: {new Date().toLocaleDateString('pt-BR')}
                    </p>

                    <div className="prose prose-neutral max-w-none space-y-6 text-[var(--color-text-secondary)]">
                        <section>
                            <h2 className="type-subsection-title text-[var(--color-accent)] mb-3">
                                1. Quem somos
                            </h2>
                            <p>
                                Esta Política de Privacidade descreve como a{' '}
                                <strong>Assembleia de Deus Missão de Sacramento/MG</strong>{' '}
                                (&quot;nós&quot;) trata os dados pessoais dos visitantes do site{' '}
                                <a
                                    href={SITE_URL}
                                    className="text-[var(--color-accent)] underline"
                                >
                                    {SITE_URL.replace(/^https:\/\//, '')}
                                </a>
                                .
                            </p>
                        </section>

                        <section>
                            <h2 className="type-subsection-title text-[var(--color-accent)] mb-3">
                                2. Dados que coletamos
                            </h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    <strong>Formulário de contato:</strong> nome, e-mail, telefone e
                                    mensagem que você enviar voluntariamente.
                                </li>
                                <li>
                                    <strong>Pedidos de oração:</strong> conteúdo da mensagem e dados
                                    de contato opcionais.
                                </li>
                                <li>
                                    <strong>Análise de uso (com seu consentimento):</strong> páginas
                                    visitadas, tipo de dispositivo, navegador, cidade aproximada e
                                    endereço IP parcialmente anonimizado.
                                </li>
                                <li>
                                    <strong>Cookies analíticos (com seu consentimento):</strong>{' '}
                                    Google Analytics, quando configurado.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="type-subsection-title text-[var(--color-accent)] mb-3">
                                3. Finalidade do tratamento
                            </h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Responder mensagens e pedidos de oração.</li>
                                <li>Melhorar a experiência e o conteúdo do site.</li>
                                <li>Entender estatísticas de acesso de forma agregada.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="type-subsection-title text-[var(--color-accent)] mb-3">
                                4. Cookies
                            </h2>
                            <p>
                                Ao visitar o site, você verá um banner solicitando consentimento
                                para cookies analíticos. Você pode aceitar ou recusar. Cookies
                                essenciais para o funcionamento básico do site não dependem de
                                consentimento.
                            </p>
                        </section>

                        <section>
                            <h2 className="type-subsection-title text-[var(--color-accent)] mb-3">
                                5. Compartilhamento
                            </h2>
                            <p>
                                Não vendemos seus dados. Utilizamos provedores de infraestrutura
                                (hospedagem e banco de dados) para operar o site. Dados analíticos
                                podem ser processados pelo Google Analytics, quando ativo e com seu
                                consentimento.
                            </p>
                        </section>

                        <section>
                            <h2 className="type-subsection-title text-[var(--color-accent)] mb-3">
                                6. Seus direitos (LGPD)
                            </h2>
                            <p>Você pode solicitar:</p>
                            <ul className="list-disc pl-6 space-y-2 mt-2">
                                <li>Confirmação e acesso aos seus dados;</li>
                                <li>Correção de dados incompletos ou desatualizados;</li>
                                <li>Eliminação de dados desnecessários;</li>
                                <li>Revogação do consentimento para cookies analíticos.</li>
                            </ul>
                            <p className="mt-4">
                                Para exercer seus direitos, entre em contato pelo e-mail{' '}
                                <a
                                    href={`mailto:${settings?.email || 'contato@assembleiadedeussacramento.com.br'}`}
                                    className="text-[var(--color-accent)] underline"
                                >
                                    {settings?.email || 'contato@assembleiadedeussacramento.com.br'}
                                </a>
                                .
                            </p>
                        </section>

                        <section>
                            <h2 className="type-subsection-title text-[var(--color-accent)] mb-3">
                                7. Retenção
                            </h2>
                            <p>
                                Mensagens de contato são mantidas pelo tempo necessário para
                                atendimento e registro interno. Dados analíticos são mantidos de
                                forma agregada conforme políticas dos serviços utilizados.
                            </p>
                        </section>

                        <section>
                            <h2 className="type-subsection-title text-[var(--color-accent)] mb-3">
                                8. Alterações
                            </h2>
                            <p>
                                Esta política pode ser atualizada periodicamente. Recomendamos
                                revisitar esta página para acompanhar eventuais mudanças.
                            </p>
                        </section>
                    </div>

                    <p className="mt-10">
                        <Link
                            href="/"
                            className="text-[var(--color-accent)] font-medium hover:underline"
                        >
                            ← Voltar ao início
                        </Link>
                    </p>
                </div>
            </main>
            <Footer settings={settings} />
        </>
    );
}
