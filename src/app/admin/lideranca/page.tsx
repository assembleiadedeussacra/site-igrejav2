'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    X,
    Save,
    Loader2,
    Users,
    Upload,
} from 'lucide-react';
import { api } from '@/services/api';
import { uploadLeaderImage } from '@/lib/supabase/storage';
import { hasValidImageUrl } from '@/lib/imageUtils';
import { toOrderUpdates } from '@/lib/admin/reorder';
import {
    AdminPageHeader,
    AdminPanel,
    AdminSortable,
    AdminEntityActions,
    AdminListToolbar,
    useAdminViewMode,
} from '@/components/admin';
import toast from 'react-hot-toast';

interface Leader {
    id: string;
    name: string;
    title: string;
    image_url: string;
    department: string | null;
    order: number;
    active: boolean;
}

const titleOptions = ['Pastor', 'Presbítero', 'Diácono', 'Diaconisa', 'Evangelista', 'Missionário', 'Outro'];

export default function AdminLiderancaPage() {
    const { viewMode, setViewMode } = useAdminViewMode('lideranca', 'grid');
    const [leaders, setLeaders] = useState<Leader[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [customTitle, setCustomTitle] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        image_url: '',
        department: '',
        active: true,
    });

    useEffect(() => {
        loadLeaders();
    }, []);

    const loadLeaders = async () => {
        try {
            setIsLoading(true);
            const data = await api.getAdminLeaders();
            setLeaders(data || []);
        } catch (error) {
            console.error('Erro ao carregar líderes:', error);
            toast.error('Erro ao carregar líderes. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (leader?: Leader) => {
        if (leader) {
            setEditingLeader(leader);
            setFormData({
                name: leader.name,
                title: leader.title,
                image_url: leader.image_url,
                department: leader.department || '',
                active: leader.active,
            });
            setImagePreview(leader.image_url);
            setCustomTitle(leader.title === 'Outro' ? '' : '');
        } else {
            setEditingLeader(null);
            setFormData({ name: '', title: '', image_url: '', department: '', active: true });
            setImagePreview('');
            setCustomTitle('');
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingLeader(null);
        setImageFile(null);
        setImagePreview('');
        setCustomTitle('');
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

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            let imageUrl = formData.image_url;

            // Upload image if a new file was selected
            if (imageFile) {
                setIsUploading(true);
                const leaderId = editingLeader?.id || 'new';
                imageUrl = await uploadLeaderImage(imageFile, leaderId);
                setIsUploading(false);
            }

            const finalTitle = formData.title === 'Outro' ? customTitle : formData.title;

            const leaderData = {
                name: formData.name,
                title: finalTitle,
                image_url: imageUrl,
                department: formData.department || null,
                active: formData.active,
            };

            if (editingLeader) {
                await api.updateLeader(editingLeader.id, leaderData);
            } else {
                const maxOrder = leaders.length > 0 ? Math.max(...leaders.map(l => l.order || 0)) : 0;
                await api.createLeader({
                    ...leaderData,
                    order: maxOrder + 1,
                });
            }
            await loadLeaders();
            toast.success(editingLeader ? 'Líder atualizado com sucesso!' : 'Líder criado com sucesso!');
            closeModal();
        } catch (error) {
            console.error('Erro ao salvar líder:', error);
            toast.error('Erro ao salvar líder. Tente novamente.');
            setIsUploading(false);
        } finally {
            setIsSaving(false);
        }
    };

    const deleteLeader = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este líder? Esta ação não pode ser desfeita.')) return;

        try {
            await api.deleteLeader(id);
            await loadLeaders();
            toast.success('Líder excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir líder:', error);
            toast.error('Erro ao excluir líder. Tente novamente.');
        }
    };

    const handleReorder = async (reordered: Leader[]) => {
        const previous = leaders;
        setLeaders(reordered);
        try {
            await api.updateLeaderOrders(toOrderUpdates(reordered, (l) => l.id));
            toast.success('Ordem atualizada!');
        } catch (error) {
            console.error('Erro ao atualizar ordem:', error);
            setLeaders(previous);
            toast.error('Erro ao atualizar ordem. Tente novamente.');
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Liderança"
                description="Gerencie os líderes exibidos na home e na página Sobre"
                action={
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)] transition-colors"
                    >
                        <Plus className="w-5 h-5" /> Novo Líder
                    </button>
                }
            />

            <AdminListToolbar viewMode={viewMode} onViewModeChange={setViewMode} />

            <AdminPanel
                isLoading={isLoading}
                isEmpty={!isLoading && leaders.length === 0}
                emptyIcon={Users}
                emptyMessage="Nenhum líder cadastrado"
                loadingMessage="Carregando líderes..."
                hint="Arraste pelo ícone ⋮⋮ para reordenar a exibição na home"
            >
                <AdminSortable
                    items={leaders}
                    getItemId={(l) => l.id}
                    onReorder={handleReorder}
                    layout={viewMode}
                    renderItem={(leader, { dragHandle, orderBadge, layout }) =>
                        layout === 'grid' ? (
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50/80">
                                <div className="flex items-center gap-2">
                                    {dragHandle}
                                    {orderBadge}
                                </div>
                                <AdminEntityActions
                                    size="sm"
                                    onEdit={() => openModal(leader)}
                                    onDelete={() => deleteLeader(leader.id)}
                                    editLabel={`Editar ${leader.name}`}
                                    deleteLabel={`Excluir ${leader.name}`}
                                />
                            </div>
                            <div className="flex flex-col items-center text-center p-5 flex-1">
                                <div className="relative w-28 h-28 rounded-[12px] overflow-hidden mb-4 border-4 border-[var(--color-primary)] bg-gray-100 flex items-center justify-center shadow-sm">
                                    {hasValidImageUrl(leader.image_url) ? (
                                        <Image src={leader.image_url} alt={leader.name} fill className="object-cover" sizes="112px" />
                                    ) : (
                                        <Users className="w-12 h-12 text-gray-400" />
                                    )}
                                    {!leader.active && (
                                        <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold tracking-wide">INATIVO</span>
                                        </div>
                                    )}
                                </div>
                                <h3 className="type-card-title leading-tight">{leader.name}</h3>
                                <p className="admin-card-desc mt-1">{leader.title}</p>
                                {leader.department && (
                                    <span className="mt-2 inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-primary)]/30 text-[var(--color-accent)]">
                                        {leader.department}
                                    </span>
                                )}
                                <span
                                    className={`mt-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                        leader.active
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    {leader.active ? 'Visível na Home' : 'Oculto'}
                                </span>
                            </div>
                        </div>
                        ) : (
                        <>
                            {dragHandle}
                            {orderBadge}
                            <div className="relative w-14 h-14 rounded-[10px] overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-[var(--color-primary)]">
                                {hasValidImageUrl(leader.image_url) ? (
                                    <Image src={leader.image_url} alt={leader.name} fill className="object-cover" sizes="56px" />
                                ) : (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-gray-400" />
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="admin-card-title truncate">{leader.name}</h3>
                                <p className="admin-card-desc truncate">{leader.title}</p>
                                {leader.department && (
                                    <p className="admin-card-meta mt-0.5 truncate">{leader.department}</p>
                                )}
                            </div>
                            <span
                                className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${
                                    leader.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                {leader.active ? 'Ativo' : 'Inativo'}
                            </span>
                            <AdminEntityActions
                                onEdit={() => openModal(leader)}
                                onDelete={() => deleteLeader(leader.id)}
                                editLabel={`Editar ${leader.name}`}
                                deleteLabel={`Excluir ${leader.name}`}
                            />
                        </>
                        )
                    }
                />
            </AdminPanel>

            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="fixed inset-0 bg-black/50 z-50" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full bg-white rounded-[10px] shadow-2xl z-50 overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h2 className="admin-modal-title">{editingLeader ? 'Editar Líder' : 'Novo Líder'}</h2>
                                <button onClick={closeModal} className="p-2 rounded-[10px] hover:bg-gray-100"><X className="w-5 h-5" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div>
                                    <label className="admin-label mb-1">Nome *</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none" required />
                                </div>
                                <div>
                                    <label className="admin-label mb-1">Cargo *</label>
                                    <select value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none" required>
                                        <option value="">Selecione...</option>
                                        {titleOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    {formData.title === 'Outro' && (
                                        <div className="mt-2">
                                            <label className="admin-label mb-1">Digite o cargo *</label>
                                            <input 
                                                type="text" 
                                                value={customTitle} 
                                                onChange={(e) => setCustomTitle(e.target.value)} 
                                                className="w-full px-4 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none" 
                                                placeholder="Ex: Coordenador, Secretário, etc."
                                                required={formData.title === 'Outro'}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="admin-label mb-1">Foto do Líder *</label>
                                    <div className="space-y-2">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-[10px] cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden">
                                            {imagePreview ? (
                                                <div className="relative w-full h-full">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                                    <p className="admin-upload-text">Clique para fazer upload</p>
                                                    <p className="admin-help">PNG, JPG até 5MB</p>
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
                                <div>
                                    <label className="admin-label mb-1">Departamento (opcional)</label>
                                    <input 
                                        type="text" 
                                        value={formData.department} 
                                        onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))} 
                                        className="w-full px-4 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none" 
                                        placeholder="Ex: Música, Jovens, Crianças, etc."
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[10px]">
                                    <div>
                                        <label className="admin-label mb-1">Status</label>
                                        <p className="admin-help">
                                            {formData.active ? 'Líder visível na home' : 'Líder oculto na home'}
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.active} 
                                            onChange={(e) => setFormData((p) => ({ ...p, active: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-accent)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
                                        <span className="ml-3 admin-label-inline">
                                            {formData.active ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </label>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-200 rounded-[30px] hover:bg-gray-50">Cancelar</button>
                                    <button type="submit" disabled={isSaving || isUploading} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)] disabled:opacity-70">
                                        {(isSaving || isUploading) ? <><Loader2 className="w-5 h-5 animate-spin" />Salvando...</> : <><Save className="w-5 h-5" />Salvar</>}
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
