'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    ChevronDown,
    Home,
    Users,
    Calendar,
    Mail,
    BookOpen,
    FileText,
    GraduationCap,
} from 'lucide-react';

const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/#sobre', label: 'Sobre', icon: Users },
    { href: '/#agenda', label: 'Agenda', icon: Calendar },
    { href: '/#contato', label: 'Contato', icon: Mail },
];

const knowledgeLinks = [
    { href: '/estudos', label: 'Estudos e Reflexões', icon: GraduationCap },
    { href: '/blog', label: 'Blog', icon: FileText },
];

import { SiteSettings } from '@/lib/database.types';

interface HeaderProps {
    settings?: SiteSettings | null;
}

export default function Header({ settings }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/90 backdrop-blur-lg shadow-lg py-2'
                    : 'bg-transparent py-4'
                    }`}
            >
                <div className="container-custom">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--color-accent)] shadow-md transition-transform group-hover:scale-105">
                                <Image
                                    src="/images/logo-igreja.jpg"
                                    alt="Logo Assembleia de Deus Missão Sacramento"
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            <div className="hidden sm:block">
                                <span
                                    className={`font-bold text-base leading-tight transition-colors ${isScrolled ? 'text-[var(--color-accent)]' : 'text-white'
                                        }`}
                                >
                                    AD Missão
                                </span>
                                <p
                                    className={`text-xs transition-colors ${isScrolled ? 'text-[var(--color-text-secondary)]' : 'text-white/80'
                                        }`}
                                >
                                    Sacramento/MG
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navLinks.slice(0, 2).map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-[20px] font-medium transition-all hover:bg-[var(--color-accent)]/10 ${isScrolled
                                        ? 'text-[var(--color-accent)]'
                                        : 'text-white hover:bg-white/10'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* Dropdown - Conhecimento */}
                            <div
                                className="relative"
                                onMouseEnter={() => setIsDropdownOpen(true)}
                                onMouseLeave={() => setIsDropdownOpen(false)}
                            >
                                <button
                                    className={`flex items-center gap-1 px-4 py-2 rounded-[20px] font-medium transition-all hover:bg-[var(--color-accent)]/10 ${isScrolled
                                        ? 'text-[var(--color-accent)]'
                                        : 'text-white hover:bg-white/10'
                                        }`}
                                >
                                    <BookOpen className="w-4 h-4" />
                                    Conhecimento
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 mt-2 w-56 bg-white rounded-[20px] shadow-xl overflow-hidden border border-[var(--color-primary)]/20"
                                        >
                                            {knowledgeLinks.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className="flex items-center gap-3 px-4 py-3 text-[var(--color-accent)] hover:bg-[var(--color-primary)]/20 transition-colors"
                                                >
                                                    <link.icon className="w-5 h-5" />
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {navLinks.slice(2).map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-[20px] font-medium transition-all hover:bg-[var(--color-accent)]/10 ${isScrolled
                                        ? 'text-[var(--color-accent)]'
                                        : 'text-white hover:bg-white/10'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <Link
                                href="/#doacoes"
                                className="ml-4 btn-primary text-sm"
                            >
                                Contribuir
                            </Link>
                        </nav>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className={`lg:hidden p-2 rounded-[20px] transition-colors ${isScrolled
                                ? 'text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10'
                                : 'text-white hover:bg-white/10'
                                }`}
                            aria-label="Abrir menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 20 }}
                            className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 lg:hidden shadow-2xl"
                        >
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-[var(--color-primary)]/20">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--color-accent)]">
                                            <Image
                                                src="/images/logo-igreja.jpg"
                                                alt="Logo"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="font-bold text-[var(--color-accent)]">
                                            AD Missão
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 rounded-[20px] text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10"
                                        aria-label="Fechar menu"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Navigation */}
                                <nav className="flex-1 overflow-y-auto py-4">
                                    {navLinks.map((link, index) => (
                                        <motion.div
                                            key={link.href}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex items-center gap-3 px-6 py-4 text-[var(--color-accent)] hover:bg-[var(--color-primary)]/20 transition-colors"
                                            >
                                                <link.icon className="w-5 h-5" />
                                                {link.label}
                                            </Link>
                                        </motion.div>
                                    ))}

                                    {/* Knowledge Section */}
                                    <div className="px-6 py-2">
                                        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                            Conhecimento
                                        </p>
                                    </div>
                                    {knowledgeLinks.map((link, index) => (
                                        <motion.div
                                            key={link.href}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: (navLinks.length + index) * 0.1 }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex items-center gap-3 px-6 py-4 text-[var(--color-accent)] hover:bg-[var(--color-primary)]/20 transition-colors"
                                            >
                                                <link.icon className="w-5 h-5" />
                                                {link.label}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>

                                {/* CTA */}
                                <div className="p-4 border-t border-[var(--color-primary)]/20">
                                    <Link
                                        href="/#doacoes"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="btn-primary w-full justify-center"
                                    >
                                        Contribuir
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
