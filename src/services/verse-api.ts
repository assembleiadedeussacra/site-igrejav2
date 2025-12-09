/**
 * Service for fetching daily Bible verses in Portuguese (PT-BR)
 */

interface VerseResponse {
    text: string;
    reference: string;
    bible_link: string | null;
}

/**
 * Coleção de versículos em português brasileiro (PT-BR)
 * Baseado na versão Almeida Revista e Corrigida (ARC)
 */
const versesPTBR: VerseResponse[] = [
    { text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.', reference: 'João 3:16', bible_link: 'https://www.bible.com/pt/bible/211/JHN.3.16' },
    { text: 'Entrega o teu caminho ao Senhor; confia nele, e ele o fará.', reference: 'Salmos 37:5', bible_link: 'https://www.bible.com/pt/bible/211/PSA.37.5' },
    { text: 'Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.', reference: 'Jeremias 29:11', bible_link: 'https://www.bible.com/pt/bible/211/JER.29.11' },
    { text: 'Tudo posso naquele que me fortalece.', reference: 'Filipenses 4:13', bible_link: 'https://www.bible.com/pt/bible/211/PHP.4.13' },
    { text: 'Lança sobre o Senhor o teu cuidado, e ele te susterá; nunca permitirá que o justo seja abalado.', reference: 'Salmos 55:22', bible_link: 'https://www.bible.com/pt/bible/211/PSA.55.22' },
    { text: 'O Senhor é o meu pastor; nada me faltará.', reference: 'Salmos 23:1', bible_link: 'https://www.bible.com/pt/bible/211/PSA.23.1' },
    { text: 'Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.', reference: 'Provérbios 3:5', bible_link: 'https://www.bible.com/pt/bible/211/PRO.3.5' },
    { text: 'Porque para Deus nada é impossível.', reference: 'Lucas 1:37', bible_link: 'https://www.bible.com/pt/bible/211/LUK.1.37' },
    { text: 'Mas buscai primeiro o reino de Deus, e a sua justiça, e todas essas coisas vos serão acrescentadas.', reference: 'Mateus 6:33', bible_link: 'https://www.bible.com/pt/bible/211/MAT.6.33' },
    { text: 'Porque onde estiver o teu tesouro, aí estará também o teu coração.', reference: 'Mateus 6:21', bible_link: 'https://www.bible.com/pt/bible/211/MAT.6.21' },
    { text: 'Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.', reference: 'Isaías 41:10', bible_link: 'https://www.bible.com/pt/bible/211/ISA.41.10' },
    { text: 'Porque a palavra de Deus é viva e eficaz, e mais penetrante do que espada alguma de dois gumes.', reference: 'Hebreus 4:12', bible_link: 'https://www.bible.com/pt/bible/211/HEB.4.12' },
    { text: 'E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.', reference: 'Romanos 8:28', bible_link: 'https://www.bible.com/pt/bible/211/ROM.8.28' },
    { text: 'Mas, como está escrito: As coisas que o olho não viu, e o ouvido não ouviu, e não subiram ao coração do homem são as que Deus preparou para os que o amam.', reference: '1 Coríntios 2:9', bible_link: 'https://www.bible.com/pt/bible/211/1CO.2.9' },
    { text: 'Porque pela graça sois salvos, por meio da fé; e isso não vem de vós; é dom de Deus.', reference: 'Efésios 2:8', bible_link: 'https://www.bible.com/pt/bible/211/EPH.2.8' },
    { text: 'Ora, a fé é o firme fundamento das coisas que se esperam e a prova das coisas que se não veem.', reference: 'Hebreus 11:1', bible_link: 'https://www.bible.com/pt/bible/211/HEB.11.1' },
    { text: 'Mas os que esperam no Senhor renovarão as suas forças; subirão com asas como águias; correrão e não se cansarão; andarão e não se fatigarão.', reference: 'Isaías 40:31', bible_link: 'https://www.bible.com/pt/bible/211/ISA.40.31' },
    { text: 'Porque o Senhor não desampara o seu povo, nem abandona a sua herança.', reference: 'Salmos 94:14', bible_link: 'https://www.bible.com/pt/bible/211/PSA.94.14' },
    { text: 'Eis que estou à porta e bato; se alguém ouvir a minha voz e abrir a porta, entrarei em sua casa e com ele cearei, e ele, comigo.', reference: 'Apocalipse 3:20', bible_link: 'https://www.bible.com/pt/bible/211/REV.3.20' },
    { text: 'Porque o Senhor teu Deus está no meio de ti, poderoso para te salvar; ele se deleitará em ti com alegria; calar-se-á por seu amor; regozijar-se-á em ti com júbilo.', reference: 'Sofonias 3:17', bible_link: 'https://www.bible.com/pt/bible/211/ZEP.3.17' },
    { text: 'Porque eu sou o Senhor, teu Deus, que te seguro pela tua mão direita e te digo: Não temas; eu te ajudo.', reference: 'Isaías 41:13', bible_link: 'https://www.bible.com/pt/bible/211/ISA.41.13' },
    { text: 'O Senhor é a minha luz e a minha salvação; a quem temerei? O Senhor é a força da minha vida; de quem me recearei?', reference: 'Salmos 27:1', bible_link: 'https://www.bible.com/pt/bible/211/PSA.27.1' },
    { text: 'Porque, se com a tua boca confessares ao Senhor Jesus e, em teu coração, creres que Deus o ressuscitou dos mortos, serás salvo.', reference: 'Romanos 10:9', bible_link: 'https://www.bible.com/pt/bible/211/ROM.10.9' },
    { text: 'E não vos conformeis com este mundo, mas transformai-vos pela renovação do vosso entendimento.', reference: 'Romanos 12:2', bible_link: 'https://www.bible.com/pt/bible/211/ROM.12.2' },
    { text: 'Porque todos pecaram e destituídos estão da glória de Deus.', reference: 'Romanos 3:23', bible_link: 'https://www.bible.com/pt/bible/211/ROM.3.23' },
    { text: 'Mas o fruto do Espírito é: amor, gozo, paz, longanimidade, benignidade, bondade, fé, mansidão, temperança.', reference: 'Gálatas 5:22', bible_link: 'https://www.bible.com/pt/bible/211/GAL.5.22' },
    { text: 'Porque o salário do pecado é a morte, mas o dom gratuito de Deus é a vida eterna, por Cristo Jesus, nosso Senhor.', reference: 'Romanos 6:23', bible_link: 'https://www.bible.com/pt/bible/211/ROM.6.23' },
    { text: 'Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.', reference: 'Mateus 11:28', bible_link: 'https://www.bible.com/pt/bible/211/MAT.11.28' },
    { text: 'Porque aquele que quiser salvar a sua vida perdê-la-á; e quem perder a sua vida por amor de mim, achá-la-á.', reference: 'Mateus 16:25', bible_link: 'https://www.bible.com/pt/bible/211/MAT.16.25' },
    { text: 'E Jesus, olhando para eles, disse-lhes: Aos homens é isso impossível, mas a Deus tudo é possível.', reference: 'Mateus 19:26', bible_link: 'https://www.bible.com/pt/bible/211/MAT.19.26' },
];

/**
 * Fetches daily verse in Portuguese (PT-BR)
 * Seleciona um versículo baseado no dia do ano para garantir consistência
 */
export async function fetchDailyVerse(): Promise<VerseResponse | null> {
    try {
        const today = new Date();
        // Calcula o dia do ano (1-365/366)
        const dayOfYear = Math.floor(
            (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
        );
        
        // Seleciona um versículo baseado no dia do ano
        // Isso garante que o mesmo versículo seja exibido durante todo o dia
        const selectedVerse = versesPTBR[dayOfYear % versesPTBR.length];

        return {
            text: selectedVerse.text,
            reference: selectedVerse.reference,
            bible_link: selectedVerse.bible_link,
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

