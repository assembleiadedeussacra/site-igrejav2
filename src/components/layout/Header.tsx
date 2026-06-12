'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    ChevronDown,
    Users,
    Calendar,
    Mail,
    BookOpen,
    FileText,
    GraduationCap,
} from 'lucide-react';

import { SiteSettings } from '@/lib/database.types';

const sobreLinks = [
    { href: '/sobre-nos', label: 'Sobre a Igreja', icon: Users },
    { href: '/sobre-nos#departamentos', label: 'Departamentos', icon: Users },
];

const knowledgeLinks = [
    { href: '/estudos', label: 'Estudos e Reflexões', icon: GraduationCap },
    { href: '/blog', label: 'Blog', icon: FileText },
];

const anchorLinks = [
    { href: '/#agenda', label: 'Agenda', icon: Calendar },
    { href: '/#contato', label: 'Contato', icon: Mail },
];

interface HeaderProps {
    settings?: SiteSettings | null;
}

const navLinkClass =
    'px-3.5 py-2 rounded-[10px] text-sm font-medium transition-colors hover:bg-[var(--color-accent)]/8 text-[var(--color-accent)]';

const navDropdownTriggerClass =
    'flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-sm font-medium transition-colors hover:bg-[var(--color-accent)]/8 text-[var(--color-accent)]';

const dropdownPanelClass =
    'absolute top-full left-0 mt-1.5 min-w-[13rem] bg-white rounded-[10px] shadow-xl overflow-hidden border border-[var(--color-primary)]/20 py-1';

const dropdownItemClass =
    'flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-accent)] hover:bg-[var(--color-primary)]/15 transition-colors';

export default function Header(_props: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSobreDropdownOpen, setIsSobreDropdownOpen] = useState(false);
    const [mobileSobreOpen, setMobileSobreOpen] = useState(false);
    const [mobileKnowledgeOpen, setMobileKnowledgeOpen] = useState(false);

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
            setMobileSobreOpen(false);
            setMobileKnowledgeOpen(false);
        }
    }, [isMobileMenuOpen]);

    const closeMobile = () => setIsMobileMenuOpen(false);

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-top ${isScrolled
                    ? 'header-glass shadow-md py-2'
                    : 'bg-white/95 shadow-sm py-3 sm:py-4'
                    }`}
            >
                <div className="container-custom">
                    <div className="flex items-center justify-between">
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
                        <nav className="hidden lg:flex items-center gap-0.5" aria-label="Menu principal">
                            {/* Sobre */}
                            <div
                                className="relative"
                                onMouseEnter={() => setIsSobreDropdownOpen(true)}
                                onMouseLeave={() => setIsSobreDropdownOpen(false)}
                            >
                                <button
                                    type="button"
                                    className={navDropdownTriggerClass}
                                    aria-expanded={isSobreDropdownOpen}
                                >
                                    Sobre
                                    <ChevronDown
                                        className={`w-3.5 h-3.5 opacity-60 transition-transform ${isSobreDropdownOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {isSobreDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 8 }}
                                            transition={{ duration: 0.15 }}
                                            className={dropdownPanelClass}
                                        >
                                            {sobreLinks.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className={dropdownItemClass}
                                                >
                                                    <link.icon className="w-4 h-4 opacity-70" />
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Conhecimento */}
                            <div
                                className="relative"
                                onMouseEnter={() => setIsDropdownOpen(true)}
                                onMouseLeave={() => setIsDropdownOpen(false)}
                            >
                                <button
                                    type="button"
                                    className={navDropdownTriggerClass}
                                    aria-expanded={isDropdownOpen}
                                >
                                    Conhecimento
                                    <ChevronDown
                                        className={`w-3.5 h-3.5 opacity-60 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 8 }}
                                            transition={{ duration: 0.15 }}
                                            className={dropdownPanelClass}
                                        >
                                            {knowledgeLinks.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className={dropdownItemClass}
                                                >
                                                    <link.icon className="w-4 h-4 opacity-70" />
                                                    {link.label}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {anchorLinks.map((link) => (
                                <Link key={link.href} href={link.href} className={navLinkClass}>
                                    {link.label}
                                </Link>
                            ))}

                            <div className="ml-2 pl-3 border-l border-[var(--color-primary)]/40">
                                <Link href="/#doacoes" className="btn-primary text-sm shadow-md hover:shadow-lg">
                                    Contribuir
                                </Link>
                            </div>
                        </nav>

                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2.5 rounded-[10px] transition-colors text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10"
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
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMobile}
                            className="fixed inset-0 bg-[var(--color-accent)]/40 backdrop-blur-sm z-[60] lg:hidden"
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                            className="fixed top-0 right-0 bottom-0 w-[min(20rem,88vw)] bg-white z-[70] lg:hidden shadow-2xl safe-top safe-bottom flex flex-col"
                        >
                            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-primary)]/25">
                                <span className="font-bold text-[var(--color-accent)]">Menu</span>
                                <button
                                    onClick={closeMobile}
                                    className="p-2 rounded-[10px] text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10"
                                    aria-label="Fechar menu"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Menu mobile">
                                {/* Sobre — acordeão */}
                                <div className="rounded-[10px] overflow-hidden border border-[var(--color-primary)]/20">
                                    <button
                                        type="button"
                                        onClick={() => setMobileSobreOpen((v) => !v)}
                                        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-[var(--color-accent)] font-semibold bg-[var(--color-background)]/60 hover:bg-[var(--color-primary)]/15 transition-colors"
                                        aria-expanded={mobileSobreOpen}
                                    >
                                        <span className="flex items-center gap-3">
                                            <Users className="w-5 h-5 text-[var(--color-accent-light)]" />
                                            Sobre
                                        </span>
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${mobileSobreOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {mobileSobreOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden bg-white"
                                            >
                                                {sobreLinks.map((link) => (
                                                    <Link
                                                        key={link.href}
                                                        href={link.href}
                                                        onClick={closeMobile}
                                                        className="flex items-center gap-3 px-4 py-3 pl-12 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-primary)]/10 transition-colors border-t border-[var(--color-primary)]/10"
                                                    >
                                                        {link.label}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Conhecimento — acordeão */}
                                <div className="rounded-[10px] overflow-hidden border border-[var(--color-primary)]/20">
                                    <button
                                        type="button"
                                        onClick={() => setMobileKnowledgeOpen((v) => !v)}
                                        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-[var(--color-accent)] font-semibold bg-[var(--color-background)]/60 hover:bg-[var(--color-primary)]/15 transition-colors"
                                        aria-expanded={mobileKnowledgeOpen}
                                    >
                                        <span className="flex items-center gap-3">
                                            <BookOpen className="w-5 h-5 text-[var(--color-accent-light)]" />
                                            Conhecimento
                                        </span>
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${mobileKnowledgeOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {mobileKnowledgeOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden bg-white"
                                            >
                                                {knowledgeLinks.map((link) => (
                                                    <Link
                                                        key={link.href}
                                                        href={link.href}
                                                        onClick={closeMobile}
                                                        className="flex items-center gap-3 px-4 py-3 pl-12 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-primary)]/10 transition-colors border-t border-[var(--color-primary)]/10"
                                                    >
                                                        {link.label}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Agenda e Contato */}
                                {anchorLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={closeMobile}
                                        className="flex items-center gap-3 px-4 py-3.5 rounded-[10px] font-semibold text-[var(--color-accent)] border border-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/15 transition-colors"
                                    >
                                        <link.icon className="w-5 h-5 text-[var(--color-accent-light)]" />
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="p-4 border-t border-[var(--color-primary)]/25">
                                <Link
                                    href="/#doacoes"
                                    onClick={closeMobile}
                                    className="btn-primary w-full justify-center"
                                >
                                    Contribuir
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
