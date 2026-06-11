'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Eye,
    EyeOff,
    X,
    Save,
    Loader2,
    Upload,
    Building2,
} from 'lucide-react';
import { api } from '@/services/api';
import { Department } from '@/lib/database.types';
import { uploadDepartmentImage } from '@/lib/supabase/storage';
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

export default function AdminDepartamentosPage() {
    const { viewMode, setViewMode } = useAdminViewMode('departamentos', 'list');
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image_url: '',
        order: 0,
        active: true,
    });

    const loadDepartments = async () => {
        setIsLoading(true);
        try {
            const data = await api.getAdminDepartments();
            setDepartments(data);
        } catch (error) {
            console.error('Error loading departments:', error);
            toast.error('Erro ao carregar departamentos. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDepartments();
    }, []);

    const openModal = (department?: Department) => {
        if (department) {
            setEditingDepartment(department);
            setFormData({
                name: department.name,
                description: department.description || '',
                image_url: department.image_url || '',
                order: department.order,
                active: department.active,
            });
            setImagePreview(department.image_url || '');
        } else {
            setEditingDepartment(null);
            setFormData({
                name: '',
                description: '',
                image_url: '',
                order: departments.length,
                active: true,
            });
            setImagePreview('');
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingDepartment(null);
        setImageFile(null);
        setImagePreview('');
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setIsUploading(false);

        try {
            let imageUrl = formData.image_url;

            if (imageFile) {
                setIsUploading(true);
                try {
                    const departmentId = editingDepartment?.id || 'new';
                    imageUrl = await uploadDepartmentImage(imageFile, departmentId);
                } catch (error: any) {
                    toast.error(`Erro ao fazer upload da imagem: ${error.message}`);
                    setIsSaving(false);
                    setIsUploading(false);
                    return;
                } finally {
                    setIsUploading(false);
                }
            }

            const departmentData = {
                name: formData.name,
                description: formData.description || null,
                image_url: imageUrl || null,
                order: formData.order,
                active: formData.active,
            };

            if (editingDepartment) {
                await api.updateDepartment(editingDepartment.id, departmentData);
                toast.success('Departamento atualizado com sucesso!');
            } else {
                await api.createDepartment(departmentData);
                toast.success('Departamento criado com sucesso!');
            }

            await loadDepartments();
            closeModal();
        } catch (error: any) {
            console.error('Error saving department:', error);
            toast.error(`Erro ao salvar departamento: ${error.message || 'Verifique os dados e tente novamente.'}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este departamento?')) return;

        try {
            await api.deleteDepartment(id);
            toast.success('Departamento excluído com sucesso!');
            await loadDepartments();
        } catch (error: any) {
            console.error('Error deleting department:', error);
            toast.error(`Erro ao excluir departamento: ${error.message}`);
        }
    };

    const handleReorder = async (reordered: Department[]) => {
        const previous = departments;
        setDepartments(reordered);
        try {
            await api.updateDepartmentOrders(toOrderUpdates(reordered, (d) => d.id));
            toast.success('Ordem atualizada!');
        } catch (error) {
            console.error('Error moving department:', error);
            setDepartments(previous);
            toast.error('Erro ao atualizar ordem.');
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Departamentos"
                description="Gerencie os departamentos da página Sobre"
                action={
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)] transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Departamento
                    </button>
                }
            />

            <AdminListToolbar viewMode={viewMode} onViewModeChange={setViewMode} />

            <AdminPanel
                isLoading={isLoading}
                isEmpty={!isLoading && departments.length === 0}
                emptyIcon={Building2}
                emptyMessage="Nenhum departamento cadastrado"
                hint="Arraste para definir a ordem na página Sobre"
            >
                <AdminSortable
                    items={departments}
                    getItemId={(d) => d.id}
                    onReorder={handleReorder}
                    layout={viewMode}
                    renderItem={(department, { dragHandle, orderBadge, layout }) =>
                        layout === 'grid' ? (
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50/80">
                                    <div className="flex items-center gap-2">{dragHandle}{orderBadge}</div>
                                    <AdminEntityActions size="sm" onEdit={() => openModal(department)} onDelete={() => handleDelete(department.id)} />
                                </div>
                                {hasValidImageUrl(department.image_url) && (
                                    <div className="relative aspect-[16/10] bg-gray-100">
                                        <Image src={department.image_url!} alt={department.name} fill className="object-cover" sizes="(max-width:640px) 100vw, 33vw" />
                                    </div>
                                )}
                                <div className="p-4 flex-1">
                                    <h3 className="admin-card-title">{department.name}</h3>
                                    {department.description && (
                                        <p className="admin-card-desc line-clamp-3 mt-1">{department.description}</p>
                                    )}
                                    <span className={`mt-3 inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${department.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                        {department.active ? 'Visível' : 'Oculto'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                        <>
                            {dragHandle}
                            {orderBadge}
                            {hasValidImageUrl(department.image_url) && (
                                <div className="relative w-16 h-16 rounded-[10px] overflow-hidden flex-shrink-0">
                                    <Image src={department.image_url!} alt={department.name} fill className="object-cover" sizes="64px" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="admin-card-title">{department.name}</h3>
                                {department.description && (
                                    <p className="admin-card-desc line-clamp-2 mt-0.5">{department.description}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0" title={department.active ? 'Visível' : 'Oculto'}>
                                {department.active ? (
                                    <Eye className="w-5 h-5 text-green-500" />
                                ) : (
                                    <EyeOff className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                            <AdminEntityActions
                                onEdit={() => openModal(department)}
                                onDelete={() => handleDelete(department.id)}
                            />
                        </>
                        )
                    }
                />
            </AdminPanel>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-[10px] shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
                                <h2 className="admin-modal-title">
                                    {editingDepartment ? 'Editar Departamento' : 'Novo Departamento'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-[10px] hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Name */}
                                <div>
                                    <label className="admin-label mb-2">
                                        Nome do Departamento *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                                        placeholder="Ex: Departamento Infantil"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="admin-label mb-2">
                                        Descrição
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent min-h-[100px]"
                                        placeholder="Breve descrição do departamento..."
                                    />
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="admin-label mb-2">
                                        Imagem do Departamento
                                    </label>
                                    <div className="flex items-center gap-4">
                                        {imagePreview && (
                                            <div className="relative w-32 h-32 rounded-[10px] overflow-hidden border border-gray-200">
                                                <Image
                                                    src={imagePreview}
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
                                                    <p className="admin-upload-text"><strong>Clique para upload</strong> ou arraste e solte</p>
                                                    <p className="admin-help mt-1">
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

                                {/* Active Toggle */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        checked={formData.active}
                                        onChange={(e) => setFormData((p) => ({ ...p, active: e.target.checked }))}
                                        className="w-4 h-4 text-[var(--color-primary)] rounded focus:ring-[var(--color-primary)]"
                                    />
                                    <label htmlFor="active" className="admin-label-inline">
                                        Ativo (exibir no site)
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-2 border border-gray-300 text-[var(--color-text)] rounded-[10px] hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

