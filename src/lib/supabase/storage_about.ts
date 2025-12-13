import { createClient } from './client';
import { getFileExtension } from './storage';

/**
 * Uploads an about page cover image
 */
export async function uploadAboutPageCover(file: File): Promise<string> {
    const supabase = createClient();
    const BUCKET_NAME = 'banners'; // Reusing banners bucket for about page cover

    if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
    }

    const extension = getFileExtension(file.name);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const path = `about-cover/cover-${timestamp}-${random}.${extension}`;

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

/**
 * Uploads a department image
 */
export async function uploadDepartmentImage(file: File, departmentId: string): Promise<string> {
    const supabase = createClient();
    const BUCKET_NAME = 'gallery'; // Reusing gallery bucket for department images

    if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
    }

    const extension = getFileExtension(file.name);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const path = `departments/${departmentId}-${timestamp}-${random}.${extension}`;

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

/**
 * Uploads a department member image
 */
export async function uploadDepartmentMemberImage(file: File, memberId: string): Promise<string> {
    const supabase = createClient();
    const BUCKET_NAME = 'leaders'; // Reusing leaders bucket for department members

    if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
    }

    const extension = getFileExtension(file.name);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const path = `members/${memberId}-${timestamp}-${random}.${extension}`;

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

