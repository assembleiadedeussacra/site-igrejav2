'use client';

import { useEffect } from 'react';
import { api } from '@/services/api';

interface PostViewTrackerProps {
    postId: string;
}

export default function PostViewTracker({ postId }: PostViewTrackerProps) {
    useEffect(() => {
        // Track view on client side
        api.incrementPostViews(postId).catch((error) => {
            console.error('Error tracking view:', error);
        });
    }, [postId]);

    return null;
}

