'use client';

import type { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
    title: string;
    description?: string;
    eyebrow?: string;
    align?: 'center' | 'left';
    variant?: 'default' | 'light';
    className?: string;
}

export default function SectionHeader({
    title,
    description,
    eyebrow,
    align = 'center',
    variant = 'default',
    className = '',
}: SectionHeaderProps) {
    const isCenter = align === 'center';
    const isLight = variant === 'light';

    return (
        <header
            className={[
                'section-header mb-10 sm:mb-12 md:mb-14',
                isCenter ? 'section-header--center text-center' : 'section-header--left',
                isLight ? 'section-header--light' : '',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            {eyebrow && (
                <p className="section-eyebrow">
                    <span className="section-eyebrow-line" aria-hidden="true" />
                    <span className="section-eyebrow-text">{eyebrow}</span>
                    <span className="section-eyebrow-line" aria-hidden="true" />
                </p>
            )}

            <h2
                className={[
                    'type-section-title section-title',
                    !isCenter ? 'section-title--left' : '',
                ]
                    .filter(Boolean)
                    .join(' ')}
            >
                {title}
            </h2>

            {description && (
                <p
                    className={[
                        'type-section-desc section-header-desc',
                        isCenter ? 'mx-auto' : '',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                >
                    {description}
                </p>
            )}
        </header>
    );
}

interface SubsectionHeaderProps {
    title: string;
    icon?: LucideIcon;
    className?: string;
}

export function SubsectionHeader({ title, icon: Icon, className = '' }: SubsectionHeaderProps) {
    return (
        <div className={`subsection-header ${className}`.trim()}>
            {Icon && <Icon className="subsection-header-icon" aria-hidden="true" />}
            <h3 className="subsection-header-title">{title}</h3>
        </div>
    );
}
