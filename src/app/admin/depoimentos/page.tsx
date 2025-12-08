'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, Loader2, MessageSquare, Star } from 'lucide-react';
import { api } from '@/services/api';
import { Testimonial } from '@/lib/database.types';

export default function AdminDepoimentosPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({ name: '', text: '', rating: 5, active: true, avatar_url: '' });

    const loadTestimonials = async () => {
        setIsLoading(true);
        try {
            const data = await api.getAdminTestimonials();
            setTestimonials(data);
        } catch (error) {
            console.error('Error loading testimonials:', error);
            alert('Erro ao carregar depoimentos. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTestimonials();
    }, []);

    const openModal = (t?: Testimonial) => {
        if (t) {
            setEditingTestimonial(t);
            setFormData({
                name: t.name,
                text: t.text,
                rating: t.rating,
                active: t.active,
                avatar_url: t.avatar_url || '',
            });
        } else {
            setEditingTestimonial(null);
            setFormData({ name: '', text: '', rating: 5, active: true, avatar_url: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTestimonial(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (editingTestimonial) {
                await api.updateTestimonial(editingTestimonial.id, {
                    name: formData.name,
                    text: formData.text,
                    rating: formData.rating,
                    active: formData.active,
                    avatar_url: formData.avatar_url || null,
                });
            } else {
                await api.createTestimonial({
                    name: formData.name,
                    text: formData.text,
                    rating: formData.rating,
                    active: formData.active,
                    avatar_url: formData.avatar_url || null,
                });
            }

            await loadTestimonials();
            closeModal();
        } catch (error) {
            console.error('Error saving testimonial:', error);
            alert('Erro ao salvar depoimento. Verifique os dados e tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteTestimonial = async (id: string) => {
        if (!confirm('Excluir este depoimento?')) return;

        try {
            setTestimonials((prev) => prev.filter((t) => t.id !== id)); // Optimistic
            await api.deleteTestimonial(id);
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            alert('Erro ao excluir depoimento.');
            loadTestimonials();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div><h1 className="text-lg font-bold text-[var(--color-accent)]">Depoimentos</h1><p className="text-[var(--color-text-secondary)] text-sm">Gerencie os depoimentos exibidos no site</p></div>
                <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)]"><Plus className="w-5 h-5" /> Novo Depoimento</button>
            </div>

            <div className="bg-white rounded-[20px] shadow-lg overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="w-8 h-8 mx-auto animate-spin text-[var(--color-accent)]" />
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className="p-12 text-center"><MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" /><p className="text-[var(--color-text-secondary)]">Nenhum depoimento cadastrado</p></div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {testimonials.map((t, index) => (
                            <motion.div key={t.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className="bg-gray-50 rounded-[20px] p-4 relative group">
                                <div className="flex gap-1 mb-2">{[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`w-4 h-4 ${s <= t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}</div>
                                <p className="text-[var(--color-text-secondary)] italic mb-3">&ldquo;{t.text}&rdquo;</p>
                                <p className="font-bold text-[var(--color-accent)]">{t.name}</p>
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openModal(t)} className="p-1.5 rounded-[20px] bg-blue-100 text-blue-600 hover:bg-blue-200"><Pencil className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => deleteTestimonial(t.id)} className="p-1.5 rounded-[20px] bg-red-100 text-red-600 hover:bg-red-200"><Trash2 className="w-3.5 h-3.5" /></button>
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
                            <div className="flex items-center justify-between p-4 border-b"><h2 className="text-lg font-bold text-[var(--color-accent)]">{editingTestimonial ? 'Editar' : 'Novo'} Depoimento</h2><button onClick={closeModal} className="p-2 rounded-[20px] hover:bg-gray-100"><X className="w-5 h-5" /></button></div>
                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div><label className="block text-sm font-medium mb-1">Nome *</label><input type="text" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2 rounded-[20px] border focus:border-[var(--color-accent)] outline-none" required /></div>
                                <div><label className="block text-sm font-medium mb-1">Depoimento *</label><textarea value={formData.text} onChange={(e) => setFormData((p) => ({ ...p, text: e.target.value }))} rows={4} className="w-full px-4 py-2 rounded-[20px] border focus:border-[var(--color-accent)] outline-none resize-none" required /></div>
                                <div><label className="block text-sm font-medium mb-1">URL do Avatar (opcional)</label><input type="url" value={formData.avatar_url} onChange={(e) => setFormData((p) => ({ ...p, avatar_url: e.target.value }))} className="w-full px-4 py-2 rounded-[20px] border focus:border-[var(--color-accent)] outline-none" placeholder="https://..." /></div>
                                <div><label className="block text-sm font-medium mb-1">Avaliação</label><div className="flex gap-2">{[1, 2, 3, 4, 5].map((s) => <button key={s} type="button" onClick={() => setFormData((p) => ({ ...p, rating: s }))} className="p-1"><Star className={`w-6 h-6 ${s <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} /></button>)}</div></div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        checked={formData.active}
                                        onChange={(e) => setFormData((p) => ({ ...p, active: e.target.checked }))}
                                        className="w-5 h-5 rounded border-gray-300 text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                                    />
                                    <label htmlFor="active" className="text-[var(--color-text)]">
                                        Depoimento ativo
                                    </label>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border rounded-[30px] hover:bg-gray-50">Cancelar</button>
                                    <button type="submit" disabled={isSaving} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[30px] disabled:opacity-70">{isSaving ? <><Loader2 className="w-5 h-5 animate-spin" />Salvando...</> : <><Save className="w-5 h-5" />Salvar</>}</button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
