'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';

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

    const breadcrumbSchema = generateBreadcrumbSchema(items);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <nav
                className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--color-text-muted)] mb-6 ${className}`}
                aria-label="Breadcrumb"
            >
                {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {index > 0 && (
                            <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
                        )}
                        {index === items.length - 1 ? (
                            <span className="text-[var(--color-text)] font-medium line-clamp-2 sm:line-clamp-1 max-w-[min(100%,280px)] sm:max-w-none">
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
