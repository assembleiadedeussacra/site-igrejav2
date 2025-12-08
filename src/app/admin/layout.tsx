'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import {
    LayoutDashboard,
    Image as ImageIcon,
    BookOpen,
    Users,
    Calendar,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Wallet,
    Images,
    MessageSquare,
} from 'lucide-react';

const menuItems = [
    {
        href: '/admin',
        label: 'Dashboard',
        icon: LayoutDashboard,
    },
    {
        href: '/admin/banners',
        label: 'Banners',
        icon: ImageIcon,
    },
    {
        href: '/admin/versiculo',
        label: 'Versículo',
        icon: BookOpen,
    },
    {
        href: '/admin/lideranca',
        label: 'Liderança',
        icon: Users,
    },
    {
        href: '/admin/posts',
        label: 'Blog & Estudos',
        icon: FileText,
    },
    {
        href: '/admin/eventos',
        label: 'Agenda/Eventos',
        icon: Calendar,
    },
    {
        href: '/admin/galeria',
        label: 'Galeria',
        icon: Images,
    },
    {
        href: '/admin/financeiro',
        label: 'Dízimos/Ofertas',
        icon: Wallet,
    },
    {
        href: '/admin/depoimentos',
        label: 'Depoimentos',
        icon: MessageSquare,
    },
    {
        href: '/admin/configuracoes',
        label: 'Configurações',
        icon: Settings,
    },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<{ email?: string } | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();
    }, []);

    // Skip layout for login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-accent)] transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <Link href="/admin" className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-[20px] overflow-hidden border-2 border-white/30">
                                <Image
                                    src="/images/logo-igreja.jpg"
                                    alt="Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h1 className="font-bold text-white text-sm">AD Missão</h1>
                                <p className="text-white/60 text-xs">Admin</p>
                            </div>
                        </Link>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden text-white/80 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4">
                        <ul className="space-y-1 px-3">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-[20px] transition-all ${isActive
                                                    ? 'bg-white/20 text-white'
                                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            <item.icon className="w-5 h-5 flex-shrink-0" />
                                            <span className="font-medium">{item.label}</span>
                                            {isActive && (
                                                <ChevronRight className="w-4 h-4 ml-auto" />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* User */}
                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-[20px] bg-white/20 flex items-center justify-center text-white font-bold">
                                {user?.email?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-sm truncate">
                                    {user?.email || 'Admin'}
                                </p>
                                <p className="text-white/60 text-xs">Administrador</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-[20px] hover:bg-white/20 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sair
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-white border-b">
                    <div className="flex items-center justify-between px-4 py-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-[20px] hover:bg-gray-100"
                        >
                            <Menu className="w-6 h-6 text-gray-600" />
                        </button>
                        <div className="hidden lg:block">
                            <h2 className="text-lg font-semibold text-[var(--color-accent)]">
                                {menuItems.find((item) => item.href === pathname)?.label ||
                                    'Dashboard'}
                            </h2>
                        </div>
                        <Link
                            href="/"
                            target="_blank"
                            className="text-sm text-[var(--color-accent)] hover:underline"
                        >
                            Ver Site →
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 md:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
