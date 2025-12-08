'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Loader2, MapPin, Mail, Phone, Instagram, Calendar } from 'lucide-react';

export default function AdminConfiguracoesPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        church_name: 'Assembleia de Deus Missão',
        church_address: 'Rua Carlos R da Cunha n° 90',
        church_city: 'Sacramento - MG',
        church_cep: '38190-000',
        phone: '34984327019',
        email: 'contato@assembleiasacramento.com.br',
        instagram_url: 'https://www.instagram.com/assembleiasacramento/',
        instagram_handle: '@assembleiasacramento',
        google_calendar_embed: 'https://calendar.google.com/calendar/embed?...',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await new Promise((r) => setTimeout(r, 1000));
        setIsSaving(false);
        alert('Configurações salvas com sucesso!');
    };

    return (
        <div className="space-y-6">
            <div><h1 className="text-2xl font-bold text-[var(--color-accent)]">Configurações</h1><p className="text-[var(--color-text-secondary)]">Configure as informações gerais do site</p></div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Church Info */}
                    <div>
                        <h2 className="text-lg font-bold text-[var(--color-accent)] mb-4 flex items-center gap-2"><Settings className="w-5 h-5" /> Informações da Igreja</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Nome da Igreja</label><input type="text" value={formData.church_name} onChange={(e) => setFormData((p) => ({ ...p, church_name: e.target.value }))} className="w-full px-4 py-2 rounded-lg border focus:border-[var(--color-accent)] outline-none" /></div>
                            <div><label className="block text-sm font-medium mb-1">Endereço</label><input type="text" value={formData.church_address} onChange={(e) => setFormData((p) => ({ ...p, church_address: e.target.value }))} className="w-full px-4 py-2 rounded-lg border focus:border-[var(--color-accent)] outline-none" /></div>
                            <div><label className="block text-sm font-medium mb-1">Cidade/Estado</label><input type="text" value={formData.church_city} onChange={(e) => setFormData((p) => ({ ...p, church_city: e.target.value }))} className="w-full px-4 py-2 rounded-lg border focus:border-[var(--color-accent)] outline-none" /></div>
                            <div><label className="block text-sm font-medium mb-1">CEP</label><input type="text" value={formData.church_cep} onChange={(e) => setFormData((p) => ({ ...p, church_cep: e.target.value }))} className="w-full px-4 py-2 rounded-lg border focus:border-[var(--color-accent)] outline-none" /></div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h2 className="text-lg font-bold text-[var(--color-accent)] mb-4 flex items-center gap-2"><Mail className="w-5 h-5" /> Contato</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium mb-1">Telefone/WhatsApp</label><input type="text" value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-2 rounded-lg border focus:border-[var(--color-accent)] outline-none" /></div>
                            <div><label className="block text-sm font-medium mb-1">E-mail</label><input type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} className="w-full px-4 py-2 rounded-lg border focus:border-[var(--color-accent)] outline-none" /></div>
                        </div>
                    </div>

                    {/* Social */}
                    <div>
                        <h2 className="text-lg font-bold text-[var(--color-accent)] mb-4 flex items-center gap-2"><Instagram className="w-5 h-5" /> Redes Sociais</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium mb-1">URL do Instagram</label><input type="url" value={formData.instagram_url} onChange={(e) => setFormData((p) => ({ ...p, instagram_url: e.target.value }))} className="w-full px-4 py-2 rounded-lg border focus:border-[var(--color-accent)] outline-none" /></div>
                            <div><label className="block text-sm font-medium mb-1">Handle do Instagram</label><input type="text" value={formData.instagram_handle} onChange={(e) => setFormData((p) => ({ ...p, instagram_handle: e.target.value }))} className="w-full px-4 py-2 rounded-lg border focus:border-[var(--color-accent)] outline-none" /></div>
                        </div>
                    </div>

                    {/* Embed */}
                    <div>
                        <h2 className="text-lg font-bold text-[var(--color-accent)] mb-4 flex items-center gap-2"><Calendar className="w-5 h-5" /> Integrações</h2>
                        <div><label className="block text-sm font-medium mb-1">URL do Google Calendar Embed</label><input type="url" value={formData.google_calendar_embed} onChange={(e) => setFormData((p) => ({ ...p, google_calendar_embed: e.target.value }))} className="w-full px-4 py-2 rounded-lg border focus:border-[var(--color-accent)] outline-none" /></div>
                    </div>

                    <button type="submit" disabled={isSaving} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-light)] disabled:opacity-70">{isSaving ? <><Loader2 className="w-5 h-5 animate-spin" />Salvando...</> : <><Save className="w-5 h-5" />Salvar Configurações</>}</button>
                </form>
            </motion.div>
        </div>
    );
}
