import { NextRequest, NextResponse } from 'next/server';
import { serverApi } from '@/services/server';
import type { Post } from '@/lib/database.types';

/**
 * API REST endpoint for Headless CMS integration
 * GET /api/content/posts
 * 
 * Query parameters:
 * - type: 'blog' | 'study' (optional)
 * - published: boolean (optional, default: true)
 * - tags: comma-separated list (optional)
 * - limit: number (optional, default: 10)
 * - offset: number (optional, default: 0)
 * - orderBy: 'created_at' | 'updated_at' | 'views' (optional, default: 'created_at')
 * - order: 'asc' | 'desc' (optional, default: 'desc')
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        
        const type = searchParams.get('type') as 'blog' | 'study' | null;
        const published = searchParams.get('published') !== 'false'; // Default to true
        const tagsParam = searchParams.get('tags');
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const offset = parseInt(searchParams.get('offset') || '0', 10);
        const orderBy = searchParams.get('orderBy') || 'created_at';
        const order = searchParams.get('order') || 'desc';

        // Get posts
        // Note: getPostsByType and getAllPostsByType only return published posts
        // If unpublished posts are needed, we'd need a different API method
        let posts: Post[] = [];
        if (type) {
            if (published) {
                posts = await serverApi.getPostsByType(type, limit, offset);
            } else {
                // Since getAllPostsByType also filters by published=true,
                // we cannot get unpublished posts with current API methods
                // Return empty array for now
                posts = [];
            }
        } else {
            // Get all posts (both blog and study)
            if (published) {
                const [blogPosts, studyPosts] = await Promise.all([
                    serverApi.getPostsByType('blog', limit, offset),
                    serverApi.getPostsByType('study', limit, offset),
                ]);
                posts = [...blogPosts, ...studyPosts];
            } else {
                // Since getAllPostsByType also filters by published=true,
                // we cannot get unpublished posts with current API methods
                // Return empty array for now
                posts = [];
            }
        }

        // Filter by tags if provided
        if (tagsParam) {
            const tags = tagsParam.split(',').map(t => t.trim());
            posts = posts.filter(post => 
                tags.some(tag => post.tags?.includes(tag))
            );
        }

        // Sort posts
        posts.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (orderBy) {
                case 'updated_at':
                    aValue = new Date(a.updated_at).getTime();
                    bValue = new Date(b.updated_at).getTime();
                    break;
                case 'views':
                    aValue = a.views || 0;
                    bValue = b.views || 0;
                    break;
                case 'created_at':
                default:
                    aValue = new Date(a.created_at).getTime();
                    bValue = new Date(b.created_at).getTime();
                    break;
            }

            return order === 'asc' ? aValue - bValue : bValue - aValue;
        });

        // Apply limit and offset after filtering
        const paginatedPosts = posts.slice(offset, offset + limit);

        // CORS headers (configurable)
        const corsOrigin = process.env.CORS_ORIGIN || '*';
        
        return NextResponse.json(
            {
                data: paginatedPosts,
                meta: {
                    total: posts.length,
                    limit,
                    offset,
                    hasMore: offset + limit < posts.length,
                },
            },
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': corsOrigin,
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            }
        );
    } catch (error) {
        console.error('Error in /api/content/posts:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
    const corsOrigin = process.env.CORS_ORIGIN || '*';
    
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': corsOrigin,
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
