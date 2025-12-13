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
    { href: '/#agenda', label: 'Agenda', icon: Calendar },
    { href: '/#contato', label: 'Contato', icon: Mail },
];

const sobreLinks = [
    { href: '/sobre-nos', label: 'Sobre a Igreja', icon: Users },
    { href: '/sobre-nos#departamentos', label: 'Departamentos', icon: Users },
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
    const [isSobreDropdownOpen, setIsSobreDropdownOpen] = useState(false);

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
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${isScrolled
                    ? 'shadow-lg py-2'
                    : 'shadow-sm py-4'
                    }`}
            >
                <div className="container-custom">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-12 h-12 rounded-[10px] overflow-hidden transition-transform group-hover:scale-105">
                                <Image
                                    src="/images/logo-igreja.png"
                                    alt="Logo Assembleia de Deus Missão Sacramento"
                                    fill
                                    sizes="48px"
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <div className="hidden sm:block">
                                <span className="font-bold text-base leading-tight text-[var(--color-accent)]">
                                    AD Missão
                                </span>
                                <p className="text-xs text-[var(--color-text-secondary)]">
                                    Sacramento/MG
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            <Link
                                href="/"
                                className="px-4 py-2 rounded-[10px] font-medium transition-all hover:bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                            >
                                Home
                            </Link>

                            {/* Dropdown - Sobre */}
                            <div
                                className="relative"
                                onMouseEnter={() => setIsSobreDropdownOpen(true)}
                                onMouseLeave={() => setIsSobreDropdownOpen(false)}
                            >
                                <button
                                    className="flex items-center gap-1 px-4 py-2 rounded-[10px] font-medium transition-all hover:bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                                >
                                    <Users className="w-4 h-4" />
                                    Sobre
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform ${isSobreDropdownOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {isSobreDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 mt-2 w-56 bg-white rounded-[10px] shadow-xl overflow-hidden border border-[var(--color-primary)]/20"
                                        >
                                            {sobreLinks.map((link) => (
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

                            {/* Dropdown - Conhecimento */}
                            <div
                                className="relative"
                                onMouseEnter={() => setIsDropdownOpen(true)}
                                onMouseLeave={() => setIsDropdownOpen(false)}
                            >
                                <button
                                    className="flex items-center gap-1 px-4 py-2 rounded-[10px] font-medium transition-all hover:bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
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
                                            className="absolute top-full left-0 mt-2 w-56 bg-white rounded-[10px] shadow-xl overflow-hidden border border-[var(--color-primary)]/20"
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
                                    className="px-4 py-2 rounded-[10px] font-medium transition-all hover:bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
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
                            className="lg:hidden p-2 rounded-[10px] transition-colors text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10"
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
                                        <div className="relative w-10 h-10 rounded-[10px] overflow-hidden">
                                            <Image
                                                src="/images/logo-igreja.png"
                                                alt="Logo"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <span className="font-bold text-[var(--color-accent)]">
                                            AD Missão
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 rounded-[10px] text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10"
                                        aria-label="Fechar menu"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Navigation */}
                                <nav className="flex-1 overflow-y-auto py-4">
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0 }}
                                    >
                                        <Link
                                            href="/"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-6 py-4 text-[var(--color-accent)] hover:bg-[var(--color-primary)]/20 transition-colors"
                                        >
                                            <Home className="w-5 h-5" />
                                            Home
                                        </Link>
                                    </motion.div>

                                    {/* Sobre Section */}
                                    <div className="px-6 py-2">
                                        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                            Sobre
                                        </p>
                                    </div>
                                    {sobreLinks.map((link, index) => (
                                        <motion.div
                                            key={link.href}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: (1 + index) * 0.1 }}
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

                                    {navLinks.slice(1).map((link, index) => (
                                        <motion.div
                                            key={link.href}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: (3 + index) * 0.1 }}
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
