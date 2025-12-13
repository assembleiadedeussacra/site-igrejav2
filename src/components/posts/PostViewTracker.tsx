'use client';

import { useEffect } from 'react';
import { api } from '@/services/api';
import { AnalyticsEvents } from '@/lib/analytics';
import type { Post } from '@/lib/database.types';

interface PostViewTrackerProps {
    post: Post;
}

export default function PostViewTracker({ post }: PostViewTrackerProps) {
    useEffect(() => {
        // Track view on client side
        api.incrementPostViews(post.id).catch((error) => {
            console.error('Error tracking view:', error);
        });

        // Track analytics event
        AnalyticsEvents.postView(post.id, post.title, post.type);
    }, [post.id, post.title, post.type]);

    return null;
}

