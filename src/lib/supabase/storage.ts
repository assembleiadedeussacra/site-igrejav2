import { createClient } from './client';

const BUCKET_NAME = 'banners';

/**
 * Uploads an image file to Supabase Storage
 * @param file - The file to upload
 * @param path - The path where the file should be stored (e.g., 'desktop/banner-1.jpg')
 * @returns The public URL of the uploaded file
 */
export async function uploadImage(file: File, path: string): Promise<string> {
    const supabase = createClient();

    // Validate file type
    if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
    }

    // Upload file
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        // Mensagem mais clara para erro de bucket não encontrado
        if (error.message?.includes('Bucket not found') || error.message?.includes('not found')) {
            throw new Error(`Bucket '${BUCKET_NAME}' não encontrado. Por favor, execute o script 'create_bucket_banners.sql' no Supabase Dashboard.`);
        }
        throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

/**
 * Deletes an image from Supabase Storage
 * @param path - The path of the file to delete
 */
export async function deleteImage(path: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([path]);

    if (error) {
        throw new Error(`Delete failed: ${error.message}`);
    }
}

/**
 * Generates a unique file path for banner images
 * @param bannerId - The ID of the banner (or 'new' for new banners)
 * @param type - 'desktop', 'mobile', or 'logo'
 * @param fileExtension - The file extension (e.g., 'jpg', 'png')
 * @returns A unique file path
 */
export function generateBannerImagePath(
    bannerId: string,
    type: 'desktop' | 'mobile' | 'logo',
    fileExtension: string
): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `${type}/${bannerId}-${timestamp}-${random}.${fileExtension}`;
}

/**
 * Extracts file extension from a file name or path
 */
export function getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || 'jpg';
}

/**
 * Uploads a leader image to Supabase Storage
 * @param file - The image file to upload
 * @param leaderId - The ID of the leader (or 'new' for new leaders)
 * @returns The public URL of the uploaded file
 */
export async function uploadLeaderImage(file: File, leaderId: string): Promise<string> {
    const supabase = createClient();
    const BUCKET_NAME = 'leaders';

    // Validate file type
    if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
    }

    // Generate unique path
    const extension = getFileExtension(file.name);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const path = `leaders/${leaderId}-${timestamp}-${random}.${extension}`;

    // Upload file
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

/**
 * Uploads a post cover image to Supabase Storage
 */
export async function uploadPostCover(file: File, postId: string): Promise<string> {
    const supabase = createClient();
    const BUCKET_NAME = 'posts';

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
    const path = `covers/${postId}-${timestamp}-${random}.${extension}`;

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
 * Uploads an inline image for post content
 */
export async function uploadPostInlineImage(file: File, postId: string): Promise<string> {
    const supabase = createClient();
    const BUCKET_NAME = 'posts';

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
    const path = `inline/${postId}-${timestamp}-${random}.${extension}`;

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
 * Uploads a gallery cover image
 */
export async function uploadGalleryCover(file: File, albumId: string): Promise<string> {
    const supabase = createClient();
    const BUCKET_NAME = 'gallery';

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
    const path = `covers/${albumId}-${timestamp}-${random}.${extension}`;

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
 * Uploads a QR Code image for financials
 */
export async function uploadQRCode(file: File): Promise<string> {
    const supabase = createClient();
    const BUCKET_NAME = 'financials';

    if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
    }

    const maxSize = 2 * 1024 * 1024; // 2MB for QR codes
    if (file.size > maxSize) {
        throw new Error('File size must be less than 2MB');
    }

    const extension = getFileExtension(file.name);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const path = `qrcode-${timestamp}-${random}.${extension}`;

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
 * Uploads a testimonial avatar
 */
export async function uploadTestimonialAvatar(file: File, testimonialId: string): Promise<string> {
    const supabase = createClient();
    const BUCKET_NAME = 'testimonials';

    if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
    }

    const maxSize = 2 * 1024 * 1024; // 2MB for avatares
    if (file.size > maxSize) {
        throw new Error('File size must be less than 2MB');
    }

    const extension = getFileExtension(file.name);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const path = `avatars/${testimonialId}-${timestamp}-${random}.${extension}`;

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

