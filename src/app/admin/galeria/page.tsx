'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, Loader2, Images, ExternalLink, GripVertical } from 'lucide-react';
import { api } from '@/services/api';
import { GalleryLink } from '@/lib/database.types';

export default function AdminGaleriaPage() {
    const [links, setLinks] = useState<GalleryLink[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<GalleryLink | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({ title: '', drive_link: '', cover_image_url: '' });

    const loadLinks = async () => {
        setIsLoading(true);
        try {
            const data = await api.getAdminGalleryLinks();
            setLinks(data);
        } catch (error) {
            console.error('Error loading gallery links:', error);
            alert('Erro ao carregar álbuns. Tente novamente.');
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
        } else {
            setEditingLink(null);
            setFormData({ title: '', drive_link: '', cover_image_url: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingLink(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (editingLink) {
                await api.updateGalleryLink(editingLink.id, {
                    title: formData.title,
                    drive_link: formData.drive_link,
                    cover_image_url: formData.cover_image_url,
                });
            } else {
                await api.createGalleryLink({
                    title: formData.title,
                    drive_link: formData.drive_link,
                    cover_image_url: formData.cover_image_url,
                    order: links.length + 1,
                    active: true,
                });
            }

            await loadLinks();
            closeModal();
        } catch (error) {
            console.error('Error saving gallery link:', error);
            alert('Erro ao salvar álbum. Verifique os dados e tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteLink = async (id: string) => {
        if (!confirm('Excluir este álbum?')) return;

        try {
            setLinks((prev) => prev.filter((l) => l.id !== id)); // Optimistic
            await api.deleteGalleryLink(id);
        } catch (error) {
            console.error('Error deleting gallery link:', error);
            alert('Erro ao excluir álbum.');
            loadLinks();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div><h1 className="text-lg font-bold text-[var(--color-accent)]">Galeria de Fotos</h1><p className="text-[var(--color-text-secondary)] text-sm">Gerencie os links para álbuns no Google Drive</p></div>
                <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)]"><Plus className="w-5 h-5" /> Novo Álbum</button>
            </div>

            <div className="bg-white rounded-[20px] shadow-lg overflow-hidden">
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
                                <div className="relative w-24 h-16 rounded-[20px] overflow-hidden bg-gray-100 flex-shrink-0"><Image src={link.cover_image_url} alt={link.title} fill className="object-cover" /></div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-[var(--color-accent)]">{link.title}</h3>
                                    <a href={link.drive_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">Ver no Drive <ExternalLink className="w-3 h-3" /></a>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openModal(link)} className="p-2 rounded-[20px] text-blue-600 hover:bg-blue-50"><Pencil className="w-5 h-5" /></button>
                                    <button onClick={() => deleteLink(link.id)} className="p-2 rounded-[20px] text-red-600 hover:bg-red-50"><Trash2 className="w-5 h-5" /></button>
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
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full bg-white rounded-[20px] shadow-2xl z-50 overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b"><h2 className="text-lg font-bold text-[var(--color-accent)]">{editingLink ? 'Editar' : 'Novo'} Álbum</h2><button onClick={closeModal} className="p-2 rounded-[20px] hover:bg-gray-100"><X className="w-5 h-5" /></button></div>
                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div><label className="block text-sm font-medium mb-1">Título *</label><input type="text" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2 rounded-[20px] border focus:border-[var(--color-accent)] outline-none" placeholder="Ex: Cultos" required /></div>
                                <div><label className="block text-sm font-medium mb-1">Link do Google Drive *</label><input type="url" value={formData.drive_link} onChange={(e) => setFormData((p) => ({ ...p, drive_link: e.target.value }))} className="w-full px-4 py-2 rounded-[20px] border focus:border-[var(--color-accent)] outline-none" placeholder="https://drive.google.com/..." required /></div>
                                <div><label className="block text-sm font-medium mb-1">URL da Capa *</label><input type="url" value={formData.cover_image_url} onChange={(e) => setFormData((p) => ({ ...p, cover_image_url: e.target.value }))} className="w-full px-4 py-2 rounded-[20px] border focus:border-[var(--color-accent)] outline-none" required /></div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border rounded-[20px] hover:bg-gray-50">Cancelar</button>
                                    <button type="submit" disabled={isSaving} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[20px] disabled:opacity-70">{isSaving ? <><Loader2 className="w-5 h-5 animate-spin" />Salvando...</> : <><Save className="w-5 h-5" />Salvar</>}</button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
