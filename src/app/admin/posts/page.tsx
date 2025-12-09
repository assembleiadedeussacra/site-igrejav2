'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, Loader2, FileText, Eye, EyeOff, Tag } from 'lucide-react';
import { api } from '@/services/api';

interface Post { id: string; title: string; description: string; cover_image: string | null; type: 'blog' | 'study'; tags: string[]; content: string; published: boolean; created_at: string; }

export default function AdminPostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'blog' | 'study'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', cover_image: '', type: 'blog' as Post['type'], tags: '', content: '', published: true });

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setIsLoading(true);
            const data = await api.getAdminPosts();
            setPosts(data || []);
        } catch (error) {
            console.error('Erro ao carregar posts:', error);
            alert('Erro ao carregar posts. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPosts = filter === 'all' ? posts : posts.filter((p) => p.type === filter);

    const openModal = (post?: Post) => {
        if (post) { setEditingPost(post); setFormData({ title: post.title, description: post.description, cover_image: post.cover_image || '', type: post.type, tags: post.tags.join(', '), content: post.content, published: post.published }); }
        else { setEditingPost(null); setFormData({ title: '', description: '', cover_image: '', type: 'blog', tags: '', content: '', published: true }); }
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); setEditingPost(null); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const tagsArray = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
            const postData = {
                ...formData,
                cover_image: formData.cover_image || null,
                tags: tagsArray,
                author: null, // Author field is required but can be null
            };

            if (editingPost) {
                await api.updatePost(editingPost.id, postData);
            } else {
                await api.createPost(postData);
            }
            await loadPosts();
            closeModal();
        } catch (error) {
            console.error('Erro ao salvar post:', error);
            alert('Erro ao salvar post. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    const togglePublish = async (id: string) => {
        try {
            const post = posts.find((p) => p.id === id);
            if (post) {
                await api.updatePost(id, { published: !post.published });
                await loadPosts();
            }
        } catch (error) {
            console.error('Erro ao alterar publicação:', error);
            alert('Erro ao alterar publicação. Tente novamente.');
        }
    };

    const deletePost = async (id: string) => {
        if (!confirm('Excluir este post?')) return;

        try {
            await api.deletePost(id);
            await loadPosts();
        } catch (error) {
            console.error('Erro ao excluir post:', error);
            alert('Erro ao excluir post. Tente novamente.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div><h1 className="text-lg font-bold text-[var(--color-accent)]">Blog & Estudos</h1><p className="text-[var(--color-text-secondary)] text-sm">Gerencie posts e estudos bíblicos</p></div>
                <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)]"><Plus className="w-5 h-5" /> Novo Post</button>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {[{ key: 'all', label: 'Todos' }, { key: 'blog', label: 'Blog' }, { key: 'study', label: 'Estudos' }].map((f) => (
                    <button key={f.key} onClick={() => setFilter(f.key as typeof filter)} className={`px-4 py-2 rounded-[20px] font-medium transition-colors ${filter === f.key ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-[var(--color-text)] hover:bg-gray-50'}`}>{f.label}</button>
                ))}
            </div>

            <div className="bg-white rounded-[20px] shadow-lg overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="w-16 h-16 mx-auto mb-4 text-gray-300 animate-spin" />
                        <p className="text-[var(--color-text-secondary)]">Carregando posts...</p>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="p-12 text-center"><FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" /><p className="text-[var(--color-text-secondary)]">Nenhum post encontrado</p></div>
                ) : (
                    <div className="divide-y">
                        {filteredPosts.map((post, index) => (
                            <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className={`flex items-center gap-4 p-4 ${!post.published ? 'opacity-60 bg-gray-50' : ''}`}>
                                {post.cover_image && (
                                    <div className="relative w-20 h-14 rounded-[20px] overflow-hidden bg-gray-100 flex-shrink-0"><Image src={post.cover_image} alt={post.title} fill className="object-cover" /></div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 rounded-[20px] text-xs font-medium ${post.type === 'blog' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>{post.type === 'blog' ? 'Blog' : 'Estudo'}</span>
                                        {!post.published && <span className="px-2 py-0.5 rounded-[20px] text-xs font-medium bg-yellow-100 text-yellow-600">Rascunho</span>}
                                    </div>
                                    <h3 className="font-bold text-[var(--color-accent)] truncate">{post.title}</h3>
                                    <p className="text-sm text-[var(--color-text-secondary)] truncate">{post.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => togglePublish(post.id)} className={`p-2 rounded-[20px] transition-colors ${post.published ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`} title={post.published ? 'Despublicar' : 'Publicar'}>{post.published ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}</button>
                                    <button onClick={() => openModal(post)} className="p-2 rounded-[20px] text-blue-600 hover:bg-blue-50"><Pencil className="w-5 h-5" /></button>
                                    <button onClick={() => deletePost(post.id)} className="p-2 rounded-[20px] text-red-600 hover:bg-red-50"><Trash2 className="w-5 h-5" /></button>
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
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full bg-white rounded-[20px] shadow-2xl z-50 overflow-auto max-h-[90vh]">
                            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10"><h2 className="text-lg font-bold text-[var(--color-accent)]">{editingPost ? 'Editar' : 'Novo'} Post</h2><button onClick={closeModal} className="p-2 rounded-[20px] hover:bg-gray-100"><X className="w-5 h-5" /></button></div>
                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Título *</label><input type="text" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2 rounded-[20px] border focus:border-[var(--color-accent)] outline-none" required /></div>
                                    <div><label className="block text-sm font-medium mb-1">Tipo *</label><select value={formData.type} onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value as Post['type'] }))} className="w-full px-4 py-2 rounded-[20px] border focus:border-[var(--color-accent)] outline-none"><option value="blog">Blog</option><option value="study">Estudo</option></select></div>
                                    <div><label className="block text-sm font-medium mb-1">URL da Capa</label><input type="url" value={formData.cover_image} onChange={(e) => setFormData((p) => ({ ...p, cover_image: e.target.value }))} className="w-full px-4 py-2 rounded-[20px] border focus:border-[var(--color-accent)] outline-none" /></div>
                                </div>
                                <div><label className="block text-sm font-medium mb-1">Descrição *</label><textarea value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} rows={2} className="w-full px-4 py-2 rounded-[20px] border focus:border-[var(--color-accent)] outline-none resize-none" required /></div>
                                <div><label className="block text-sm font-medium mb-1">Tags (separadas por vírgula)</label><input type="text" value={formData.tags} onChange={(e) => setFormData((p) => ({ ...p, tags: e.target.value }))} className="w-full px-4 py-2 rounded-[20px] border focus:border-[var(--color-accent)] outline-none" placeholder="Ex: Oração, Vida Cristã" /></div>
                                <div><label className="block text-sm font-medium mb-1">Conteúdo</label><textarea value={formData.content} onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))} rows={8} className="w-full px-4 py-2 rounded-[20px] border focus:border-[var(--color-accent)] outline-none resize-none" placeholder="Escreva o conteúdo do post..." /></div>
                                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.published} onChange={(e) => setFormData((p) => ({ ...p, published: e.target.checked }))} className="w-5 h-5 rounded" /><span>Publicar imediatamente</span></label>
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
