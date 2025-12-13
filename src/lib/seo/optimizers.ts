/**
 * SEO optimizers for titles and descriptions
 */

/**
 * Optimizes title for SEO
 * - Ensures proper length (50-60 characters recommended)
 * - Includes primary keyword naturally
 * - Maintains readability
 */
export function optimizeTitle(title: string, keywords: string[] = []): string {
    if (!title) return '';

    let optimized = title.trim();

    // Remove extra whitespace
    optimized = optimized.replace(/\s+/g, ' ');

    // If title is too long, truncate intelligently
    if (optimized.length > 60) {
        // Try to truncate at a word boundary
        const truncated = optimized.substring(0, 57);
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > 40) {
            optimized = truncated.substring(0, lastSpace) + '...';
        } else {
            optimized = truncated + '...';
        }
    }

    // If title is too short and we have keywords, consider adding them
    // But only if it doesn't make it too long
    if (optimized.length < 30 && keywords.length > 0) {
        const primaryKeyword = keywords[0];
        if (primaryKeyword && !optimized.toLowerCase().includes(primaryKeyword.toLowerCase())) {
            const withKeyword = `${optimized} - ${primaryKeyword}`;
            if (withKeyword.length <= 60) {
                optimized = withKeyword;
            }
        }
    }

    return optimized;
}

/**
 * Optimizes description for SEO
 * - Ensures proper length (150-160 characters recommended)
 * - Includes primary keyword naturally
 * - Maintains readability and call-to-action
 */
export function optimizeDescription(
    description: string,
    maxLength: number = 160
): string {
    if (!description) return '';

    let optimized = description.trim();

    // Remove extra whitespace
    optimized = optimized.replace(/\s+/g, ' ');

    // If description is too long, truncate intelligently
    if (optimized.length > maxLength) {
        // Try to truncate at a sentence boundary first
        const sentences = optimized.match(/[^.!?]+[.!?]+/g);
        if (sentences && sentences.length > 0) {
            let truncated = '';
            for (const sentence of sentences) {
                if ((truncated + sentence).length <= maxLength - 3) {
                    truncated += sentence;
                } else {
                    break;
                }
            }
            if (truncated.length > 0) {
                optimized = truncated.trim() + '...';
            } else {
                // Fallback to word boundary
                const truncated = optimized.substring(0, maxLength - 3);
                const lastSpace = truncated.lastIndexOf(' ');
                if (lastSpace > maxLength * 0.7) {
                    optimized = truncated.substring(0, lastSpace) + '...';
                } else {
                    optimized = truncated + '...';
                }
            }
        } else {
            // Fallback to word boundary
            const truncated = optimized.substring(0, maxLength - 3);
            const lastSpace = truncated.lastIndexOf(' ');
            if (lastSpace > maxLength * 0.7) {
                optimized = truncated.substring(0, lastSpace) + '...';
            } else {
                optimized = truncated + '...';
            }
        }
    }

    // If description is too short, consider adding more context
    if (optimized.length < 120) {
        // Description is acceptable but could be longer
        // This is just a note - we don't auto-expand descriptions
    }

    return optimized;
}

/**
 * Validates title length
 */
export function validateTitleLength(title: string): {
    isValid: boolean;
    length: number;
    recommendation: string;
} {
    const length = title.length;
    
    if (length < 30) {
        return {
            isValid: false,
            length,
            recommendation: 'Title is too short. Aim for 50-60 characters for optimal SEO.',
        };
    }
    
    if (length > 60) {
        return {
            isValid: false,
            length,
            recommendation: 'Title is too long. It may be truncated in search results. Aim for 50-60 characters.',
        };
    }
    
    return {
        isValid: true,
        length,
        recommendation: 'Title length is optimal for SEO.',
    };
}

/**
 * Validates description length
 */
export function validateDescriptionLength(description: string): {
    isValid: boolean;
    length: number;
    recommendation: string;
} {
    const length = description.length;
    
    if (length < 120) {
        return {
            isValid: false,
            length,
            recommendation: 'Description is too short. Aim for 150-160 characters for optimal SEO.',
        };
    }
    
    if (length > 160) {
        return {
            isValid: false,
            length,
            recommendation: 'Description is too long. It may be truncated in search results. Aim for 150-160 characters.',
        };
    }
    
    return {
        isValid: true,
        length,
        recommendation: 'Description length is optimal for SEO.',
    };
}
