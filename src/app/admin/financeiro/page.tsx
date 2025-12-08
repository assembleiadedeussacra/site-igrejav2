'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Copy, Check, QrCode, Save, Loader2, Wallet } from 'lucide-react';

export default function AdminFinanceiroPage() {
    const [pixKey, setPixKey] = useState('34984327019');
    const [qrcodeUrl, setQrcodeUrl] = useState('/images/qrcode-pix.png');
    const [isSaving, setIsSaving] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyPixKey = async () => {
        await navigator.clipboard.writeText(pixKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await new Promise((r) => setTimeout(r, 1000));
        setIsSaving(false);
        alert('Configurações salvas com sucesso!');
    };

    return (
        <div className="space-y-6">
            <div><h1 className="text-2xl font-bold text-[var(--color-accent)]">Dízimos e Ofertas</h1><p className="text-[var(--color-text-secondary)]">Configure as informações de PIX para contribuições</p></div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Preview */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)] rounded-[20px] p-6 text-white">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Wallet className="w-5 h-5" /> Preview</h2>
                    <div className="bg-white/10 backdrop-blur-sm rounded-[20px] p-4 mb-4">
                        <p className="text-white/80 text-sm uppercase tracking-wider mb-2">Chave PIX</p>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold font-mono">{pixKey}</span>
                            <button onClick={copyPixKey} className={`p-2 rounded-[20px] transition-colors ${copied ? 'bg-green-500' : 'bg-white/20 hover:bg-white/30'}`}>{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button>
                        </div>
                    </div>
                    <div className="bg-white rounded-[20px] p-4 inline-block">
                        <div className="flex items-center gap-2 text-[var(--color-accent)] mb-2"><QrCode className="w-4 h-4" /><span className="text-sm font-medium">QR Code</span></div>
                        <div className="relative w-32 h-32"><Image src={qrcodeUrl} alt="QR Code PIX" fill className="object-contain" /></div>
                    </div>
                </motion.div>

                {/* Form */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[20px] shadow-lg p-6">
                    <h2 className="text-lg font-bold text-[var(--color-accent)] mb-4">Configurações</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div><label className="block text-sm font-medium mb-1">Chave PIX *</label><input type="text" value={pixKey} onChange={(e) => setPixKey(e.target.value)} className="w-full px-4 py-2 rounded-[20px] border focus:border-[var(--color-accent)] outline-none" required /></div>
                        <div><label className="block text-sm font-medium mb-1">URL do QR Code *</label><input type="url" value={qrcodeUrl} onChange={(e) => setQrcodeUrl(e.target.value)} className="w-full px-4 py-2 rounded-[20px] border focus:border-[var(--color-accent)] outline-none" required /><p className="text-xs text-gray-500 mt-1">URL da imagem do QR Code</p></div>
                        <button type="submit" disabled={isSaving} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)] disabled:opacity-70">{isSaving ? <><Loader2 className="w-5 h-5 animate-spin" />Salvando...</> : <><Save className="w-5 h-5" />Salvar</>}</button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
