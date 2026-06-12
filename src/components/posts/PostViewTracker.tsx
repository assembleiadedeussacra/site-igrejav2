'use client';

import { useEffect } from 'react';
import { AnalyticsEvents } from '@/lib/analytics';
import { hasAnalyticsConsent } from '@/lib/cookieConsent';
import type { Post } from '@/lib/database.types';

interface PostViewTrackerProps {
    post: Post;
}

export default function PostViewTracker({ post }: PostViewTrackerProps) {
    useEffect(() => {
        fetch(`/api/posts/${post.id}/view`, { method: 'POST' }).catch((error) => {
            console.error('Error tracking view:', error);
        });

        if (hasAnalyticsConsent()) {
            AnalyticsEvents.postView(post.id, post.title, post.type);
        }
    }, [post.id, post.title, post.type]);

    return null;
}
