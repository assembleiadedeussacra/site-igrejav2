import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { Errors } from '@/lib/errors';

const CONTACT_PER_HOUR = 5;

const contactSchema = z.object({
    name: z.string().trim().min(2, 'Nome muito curto').max(100),
    email: z
        .string()
        .trim()
        .email('E-mail inválido')
        .max(200)
        .optional()
        .or(z.literal('')),
    phone: z.string().trim().max(20).optional().or(z.literal('')),
    subject: z.string().trim().max(200).optional().or(z.literal('')),
    message: z.string().trim().min(10, 'Mensagem muito curta').max(5000),
    type: z.enum(['contact', 'prayer']).default('contact'),
    website: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const ip =
            request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') ||
            'unknown';

        if (!checkRateLimit(`contact:ip:${ip}`, CONTACT_PER_HOUR)) {
            return NextResponse.json(Errors.RATE_LIMIT_EXCEEDED(), { status: 429 });
        }

        const body = await request.json();
        const parsed = contactSchema.safeParse(body);

        if (!parsed.success) {
            const message = parsed.error.issues[0]?.message || 'Dados inválidos';
            return NextResponse.json({ error: message }, { status: 400 });
        }

        const { name, email, phone, subject, message, type, website } = parsed.data;

        if (website && website.trim().length > 0) {
            return NextResponse.json({ success: true });
        }

        const supabase = await createClient();
        const { error } = await supabase.from('contact_messages').insert([
            {
                name,
                email: email || null,
                phone: phone || null,
                subject: subject || null,
                message,
                type,
                status: 'new',
            },
        ]);

        if (error) {
            console.error('Error saving contact message:', error);
            return NextResponse.json(
                { error: 'Não foi possível enviar a mensagem. Tente novamente.' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in contact route:', error);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}
