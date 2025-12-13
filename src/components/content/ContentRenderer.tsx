'use client';

import { useEffect, useState } from 'react';
import { renderContent } from '@/lib/content/renderer';

interface ContentRendererProps {
    content: string;
    className?: string;
}

/**
 * ContentRenderer component
 * Renders Markdown or HTML content with proper styling
 */
export default function ContentRenderer({ content, className = '' }: ContentRendererProps) {
    const [renderedContent, setRenderedContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            setIsLoading(true);
            try {
                const rendered = await renderContent(content);
                setRenderedContent(rendered);
            } catch (error) {
                console.error('Error rendering content:', error);
                setRenderedContent(content); // Fallback to raw content
            } finally {
                setIsLoading(false);
            }
        };

        if (content) {
            loadContent();
        } else {
            setRenderedContent('');
            setIsLoading(false);
        }
    }, [content]);

    if (isLoading) {
        return (
            <div className={`prose prose-lg max-w-none ${className}`}>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`prose prose-lg max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
    );
}
