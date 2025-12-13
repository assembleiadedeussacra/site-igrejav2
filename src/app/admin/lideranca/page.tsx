'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Pencil,
    Trash2,
    GripVertical,
    X,
    Save,
    Loader2,
    Users,
    Upload,
    Image as ImageIcon,
} from 'lucide-react';
import { api } from '@/services/api';
import { uploadLeaderImage } from '@/lib/supabase/storage';
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-[28px] font-bold text-[var(--color-accent)]">Liderança</h1>
                    <p className="text-[var(--color-text-secondary)]">Gerencie os líderes da igreja</p>
                </div>
                <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)] transition-colors">
                    <Plus className="w-5 h-5" /> Novo Líder
                </button>
            </div>

            <div className="bg-white rounded-[10px] shadow-lg overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="w-16 h-16 mx-auto mb-4 text-gray-300 animate-spin" />
                        <p className="text-[var(--color-text-secondary)]">Carregando líderes...</p>
                    </div>
                ) : leaders.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-[var(--color-text-secondary)]">Nenhum líder cadastrado</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {leaders.map((leader, index) => (
                            <motion.div
                                key={leader.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-gray-50 rounded-[10px] p-4 flex flex-col items-center text-center group"
                            >
                                <div className="relative w-24 h-24 rounded-[10px] overflow-hidden mb-4 border-4 border-[var(--color-primary)]">
                                    <Image src={leader.image_url} alt={leader.name} fill className="object-cover" />
                                </div>
                                <h3 className="font-bold text-[var(--color-accent)]">{leader.name}</h3>
                                <p className="text-sm text-[var(--color-text-secondary)]">{leader.title}</p>
                                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openModal(leader)} className="p-2 rounded-[10px] bg-blue-100 text-blue-600 hover:bg-blue-200" aria-label={`Editar ${leader.name}`}>
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => deleteLeader(leader.id)} className="p-2 rounded-[10px] bg-red-100 text-red-600 hover:bg-red-200" aria-label={`Excluir ${leader.name}`}>
                                        <Trash2 className="w-4 h-4" />
                                    </button>
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
                            <div className="flex items-center justify-between p-4 border-b">
                                <h2 className="text-xl md:text-[24px] font-bold text-[var(--color-accent)]">{editingLeader ? 'Editar Líder' : 'Novo Líder'}</h2>
                                <button onClick={closeModal} className="p-2 rounded-[10px] hover:bg-gray-100"><X className="w-5 h-5" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Nome *</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Cargo *</label>
                                    <select value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none" required>
                                        <option value="">Selecione...</option>
                                        {titleOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    {formData.title === 'Outro' && (
                                        <div className="mt-2">
                                            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Digite o cargo *</label>
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
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Foto do Líder *</label>
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
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Departamento (opcional)</label>
                                    <input 
                                        type="text" 
                                        value={formData.department} 
                                        onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))} 
                                        className="w-full px-4 py-2 rounded-[10px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none" 
                                        placeholder="Ex: Música, Jovens, Crianças, etc."
                                    />
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
