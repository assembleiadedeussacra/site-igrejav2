'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Pencil,
    Trash2,
    GripVertical,
    Eye,
    EyeOff,
    X,
    Save,
    Loader2,
    ImageIcon,
} from 'lucide-react';
import { api } from '@/services/api';
import { Banner } from '@/lib/database.types';

export default function AdminBannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        image_desktop_url: '',
        image_mobile_url: '',
        link: '',
        alt_text: '',
        active: true,
    });

    const loadBanners = async () => {
        setIsLoading(true);
        try {
            const data = await api.getAdminBanners();
            setBanners(data);
        } catch (error) {
            console.error('Error loading banners:', error);
            alert('Erro ao carregar banners. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadBanners();
    }, []);

    const openModal = (banner?: Banner) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                image_desktop_url: banner.image_desktop_url,
                image_mobile_url: banner.image_mobile_url,
                link: banner.link || '',
                alt_text: banner.alt_text,
                active: banner.active,
            });
        } else {
            setEditingBanner(null);
            setFormData({
                image_desktop_url: '',
                image_mobile_url: '',
                link: '',
                alt_text: '',
                active: true,
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBanner(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const bannerData = {
                image_desktop_url: formData.image_desktop_url,
                image_mobile_url: formData.image_mobile_url,
                link: formData.link || null,
                alt_text: formData.alt_text,
                active: formData.active,
            };

            if (editingBanner) {
                await api.updateBanner(editingBanner.id, bannerData);
            } else {
                await api.createBanner({
                    ...bannerData,
                    position: banners.length + 1,
                });
            }

            await loadBanners();
            closeModal();
        } catch (error) {
            console.error('Error saving banner:', error);
            alert('Erro ao salvar banner. Verifique os dados e tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            // Optimistic update
            setBanners((prev) =>
                prev.map((b) => (b.id === id ? { ...b, active: !currentStatus } : b))
            );
            await api.updateBanner(id, { active: !currentStatus });
        } catch (error) {
            console.error('Error updating banner status:', error);
            loadBanners(); // Revert on error
        }
    };

    const deleteBanner = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este banner?')) return;

        try {
            setBanners((prev) => prev.filter((b) => b.id !== id)); // Optimistic
            await api.deleteBanner(id);
        } catch (error) {
            console.error('Error deleting banner:', error);
            alert('Erro ao excluir banner.');
            loadBanners();
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-accent)]">
                        Gerenciar Banners
                    </h1>
                    <p className="text-[var(--color-text-secondary)]">
                        Gerencie os banners do slider principal da página inicial
                    </p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[20px] hover:bg-[var(--color-accent-light)] transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Novo Banner
                </button>
            </div>

            {/* Banners List */}
            <div className="bg-white rounded-[20px] shadow-lg overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="w-8 h-8 mx-auto animate-spin text-[var(--color-accent)]" />
                    </div>
                ) : banners.length === 0 ? (
                    <div className="p-12 text-center">
                        <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-[var(--color-text-secondary)]">
                            Nenhum banner cadastrado
                        </p>
                        <button
                            onClick={() => openModal()}
                            className="mt-4 inline-flex items-center gap-2 text-[var(--color-accent)] font-medium hover:underline"
                        >
                            <Plus className="w-4 h-4" />
                            Adicionar primeiro banner
                        </button>
                    </div>
                ) : (
                    <div className="divide-y">
                        {banners.map((banner, index) => (
                            <motion.div
                                key={banner.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex items-center gap-4 p-4 ${!banner.active ? 'opacity-60 bg-gray-50' : ''
                                    }`}
                            >
                                {/* Drag Handle */}
                                <button className="text-gray-400 cursor-grab hover:text-gray-600">
                                    <GripVertical className="w-5 h-5" />
                                </button>

                                {/* Position */}
                                <span className="w-8 h-8 rounded-[20px] bg-[var(--color-accent)] text-white flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                </span>

                                {/* Thumbnail */}
                                <div className="relative w-32 h-20 rounded-[20px] overflow-hidden bg-gray-100 flex-shrink-0">
                                    <Image
                                        src={banner.image_desktop_url}
                                        alt={banner.alt_text}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-[var(--color-text)] truncate">
                                        {banner.alt_text}
                                    </p>
                                    <p className="text-sm text-[var(--color-text-muted)] truncate">
                                        {banner.link || 'Sem link'}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleActive(banner.id, banner.active)}
                                        className={`p-2 rounded-[20px] transition-colors ${banner.active
                                            ? 'text-green-600 hover:bg-green-50'
                                            : 'text-gray-400 hover:bg-gray-100'
                                            }`}
                                        title={banner.active ? 'Desativar' : 'Ativar'}
                                    >
                                        {banner.active ? (
                                            <Eye className="w-5 h-5" />
                                        ) : (
                                            <EyeOff className="w-5 h-5" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => openModal(banner)}
                                        className="p-2 rounded-[20px] text-blue-600 hover:bg-blue-50 transition-colors"
                                        title="Editar"
                                    >
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => deleteBanner(banner.id)}
                                        className="p-2 rounded-[20px] text-red-600 hover:bg-red-50 transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="fixed inset-0 bg-black/50 z-50"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full bg-white rounded-[20px] shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-4 border-b">
                                <h2 className="text-xl font-bold text-[var(--color-accent)]">
                                    {editingBanner ? 'Editar Banner' : 'Novo Banner'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-[20px] hover:bg-gray-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                {/* Desktop Image URL */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                                        URL da Imagem (Desktop) *
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.image_desktop_url}
                                        onChange={(e) =>
                                            setFormData((p) => ({
                                                ...p,
                                                image_desktop_url: e.target.value,
                                            }))
                                        }
                                        className="w-full px-4 py-2 rounded-[20px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none"
                                        placeholder="https://..."
                                        required
                                    />
                                </div>

                                {/* Mobile Image URL */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                                        URL da Imagem (Mobile) *
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.image_mobile_url}
                                        onChange={(e) =>
                                            setFormData((p) => ({
                                                ...p,
                                                image_mobile_url: e.target.value,
                                            }))
                                        }
                                        className="w-full px-4 py-2 rounded-[20px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none"
                                        placeholder="https://..."
                                        required
                                    />
                                </div>

                                {/* Alt Text */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                                        Texto Alternativo *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.alt_text}
                                        onChange={(e) =>
                                            setFormData((p) => ({ ...p, alt_text: e.target.value }))
                                        }
                                        className="w-full px-4 py-2 rounded-[20px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none"
                                        placeholder="Descrição da imagem"
                                        required
                                    />
                                </div>

                                {/* Link */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                                        Link (opcional)
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.link}
                                        onChange={(e) =>
                                            setFormData((p) => ({ ...p, link: e.target.value }))
                                        }
                                        className="w-full px-4 py-2 rounded-[20px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none"
                                        placeholder="https://..."
                                    />
                                </div>

                                {/* Active */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        checked={formData.active}
                                        onChange={(e) =>
                                            setFormData((p) => ({ ...p, active: e.target.checked }))
                                        }
                                        className="w-5 h-5 rounded border-gray-300 text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                                    />
                                    <label htmlFor="active" className="text-[var(--color-text)]">
                                        Banner ativo
                                    </label>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-[20px] hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[20px] hover:bg-[var(--color-accent-light)] transition-colors disabled:opacity-70"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Salvando...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                Salvar
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
