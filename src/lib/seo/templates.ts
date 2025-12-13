/**
 * SEO Templates for programmatic SEO
 * Supports dynamic page generation with variable substitution
 */

export interface TemplateVariables {
    [key: string]: string | number;
}

/**
 * Replaces template variables in a string
 * Example: "{{tema}}" -> "Oração"
 */
export function replaceTemplateVariables(
    template: string,
    variables: TemplateVariables
): string {
    let result = template;
    
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        result = result.replace(regex, String(value));
    }
    
    return result;
}

/**
 * Generates metadata from a template
 */
export function generateMetadataFromTemplate(
    titleTemplate: string,
    descriptionTemplate: string,
    variables: TemplateVariables
): {
    title: string;
    description: string;
} {
    return {
        title: replaceTemplateVariables(titleTemplate, variables),
        description: replaceTemplateVariables(descriptionTemplate, variables),
    };
}

/**
 * Default templates for programmatic SEO
 */
export const defaultTemplates = {
    estudoTema: {
        title: 'Estudos sobre {{tema}} | Assembleia de Deus Missão Sacramento',
        description: 'Explore estudos bíblicos profundos sobre {{tema}}. Encontre reflexões, ensinamentos e aplicações práticas da Palavra de Deus.',
    },
    estudoSubtema: {
        title: '{{subtema}} - Estudos sobre {{tema}} | Assembleia de Deus Missão Sacramento',
        description: 'Estudos bíblicos sobre {{subtema}} no contexto de {{tema}}. Aprenda mais sobre a Palavra de Deus e sua aplicação prática.',
    },
    categoria: {
        title: '{{categoria}} | Assembleia de Deus Missão Sacramento',
        description: 'Conteúdo sobre {{categoria}}. Encontre artigos, estudos e reflexões sobre este tema.',
    },
};
