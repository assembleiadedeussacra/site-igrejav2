'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

/**
 * Breadcrumbs component with Schema.org structured data
 */
export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
    if (!items || items.length === 0) return null;

    // Generate Schema.org BreadcrumbList
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: item.href.startsWith('http') ? item.href : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://assembleiasacramento.vercel.app'}${item.href}`,
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <nav
                className={`flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6 ${className}`}
                aria-label="Breadcrumb"
            >
                {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {index > 0 && (
                            <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
                        )}
                        {index === items.length - 1 ? (
                            <span className="text-[var(--color-text)] font-medium">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-[var(--color-accent)] hover:text-[var(--color-accent-light)] transition-colors"
                            >
                                {item.label}
                            </Link>
                        )}
                    </div>
                ))}
            </nav>
        </>
    );
}
