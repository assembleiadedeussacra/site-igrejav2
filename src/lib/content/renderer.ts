/**
 * Content renderer for Markdown and HTML
 * Supports dual format: Markdown and HTML
 */

import { remark } from 'remark';
import remarkHtml from 'remark-html';
import sanitizeHtml from 'sanitize-html';

/**
 * Detects if content is Markdown or HTML
 * Simple heuristic: if content starts with HTML tags, it's HTML; otherwise, assume Markdown
 */
export function detectContentType(content: string): 'markdown' | 'html' {
    if (!content || content.trim().length === 0) {
        return 'html'; // Default to HTML for empty content
    }

    const trimmed = content.trim();
    
    // Check if content starts with HTML tags
    const htmlPattern = /^<[a-z][\s\S]*>/i;
    if (htmlPattern.test(trimmed)) {
        return 'html';
    }

    // Check for common Markdown patterns
    const markdownPatterns = [
        /^#{1,6}\s/,           // Headers
        /^\*\s/,               // Unordered lists
        /^\d+\.\s/,            // Ordered lists
        /^>\s/,                // Blockquotes
        /^```/,                // Code blocks
        /^\|.*\|/,             // Tables
    ];

    for (const pattern of markdownPatterns) {
        if (pattern.test(trimmed)) {
            return 'markdown';
        }
    }

    // Default to HTML if no clear pattern
    return 'html';
}

/**
 * Renders Markdown content to HTML using remark
 */
export async function renderMarkdown(markdown: string): Promise<string> {
    try {
        const result = await remark()
            .use(remarkHtml, {
                // Preserve line breaks
                sanitize: false, // We'll sanitize after
            })
            .process(markdown);
        
        return String(result);
    } catch (error) {
        console.error('Error rendering markdown:', error);
        // Fallback: return markdown as-is
        return markdown;
    }
}

/**
 * Sanitizes HTML content
 * Removes potentially dangerous elements and attributes
 */
export function sanitizeHtmlContent(html: string): string {
    return sanitizeHtml(html, {
        allowedTags: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'br', 'strong', 'em', 'u', 's', 'del', 'ins',
            'ul', 'ol', 'li',
            'blockquote', 'pre', 'code',
            'a', 'img',
            'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'div', 'span',
            'hr',
        ],
        allowedAttributes: {
            'a': ['href', 'title', 'target', 'rel'],
            'img': ['src', 'alt', 'title', 'width', 'height'],
            '*': ['class', 'id'],
        },
        allowedSchemes: ['http', 'https', 'mailto'],
        allowedSchemesByTag: {
            img: ['http', 'https', 'data'],
        },
        // Transform relative URLs to absolute if needed
        transformTags: {
            'a': (tagName, attribs) => {
                // Add rel="noopener noreferrer" to external links
                if (attribs.href && attribs.href.startsWith('http') && !attribs.href.includes(process.env.NEXT_PUBLIC_SITE_URL || '')) {
                    return {
                        tagName: 'a',
                        attribs: {
                            ...attribs,
                            target: '_blank',
                            rel: 'noopener noreferrer',
                        },
                    };
                }
                return { tagName, attribs };
            },
            'img': (tagName, attribs) => {
                // Ensure images have alt text
                if (!attribs.alt) {
                    attribs.alt = attribs.title || 'Imagem';
                }
                return { tagName, attribs };
            },
        },
    });
}

/**
 * Renders content (Markdown or HTML) to safe HTML
 */
export async function renderContent(
    content: string,
    type?: 'markdown' | 'html'
): Promise<string> {
    if (!content) return '';

    const contentType = type || detectContentType(content);
    
    if (contentType === 'markdown') {
        const html = await renderMarkdown(content);
        return sanitizeHtmlContent(html);
    } else {
        return sanitizeHtmlContent(content);
    }
}
