'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, Loader2, FileText, Eye, EyeOff, Tag, Upload, XCircle } from 'lucide-react';
import { api } from '@/services/api';
import { uploadPostCover, uploadPostInlineImage } from '@/lib/supabase/storage';
import RichTextEditor from '@/components/admin/RichTextEditor';
import toast from 'react-hot-toast';

interface Post { id: string; title: string; description: string; cover_image: string | null; type: 'blog' | 'study'; tags: string[]; content: string; published: boolean; created_at: string; related_posts?: Post[]; }

export default function AdminPostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'blog' | 'study'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string>('');
    const [relatedPosts, setRelatedPosts] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
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
            toast.error('Erro ao carregar posts. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPosts = filter === 'all' ? posts : posts.filter((p) => p.type === filter);

    const openModal = async (post?: Post) => {
        if (post) { 
            setEditingPost(post); 
            setFormData({ 
                title: post.title, 
                description: post.description, 
                cover_image: post.cover_image || '', 
                type: post.type, 
                tags: post.tags.join(', '), 
                content: post.content, 
                published: post.published 
            });
            setCoverPreview(post.cover_image || '');
            // Load related posts from API
            try {
                const relations = await api.getPostRelations(post.id);
                if (relations && relations.length > 0) {
                    const relatedIds = relations.map((r: any) => {
                        return r.related_post_id || (r.related_post && r.related_post.id) || null;
                    }).filter(Boolean);
                    setRelatedPosts(relatedIds);
                } else {
                    setRelatedPosts([]);
                }
            } catch (error) {
                console.error('Erro ao carregar posts relacionados:', error);
                setRelatedPosts([]);
            }
        }
        else { 
            setEditingPost(null); 
            setFormData({ title: '', description: '', cover_image: '', type: 'blog', tags: '', content: '', published: true });
            setCoverPreview('');
            setRelatedPosts([]);
        }
        setCoverFile(null);
        setSearchQuery('');
        setIsModalOpen(true);
    };

    const closeModal = () => { 
        setIsModalOpen(false); 
        setEditingPost(null);
        setCoverFile(null);
        setCoverPreview('');
        setRelatedPosts([]);
        setSearchQuery('');
    };

    const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleImageUpload = async (file: File): Promise<string> => {
        // Validação adicional no handler
        if (!file.type.startsWith('image/')) {
            throw new Error('Arquivo deve ser uma imagem.');
        }
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new Error('Arquivo deve ter no máximo 5MB.');
        }
        const postId = editingPost?.id || 'new';
        return await uploadPostInlineImage(file, postId);
    };

    const filteredPostsForRelation = posts.filter(p => 
        p.id !== editingPost?.id && 
        (p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
         p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const addRelatedPost = (postId: string) => {
        if (!relatedPosts.includes(postId)) {
            setRelatedPosts([...relatedPosts, postId]);
        }
        setSearchQuery('');
    };

    const removeRelatedPost = (postId: string) => {
        setRelatedPosts(relatedPosts.filter(id => id !== postId));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            let coverImageUrl = formData.cover_image;

            // Upload cover image if a new file was selected
            if (coverFile) {
                setIsUploading(true);
                const postId = editingPost?.id || 'new';
                coverImageUrl = await uploadPostCover(coverFile, postId);
                setIsUploading(false);
            }

            const tagsArray = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
            const postData = {
                ...formData,
                cover_image: coverImageUrl || null,
                tags: tagsArray,
                author: null,
            };

            let savedPostId: string;
            if (editingPost) {
                await api.updatePost(editingPost.id, postData);
                savedPostId = editingPost.id;
            } else {
                const newPost = await api.createPost(postData);
                savedPostId = newPost.id;
            }

            // Save related posts
            if (editingPost) {
                // Delete existing relations
                await api.deleteAllPostRelations(savedPostId);
            }
            // Create new relations
            if (relatedPosts.length > 0) {
                for (const relatedPostId of relatedPosts) {
                    await api.createPostRelation(savedPostId, relatedPostId);
                }
            }

            await loadPosts();
            toast.success(editingPost ? 'Post atualizado com sucesso!' : 'Post criado com sucesso!');
            closeModal();
        } catch (error) {
            console.error('Erro ao salvar post:', error);
            toast.error('Erro ao salvar post. Tente novamente.');
            setIsUploading(false);
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
            toast.error('Erro ao alterar publicação. Tente novamente.');
        }
    };

    const deletePost = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.')) return;

        try {
            await api.deletePost(id);
            await loadPosts();
            toast.success('Post excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir post:', error);
            toast.error('Erro ao excluir post. Tente novamente.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div><h1 className="text-2xl md:text-[28px] font-bold text-[var(--color-accent)]">Blog & Estudos</h1><p className="text-[var(--color-text-secondary)] text-sm">Gerencie posts e estudos bíblicos</p></div>
                <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)]"><Plus className="w-5 h-5" /> Novo Post</button>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {[{ key: 'all', label: 'Todos' }, { key: 'blog', label: 'Blog' }, { key: 'study', label: 'Estudos' }].map((f) => (
                    <button key={f.key} onClick={() => setFilter(f.key as typeof filter)} className={`px-4 py-2 rounded-[10px] font-medium transition-colors ${filter === f.key ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-[var(--color-text)] hover:bg-gray-50'}`}>{f.label}</button>
                ))}
            </div>

            <div className="bg-white rounded-[10px] shadow-lg overflow-hidden">
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
                                    <div className="relative w-20 h-14 rounded-[10px] overflow-hidden bg-gray-100 flex-shrink-0"><Image src={post.cover_image} alt={post.title} fill className="object-cover" /></div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 rounded-[10px] text-xs font-medium ${post.type === 'blog' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>{post.type === 'blog' ? 'Blog' : 'Estudo'}</span>
                                        {!post.published && <span className="px-2 py-0.5 rounded-[10px] text-xs font-medium bg-yellow-100 text-yellow-600">Rascunho</span>}
                                    </div>
                                    <h3 className="font-bold text-[var(--color-accent)] truncate">{post.title}</h3>
                                    <p className="text-sm text-[var(--color-text-secondary)] truncate">{post.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => togglePublish(post.id)} className={`p-2 rounded-[10px] transition-colors ${post.published ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`} title={post.published ? 'Despublicar' : 'Publicar'} aria-label={post.published ? 'Despublicar post' : 'Publicar post'}>{post.published ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}</button>
                                    <button onClick={() => openModal(post)} className="p-2 rounded-[10px] text-blue-600 hover:bg-blue-50" aria-label={`Editar ${post.title}`}><Pencil className="w-5 h-5" /></button>
                                    <button onClick={() => deletePost(post.id)} className="p-2 rounded-[10px] text-red-600 hover:bg-red-50" aria-label={`Excluir ${post.title}`}><Trash2 className="w-5 h-5" /></button>
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
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full bg-white rounded-[10px] shadow-2xl z-50 overflow-auto max-h-[90vh]">
                            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10"><h2 className="text-xl md:text-[24px] font-bold text-[var(--color-accent)]">{editingPost ? 'Editar' : 'Novo'} Post</h2><button onClick={closeModal} className="p-2 rounded-[10px] hover:bg-gray-100"><X className="w-5 h-5" /></button></div>
                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Título *</label><input type="text" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" required /></div>
                                    <div><label className="block text-sm font-medium mb-1">Tipo *</label><select value={formData.type} onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value as Post['type'] }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none"><option value="blog">Blog</option><option value="study">Estudo</option></select></div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Imagem de Capa</label>
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
                                                <input type="file" className="hidden" accept="image/*" onChange={handleCoverFileChange} />
                                            </label>
                                            {isUploading && (
                                                <div className="flex items-center gap-2 text-sm text-[var(--color-accent)]">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Enviando imagem...</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div><label className="block text-sm font-medium mb-1">Descrição *</label><textarea value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} rows={2} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none resize-none" required /></div>
                                <div><label className="block text-sm font-medium mb-1">Tags (separadas por vírgula)</label><input type="text" value={formData.tags} onChange={(e) => setFormData((p) => ({ ...p, tags: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" placeholder="Ex: Oração, Vida Cristã" /></div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Conteúdo *</label>
                                    <RichTextEditor 
                                        content={formData.content} 
                                        onChange={(content) => setFormData((p) => ({ ...p, content }))}
                                        onImageUpload={handleImageUpload}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Conteúdos Relacionados</label>
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={searchQuery} 
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Buscar posts ou estudos..."
                                                className="flex-1 px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none"
                                            />
                                        </div>
                                        {searchQuery && filteredPostsForRelation.length > 0 && (
                                            <div className="border border-gray-200 rounded-[10px] max-h-40 overflow-y-auto">
                                                {filteredPostsForRelation.map((post) => (
                                                    <button
                                                        key={post.id}
                                                        type="button"
                                                        onClick={() => addRelatedPost(post.id)}
                                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                                        aria-label={`Adicionar ${post.title} como post relacionado`}
                                                    >
                                                        <div className="font-medium text-[var(--color-accent)]">{post.title}</div>
                                                        <div className="text-xs text-gray-500">{post.type === 'blog' ? 'Blog' : 'Estudo'}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {relatedPosts.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium">Posts Relacionados Selecionados:</p>
                                                {relatedPosts.map((postId) => {
                                                    const post = posts.find(p => p.id === postId);
                                                    if (!post) return null;
                                                    return (
                                                        <div key={postId} className="flex items-center justify-between p-2 bg-gray-50 rounded-[10px]">
                                                            <span className="text-sm">{post.title}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeRelatedPost(postId)}
                                                                className="p-1 text-red-600 hover:bg-red-50 rounded-[10px]"
                                                                aria-label={`Remover ${post.title} dos relacionados`}
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.published} onChange={(e) => setFormData((p) => ({ ...p, published: e.target.checked }))} className="w-5 h-5 rounded" /><span>Publicar imediatamente</span></label>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border rounded-[30px] hover:bg-gray-50">Cancelar</button>
                                    <button type="submit" disabled={isSaving || isUploading} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[30px] disabled:opacity-70">{(isSaving || isUploading) ? <><Loader2 className="w-5 h-5 animate-spin" />Salvando...</> : <><Save className="w-5 h-5" />Salvar</>}</button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
