/**
 * Slug utilities for generating and validating URL-friendly slugs
 */

/**
 * Normalizes a string to create a URL-friendly slug
 * - Converts to lowercase
 * - Removes accents
 * - Replaces spaces and special characters with hyphens
 * - Removes leading/trailing hyphens
 * 
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
    if (!text) return '';
    
    let slug = text
        .toLowerCase()
        .trim();
    
    // Remove accents (basic approach)
    slug = slug
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    
    // Replace spaces and special characters with hyphens
    slug = slug.replace(/[^a-z0-9]+/g, '-');
    
    // Remove leading/trailing hyphens
    slug = slug.replace(/^-+|-+$/g, '');
    
    // Limit length to 100 characters
    if (slug.length > 100) {
        slug = slug.substring(0, 100);
        slug = slug.replace(/-+$/, '');
    }
    
    return slug;
}

/**
 * Validates if a slug has the correct format
 * - Only lowercase letters, numbers, and hyphens
 * - No consecutive hyphens
 * - Not empty
 * - Max 100 characters
 * 
 * @param slug - The slug to validate
 * @returns True if the slug is valid, false otherwise
 */
export function validateSlug(slug: string): boolean {
    if (!slug || slug.length === 0) return false;
    if (slug.length > 100) return false;
    
    // Only lowercase letters, numbers, and hyphens
    const validPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!validPattern.test(slug)) return false;
    
    // No consecutive hyphens
    if (slug.includes('--')) return false;
    
    // Cannot start or end with hyphen
    if (slug.startsWith('-') || slug.endsWith('-')) return false;
    
    return true;
}

/**
 * Ensures a slug is unique by appending a number if necessary
 * This function should be called with database access to check uniqueness
 * 
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @param excludeId - Optional ID to exclude from uniqueness check (for updates)
 * @returns A unique slug
 */
export function ensureUniqueSlug(
    baseSlug: string,
    existingSlugs: string[],
    excludeId?: string
): string {
    if (!baseSlug) return '';
    
    let finalSlug = baseSlug;
    let counter = 0;
    
    // Filter out the excluded ID if provided
    const slugsToCheck = excludeId 
        ? existingSlugs.filter((_, index) => index.toString() !== excludeId)
        : existingSlugs;
    
    while (slugsToCheck.includes(finalSlug)) {
        counter++;
        finalSlug = `${baseSlug}-${counter}`;
        
        // Safety check to prevent infinite loop
        if (counter > 1000) {
            throw new Error('Unable to generate unique slug after 1000 attempts');
        }
    }
    
    return finalSlug;
}

/**
 * Sanitizes a slug by removing invalid characters
 * 
 * @param slug - The slug to sanitize
 * @returns A sanitized slug
 */
export function sanitizeSlug(slug: string): string {
    if (!slug) return '';
    
    return slug
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '') // Remove invalid characters
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
