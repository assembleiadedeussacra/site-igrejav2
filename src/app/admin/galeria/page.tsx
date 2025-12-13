'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, Loader2, Images, ExternalLink, GripVertical, Upload } from 'lucide-react';
import { api } from '@/services/api';
import { GalleryLink } from '@/lib/database.types';
import { uploadGalleryCover } from '@/lib/supabase/storage';
import toast from 'react-hot-toast';

export default function AdminGaleriaPage() {
    const [links, setLinks] = useState<GalleryLink[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<GalleryLink | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string>('');
    const [formData, setFormData] = useState({ title: '', drive_link: '', cover_image_url: '' });

    const loadLinks = async () => {
        setIsLoading(true);
        try {
            const data = await api.getAdminGalleryLinks();
            setLinks(data);
        } catch (error) {
            console.error('Error loading gallery links:', error);
            toast.error('Erro ao carregar álbuns. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadLinks();
    }, []);

    const openModal = (link?: GalleryLink) => {
        if (link) {
            setEditingLink(link);
            setFormData({
                title: link.title,
                drive_link: link.drive_link,
                cover_image_url: link.cover_image_url,
            });
            setCoverPreview(link.cover_image_url);
        } else {
            setEditingLink(null);
            setFormData({ title: '', drive_link: '', cover_image_url: '' });
            setCoverPreview('');
        }
        setCoverFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingLink(null);
        setCoverFile(null);
        setCoverPreview('');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Por favor, selecione um arquivo de imagem.');
            return;
        }

        // Validar tamanho do arquivo (5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            let coverImageUrl = formData.cover_image_url;

            // Upload cover image if a new file was selected
            if (coverFile) {
                setIsUploading(true);
                const albumId = editingLink?.id || 'new';
                coverImageUrl = await uploadGalleryCover(coverFile, albumId);
                setIsUploading(false);
            }

            if (editingLink) {
                await api.updateGalleryLink(editingLink.id, {
                    title: formData.title,
                    drive_link: formData.drive_link,
                    cover_image_url: coverImageUrl,
                });
            } else {
                await api.createGalleryLink({
                    title: formData.title,
                    drive_link: formData.drive_link,
                    cover_image_url: coverImageUrl,
                    order: links.length + 1,
                    active: true,
                });
            }

            await loadLinks();
            toast.success(editingLink ? 'Álbum atualizado com sucesso!' : 'Álbum criado com sucesso!');
            closeModal();
        } catch (error) {
            console.error('Error saving gallery link:', error);
            toast.error('Erro ao salvar álbum. Verifique os dados e tente novamente.');
            setIsUploading(false);
        } finally {
            setIsSaving(false);
        }
    };

    const deleteLink = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este álbum? Esta ação não pode ser desfeita.')) return;

        try {
            setLinks((prev) => prev.filter((l) => l.id !== id)); // Optimistic
            await api.deleteGalleryLink(id);
            toast.success('Álbum excluído com sucesso!');
        } catch (error) {
            console.error('Error deleting gallery link:', error);
            toast.error('Erro ao excluir álbum.');
            loadLinks();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div><h1 className="text-2xl md:text-[28px] font-bold text-[var(--color-accent)]">Galeria de Fotos</h1><p className="text-[var(--color-text-secondary)] text-sm">Gerencie os links para álbuns no Google Drive</p></div>
                <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)]"><Plus className="w-5 h-5" /> Novo Álbum</button>
            </div>

            <div className="bg-white rounded-[10px] shadow-lg overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="w-8 h-8 mx-auto animate-spin text-[var(--color-accent)]" />
                    </div>
                ) : links.length === 0 ? (
                    <div className="p-12 text-center"><Images className="w-16 h-16 mx-auto mb-4 text-gray-300" /><p className="text-[var(--color-text-secondary)]">Nenhum álbum cadastrado</p></div>
                ) : (
                    <div className="divide-y">
                        {links.map((link, index) => (
                            <motion.div key={link.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                                <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                                <div className="relative w-24 h-16 rounded-[10px] overflow-hidden bg-gray-100 flex-shrink-0"><Image src={link.cover_image_url} alt={link.title} fill className="object-cover" /></div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-[var(--color-accent)]">{link.title}</h3>
                                    <a href={link.drive_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">Ver no Drive <ExternalLink className="w-3 h-3" /></a>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openModal(link)} className="p-2 rounded-[10px] text-blue-600 hover:bg-blue-50" aria-label={`Editar ${link.title}`}><Pencil className="w-5 h-5" /></button>
                                    <button onClick={() => deleteLink(link.id)} className="p-2 rounded-[10px] text-red-600 hover:bg-red-50" aria-label={`Excluir ${link.title}`}><Trash2 className="w-5 h-5" /></button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="fixed inset-0 bg-black/50 z-50" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full bg-white rounded-[10px] shadow-2xl z-50 overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b"><h2 className="text-xl md:text-[24px] font-bold text-[var(--color-accent)]">{editingLink ? 'Editar' : 'Novo'} Álbum</h2><button onClick={closeModal} className="p-2 rounded-[10px] hover:bg-gray-100" aria-label="Fechar modal"><X className="w-5 h-5" /></button></div>
                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div><label className="block text-sm font-medium mb-1">Título *</label><input type="text" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" placeholder="Ex: Cultos" required /></div>
                                <div><label className="block text-sm font-medium mb-1">Link do Google Drive *</label><input type="url" value={formData.drive_link} onChange={(e) => setFormData((p) => ({ ...p, drive_link: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" placeholder="https://drive.google.com/..." required /></div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Imagem de Capa *</label>
                                    <div className="space-y-2">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-[10px] cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden">
                                            {coverPreview ? (
                                                <div className="relative w-full h-full">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                                    <p className="text-sm text-gray-500">Clique para fazer upload</p>
                                                    <p className="text-xs text-gray-400">PNG, JPG até 5MB</p>
                                                </div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                        {isUploading && (
                                            <div className="flex items-center gap-2 text-sm text-[var(--color-accent)]">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Enviando imagem...</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border rounded-[10px] hover:bg-gray-50">Cancelar</button>
                                    <button type="submit" disabled={isSaving || isUploading} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[10px] disabled:opacity-70">{(isSaving || isUploading) ? <><Loader2 className="w-5 h-5 animate-spin" />Salvando...</> : <><Save className="w-5 h-5" />Salvar</>}</button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
