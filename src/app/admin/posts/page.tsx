'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Save, Loader2, FileText, Eye, EyeOff, Tag, Upload, XCircle } from 'lucide-react';
import { AdminPageHeader, AdminPanel, AdminEntityActions, AdminListToolbar, useAdminViewMode } from '@/components/admin';
import { triggerContentRevalidation } from '@/lib/admin/triggerRevalidation';
import { hasValidImageUrl } from '@/lib/imageUtils';
import { api } from '@/services/api';
import { uploadPostCover, uploadPostInlineImage } from '@/lib/supabase/storage';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { Post } from '@/lib/database.types';
import { generateSlug, validateSlug } from '@/lib/utils/slug';
import { validateSemanticStructure, validateContentLength } from '@/lib/content/validator';
import { validateTitleLength, validateDescriptionLength } from '@/lib/seo/optimizers';
import { validatePost } from '@/lib/validation/post';
import toast from 'react-hot-toast';

export default function AdminPostsPage() {
    const { viewMode, setViewMode } = useAdminViewMode('posts', 'list');
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
    const [formData, setFormData] = useState({ 
        title: '', 
        description: '', 
        cover_image: '', 
        type: 'blog' as Post['type'], 
        tags: '', 
        content: '', 
        published: true,
        slug: '',
        excerpt: '',
        meta_title: '',
        meta_description: '',
        keywords: '',
        canonical_url: '',
        noindex: false,
        nofollow: false,
        og_title: '',
        og_description: '',
        og_image: '',
        schema_type: 'Article' as 'Article' | 'BlogPosting' | 'Study',
    });
    const [slugError, setSlugError] = useState<string>('');
    const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
    const [seoWarnings, setSeoWarnings] = useState<string[]>([]);

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
                published: post.published,
                slug: post.slug || '',
                excerpt: post.excerpt || '',
                meta_title: post.meta_title || '',
                meta_description: post.meta_description || '',
                keywords: post.keywords?.join(', ') || '',
                canonical_url: post.canonical_url || '',
                noindex: post.noindex || false,
                nofollow: post.nofollow || false,
                og_title: post.og_title || '',
                og_description: post.og_description || '',
                og_image: post.og_image || '',
                schema_type: post.schema_type || 'Article',
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
            setFormData({ 
                title: '', 
                description: '', 
                cover_image: '', 
                type: 'blog', 
                tags: '', 
                content: '', 
                published: true,
                slug: '',
                excerpt: '',
                meta_title: '',
                meta_description: '',
                keywords: '',
                canonical_url: '',
                noindex: false,
                nofollow: false,
                og_title: '',
                og_description: '',
                og_image: '',
                schema_type: 'Article',
            });
            setCoverPreview('');
            setRelatedPosts([]);
        }
        setSlugError('');
        setSeoWarnings([]);
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

    const handleGenerateSlug = () => {
        if (!formData.title) {
            toast.error('Digite um título primeiro');
            return;
        }
        setIsGeneratingSlug(true);
        const generatedSlug = generateSlug(formData.title);
        setFormData(prev => ({ ...prev, slug: generatedSlug }));
        setSlugError('');
        setIsGeneratingSlug(false);
    };

    const handleSlugChange = (value: string) => {
        setFormData(prev => ({ ...prev, slug: value }));
        if (value && !validateSlug(value)) {
            setSlugError('Slug inválido. Use apenas letras minúsculas, números e hífens.');
        } else {
            setSlugError('');
        }
    };

    const validateSEO = () => {
        const warnings: string[] = [];

        // Validate title length
        const titleValidation = validateTitleLength(formData.title);
        if (!titleValidation.isValid) {
            warnings.push(`Título: ${titleValidation.recommendation}`);
        }

        // Validate description length
        const descValidation = validateDescriptionLength(formData.description);
        if (!descValidation.isValid) {
            warnings.push(`Descrição: ${descValidation.recommendation}`);
        }

        // Validate meta title if provided
        if (formData.meta_title) {
            const metaTitleValidation = validateTitleLength(formData.meta_title);
            if (!metaTitleValidation.isValid) {
                warnings.push(`Meta Title: ${metaTitleValidation.recommendation}`);
            }
        }

        // Validate meta description if provided
        if (formData.meta_description) {
            const metaDescValidation = validateDescriptionLength(formData.meta_description);
            if (!metaDescValidation.isValid) {
                warnings.push(`Meta Description: ${metaDescValidation.recommendation}`);
            }
        }

        // Validate content structure
        if (formData.content) {
            const contentValidation = validateSemanticStructure(formData.content);
            contentValidation.errors.forEach(err => {
                warnings.push(`Erro no conteúdo: ${err.message}`);
            });
            contentValidation.warnings.forEach(warn => {
                warnings.push(`Aviso no conteúdo: ${warn.message}`);
            });

            // Validate content length
            const lengthValidation = validateContentLength(formData.content);
            lengthValidation.errors.forEach(err => {
                warnings.push(`Erro: ${err.message}`);
            });
            lengthValidation.warnings.forEach(warn => {
                warnings.push(`Aviso: ${warn.message}`);
            });
        }

        // Check for slug
        if (!formData.slug && formData.title) {
            warnings.push('Slug não definido. Será gerado automaticamente do título.');
        }

        setSeoWarnings(warnings);
        return warnings.length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // Validate slug if provided
            if (formData.slug && !validateSlug(formData.slug)) {
                toast.error('Slug inválido. Corrija antes de salvar.');
                setIsSaving(false);
                return;
            }

            let coverImageUrl = formData.cover_image;

            // Upload cover image if a new file was selected
            if (coverFile) {
                setIsUploading(true);
                const postId = editingPost?.id || 'new';
                coverImageUrl = await uploadPostCover(coverFile, postId);
                setIsUploading(false);
            }

            const tagsArray = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
            const keywordsArray = formData.keywords.split(',').map((k) => k.trim()).filter(Boolean);
            
            // Preparar dados para validação
            const postDataToValidate = {
                title: formData.title,
                description: formData.description,
                cover_image: coverImageUrl || null,
                type: formData.type,
                tags: tagsArray,
                content: formData.content,
                published: formData.published,
                slug: formData.slug || generateSlug(formData.title),
                excerpt: formData.excerpt || null,
                meta_title: formData.meta_title || null,
                meta_description: formData.meta_description || null,
                keywords: keywordsArray.length > 0 ? keywordsArray.join(', ') : null,
                canonical_url: formData.canonical_url || null,
                noindex: formData.noindex,
                nofollow: formData.nofollow,
                og_title: formData.og_title || null,
                og_description: formData.og_description || null,
                og_image: formData.og_image || null,
                schema_type: formData.schema_type,
            };

            // Validação com Zod
            const validation = validatePost(postDataToValidate);
            if (!validation.success) {
                const errorMessages = validation.errors.map(e => e.message).join(', ');
                toast.error(`Erro de validação: ${errorMessages}`, {
                    duration: 6000,
                });
                setIsSaving(false);
                return;
            }

            // Validate SEO (avisos, não bloqueia)
            const isValid = validateSEO();
            if (!isValid && seoWarnings.length > 0) {
                // Show warnings but allow saving
                toast.error(`Atenção: ${seoWarnings.length} aviso(s) de SEO encontrado(s). Verifique os avisos abaixo.`, {
                    duration: 5000,
                });
            }
            
            const postData: any = {
                title: validation.data.title,
                description: formData.description,
                cover_image: coverImageUrl || null,
                type: validation.data.type,
                tags: validation.data.tags,
                content: validation.data.content,
                published: validation.data.published,
                author: null,
                views: editingPost?.views ?? 0,
                // SEO fields
                slug: validation.data.slug,
                excerpt: validation.data.excerpt || null,
                meta_title: validation.data.meta_title || null,
                meta_description: validation.data.meta_description || null,
                keywords: keywordsArray,
                canonical_url: validation.data.canonical_url || null,
                noindex: validation.data.noindex,
                nofollow: validation.data.nofollow,
                og_title: validation.data.og_title || null,
                og_description: validation.data.og_description || null,
                og_image: validation.data.og_image || null,
                schema_type: validation.data.schema_type,
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
            if (validation.data.published) {
                await triggerContentRevalidation({
                    type: validation.data.type,
                    slug: validation.data.slug,
                });
            } else {
                await triggerContentRevalidation({ type: validation.data.type });
            }
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
                await triggerContentRevalidation({
                    type: post.type,
                    slug: post.slug || undefined,
                });
            }
        } catch (error) {
            console.error('Erro ao alterar publicação:', error);
            toast.error('Erro ao alterar publicação. Tente novamente.');
        }
    };

    const deletePost = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.')) return;

        try {
            const post = posts.find((p) => p.id === id);
            await api.deletePost(id);
            await loadPosts();
            if (post) {
                await triggerContentRevalidation({
                    type: post.type,
                    slug: post.slug || undefined,
                });
            }
            toast.success('Post excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir post:', error);
            toast.error('Erro ao excluir post. Tente novamente.');
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Blog & Estudos"
                description="Gerencie posts e estudos bíblicos"
                action={
                    <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)]">
                        <Plus className="w-5 h-5" /> Novo Post
                    </button>
                }
            />

            <AdminListToolbar viewMode={viewMode} onViewModeChange={setViewMode}>
                {[{ key: 'all', label: 'Todos' }, { key: 'blog', label: 'Blog' }, { key: 'study', label: 'Estudos' }].map((f) => (
                    <button key={f.key} onClick={() => setFilter(f.key as typeof filter)} className={`px-4 py-2 rounded-[10px] font-medium transition-colors ${filter === f.key ? 'bg-[var(--color-accent)] text-white' : 'bg-white text-[var(--color-text)] hover:bg-gray-50 admin-card border border-gray-100'}`}>{f.label}</button>
                ))}
            </AdminListToolbar>

            <AdminPanel
                isLoading={isLoading}
                isEmpty={!isLoading && filteredPosts.length === 0}
                emptyIcon={FileText}
                emptyMessage="Nenhum post encontrado"
                loadingMessage="Carregando posts..."
            >
                {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                    {filteredPosts.map((post) => (
                        <article key={post.id} className={`admin-sortable-card flex flex-col h-full ${!post.published ? 'opacity-75' : ''}`}>
                            <div className="relative aspect-[16/10] bg-gray-100">
                                {hasValidImageUrl(post.cover_image) ? (
                                    <Image src={post.cover_image!} alt={post.title} fill className="object-cover" sizes="(max-width:640px) 100vw, 33vw" />
                                ) : (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <FileText className="w-10 h-10 text-gray-300" />
                                    </span>
                                )}
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${post.type === 'blog' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                        {post.type === 'blog' ? 'Blog' : 'Estudo'}
                                    </span>
                                    {!post.published && (
                                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Rascunho</span>
                                    )}
                                </div>
                                <h3 className="admin-card-title line-clamp-2">{post.title}</h3>
                                <p className="admin-card-desc line-clamp-2 mt-1 flex-1">{post.description}</p>
                                <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => togglePublish(post.id)}
                                        className={`p-2 rounded-[10px] transition-colors ${post.published ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-500 bg-gray-50 hover:bg-gray-100'}`}
                                        title={post.published ? 'Despublicar' : 'Publicar'}
                                        aria-label={post.published ? 'Despublicar post' : 'Publicar post'}
                                    >
                                        {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                    <AdminEntityActions onEdit={() => openModal(post)} onDelete={() => deletePost(post.id)} />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
                ) : (
                <div className="divide-y divide-gray-100">
                    {filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            className={`admin-sortable-row ${!post.published ? 'opacity-75' : ''}`}
                        >
                            <div className="relative w-16 h-11 sm:w-20 sm:h-14 rounded-[10px] overflow-hidden bg-gray-100 flex-shrink-0">
                                {hasValidImageUrl(post.cover_image) ? (
                                    <Image src={post.cover_image!} alt={post.title} fill className="object-cover" sizes="80px" />
                                ) : (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-gray-300" />
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${post.type === 'blog' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                        {post.type === 'blog' ? 'Blog' : 'Estudo'}
                                    </span>
                                    {!post.published && (
                                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Rascunho</span>
                                    )}
                                </div>
                                <h3 className="admin-card-title truncate">{post.title}</h3>
                                <p className="admin-card-desc truncate">{post.description}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => togglePublish(post.id)}
                                    className={`p-2 rounded-[10px] transition-colors ${post.published ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-500 bg-gray-50 hover:bg-gray-100'}`}
                                    title={post.published ? 'Despublicar' : 'Publicar'}
                                    aria-label={post.published ? 'Despublicar post' : 'Publicar post'}
                                >
                                    {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                                <AdminEntityActions
                                    onEdit={() => openModal(post)}
                                    onDelete={() => deletePost(post.id)}
                                    editLabel={`Editar ${post.title}`}
                                    deleteLabel={`Excluir ${post.title}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                )}
            </AdminPanel>

            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="fixed inset-0 bg-black/50 z-50" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full bg-white rounded-[10px] shadow-2xl z-50 overflow-auto max-h-[90vh]">
                            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10"><h2 className="admin-modal-title">{editingPost ? 'Editar' : 'Novo'} Post</h2><button onClick={closeModal} className="p-2 rounded-[10px] hover:bg-gray-100"><X className="w-5 h-5" /></button></div>
                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                {/* SEO Warnings */}
                                {seoWarnings.length > 0 && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-[10px] p-4 mb-4">
                                        <h3 className="admin-form-subtitle text-yellow-800 mb-2">⚠️ Avisos de SEO</h3>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                                            {seoWarnings.map((warning, index) => (
                                                <li key={index}>{warning}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="admin-label mb-1">
                                            Título *
                                            {formData.title && (
                                                <span className={`ml-2 text-xs ${validateTitleLength(formData.title).isValid ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    ({formData.title.length}/60 caracteres)
                                                </span>
                                            )}
                                        </label>
                                        <input 
                                            type="text" 
                                            value={formData.title} 
                                            onChange={(e) => {
                                                setFormData((p) => ({ ...p, title: e.target.value }));
                                                setTimeout(() => validateSEO(), 100);
                                            }} 
                                            className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" 
                                            required 
                                            maxLength={60}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="admin-label mb-1">
                                            Slug (URL amigável)
                                            <button
                                                type="button"
                                                onClick={handleGenerateSlug}
                                                disabled={isGeneratingSlug || !formData.title}
                                                className="ml-2 text-xs text-[var(--color-accent)] hover:underline disabled:opacity-50"
                                            >
                                                {isGeneratingSlug ? 'Gerando...' : 'Gerar do título'}
                                            </button>
                                        </label>
                                        <input 
                                            type="text" 
                                            value={formData.slug} 
                                            onChange={(e) => {
                                                handleSlugChange(e.target.value);
                                                // Re-validate SEO when slug changes
                                                setTimeout(() => validateSEO(), 100);
                                            }} 
                                            placeholder="exemplo-de-slug-amigavel"
                                            className={`w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none ${slugError ? 'border-red-500' : ''}`}
                                        />
                                        {slugError && <p className="text-xs text-red-500 mt-1">{slugError}</p>}
                                        <p className="admin-help mt-1">Deixe vazio para gerar automaticamente do título</p>
                                    </div>
                                    <div>
                                        <label className="admin-label mb-1">Tipo *</label>
                                        <select value={formData.type} onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value as Post['type'] }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none">
                                            <option value="blog">Blog</option>
                                            <option value="study">Estudo</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="admin-label mb-1">Tipo de Schema</label>
                                        <select value={formData.schema_type} onChange={(e) => setFormData((p) => ({ ...p, schema_type: e.target.value as 'Article' | 'BlogPosting' | 'Study' }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none">
                                            <option value="Article">Article</option>
                                            <option value="BlogPosting">BlogPosting</option>
                                            <option value="Study">Study</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="admin-label mb-1">Imagem de Capa</label>
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
                                                        <p className="admin-upload-text">Clique para fazer upload</p>
                                                        <p className="admin-help">PNG, JPG até 5MB</p>
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
                                <div>
                                    <label className="admin-label mb-1">
                                        Descrição *
                                        {formData.description && (
                                            <span className={`ml-2 text-xs ${validateDescriptionLength(formData.description).isValid ? 'text-green-600' : 'text-yellow-600'}`}>
                                                ({formData.description.length}/160 caracteres)
                                            </span>
                                        )}
                                    </label>
                                    <textarea 
                                        value={formData.description} 
                                        onChange={(e) => {
                                            setFormData((p) => ({ ...p, description: e.target.value }));
                                            setTimeout(() => validateSEO(), 100);
                                        }} 
                                        rows={2} 
                                        className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none resize-none" 
                                        required 
                                        maxLength={200}
                                    />
                                </div>
                                <div><label className="admin-label mb-1">Excerpt (Resumo para SEO)</label><textarea value={formData.excerpt} onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))} rows={2} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none resize-none" placeholder="Resumo otimizado para SEO (150-160 caracteres)" /></div>
                                
                                {/* SEO Section */}
                                <div className="md:col-span-2 border-t pt-4 mt-4">
                                    <h3 className="admin-section-title mb-4">Configurações SEO</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="admin-label mb-1">Meta Title (opcional)</label>
                                            <input type="text" value={formData.meta_title} onChange={(e) => setFormData((p) => ({ ...p, meta_title: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" placeholder="Título para SEO (50-60 caracteres)" maxLength={60} />
                                            <p className="admin-help mt-1">{formData.meta_title.length}/60 caracteres</p>
                                        </div>
                                        <div>
                                            <label className="admin-label mb-1">Meta Description (opcional)</label>
                                            <textarea value={formData.meta_description} onChange={(e) => setFormData((p) => ({ ...p, meta_description: e.target.value }))} rows={2} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none resize-none" placeholder="Descrição para SEO (150-160 caracteres)" maxLength={160} />
                                            <p className="admin-help mt-1">{formData.meta_description.length}/160 caracteres</p>
                                        </div>
                                        <div>
                                            <label className="admin-label mb-1">Keywords (separadas por vírgula)</label>
                                            <input type="text" value={formData.keywords} onChange={(e) => setFormData((p) => ({ ...p, keywords: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" placeholder="palavra-chave-1, palavra-chave-2" />
                                        </div>
                                        <div>
                                            <label className="admin-label mb-1">Canonical URL (opcional)</label>
                                            <input type="url" value={formData.canonical_url} onChange={(e) => setFormData((p) => ({ ...p, canonical_url: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" placeholder="https://exemplo.com/artigo" />
                                        </div>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2">
                                                <input type="checkbox" checked={formData.noindex} onChange={(e) => setFormData((p) => ({ ...p, noindex: e.target.checked }))} className="w-5 h-5 rounded" />
                                                <span className="text-sm">Noindex (não indexar)</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="checkbox" checked={formData.nofollow} onChange={(e) => setFormData((p) => ({ ...p, nofollow: e.target.checked }))} className="w-5 h-5 rounded" />
                                                <span className="text-sm">Nofollow (não seguir links)</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Open Graph Section */}
                                <div className="md:col-span-2 border-t pt-4 mt-4">
                                    <h3 className="admin-section-title mb-4">Open Graph (Redes Sociais)</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="admin-label mb-1">OG Title (opcional)</label>
                                            <input type="text" value={formData.og_title} onChange={(e) => setFormData((p) => ({ ...p, og_title: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" placeholder="Título para compartilhamento" />
                                        </div>
                                        <div>
                                            <label className="admin-label mb-1">OG Description (opcional)</label>
                                            <textarea value={formData.og_description} onChange={(e) => setFormData((p) => ({ ...p, og_description: e.target.value }))} rows={2} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none resize-none" placeholder="Descrição para compartilhamento" />
                                        </div>
                                        <div>
                                            <label className="admin-label mb-1">OG Image URL (opcional)</label>
                                            <input type="url" value={formData.og_image} onChange={(e) => setFormData((p) => ({ ...p, og_image: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" placeholder="https://exemplo.com/imagem-og.jpg" />
                                            <p className="admin-help mt-1">Recomendado: 1200x630px. Deixe vazio para usar imagem de capa.</p>
                                        </div>
                                    </div>
                                </div>

                                <div><label className="admin-label mb-1">Tags (separadas por vírgula)</label><input type="text" value={formData.tags} onChange={(e) => setFormData((p) => ({ ...p, tags: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" placeholder="Ex: Oração, Vida Cristã" /></div>
                                <div>
                                    <label className="admin-label mb-1">Conteúdo *</label>
                                    <RichTextEditor 
                                        content={formData.content} 
                                        onChange={(content) => {
                                            setFormData((p) => ({ ...p, content }));
                                            setTimeout(() => validateSEO(), 300);
                                        }}
                                        onImageUpload={handleImageUpload}
                                    />
                                    <p className="admin-help mt-2">
                                        Dica: Use apenas um H1 por artigo. Use H2, H3, H4 para hierarquia.
                                    </p>
                                </div>
                                <div>
                                    <label className="admin-label mb-1">Conteúdos Relacionados</label>
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
                                                        <div className="admin-card-meta">{post.type === 'blog' ? 'Blog' : 'Estudo'}</div>
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
