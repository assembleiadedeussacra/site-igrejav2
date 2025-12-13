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
import { uploadImage, generateBannerImagePath, getFileExtension } from '@/lib/supabase/storage';
import toast from 'react-hot-toast';
import { Upload, X as XIcon } from 'lucide-react';

export default function AdminBannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);

    // File states
    const [desktopFile, setDesktopFile] = useState<File | null>(null);
    const [mobileFile, setMobileFile] = useState<File | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [desktopPreview, setDesktopPreview] = useState<string>('');
    const [mobilePreview, setMobilePreview] = useState<string>('');
    const [logoPreview, setLogoPreview] = useState<string>('');

    // Form state
    const [formData, setFormData] = useState({
        image_desktop_url: '',
        image_mobile_url: '',
        logo_url: '',
        title: '',
        description: '',
        button1_text: '',
        button1_link: '',
        button1_bg_color: '#ffffff',
        button1_text_color: '#1a1a1a',
        button1_hover_bg_color: '#f0f0f0',
        button1_hover_text_color: '#1a1a1a',
        button1_size: 'md' as 'sm' | 'md' | 'lg',
        button1_style: 'solid' as 'solid' | 'outline' | 'ghost',
        button1_open_new_tab: false,
        button1_border_radius: 10,
        button2_text: '',
        button2_link: '',
        button2_bg_color: 'rgba(255, 255, 255, 0.1)',
        button2_text_color: '#ffffff',
        button2_hover_bg_color: 'rgba(255, 255, 255, 0.2)',
        button2_hover_text_color: '#ffffff',
        button2_size: 'md' as 'sm' | 'md' | 'lg',
        button2_style: 'outline' as 'solid' | 'outline' | 'ghost',
        button2_open_new_tab: false,
        button2_border_radius: 10,
        buttons_global_style: 'individual' as 'individual' | 'unified',
        overlay_opacity: 50,
        overlay_color: '#232d82',
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
            toast.error('Erro ao carregar banners. Tente novamente.');
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
                logo_url: banner.logo_url || '',
                title: banner.title || '',
                description: banner.description || '',
                button1_text: banner.button1_text || '',
                button1_link: banner.button1_link || '',
                button1_bg_color: banner.button1_bg_color || '#ffffff',
                button1_text_color: banner.button1_text_color || '#1a1a1a',
                button1_hover_bg_color: banner.button1_hover_bg_color || '#f0f0f0',
                button1_hover_text_color: banner.button1_hover_text_color || '#1a1a1a',
                button1_size: (banner.button1_size as 'sm' | 'md' | 'lg') || 'md',
                button1_style: (banner.button1_style as 'solid' | 'outline' | 'ghost') || 'solid',
                button1_open_new_tab: banner.button1_open_new_tab || false,
                button1_border_radius: banner.button1_border_radius || 10,
                button2_text: banner.button2_text || '',
                button2_link: banner.button2_link || '',
                button2_bg_color: banner.button2_bg_color || 'rgba(255, 255, 255, 0.1)',
                button2_text_color: banner.button2_text_color || '#ffffff',
                button2_hover_bg_color: banner.button2_hover_bg_color || 'rgba(255, 255, 255, 0.2)',
                button2_hover_text_color: banner.button2_hover_text_color || '#ffffff',
                button2_size: (banner.button2_size as 'sm' | 'md' | 'lg') || 'md',
                button2_style: (banner.button2_style as 'solid' | 'outline' | 'ghost') || 'outline',
                button2_open_new_tab: banner.button2_open_new_tab || false,
                button2_border_radius: banner.button2_border_radius || 10,
                buttons_global_style: (banner.buttons_global_style as 'individual' | 'unified') || 'individual',
                overlay_opacity: banner.overlay_opacity || 50,
                overlay_color: banner.overlay_color || '#232d82',
                link: banner.link || '',
                alt_text: banner.alt_text,
                active: banner.active,
            });
            setDesktopPreview(banner.image_desktop_url);
            setMobilePreview(banner.image_mobile_url);
            setLogoPreview(banner.logo_url || '');
        } else {
            setEditingBanner(null);
            setFormData({
                image_desktop_url: '',
                image_mobile_url: '',
                logo_url: '',
                title: '',
                description: '',
                button1_text: '',
                button1_link: '',
                button1_bg_color: '#ffffff',
                button1_text_color: '#1a1a1a',
                button1_hover_bg_color: '#f0f0f0',
                button1_hover_text_color: '#1a1a1a',
                button1_size: 'md',
                button1_style: 'solid',
                button1_open_new_tab: false,
                button1_border_radius: 10,
                button2_text: '',
                button2_link: '',
                button2_bg_color: 'rgba(255, 255, 255, 0.1)',
                button2_text_color: '#ffffff',
                button2_hover_bg_color: 'rgba(255, 255, 255, 0.2)',
                button2_hover_text_color: '#ffffff',
                button2_size: 'md',
                button2_style: 'outline',
                button2_open_new_tab: false,
                button2_border_radius: 10,
                buttons_global_style: 'individual',
                overlay_opacity: 50,
                overlay_color: '#232d82',
                link: '',
                alt_text: '',
                active: true,
            });
            setDesktopPreview('');
            setMobilePreview('');
            setLogoPreview('');
        }
        setDesktopFile(null);
        setMobileFile(null);
        setLogoFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBanner(null);
        setDesktopFile(null);
        setMobileFile(null);
        setLogoFile(null);
        setDesktopPreview('');
        setMobilePreview('');
        setLogoPreview('');
    };

    const handleFileChange = (
        file: File | null,
        type: 'desktop' | 'mobile' | 'logo',
        setFile: (file: File | null) => void,
        setPreview: (url: string) => void
    ) => {
        if (!file) return;

        setFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleImageUpload = async (file: File, type: 'desktop' | 'mobile' | 'logo', bannerId: string): Promise<string> => {
        setUploading(type);
        try {
            const extension = getFileExtension(file.name);
            const path = generateBannerImagePath(bannerId, type, extension);
            const url = await uploadImage(file, path);
            setUploading(null);
            return url;
        } catch (error: any) {
            setUploading(null);
            // Re-throw com mensagem melhorada
            const errorMessage = error?.message || 'Erro ao fazer upload da imagem';
            if (errorMessage.includes('Bucket') && errorMessage.includes('não encontrado')) {
                toast.error(
                    `Erro: ${errorMessage}. Execute o script 'create_bucket_banners.sql' no Supabase Dashboard.`,
                    { duration: 6000 }
                );
            } else {
                toast.error(`Erro ao fazer upload: ${errorMessage}`);
            }
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate that at least one image is provided
        if (!desktopFile && !formData.image_desktop_url && !mobileFile && !formData.image_mobile_url) {
            toast.error('Por favor, envie pelo menos uma imagem (desktop ou mobile).');
            return;
        }

        setIsSaving(true);

        try {
            const bannerId = editingBanner?.id || `new-${Date.now()}`;
            let imageDesktopUrl = formData.image_desktop_url;
            let imageMobileUrl = formData.image_mobile_url;
            let logoUrl = formData.logo_url;

            // Upload new files if selected
            if (desktopFile) {
                imageDesktopUrl = await handleImageUpload(desktopFile, 'desktop', bannerId);
            }
            if (mobileFile) {
                imageMobileUrl = await handleImageUpload(mobileFile, 'mobile', bannerId);
            }
            if (logoFile) {
                logoUrl = await handleImageUpload(logoFile, 'logo', bannerId);
            }

            // Ensure at least one image URL is set
            if (!imageDesktopUrl && !imageMobileUrl) {
                throw new Error('É necessário ter pelo menos uma imagem (desktop ou mobile).');
            }

            const bannerData: any = {
                image_desktop_url: imageDesktopUrl,
                image_mobile_url: imageMobileUrl,
                logo_url: logoUrl || null,
                title: formData.title || null,
                description: formData.description || null,
                button1_text: formData.button1_text || null,
                button1_link: formData.button1_link || null,
                button1_bg_color: formData.button1_bg_color || null,
                button1_text_color: formData.button1_text_color || null,
                button1_hover_bg_color: formData.button1_hover_bg_color || null,
                button1_hover_text_color: formData.button1_hover_text_color || null,
                button1_size: formData.button1_size || null,
                button1_style: formData.button1_style || null,
                button1_open_new_tab: formData.button1_open_new_tab || null,
                button1_border_radius: formData.button1_border_radius || null,
                button2_text: formData.button2_text || null,
                button2_link: formData.button2_link || null,
                button2_bg_color: formData.button2_bg_color || null,
                button2_text_color: formData.button2_text_color || null,
                button2_hover_bg_color: formData.button2_hover_bg_color || null,
                button2_hover_text_color: formData.button2_hover_text_color || null,
                button2_size: formData.button2_size || null,
                button2_style: formData.button2_style || null,
                button2_open_new_tab: formData.button2_open_new_tab || null,
                button2_border_radius: formData.button2_border_radius || null,
                buttons_global_style: formData.buttons_global_style || null,
                overlay_opacity: formData.overlay_opacity || null,
                overlay_color: formData.overlay_color || null,
                link: formData.link || null,
                alt_text: formData.alt_text,
                active: formData.active,
            };

            let savedBannerId = editingBanner?.id;
            if (editingBanner) {
                await api.updateBanner(editingBanner.id, bannerData);
            } else {
                const newBanner = await api.createBanner({
                    ...bannerData,
                    position: banners.length + 1,
                });
                savedBannerId = newBanner.id;
            }

            // If we uploaded files with a temporary ID, we might need to re-upload with the real ID
            // For now, we'll keep the uploaded URLs as they are

            await loadBanners();
            toast.success(editingBanner ? 'Banner atualizado com sucesso!' : 'Banner criado com sucesso!');
            closeModal();
        } catch (error: any) {
            console.error('Error saving banner:', error);
            
            // Extrair mensagem de erro de diferentes formatos
            let errorMessage = 'Erro desconhecido ao salvar banner';
            
            if (error) {
                if (typeof error === 'string') {
                    errorMessage = error;
                } else if (error?.message) {
                    errorMessage = error.message;
                } else if (error?.details) {
                    errorMessage = error.details;
                } else if (error?.error?.message) {
                    errorMessage = error.error.message;
                } else if (typeof error === 'object') {
                    // Tentar extrair informações úteis do objeto
                    const errorStr = JSON.stringify(error);
                    if (errorStr !== '{}') {
                        errorMessage = errorStr;
                    } else {
                        errorMessage = 'Erro ao salvar banner. Verifique os dados e tente novamente.';
                    }
                } else {
                    errorMessage = String(error);
                }
            }
            
            // Mensagem mais específica para erro de bucket
            if (errorMessage.includes('Bucket') && errorMessage.includes('não encontrado')) {
                toast.error(
                    `Erro: ${errorMessage}. Execute o script 'create_bucket_banners.sql' no Supabase Dashboard.`,
                    { duration: 6000 }
                );
            } else if (errorMessage.includes('duplicate key') || errorMessage.includes('unique constraint')) {
                toast.error('Erro: Já existe um banner com essas informações. Verifique os dados e tente novamente.');
            } else if (errorMessage.includes('null value') || errorMessage.includes('violates not-null')) {
                toast.error('Erro: Algum campo obrigatório está faltando. Verifique todos os campos e tente novamente.');
            } else {
                toast.error(`Erro ao salvar banner: ${errorMessage}`);
            }
        } finally {
            setIsSaving(false);
            setUploading(null);
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
        if (!confirm('Tem certeza que deseja excluir este banner? Esta ação não pode ser desfeita.')) return;

        try {
            setBanners((prev) => prev.filter((b) => b.id !== id)); // Optimistic
            await api.deleteBanner(id);
            toast.success('Banner excluído com sucesso!');
        } catch (error) {
            console.error('Error deleting banner:', error);
            toast.error('Erro ao excluir banner.');
            loadBanners();
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-[28px] font-bold text-[var(--color-accent)]">
                        Gerenciar Banners
                    </h1>
                    <p className="text-[var(--color-text-secondary)]">
                        Gerencie os banners do slider principal da página inicial
                    </p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)] transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Novo Banner
                </button>
            </div>

            {/* Banners List */}
            <div className="bg-white rounded-[10px] shadow-lg overflow-hidden">
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
                                <span className="w-8 h-8 rounded-[10px] bg-[var(--color-accent)] text-white flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                </span>

                                {/* Thumbnail */}
                                <div className="relative w-32 h-20 rounded-[10px] overflow-hidden bg-gray-100 flex-shrink-0">
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
                                        className={`p-2 rounded-[10px] transition-colors ${banner.active
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
                                        className="p-2 rounded-[10px] text-blue-600 hover:bg-blue-50 transition-colors"
                                        title="Editar"
                                    >
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => deleteBanner(banner.id)}
                                        className="p-2 rounded-[10px] text-red-600 hover:bg-red-50 transition-colors"
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
                            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full bg-white rounded-[10px] shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                                <h2 className="text-xl md:text-[24px] font-bold text-[var(--color-accent)]">
                                    {editingBanner ? 'Editar Banner' : 'Novo Banner'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-[10px] hover:bg-gray-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1">
                                {/* Desktop Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                                        Imagem Desktop *
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                handleFileChange(file, 'desktop', setDesktopFile, setDesktopPreview);
                                            }}
                                            className="w-full px-4 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none"
                                        />
                                        {desktopPreview && (
                                            <div className="relative w-full h-32 rounded-[10px] overflow-hidden border border-gray-200">
                                                <Image
                                                    src={desktopPreview}
                                                    alt="Preview desktop"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setDesktopFile(null);
                                                        setDesktopPreview(formData.image_desktop_url);
                                                    }}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                >
                                                    <XIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        {uploading === 'desktop' && (
                                            <p className="text-sm text-blue-600">Enviando imagem...</p>
                                        )}
                                    </div>
                                </div>

                                {/* Mobile Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                                        Imagem Mobile *
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                handleFileChange(file, 'mobile', setMobileFile, setMobilePreview);
                                            }}
                                            className="w-full px-4 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none"
                                        />
                                        {mobilePreview && (
                                            <div className="relative w-full h-32 rounded-[10px] overflow-hidden border border-gray-200">
                                                <Image
                                                    src={mobilePreview}
                                                    alt="Preview mobile"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setMobileFile(null);
                                                        setMobilePreview(formData.image_mobile_url);
                                                    }}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                >
                                                    <XIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        {uploading === 'mobile' && (
                                            <p className="text-sm text-blue-600">Enviando imagem...</p>
                                        )}
                                    </div>
                                </div>

                                {/* Logo Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                                        Logo (opcional)
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                handleFileChange(file, 'logo', setLogoFile, setLogoPreview);
                                            }}
                                            className="w-full px-4 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none"
                                        />
                                        {logoPreview && (
                                            <div className="relative w-24 h-24 rounded-[10px] overflow-hidden border border-gray-200">
                                                <Image
                                                    src={logoPreview}
                                                    alt="Preview logo"
                                                    fill
                                                    className="object-contain"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setLogoFile(null);
                                                        setLogoPreview(formData.logo_url || '');
                                                    }}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                >
                                                    <XIcon className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                        {uploading === 'logo' && (
                                            <p className="text-sm text-blue-600">Enviando logo...</p>
                                        )}
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                                        Título (opcional)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData((p) => ({ ...p, title: e.target.value }))
                                        }
                                        className="w-full px-4 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none"
                                        placeholder="Título do banner"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                                        Descrição (opcional)
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData((p) => ({ ...p, description: e.target.value }))
                                        }
                                        rows={3}
                                        className="w-full px-4 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none resize-none"
                                        placeholder="Descrição do banner"
                                    />
                                </div>

                                {/* Overlay Opacity Control */}
                                <div className="p-4 bg-purple-50 rounded-[10px] border border-purple-200 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                            Cor do Overlay
                                        </label>
                                        <input
                                            type="color"
                                            value={formData.overlay_color}
                                            onChange={(e) => setFormData((p) => ({ ...p, overlay_color: e.target.value }))}
                                            className="w-full h-12 rounded-[10px] border border-gray-200 cursor-pointer"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Escolha a cor do overlay que será aplicado sobre a imagem do banner.
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                            Escuridão do Fundo (Overlay)
                                        </label>
                                        <div className="space-y-2">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={formData.overlay_opacity}
                                                onChange={(e) => setFormData((p) => ({ ...p, overlay_opacity: parseInt(e.target.value) || 50 }))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
                                            />
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-600">Transparente (0%)</span>
                                                <span className="text-sm font-semibold text-[var(--color-accent)]">
                                                    {formData.overlay_opacity}%
                                                </span>
                                                <span className="text-xs text-gray-600">Muito Escuro (100%)</span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Controla o quanto escuro fica o overlay sobre a imagem do banner para melhorar a legibilidade do texto.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Global Button Style */}
                                {(formData.button1_text || formData.button2_text) && (
                                    <div className="p-4 bg-blue-50 rounded-[10px] border border-blue-200">
                                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                            Estilo Global dos Botões
                                        </label>
                                        <select
                                            value={formData.buttons_global_style}
                                            onChange={(e) => setFormData((p) => ({ ...p, buttons_global_style: e.target.value as 'individual' | 'unified' }))}
                                            className="w-full px-4 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none"
                                        >
                                            <option value="individual">Individual (cada botão com seu próprio estilo)</option>
                                            <option value="unified">Unificado (todos os botões com o mesmo estilo do botão 1)</option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formData.buttons_global_style === 'unified' 
                                                ? 'Quando unificado, o botão 2 usará as mesmas configurações do botão 1'
                                                : 'Cada botão pode ter suas próprias configurações de cor, tamanho e estilo'}
                                        </p>
                                    </div>
                                )}

                                {/* Button 1 */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                                        Botão 1 (opcional)
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            value={formData.button1_text}
                                            onChange={(e) =>
                                                setFormData((p) => ({ ...p, button1_text: e.target.value }))
                                            }
                                            className="px-4 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none"
                                            placeholder="Texto do botão"
                                        />
                                        <input
                                            type="url"
                                            value={formData.button1_link}
                                            onChange={(e) =>
                                                setFormData((p) => ({ ...p, button1_link: e.target.value }))
                                            }
                                            className="px-4 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none"
                                            placeholder="Link do botão"
                                        />
                                    </div>
                                    
                                    {/* Button 1 Style Options */}
                                    {(formData.button1_text || formData.button1_link) && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-[10px] space-y-3">
                                            <h4 className="text-sm font-semibold text-gray-700">Personalização do Botão 1</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Cor de Fundo</label>
                                                    <input
                                                        type="color"
                                                        value={formData.button1_bg_color}
                                                        onChange={(e) => setFormData((p) => ({ ...p, button1_bg_color: e.target.value }))}
                                                        className="w-full h-10 rounded-[10px] border border-gray-200"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Cor do Texto</label>
                                                    <input
                                                        type="color"
                                                        value={formData.button1_text_color}
                                                        onChange={(e) => setFormData((p) => ({ ...p, button1_text_color: e.target.value }))}
                                                        className="w-full h-10 rounded-[10px] border border-gray-200"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Hover - Fundo</label>
                                                    <input
                                                        type="color"
                                                        value={formData.button1_hover_bg_color}
                                                        onChange={(e) => setFormData((p) => ({ ...p, button1_hover_bg_color: e.target.value }))}
                                                        className="w-full h-10 rounded-[10px] border border-gray-200"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Hover - Texto</label>
                                                    <input
                                                        type="color"
                                                        value={formData.button1_hover_text_color}
                                                        onChange={(e) => setFormData((p) => ({ ...p, button1_hover_text_color: e.target.value }))}
                                                        className="w-full h-10 rounded-[10px] border border-gray-200"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Tamanho</label>
                                                    <select
                                                        value={formData.button1_size}
                                                        onChange={(e) => setFormData((p) => ({ ...p, button1_size: e.target.value as 'sm' | 'md' | 'lg' }))}
                                                        className="w-full px-3 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] outline-none text-sm"
                                                    >
                                                        <option value="sm">Pequeno</option>
                                                        <option value="md">Médio</option>
                                                        <option value="lg">Grande</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Estilo</label>
                                                    <select
                                                        value={formData.button1_style}
                                                        onChange={(e) => setFormData((p) => ({ ...p, button1_style: e.target.value as 'solid' | 'outline' | 'ghost' }))}
                                                        className="w-full px-3 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] outline-none text-sm"
                                                    >
                                                        <option value="solid">Sólido</option>
                                                        <option value="outline">Contorno</option>
                                                        <option value="ghost">Transparente</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Border Radius (px)</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="50"
                                                        value={formData.button1_border_radius}
                                                        onChange={(e) => setFormData((p) => ({ ...p, button1_border_radius: parseInt(e.target.value) || 10 }))}
                                                        className="w-full px-3 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] outline-none text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.button1_open_new_tab}
                                                            onChange={(e) => setFormData((p) => ({ ...p, button1_open_new_tab: e.target.checked }))}
                                                            className="rounded border-gray-300"
                                                        />
                                                        Abrir em nova aba
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Button 2 */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                                        Botão 2 (opcional)
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            value={formData.button2_text}
                                            onChange={(e) =>
                                                setFormData((p) => ({ ...p, button2_text: e.target.value }))
                                            }
                                            className="px-4 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none"
                                            placeholder="Texto do botão"
                                        />
                                        <input
                                            type="url"
                                            value={formData.button2_link}
                                            onChange={(e) =>
                                                setFormData((p) => ({ ...p, button2_link: e.target.value }))
                                            }
                                            className="px-4 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none"
                                            placeholder="Link do botão"
                                        />
                                    </div>
                                    
                                    {/* Button 2 Style Options */}
                                    {(formData.button2_text || formData.button2_link) && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-[10px] space-y-3">
                                            <h4 className="text-sm font-semibold text-gray-700">Personalização do Botão 2</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Cor de Fundo</label>
                                                    <input
                                                        type="color"
                                                        value={formData.button2_bg_color}
                                                        onChange={(e) => setFormData((p) => ({ ...p, button2_bg_color: e.target.value }))}
                                                        disabled={formData.buttons_global_style === 'unified'}
                                                        className="w-full h-10 rounded-[10px] border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Cor do Texto</label>
                                                    <input
                                                        type="color"
                                                        value={formData.button2_text_color}
                                                        onChange={(e) => setFormData((p) => ({ ...p, button2_text_color: e.target.value }))}
                                                        disabled={formData.buttons_global_style === 'unified'}
                                                        className="w-full h-10 rounded-[10px] border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Hover - Fundo</label>
                                                    <input
                                                        type="color"
                                                        value={formData.button2_hover_bg_color}
                                                        onChange={(e) => setFormData((p) => ({ ...p, button2_hover_bg_color: e.target.value }))}
                                                        disabled={formData.buttons_global_style === 'unified'}
                                                        className="w-full h-10 rounded-[10px] border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Hover - Texto</label>
                                                    <input
                                                        type="color"
                                                        value={formData.button2_hover_text_color}
                                                        onChange={(e) => setFormData((p) => ({ ...p, button2_hover_text_color: e.target.value }))}
                                                        disabled={formData.buttons_global_style === 'unified'}
                                                        className="w-full h-10 rounded-[10px] border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Tamanho</label>
                                                    <select
                                                        value={formData.button2_size}
                                                        onChange={(e) => setFormData((p) => ({ ...p, button2_size: e.target.value as 'sm' | 'md' | 'lg' }))}
                                                        disabled={formData.buttons_global_style === 'unified'}
                                                        className="w-full px-3 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <option value="sm">Pequeno</option>
                                                        <option value="md">Médio</option>
                                                        <option value="lg">Grande</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Estilo</label>
                                                    <select
                                                        value={formData.button2_style}
                                                        onChange={(e) => setFormData((p) => ({ ...p, button2_style: e.target.value as 'solid' | 'outline' | 'ghost' }))}
                                                        disabled={formData.buttons_global_style === 'unified'}
                                                        className="w-full px-3 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <option value="solid">Sólido</option>
                                                        <option value="outline">Contorno</option>
                                                        <option value="ghost">Transparente</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Border Radius (px)</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="50"
                                                        value={formData.button2_border_radius}
                                                        onChange={(e) => setFormData((p) => ({ ...p, button2_border_radius: parseInt(e.target.value) || 10 }))}
                                                        className="w-full px-3 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] outline-none text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.button2_open_new_tab}
                                                            onChange={(e) => setFormData((p) => ({ ...p, button2_open_new_tab: e.target.checked }))}
                                                            className="rounded border-gray-300"
                                                        />
                                                        Abrir em nova aba
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
                                        className="w-full px-4 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none"
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
                                        className="w-full px-4 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none"
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
                                <div className="flex gap-3 pt-4 border-t flex-shrink-0">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-[30px] hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving || uploading !== null}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)] transition-colors disabled:opacity-70"
                                    >
                                        {isSaving || uploading !== null ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                {uploading ? 'Enviando...' : 'Salvando...'}
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
