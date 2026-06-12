'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    Loader2,
    Heart,
    MessageSquare,
    Archive,
    Check,
    Trash2,
    Phone,
} from 'lucide-react';
import { api } from '@/services/api';
import { ContactMessage } from '@/lib/database.types';
import { AdminPageHeader, AdminPanel } from '@/components/admin';
import toast from 'react-hot-toast';

function formatDate(iso: string) {
    return new Date(iso).toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function AdminContatosPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'archived'>('all');

    const loadMessages = async () => {
        setIsLoading(true);
        try {
            const data = await api.getContactMessages();
            setMessages(data);
        } catch {
            toast.error('Erro ao carregar mensagens.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);

    const updateStatus = async (id: string, status: ContactMessage['status']) => {
        try {
            await api.updateContactMessageStatus(id, status);
            setMessages((prev) =>
                prev.map((m) => (m.id === id ? { ...m, status } : m))
            );
            toast.success('Status atualizado.');
        } catch {
            toast.error('Erro ao atualizar status.');
        }
    };

    const deleteMessage = async (id: string) => {
        if (!confirm('Excluir esta mensagem permanentemente?')) return;
        try {
            await api.deleteContactMessage(id);
            setMessages((prev) => prev.filter((m) => m.id !== id));
            toast.success('Mensagem excluída.');
        } catch {
            toast.error('Erro ao excluir mensagem.');
        }
    };

    const filtered = messages.filter((m) => filter === 'all' || m.status === filter);
    const newCount = messages.filter((m) => m.status === 'new').length;

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Mensagens de Contato"
                description="Formulários enviados pelo site — contato geral e pedidos de oração."
            />

            <div className="flex flex-wrap gap-2">
                {(
                    [
                        ['all', 'Todas'],
                        ['new', `Novas (${newCount})`],
                        ['read', 'Lidas'],
                        ['archived', 'Arquivadas'],
                    ] as const
                ).map(([key, label]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => setFilter(key)}
                        className={`px-4 py-2 rounded-[10px] text-sm font-medium transition-colors ${
                            filter === key
                                ? 'bg-[var(--color-accent)] text-white'
                                : 'bg-white border border-gray-200 text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)]" />
                </div>
            ) : filtered.length === 0 ? (
                <AdminPanel>
                    <p className="text-center text-[var(--color-text-secondary)] py-8">
                        Nenhuma mensagem encontrada.
                    </p>
                </AdminPanel>
            ) : (
                <div className="space-y-4">
                    {filtered.map((msg, index) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                        >
                            <AdminPanel>
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                    <div
                                        className={`w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0 ${
                                            msg.type === 'prayer'
                                                ? 'bg-pink-100 text-pink-600'
                                                : 'bg-blue-100 text-blue-600'
                                        }`}
                                    >
                                        {msg.type === 'prayer' ? (
                                            <Heart className="w-6 h-6" />
                                        ) : (
                                            <MessageSquare className="w-6 h-6" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-[var(--color-accent)]">
                                                {msg.name}
                                            </h3>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full ${
                                                    msg.status === 'new'
                                                        ? 'bg-green-100 text-green-700'
                                                        : msg.status === 'read'
                                                          ? 'bg-gray-100 text-gray-600'
                                                          : 'bg-amber-100 text-amber-700'
                                                }`}
                                            >
                                                {msg.status === 'new'
                                                    ? 'Nova'
                                                    : msg.status === 'read'
                                                      ? 'Lida'
                                                      : 'Arquivada'}
                                            </span>
                                            <span className="text-xs text-[var(--color-text-secondary)]">
                                                {msg.type === 'prayer'
                                                    ? 'Pedido de oração'
                                                    : 'Contato'}
                                            </span>
                                        </div>

                                        {msg.subject && (
                                            <p className="text-sm font-medium mb-1">{msg.subject}</p>
                                        )}

                                        <p className="text-[var(--color-text-secondary)] whitespace-pre-wrap mb-3">
                                            {msg.message}
                                        </p>

                                        <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)]">
                                            {msg.email && (
                                                <a
                                                    href={`mailto:${msg.email}`}
                                                    className="flex items-center gap-1 hover:text-[var(--color-accent)]"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                    {msg.email}
                                                </a>
                                            )}
                                            {msg.phone && (
                                                <span className="flex items-center gap-1">
                                                    <Phone className="w-4 h-4" />
                                                    {msg.phone}
                                                </span>
                                            )}
                                            <span>{formatDate(msg.created_at)}</span>
                                        </div>
                                    </div>

                                    <div className="flex sm:flex-col gap-2 flex-shrink-0">
                                        {msg.status !== 'read' && (
                                            <button
                                                type="button"
                                                onClick={() => updateStatus(msg.id, 'read')}
                                                className="p-2 rounded-[8px] border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-colors"
                                                title="Marcar como lida"
                                            >
                                                <Check className="w-4 h-4 text-green-600" />
                                            </button>
                                        )}
                                        {msg.status !== 'archived' && (
                                            <button
                                                type="button"
                                                onClick={() => updateStatus(msg.id, 'archived')}
                                                className="p-2 rounded-[8px] border border-gray-200 hover:bg-amber-50 hover:border-amber-300 transition-colors"
                                                title="Arquivar"
                                            >
                                                <Archive className="w-4 h-4 text-amber-600" />
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => deleteMessage(msg.id)}
                                            className="p-2 rounded-[8px] border border-gray-200 hover:bg-red-50 hover:border-red-300 transition-colors"
                                            title="Excluir"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </AdminPanel>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
