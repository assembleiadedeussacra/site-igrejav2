'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export default function Toaster() {
    return (
        <HotToaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: 'white',
                    color: 'var(--color-text)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                },
                success: {
                    iconTheme: {
                        primary: 'var(--color-success)',
                        secondary: 'white',
                    },
                },
                error: {
                    iconTheme: {
                        primary: 'var(--color-error)',
                        secondary: 'white',
                    },
                },
            }}
        />
    );
}

