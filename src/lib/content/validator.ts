/**
 * Semantic content validator
 * Validates HTML structure for SEO best practices
 */

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
}

export interface ValidationError {
    type: 'error';
    message: string;
    element?: string;
    line?: number;
}

export interface ValidationWarning {
    type: 'warning';
    message: string;
    element?: string;
    line?: number;
}

/**
 * Validates semantic structure of HTML content
 */
export function validateSemanticStructure(html: string): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!html || html.trim().length === 0) {
        return {
            isValid: true,
            errors: [],
            warnings: [
                {
                    type: 'warning',
                    message: 'Content is empty',
                },
            ],
        };
    }

    // Parse HTML (basic approach - in production, use a proper HTML parser)
    const h1Matches = html.match(/<h1[^>]*>.*?<\/h1>/gi) || [];
    const h2Matches = html.match(/<h2[^>]*>.*?<\/h2>/gi) || [];
    const h3Matches = html.match(/<h3[^>]*>.*?<\/h3>/gi) || [];
    const h4Matches = html.match(/<h4[^>]*>.*?<\/h4>/gi) || [];

    // Check for H1 count (should be 0 or 1 - H1 is usually in the page template)
    if (h1Matches.length > 1) {
        errors.push({
            type: 'error',
            message: `Found ${h1Matches.length} H1 elements. Content should have at most 1 H1.`,
            element: 'h1',
        });
    }

    // Check for hierarchy (H2 should come before H3, etc.)
    // This is a simplified check - in production, parse the DOM tree
    const allHeadings = [
        ...h1Matches.map((h, i) => ({ level: 1, index: html.indexOf(h) })),
        ...h2Matches.map((h, i) => ({ level: 2, index: html.indexOf(h) })),
        ...h3Matches.map((h, i) => ({ level: 3, index: html.indexOf(h) })),
        ...h4Matches.map((h, i) => ({ level: 4, index: html.indexOf(h) })),
    ].sort((a, b) => a.index - b.index);

    // Check for hierarchy violations
    for (let i = 1; i < allHeadings.length; i++) {
        const prev = allHeadings[i - 1];
        const curr = allHeadings[i];
        
        // Skip if same level or valid hierarchy
        if (curr.level <= prev.level || curr.level === prev.level + 1) {
            continue;
        }
        
        // Check for skipping levels (e.g., H1 -> H3)
        if (curr.level > prev.level + 1) {
            warnings.push({
                type: 'warning',
                message: `Heading hierarchy violation: H${prev.level} followed by H${curr.level}. Consider using H${prev.level + 1} instead.`,
                element: `h${curr.level}`,
            });
        }
    }

    // Check for required semantic elements
    const hasLists = /<(ul|ol)[^>]*>/i.test(html);
    const hasParagraphs = /<p[^>]*>/i.test(html);
    
    if (!hasParagraphs && html.length > 100) {
        warnings.push({
            type: 'warning',
            message: 'Content appears to be long but has no paragraph tags. Consider using <p> tags for better semantic structure.',
        });
    }

    // Check for images without alt text
    const imageMatches = html.match(/<img[^>]*>/gi) || [];
    imageMatches.forEach((img, index) => {
        if (!/alt\s*=\s*["'][^"']*["']/i.test(img)) {
            warnings.push({
                type: 'warning',
                message: `Image at position ${index + 1} is missing alt text. Alt text is important for accessibility and SEO.`,
                element: 'img',
            });
        }
    });

    // Check for links without descriptive text
    const linkMatches = html.match(/<a[^>]*>.*?<\/a>/gi) || [];
    linkMatches.forEach((link, index) => {
        const textContent = link.replace(/<[^>]*>/g, '').trim();
        if (textContent.length === 0 || textContent === 'aqui' || textContent === 'clique aqui') {
            warnings.push({
                type: 'warning',
                message: `Link at position ${index + 1} has non-descriptive text. Use descriptive link text for better SEO and accessibility.`,
                element: 'a',
            });
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}

/**
 * Validates content length for SEO
 */
export function validateContentLength(content: string): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Remove HTML tags for length calculation
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;

    // SEO best practices: minimum 300 words for articles
    if (wordCount < 300) {
        warnings.push({
            type: 'warning',
            message: `Content has only ${wordCount} words. For better SEO, aim for at least 300 words.`,
        });
    }

    // Check for very short content
    if (wordCount < 100) {
        errors.push({
            type: 'error',
            message: `Content is too short (${wordCount} words). Minimum recommended length is 100 words.`,
        });
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}
