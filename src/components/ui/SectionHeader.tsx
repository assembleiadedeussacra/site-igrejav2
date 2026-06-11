'use client';

interface SectionHeaderProps {
    title: string;
    description?: string;
    align?: 'center' | 'left';
    className?: string;
}

export default function SectionHeader({
    title,
    description,
    align = 'center',
    className = '',
}: SectionHeaderProps) {
    return (
        <div
            className={`mb-12 md:mb-16 ${align === 'center' ? 'text-center' : ''} ${className}`}
        >
            <h2 className="type-section-title section-title">{title}</h2>
            {description && (
                <p
                    className={`type-section-desc mt-3 ${align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}
                >
                    {description}
                </p>
            )}
        </div>
    );
}
