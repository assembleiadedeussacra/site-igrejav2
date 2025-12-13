'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Save, Loader2, Upload } from 'lucide-react';
import { api } from '@/services/api';
import { PageBanner } from '@/lib/database.types';
import { uploadAboutPageCover } from '@/lib/supabase/storage';
import toast from 'react-hot-toast';

export default function AdminBannersPaginasPage() {
    const [estudosBanner, setEstudosBanner] = useState<PageBanner | null>(null);
    const [blogBanner, setBlogBanner] = useState<PageBanner | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState<string | null>(null);
    const [estudosFile, setEstudosFile] = useState<File | null>(null);
    const [blogFile, setBlogFile] = useState<File | null>(null);
    const [estudosPreview, setEstudosPreview] = useState<string>('');
    const [blogPreview, setBlogPreview] = useState<string>('');

    const loadBanners = async () => {
        setIsLoading(true);
        try {
            const [estudos, blog] = await Promise.all([
                api.getAdminPageBanner('estudos'),
                api.getAdminPageBanner('blog'),
            ]);

            if (estudos) {
                setEstudosBanner(estudos);
                setEstudosPreview(estudos.image_url);
            }
            if (blog) {
                setBlogBanner(blog);
                setBlogPreview(blog.image_url);
            }
        } catch (error) {
            console.error('Error loading banners:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadBanners();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'estudos' | 'blog') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Por favor, selecione um arquivo de imagem válido.');
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('O arquivo deve ter no máximo 5MB.');
            return;
        }

        if (type === 'estudos') {
            setEstudosFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setEstudosPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setBlogFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBlogPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (type: 'estudos' | 'blog') => {
        setIsSaving(true);
        setIsUploading(type);

        try {
            const file = type === 'estudos' ? estudosFile : blogFile;
            const currentBanner = type === 'estudos' ? estudosBanner : blogBanner;
            let imageUrl = type === 'estudos' ? estudosPreview : blogPreview;

            if (file) {
                try {
                    imageUrl = await uploadAboutPageCover(file);
                } catch (error: any) {
                    toast.error(`Erro ao fazer upload da imagem: ${error.message}`);
                    setIsSaving(false);
                    setIsUploading(null);
                    return;
                }
            }

            const bannerData = {
                page_type: type,
                image_url: imageUrl,
                active: true,
            };

            if (currentBanner) {
                await api.updatePageBanner(currentBanner.id, bannerData);
                toast.success(`Banner da página ${type === 'estudos' ? 'Estudos' : 'Blog'} atualizado com sucesso!`);
            } else {
                await api.createPageBanner(bannerData);
                toast.success(`Banner da página ${type === 'estudos' ? 'Estudos' : 'Blog'} criado com sucesso!`);
            }

            await loadBanners();
            if (type === 'estudos') {
                setEstudosFile(null);
            } else {
                setBlogFile(null);
            }
        } catch (error: any) {
            console.error('Error saving banner:', error);
            toast.error(`Erro ao salvar banner: ${error.message || 'Verifique os dados e tente novamente.'}`);
        } finally {
            setIsSaving(false);
            setIsUploading(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl md:text-[28px] font-bold text-[var(--color-text)]">
                    Banners das Páginas
                </h1>
                <p className="text-[var(--color-text-secondary)] mt-1">
                    Configure os banners das páginas de Estudos e Blog
                </p>
            </div>

            {/* Estudos Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[10px] shadow-sm border border-gray-200 p-6"
            >
                <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">Banner - Página Estudos</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                            Imagem do Banner
                        </label>
                        <div className="flex items-center gap-4">
                            {estudosPreview && (
                                <div className="relative w-48 h-32 rounded-[10px] overflow-hidden border border-gray-200">
                                    <Image
                                        src={estudosPreview}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-[10px] cursor-pointer hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Clique para upload</span> ou arraste e solte
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            PNG, JPG até 5MB
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'estudos')}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={() => handleSubmit('estudos')}
                            disabled={isSaving && isUploading === 'estudos'}
                            className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-[10px] hover:bg-[var(--color-accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSaving && isUploading === 'estudos' ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {isUploading ? 'Fazendo upload...' : 'Salvando...'}
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Salvar
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Blog Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[10px] shadow-sm border border-gray-200 p-6"
            >
                <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">Banner - Página Blog</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                            Imagem do Banner
                        </label>
                        <div className="flex items-center gap-4">
                            {blogPreview && (
                                <div className="relative w-48 h-32 rounded-[10px] overflow-hidden border border-gray-200">
                                    <Image
                                        src={blogPreview}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-[10px] cursor-pointer hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Clique para upload</span> ou arraste e solte
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            PNG, JPG até 5MB
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'blog')}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={() => handleSubmit('blog')}
                            disabled={isSaving && isUploading === 'blog'}
                            className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-[10px] hover:bg-[var(--color-accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSaving && isUploading === 'blog' ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {isUploading ? 'Fazendo upload...' : 'Salvando...'}
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Salvar
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

