'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Save, Loader2, Calendar, Clock } from 'lucide-react';
import { api } from '@/services/api';
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

interface Event { id: string; title: string; day_of_week: string; time_start: string; time_end: string | null; description: string | null; type: 'culto' | 'estudo' | 'oracao' | 'ebd' | 'ensaio'; active: boolean; order: number; }

const dayOptions = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
const typeOptions = [{ value: 'culto', label: 'Culto' }, { value: 'estudo', label: 'Estudo' }, { value: 'oracao', label: 'Oração' }, { value: 'ebd', label: 'EBD' }, { value: 'ensaio', label: 'Ensaio' }];
const typeColors = { culto: 'bg-blue-100 text-blue-600', estudo: 'bg-green-100 text-green-600', oracao: 'bg-purple-100 text-purple-600', ebd: 'bg-orange-100 text-orange-600', ensaio: 'bg-pink-100 text-pink-600' };

export default function AdminEventosPage() {
    const { viewMode, setViewMode } = useAdminViewMode('eventos', 'list');
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({ title: '', day_of_week: '', time_start: '', time_end: '', description: '', type: 'culto' as Event['type'], active: true });

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            setIsLoading(true);
            const data = await api.getAdminEvents();
            setEvents(data || []);
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
            toast.error('Erro ao carregar eventos. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (event?: Event) => {
        if (event) { setEditingEvent(event); setFormData({ title: event.title, day_of_week: event.day_of_week, time_start: event.time_start, time_end: event.time_end || '', description: event.description || '', type: event.type, active: event.active }); }
        else { setEditingEvent(null); setFormData({ title: '', day_of_week: '', time_start: '', time_end: '', description: '', type: 'culto', active: true }); }
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); setEditingEvent(null); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const eventData: any = {
                ...formData,
                time_end: formData.time_end || null,
                description: formData.description || null,
            };

            if (editingEvent) {
                await api.updateEvent(editingEvent.id, eventData);
            } else {
                // Calcular order para novo evento
                const maxOrder = events.length > 0 ? Math.max(...events.map(e => e.order || 0)) : -1;
                eventData.order = maxOrder + 1;
                await api.createEvent(eventData);
            }
            await loadEvents();
            toast.success(editingEvent ? 'Evento atualizado com sucesso!' : 'Evento criado com sucesso!');
            closeModal();
        } catch (error) {
            console.error('Erro ao salvar evento:', error);
            toast.error('Erro ao salvar evento. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteEvent = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.')) return;

        try {
            await api.deleteEvent(id);
            await loadEvents();
            toast.success('Evento excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir evento:', error);
            toast.error('Erro ao excluir evento. Tente novamente.');
        }
    };

    const handleReorder = async (reordered: Event[]) => {
        const previous = events;
        setEvents(reordered);
        try {
            await api.updateEventOrders(toOrderUpdates(reordered, (e) => e.id));
            toast.success('Ordem atualizada!');
        } catch (error) {
            console.error('Erro ao atualizar ordem:', error);
            setEvents(previous);
            toast.error('Erro ao atualizar ordem. Tente novamente.');
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Agenda / Eventos"
                description="Gerencie a programação fixa exibida na home"
                action={
                    <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)]">
                        <Plus className="w-5 h-5" /> Novo Evento
                    </button>
                }
            />

            <AdminListToolbar viewMode={viewMode} onViewModeChange={setViewMode} />

            <AdminPanel
                isLoading={isLoading}
                isEmpty={!isLoading && events.length === 0}
                emptyIcon={Calendar}
                emptyMessage="Nenhum evento cadastrado"
                hint="Arraste para definir a ordem na seção Agenda"
            >
                <AdminSortable
                    items={events}
                    getItemId={(e) => e.id}
                    onReorder={handleReorder}
                    layout={viewMode}
                    renderItem={(event, { dragHandle, orderBadge, layout }) =>
                        layout === 'grid' ? (
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50/80">
                                    <div className="flex items-center gap-2">{dragHandle}{orderBadge}</div>
                                    <AdminEntityActions
                                        size="sm"
                                        onEdit={() => openModal(event)}
                                        onDelete={() => deleteEvent(event.id)}
                                    />
                                </div>
                                <div className="p-4 flex-1">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${typeColors[event.type]}`}>
                                        {typeOptions.find((t) => t.value === event.type)?.label}
                                    </span>
                                    <h3 className="admin-card-title-lg mt-2">{event.title}</h3>
                                    <div className="flex flex-col gap-1 admin-card-meta mt-2">
                                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4 shrink-0" />{event.day_of_week}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-4 h-4 shrink-0" />{event.time_start}{event.time_end && ` - ${event.time_end}`}</span>
                                    </div>
                                    {event.description && (
                                        <p className="text-xs text-[var(--color-text-muted)] mt-2 line-clamp-2">{event.description}</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                        <>
                            {dragHandle}
                            {orderBadge}
                            <span className={`px-3 py-1 rounded-[10px] text-xs font-semibold shrink-0 ${typeColors[event.type]}`}>
                                {typeOptions.find((t) => t.value === event.type)?.label}
                            </span>
                            <div className="flex-1 min-w-0">
                                <h3 className="admin-card-title truncate">{event.title}</h3>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 admin-card-meta mt-0.5">
                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4 shrink-0" />{event.day_of_week}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4 shrink-0" />{event.time_start}{event.time_end && ` - ${event.time_end}`}</span>
                                </div>
                                {event.description && (
                                    <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-1">{event.description}</p>
                                )}
                            </div>
                            <AdminEntityActions
                                onEdit={() => openModal(event)}
                                onDelete={() => deleteEvent(event.id)}
                                editLabel={`Editar ${event.title}`}
                                deleteLabel={`Excluir ${event.title}`}
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
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full bg-white rounded-[10px] shadow-2xl z-50 overflow-auto max-h-[90vh]">
                            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white"><h2 className="admin-modal-title">{editingEvent ? 'Editar' : 'Novo'} Evento</h2><button onClick={closeModal} className="p-2 rounded-[10px] hover:bg-gray-100" aria-label="Fechar modal"><X className="w-5 h-5" /></button></div>
                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div><label className="admin-label mb-1">Título *</label><input type="text" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" required /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="admin-label mb-1">Dia *</label><select value={formData.day_of_week} onChange={(e) => setFormData((p) => ({ ...p, day_of_week: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" required><option value="">Selecione...</option>{dayOptions.map((d) => <option key={d} value={d}>{d}</option>)}</select></div>
                                    <div><label className="admin-label mb-1">Tipo *</label><select value={formData.type} onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value as Event['type'] }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" required>{typeOptions.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="admin-label mb-1">Início *</label><input type="time" value={formData.time_start} onChange={(e) => setFormData((p) => ({ ...p, time_start: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" required /></div>
                                    <div><label className="admin-label mb-1">Término</label><input type="time" value={formData.time_end} onChange={(e) => setFormData((p) => ({ ...p, time_end: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" /></div>
                                </div>
                                <div><label className="admin-label mb-1">Descrição</label><textarea value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none resize-none" /></div>
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
