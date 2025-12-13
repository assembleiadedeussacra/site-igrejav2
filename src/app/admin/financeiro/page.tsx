'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Copy, Check, QrCode, Save, Loader2, Wallet, Upload } from 'lucide-react';
import { api } from '@/services/api';
import { Financial } from '@/lib/database.types';
import { uploadQRCode } from '@/lib/supabase/storage';
import toast from 'react-hot-toast';

export default function AdminFinanceiroPage() {
    const [pixKey, setPixKey] = useState('');
    const [qrcodeUrl, setQrcodeUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [qrcodeFile, setQrcodeFile] = useState<File | null>(null);
    const [qrcodePreview, setQrcodePreview] = useState<string>('');
    const [copied, setCopied] = useState(false);

    const loadFinancials = async () => {
        setIsLoading(true);
        try {
            const data = await api.getAdminFinancials() as Financial | null;
            if (data) {
                setPixKey(data.pix_key || '');
                setQrcodeUrl(data.pix_qrcode_url || '');
                setQrcodePreview(data.pix_qrcode_url || '');
            }
        } catch (error) {
            console.error('Error loading financials:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFinancials();
    }, []);

    const copyPixKey = async () => {
        await navigator.clipboard.writeText(pixKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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

        setQrcodeFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setQrcodePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            let finalQrcodeUrl = qrcodeUrl;

            // Upload QR Code if a new file was selected
            if (qrcodeFile) {
                setIsUploading(true);
                finalQrcodeUrl = await uploadQRCode(qrcodeFile);
                setQrcodeUrl(finalQrcodeUrl);
                setIsUploading(false);
            }

            await api.updateFinancials({
                pix_key: pixKey,
                pix_qrcode_url: finalQrcodeUrl,
                active: true,
            });
            toast.success('Configurações salvas com sucesso!');
            setQrcodeFile(null);
        } catch (error) {
            console.error('Error saving financials:', error);
            toast.error('Erro ao salvar configurações. Tente novamente.');
            setIsUploading(false);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div><h1 className="text-2xl md:text-[28px] font-bold text-[var(--color-accent)]">Dízimos e Ofertas</h1><p className="text-[var(--color-text-secondary)] text-sm">Configure as informações de PIX para contribuições</p></div>

            {isLoading ? (
                <div className="bg-white rounded-[10px] shadow-lg p-12 text-center">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-[var(--color-accent)]" />
                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Preview */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] rounded-[10px] p-6 text-white">
                    <h2 className="text-xl md:text-[24px] font-bold mb-4 flex items-center gap-2"><Wallet className="w-5 h-5" /> Preview</h2>
                    <div className="bg-white/10 backdrop-blur-sm rounded-[10px] p-4 mb-4">
                        <p className="text-white/80 text-sm uppercase tracking-wider mb-2">Chave PIX</p>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold font-mono">{pixKey}</span>
                            <button onClick={copyPixKey} className={`p-2 rounded-[10px] transition-colors ${copied ? 'bg-green-500' : 'bg-white/20 hover:bg-white/30'}`}>{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button>
                        </div>
                    </div>
                    {qrcodePreview && (
                        <div className="bg-white rounded-[10px] p-4 inline-block">
                            <div className="flex items-center gap-2 text-[var(--color-accent)] mb-2"><QrCode className="w-4 h-4" /><span className="text-sm font-medium">QR Code</span></div>
                            <div className="relative w-32 h-32"><Image src={qrcodePreview} alt="QR Code PIX" fill className="object-contain" /></div>
                        </div>
                    )}
                </motion.div>

                {/* Form */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[10px] shadow-lg p-6">
                    <h2 className="text-xl md:text-[24px] font-bold text-[var(--color-accent)] mb-4">Configurações</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div><label className="block text-sm font-medium mb-1">Chave PIX *</label><input type="text" value={pixKey} onChange={(e) => setPixKey(e.target.value)} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" required /></div>
                        <div>
                            <label className="block text-sm font-medium mb-1">QR Code *</label>
                            <div className="space-y-2">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-[10px] cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden">
                                    {qrcodePreview ? (
                                        <div className="relative w-full h-full">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={qrcodePreview} alt="QR Code Preview" className="w-full h-full object-contain" />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                            <p className="text-sm text-gray-500">Clique para fazer upload</p>
                                            <p className="text-xs text-gray-400">PNG, JPG até 2MB</p>
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
                        <button type="submit" disabled={isSaving || isUploading} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)] disabled:opacity-70">{(isSaving || isUploading) ? <><Loader2 className="w-5 h-5 animate-spin" />Salvando...</> : <><Save className="w-5 h-5" />Salvar</>}</button>
                    </form>
                </motion.div>
            </div>
            )}
        </div>
    );
}
