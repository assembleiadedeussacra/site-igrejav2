import { getCachedSettings } from '@/lib/cache';
import { generateChurchSchema } from '@/lib/seo/schema';
import JsonLd from './JsonLd';

export default async function ChurchStructuredData() {
    let settings = null;

    try {
        settings = await getCachedSettings();
    } catch {
        // Usa valores padrão do schema
    }

    return <JsonLd data={generateChurchSchema(settings)} />;
}
