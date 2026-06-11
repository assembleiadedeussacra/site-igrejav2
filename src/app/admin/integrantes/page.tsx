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
    Users,
} from 'lucide-react';
import { api } from '@/services/api';
import { DepartmentMember, Department } from '@/lib/database.types';
import { uploadDepartmentMemberImage } from '@/lib/supabase/storage';
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

export default function AdminIntegrantesPage() {
    const { viewMode, setViewMode } = useAdminViewMode('integrantes', 'list');
    const [members, setMembers] = useState<DepartmentMember[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<DepartmentMember | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    const [formData, setFormData] = useState({
        department_id: '',
        name: '',
        role: '',
        image_url: '',
        order: 0,
        active: true,
    });

    const loadDepartments = async () => {
        try {
            const data = await api.getAdminDepartments();
            setDepartments(data);
        } catch (error) {
            console.error('Error loading departments:', error);
        }
    };

    const loadMembers = async () => {
        setIsLoading(true);
        try {
            const data = selectedDepartment === 'all'
                ? await api.getAdminDepartmentMembers()
                : await api.getAdminDepartmentMembers(selectedDepartment);
            setMembers(data);
        } catch (error) {
            console.error('Error loading members:', error);
            toast.error('Erro ao carregar integrantes. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDepartments();
    }, []);

    useEffect(() => {
        loadMembers();
    }, [selectedDepartment]);

    const openModal = (member?: DepartmentMember) => {
        if (member) {
            setEditingMember(member);
            setFormData({
                department_id: member.department_id,
                name: member.name,
                role: member.role,
                image_url: member.image_url,
                order: member.order,
                active: member.active,
            });
            setImagePreview(member.image_url);
        } else {
            setEditingMember(null);
            setFormData({
                department_id: selectedDepartment !== 'all' ? selectedDepartment : departments[0]?.id || '',
                name: '',
                role: '',
                image_url: '',
                order: members.length,
                active: true,
            });
            setImagePreview('');
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingMember(null);
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
                    const memberId = editingMember?.id || 'new';
                    imageUrl = await uploadDepartmentMemberImage(imageFile, memberId);
                } catch (error: any) {
                    toast.error(`Erro ao fazer upload da imagem: ${error.message}`);
                    setIsSaving(false);
                    setIsUploading(false);
                    return;
                } finally {
                    setIsUploading(false);
                }
            }

            if (!imageUrl && !editingMember) {
                toast.error('Por favor, faça upload de uma foto do integrante.');
                setIsSaving(false);
                return;
            }

            const memberData = {
                department_id: formData.department_id,
                name: formData.name,
                role: formData.role,
                image_url: imageUrl || formData.image_url,
                order: formData.order,
                active: formData.active,
            };

            if (editingMember) {
                await api.updateDepartmentMember(editingMember.id, memberData);
                toast.success('Integrante atualizado com sucesso!');
            } else {
                await api.createDepartmentMember(memberData);
                toast.success('Integrante criado com sucesso!');
            }

            await loadMembers();
            closeModal();
        } catch (error: any) {
            console.error('Error saving member:', error);
            toast.error(`Erro ao salvar integrante: ${error.message || 'Verifique os dados e tente novamente.'}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este integrante?')) return;

        try {
            await api.deleteDepartmentMember(id);
            toast.success('Integrante excluído com sucesso!');
            await loadMembers();
        } catch (error: any) {
            console.error('Error deleting member:', error);
            toast.error(`Erro ao excluir integrante: ${error.message}`);
        }
    };

    const handleReorder = async (reordered: DepartmentMember[]) => {
        const previous = members;
        setMembers(reordered);
        try {
            await api.updateDepartmentMemberOrders(toOrderUpdates(reordered, (m) => m.id));
            toast.success('Ordem atualizada!');
        } catch (error) {
            console.error('Error moving member:', error);
            setMembers(previous);
            toast.error('Erro ao atualizar ordem.');
        }
    };

    const getDepartmentName = (departmentId: string) => {
        return departments.find((d) => d.id === departmentId)?.name || 'Desconhecido';
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Integrantes dos Departamentos"
                description="Gerencie os integrantes exibidos em cada departamento"
                action={
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)] transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Integrante
                    </button>
                }
            />

            <div className="admin-card bg-white rounded-[10px] shadow-lg border border-gray-100 p-4 sm:p-5">
                <label className="admin-label mb-2">
                    Filtrar por Departamento
                </label>
                <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full md:max-w-md px-4 py-2 border border-gray-200 rounded-[10px] focus:border-[var(--color-accent)] outline-none admin-input"
                >
                    <option value="all">Todos os Departamentos</option>
                    {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                            {dept.name}
                        </option>
                    ))}
                </select>
            </div>

            <AdminListToolbar viewMode={viewMode} onViewModeChange={setViewMode} />

            <AdminPanel
                isLoading={isLoading}
                isEmpty={!isLoading && members.length === 0}
                emptyIcon={Users}
                emptyMessage="Nenhum integrante encontrado"
                hint="Arraste para definir a ordem dentro do departamento"
            >
                <AdminSortable
                    items={members}
                    getItemId={(m) => m.id}
                    onReorder={handleReorder}
                    layout={viewMode}
                    renderItem={(member, { dragHandle, orderBadge, layout }) =>
                        layout === 'grid' ? (
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50/80">
                                    <div className="flex items-center gap-2">{dragHandle}{orderBadge}</div>
                                    <AdminEntityActions size="sm" onEdit={() => openModal(member)} onDelete={() => handleDelete(member.id)} />
                                </div>
                                <div className="flex flex-col items-center text-center p-5 flex-1">
                                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 mb-3 border-2 border-[var(--color-primary)]">
                                        {hasValidImageUrl(member.image_url) ? (
                                            <Image src={member.image_url} alt={member.name} fill className="object-cover" sizes="80px" />
                                        ) : (
                                            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[var(--color-accent)]">
                                                {member.name.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="admin-card-title">{member.name}</h3>
                                    <p className="admin-card-desc mt-0.5">{member.role}</p>
                                    <p className="admin-card-meta mt-1">{getDepartmentName(member.department_id)}</p>
                                    <span className={`mt-3 inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${member.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                        {member.active ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                        <>
                            {dragHandle}
                            {orderBadge}
                            <div className="relative w-14 h-14 rounded-[10px] overflow-hidden bg-gray-100 flex-shrink-0">
                                {hasValidImageUrl(member.image_url) ? (
                                    <Image src={member.image_url} alt={member.name} fill className="object-cover" sizes="56px" />
                                ) : (
                                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[var(--color-accent)]">
                                        {member.name.charAt(0)}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="admin-card-title">{member.name}</h3>
                                <p className="admin-card-desc">{member.role}</p>
                                <p className="admin-card-meta mt-0.5">
                                    {getDepartmentName(member.department_id)}
                                </p>
                            </div>
                            <div className="shrink-0" title={member.active ? 'Visível' : 'Oculto'}>
                                {member.active ? (
                                    <Eye className="w-5 h-5 text-green-500" />
                                ) : (
                                    <EyeOff className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                            <AdminEntityActions
                                onEdit={() => openModal(member)}
                                onDelete={() => handleDelete(member.id)}
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
                                    {editingMember ? 'Editar Integrante' : 'Novo Integrante'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-[10px] hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Department */}
                                <div>
                                    <label className="admin-label mb-2">
                                        Departamento *
                                    </label>
                                    <select
                                        value={formData.department_id}
                                        onChange={(e) => setFormData((p) => ({ ...p, department_id: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                                        required
                                    >
                                        <option value="">Selecione um departamento</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="admin-label mb-2">
                                        Nome *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                                        placeholder="Nome completo"
                                        required
                                    />
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="admin-label mb-2">
                                        Cargo/Função *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                                        placeholder="Ex: Professor, Líder, Regente"
                                        required
                                    />
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="admin-label mb-2">
                                        Foto do Integrante *
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

