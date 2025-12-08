'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, Loader2, Calendar, Clock, Check } from 'lucide-react';
import { api } from '@/services/api';

interface Event { id: string; title: string; day_of_week: string; time_start: string; time_end: string | null; description: string | null; type: 'culto' | 'estudo' | 'oracao' | 'ebd'; active: boolean; }

const dayOptions = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
const typeOptions = [{ value: 'culto', label: 'Culto' }, { value: 'estudo', label: 'Estudo' }, { value: 'oracao', label: 'Oração' }, { value: 'ebd', label: 'EBD' }];
const typeColors = { culto: 'bg-blue-100 text-blue-600', estudo: 'bg-green-100 text-green-600', oracao: 'bg-purple-100 text-purple-600', ebd: 'bg-orange-100 text-orange-600' };

export default function AdminEventosPage() {
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
            alert('Erro ao carregar eventos. Tente novamente.');
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
            const eventData = {
                ...formData,
                time_end: formData.time_end || null,
                description: formData.description || null,
            };

            if (editingEvent) {
                await api.updateEvent(editingEvent.id, eventData);
            } else {
                await api.createEvent(eventData);
            }
            await loadEvents();
            closeModal();
        } catch (error) {
            console.error('Erro ao salvar evento:', error);
            alert('Erro ao salvar evento. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteEvent = async (id: string) => {
        if (!confirm('Excluir este evento?')) return;

        try {
            await api.deleteEvent(id);
            await loadEvents();
        } catch (error) {
            console.error('Erro ao excluir evento:', error);
            alert('Erro ao excluir evento. Tente novamente.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div><h1 className="text-lg font-bold text-[var(--color-accent)]">Agenda / Eventos</h1><p className="text-[var(--color-text-secondary)] text-sm">Gerencie a programação fixa da igreja</p></div>
                <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)]"><Plus className="w-5 h-5" /> Novo Evento</button>
            </div>

            <div className="bg-white rounded-[20px] shadow-lg overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="w-16 h-16 mx-auto mb-4 text-gray-300 animate-spin" />
                        <p className="text-[var(--color-text-secondary)]">Carregando eventos...</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="p-12 text-center">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-[var(--color-text-secondary)]">Nenhum evento cadastrado</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {events.map((event, index) => (
                        <motion.div key={event.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                            <span className={`px-3 py-1 rounded-[20px] text-xs font-semibold ${typeColors[event.type]}`}>{typeOptions.find((t) => t.value === event.type)?.label}</span>
                            <div className="flex-1">
                                <h3 className="font-bold text-[var(--color-accent)]">{event.title}</h3>
                                <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{event.day_of_week}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{event.time_start}{event.time_end && ` - ${event.time_end}`}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openModal(event)} className="p-2 rounded-[20px] text-blue-600 hover:bg-blue-50"><Pencil className="w-5 h-5" /></button>
                                <button onClick={() => deleteEvent(event.id)} className="p-2 rounded-[20px] text-red-600 hover:bg-red-50"><Trash2 className="w-5 h-5" /></button>
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
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full bg-white rounded-[20px] shadow-2xl z-50 overflow-auto max-h-[90vh]">
                            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white"><h2 className="text-lg font-bold text-[var(--color-accent)]">{editingEvent ? 'Editar' : 'Novo'} Evento</h2><button onClick={closeModal} className="p-2 rounded-[20px] hover:bg-gray-100"><X className="w-5 h-5" /></button></div>
                            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                                <div><label className="block text-sm font-medium mb-1">Título *</label><input type="text" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2 rounded-[20px] border focus:border-[var(--color-accent)] outline-none" required /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-medium mb-1">Dia *</label><select value={formData.day_of_week} onChange={(e) => setFormData((p) => ({ ...p, day_of_week: e.target.value }))} className="w-full px-4 py-2 rounded-[20px] border focus:border-[var(--color-accent)] outline-none" required><option value="">Selecione...</option>{dayOptions.map((d) => <option key={d} value={d}>{d}</option>)}</select></div>
                                    <div><label className="block text-sm font-medium mb-1">Tipo *</label><select value={formData.type} onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value as Event['type'] }))} className="w-full px-4 py-2 rounded-[20px] border focus:border-[var(--color-accent)] outline-none" required>{typeOptions.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-medium mb-1">Início *</label><input type="time" value={formData.time_start} onChange={(e) => setFormData((p) => ({ ...p, time_start: e.target.value }))} className="w-full px-4 py-2 rounded-[20px] border focus:border-[var(--color-accent)] outline-none" required /></div>
                                    <div><label className="block text-sm font-medium mb-1">Término</label><input type="time" value={formData.time_end} onChange={(e) => setFormData((p) => ({ ...p, time_end: e.target.value }))} className="w-full px-4 py-2 rounded-[20px] border focus:border-[var(--color-accent)] outline-none" /></div>
                                </div>
                                <div><label className="block text-sm font-medium mb-1">Descrição</label><textarea value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-4 py-2 rounded-[20px] border focus:border-[var(--color-accent)] outline-none resize-none" /></div>
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
