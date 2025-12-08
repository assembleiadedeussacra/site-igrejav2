/**
 * Service for fetching daily Bible verses from external APIs
 */

interface VerseResponse {
    text: string;
    reference: string;
    bible_link: string | null;
}

/**
 * Fetches daily verse from Bible.com/YouVersion API
 * Note: Bible.com doesn't have a public API, so we'll use an alternative approach
 * Using a free Bible API service
 */
export async function fetchDailyVerse(): Promise<VerseResponse | null> {
    try {
        // Using Bible API (bible-api.com) - free and public
        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
        
        // Popular verses array as fallback
        const popularVerses = [
            { text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.', reference: 'João 3:16', link: 'https://www.bible.com/pt/bible/211/JHN.3.16' },
            { text: 'Entrega o teu caminho ao Senhor; confia nele, e ele o fará.', reference: 'Salmos 37:5', link: 'https://www.bible.com/pt/bible/211/PSA.37.5' },
            { text: 'Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.', reference: 'Jeremias 29:11', link: 'https://www.bible.com/pt/bible/211/JER.29.11' },
            { text: 'Tudo posso naquele que me fortalece.', reference: 'Filipenses 4:13', link: 'https://www.bible.com/pt/bible/211/PHP.4.13' },
            { text: 'Lança sobre o Senhor o teu cuidado, e ele te susterá; nunca permitirá que o justo seja abalado.', reference: 'Salmos 55:22', link: 'https://www.bible.com/pt/bible/211/PSA.55.22' },
        ];

        // Select verse based on day of year for consistency
        const selectedVerse = popularVerses[dayOfYear % popularVerses.length];

        // Try to fetch from Bible API
        try {
            // Using verse of the day from a public API
            // API: https://beta.ourmanna.com/api/v1/get/?format=json&order=daily
            const response = await fetch('https://beta.ourmanna.com/api/v1/get/?format=json&order=daily', {
                next: { revalidate: 86400 } // Cache for 24 hours
            });

            if (response.ok) {
                const data = await response.json();
                if (data.verse && data.verse.details) {
                    return {
                        text: data.verse.details.text,
                        reference: data.verse.details.reference,
                        bible_link: `https://www.bible.com/pt/bible/211/${data.verse.details.reference.replace(/\s+/g, '.')}`,
                    };
                }
            }
        } catch (apiError) {
            console.warn('Error fetching from verse API, using fallback:', apiError);
        }

        // Fallback to predefined verses
        return {
            text: selectedVerse.text,
            reference: selectedVerse.reference,
            bible_link: selectedVerse.link,
        };
    } catch (error) {
        console.error('Error fetching daily verse:', error);
        return null;
    }
}

/**
 * Gets verse for a specific date (for caching purposes)
 */
export async function getVerseForDate(date: Date): Promise<VerseResponse | null> {
    // For now, we'll use the daily verse function
    // In the future, this could be enhanced to cache verses per date
    return fetchDailyVerse();
}

