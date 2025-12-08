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
} from 'lucide-react';

interface Leader {
    id: string;
    name: string;
    title: string;
    image_url: string;
    order: number;
    active: boolean;
}

const initialLeaders: Leader[] = [
    { id: '1', name: 'Pastor Paulo', title: 'Pastor Presidente', image_url: '/images/Pastor Paulo.jpg', order: 1, active: true },
    { id: '2', name: 'Pb. Joanides', title: 'Presbítero', image_url: '/images/Pb Joanides.jpg', order: 2, active: true },
    { id: '3', name: 'Presbitero Jonas', title: 'Presbítero', image_url: '/images/Presbitero Jonas.jpg', order: 3, active: true },
    { id: '4', name: 'Jailton', title: 'Diácono', image_url: '/images/Jailton.jpg', order: 4, active: true },
    { id: '5', name: 'Cleudijane', title: 'Diaconisa', image_url: '/images/Cleudijane.jpg', order: 5, active: true },
    { id: '6', name: 'Janaina', title: 'Diaconisa', image_url: '/images/Janaina.jpg', order: 6, active: true },
];

const titleOptions = ['Pastor', 'Presbítero', 'Diácono', 'Diaconisa', 'Evangelista', 'Missionário', 'Outro'];

export default function AdminLiderancaPage() {
    const [leaders, setLeaders] = useState<Leader[]>(initialLeaders);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        image_url: '',
        active: true,
    });

    const openModal = (leader?: Leader) => {
        if (leader) {
            setEditingLeader(leader);
            setFormData({
                name: leader.name,
                title: leader.title,
                image_url: leader.image_url,
                active: leader.active,
            });
        } else {
            setEditingLeader(null);
            setFormData({ name: '', title: '', image_url: '', active: true });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingLeader(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await new Promise((r) => setTimeout(r, 1000));

        if (editingLeader) {
            setLeaders((prev) => prev.map((l) => l.id === editingLeader.id ? { ...l, ...formData } : l));
        } else {
            const newLeader: Leader = {
                id: Date.now().toString(),
                ...formData,
                order: leaders.length + 1,
            };
            setLeaders((prev) => [...prev, newLeader]);
        }

        closeModal();
        setIsSaving(false);
    };

    const deleteLeader = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este líder?')) return;
        setLeaders((prev) => prev.filter((l) => l.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-accent)]">Liderança</h1>
                    <p className="text-[var(--color-text-secondary)]">Gerencie os líderes da igreja</p>
                </div>
                <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[20px] hover:bg-[var(--color-accent-light)] transition-colors">
                    <Plus className="w-5 h-5" /> Novo Líder
                </button>
            </div>

            <div className="bg-white rounded-[20px] shadow-lg overflow-hidden">
                {leaders.length === 0 ? (
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
                                className="bg-gray-50 rounded-[20px] p-4 flex flex-col items-center text-center group"
                            >
                                <div className="relative w-24 h-24 rounded-[20px] overflow-hidden mb-4 border-4 border-[var(--color-primary)]">
                                    <Image src={leader.image_url} alt={leader.name} fill className="object-cover" />
                                </div>
                                <h3 className="font-bold text-[var(--color-accent)]">{leader.name}</h3>
                                <p className="text-sm text-[var(--color-text-secondary)]">{leader.title}</p>
                                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openModal(leader)} className="p-2 rounded-[20px] bg-blue-100 text-blue-600 hover:bg-blue-200">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => deleteLeader(leader.id)} className="p-2 rounded-[20px] bg-red-100 text-red-600 hover:bg-red-200">
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
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full bg-white rounded-[20px] shadow-2xl z-50 overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h2 className="text-xl font-bold text-[var(--color-accent)]">{editingLeader ? 'Editar Líder' : 'Novo Líder'}</h2>
                                <button onClick={closeModal} className="p-2 rounded-[20px] hover:bg-gray-100"><X className="w-5 h-5" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Nome *</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2 rounded-[20px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Cargo *</label>
                                    <select value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2 rounded-[20px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none" required>
                                        <option value="">Selecione...</option>
                                        {titleOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1">URL da Foto *</label>
                                    <input type="url" value={formData.image_url} onChange={(e) => setFormData((p) => ({ ...p, image_url: e.target.value }))} className="w-full px-4 py-2 rounded-[20px] border border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none" required />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-200 rounded-[20px] hover:bg-gray-50">Cancelar</button>
                                    <button type="submit" disabled={isSaving} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[20px] hover:bg-[var(--color-accent-light)] disabled:opacity-70">
                                        {isSaving ? <><Loader2 className="w-5 h-5 animate-spin" />Salvando...</> : <><Save className="w-5 h-5" />Salvar</>}
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
