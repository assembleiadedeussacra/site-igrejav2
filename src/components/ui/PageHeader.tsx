interface PageHeaderProps {
    title: string;
    description?: string;
    eyebrow?: string;
    meta?: string;
    align?: 'center' | 'left';
    variant?: 'default' | 'hero' | 'article';
    className?: string;
}

export default function PageHeader({
    title,
    description,
    eyebrow,
    meta,
    align = 'center',
    variant = 'default',
    className = '',
}: PageHeaderProps) {
    const isCenter = align === 'center';
    const isHero = variant === 'hero';
    const isArticle = variant === 'article';

    return (
        <header
            className={[
                'page-header',
                isCenter ? 'page-header--center' : 'page-header--left',
                isHero ? 'page-header--hero' : '',
                isArticle ? 'page-header--article' : '',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            {eyebrow && (
                <p className="page-eyebrow">
                    <span className="page-eyebrow-line" aria-hidden="true" />
                    <span className="page-eyebrow-text">{eyebrow}</span>
                    <span className="page-eyebrow-line" aria-hidden="true" />
                </p>
            )}

            <h1
                className={[
                    'page-title',
                    isHero ? 'hero-text-shadow' : '',
                ]
                    .filter(Boolean)
                    .join(' ')}
            >
                {title}
            </h1>

            {description && (
                <p
                    className={[
                        'page-header-desc',
                        isHero ? 'hero-text-shadow-sm' : '',
                        isCenter ? 'mx-auto' : '',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                >
                    {description}
                </p>
            )}

            {meta && <p className="page-header-meta">{meta}</p>}
        </header>
    );
}

interface ContentSectionTitleProps {
    children: React.ReactNode;
    className?: string;
}

export function ContentSectionTitle({ children, className = '' }: ContentSectionTitleProps) {
    return (
        <h2 className={`content-section-title ${className}`.trim()}>
            {children}
        </h2>
    );
}
