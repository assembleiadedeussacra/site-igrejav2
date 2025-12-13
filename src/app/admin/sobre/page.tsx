'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Save, Loader2, ImageIcon, Upload } from 'lucide-react';
import { api } from '@/services/api';
import { AboutPageCover } from '@/lib/database.types';
import { uploadAboutPageCover } from '@/lib/supabase/storage';
import RichTextEditor from '@/components/admin/RichTextEditor';
import toast from 'react-hot-toast';

export default function AdminSobrePage() {
    const [cover, setCover] = useState<AboutPageCover | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string>('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        church_text_part1: '',
        church_image_url: '',
        church_text_part2: '',
        active: true,
    });
    const [churchImageFile, setChurchImageFile] = useState<File | null>(null);
    const [churchImagePreview, setChurchImagePreview] = useState<string>('');

    const loadCover = async () => {
        setIsLoading(true);
        try {
            const data = await api.getAdminAboutPageCover();
            if (data) {
                setCover(data);
                setFormData({
                    title: data.title,
                    description: data.description,
                    image_url: data.image_url,
                    church_text_part1: data.church_text_part1 || '',
                    church_image_url: data.church_image_url || '',
                    church_text_part2: data.church_text_part2 || '',
                    active: data.active,
                });
                setCoverPreview(data.image_url);
                setChurchImagePreview(data.church_image_url || '');
            }
        } catch (error) {
            console.error('Error loading cover:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCover();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Por favor, selecione um arquivo de imagem válido.');
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('O arquivo deve ter no máximo 5MB.');
            return;
        }

        setCoverFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setCoverPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleChurchImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Por favor, selecione um arquivo de imagem válido.');
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('O arquivo deve ter no máximo 5MB.');
            return;
        }

        setChurchImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setChurchImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setIsUploading(false);

        try {
            let imageUrl = formData.image_url;
            let churchImageUrl = formData.church_image_url;

            // Upload new cover image if file was selected
            if (coverFile) {
                setIsUploading(true);
                try {
                    imageUrl = await uploadAboutPageCover(coverFile);
                } catch (error: any) {
                    toast.error(`Erro ao fazer upload da imagem de capa: ${error.message}`);
                    setIsSaving(false);
                    setIsUploading(false);
                    return;
                } finally {
                    setIsUploading(false);
                }
            }

            // Upload new church image if file was selected
            if (churchImageFile) {
                setIsUploading(true);
                try {
                    churchImageUrl = await uploadAboutPageCover(churchImageFile);
                } catch (error: any) {
                    toast.error(`Erro ao fazer upload da imagem da igreja: ${error.message}`);
                    setIsSaving(false);
                    setIsUploading(false);
                    return;
                } finally {
                    setIsUploading(false);
                }
            }

            const coverData = {
                title: formData.title,
                description: formData.description,
                image_url: imageUrl,
                church_text_part1: formData.church_text_part1 || null,
                church_image_url: churchImageUrl || null,
                church_text_part2: formData.church_text_part2 || null,
                active: formData.active,
            };

            if (cover) {
                await api.updateAboutPageCover(cover.id, coverData);
                toast.success('Cover atualizado com sucesso!');
            } else {
                await api.createAboutPageCover(coverData);
                toast.success('Cover criado com sucesso!');
            }

            await loadCover();
            setCoverFile(null);
            setChurchImageFile(null);
        } catch (error: any) {
            console.error('Error saving cover:', error);
            toast.error(`Erro ao salvar cover: ${error.message || 'Verifique os dados e tente novamente.'}`);
        } finally {
            setIsSaving(false);
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-[28px] font-bold text-[var(--color-text)]">
                        Cover da Página Sobre
                    </h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">
                        Configure a imagem, título e descrição exibidos no topo da página Sobre
                    </p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[10px] shadow-sm border border-gray-200 p-6"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                            Imagem de Capa
                        </label>
                        <div className="flex items-center gap-4">
                            {coverPreview && (
                                <div className="relative w-48 h-32 rounded-[10px] overflow-hidden border border-gray-200">
                                    <Image
                                        src={coverPreview}
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
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                            Título
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                            placeholder="Ex: Sobre Nossa Igreja"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                            Descrição
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent min-h-[100px]"
                            placeholder="Breve descrição sobre a igreja..."
                            required
                        />
                    </div>

                    {/* Church Content Section */}
                    <div className="border-t border-gray-200 pt-6 space-y-6">
                        <h3 className="text-lg font-semibold text-[var(--color-text)]">
                            Conteúdo Sobre a Igreja
                        </h3>

                        {/* Church Text Part 1 */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Texto Sobre a Igreja (Parte 1)
                            </label>
                            <div className="border border-gray-300 rounded-[10px] overflow-hidden">
                                <RichTextEditor
                                    content={formData.church_text_part1}
                                    onChange={(content) => setFormData((p) => ({ ...p, church_text_part1: content }))}
                                />
                            </div>
                        </div>

                        {/* Church Image */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Imagem da Igreja
                            </label>
                            <div className="flex items-center gap-4">
                                {churchImagePreview && (
                                    <div className="relative w-48 h-32 rounded-[10px] overflow-hidden border border-gray-200">
                                        <Image
                                            src={churchImagePreview}
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
                                            onChange={handleChurchImageUpload}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Church Text Part 2 */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                Texto Sobre a Igreja (Parte 2 - Continuação)
                            </label>
                            <div className="border border-gray-300 rounded-[10px] overflow-hidden">
                                <RichTextEditor
                                    content={formData.church_text_part2}
                                    onChange={(content) => setFormData((p) => ({ ...p, church_text_part2: content }))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="active"
                            checked={formData.active}
                            onChange={(e) => setFormData((p) => ({ ...p, active: e.target.checked }))}
                            className="w-4 h-4 text-[var(--color-primary)] rounded focus:ring-[var(--color-primary)]"
                        />
                        <label htmlFor="active" className="text-sm text-[var(--color-text)]">
                            Ativo (exibir no site)
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving || isUploading}
                            className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-[10px] hover:bg-[var(--color-accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSaving || isUploading ? (
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
                </form>
            </motion.div>
        </div>
    );
}

