import { LRUCache } from 'lru-cache';

/**
 * Cache para rate limiting baseado em LRU
 * Armazena contadores de requisições por identificador (IP, user ID, etc)
 */
const rateLimitCache = new LRUCache<string, number>({
  max: 500, // Máximo de 500 identificadores únicos
  ttl: 60000, // TTL de 1 minuto (60000ms)
});

/**
 * Verifica se um identificador excedeu o limite de requisições
 * 
 * @param identifier - Identificador único (IP, user ID, etc)
 * @param limit - Número máximo de requisições permitidas no período
 * @returns true se dentro do limite, false se excedeu
 */
export function checkRateLimit(identifier: string, limit: number = 10): boolean {
  const count = rateLimitCache.get(identifier) || 0;
  
  if (count >= limit) {
    return false;
  }
  
  rateLimitCache.set(identifier, count + 1);
  return true;
}

/**
 * Obtém o número atual de requisições para um identificador
 */
export function getRateLimitCount(identifier: string): number {
  return rateLimitCache.get(identifier) || 0;
}

/**
 * Reseta o contador para um identificador (útil para testes ou admin)
 */
export function resetRateLimit(identifier: string): void {
  rateLimitCache.delete(identifier);
}

/**
 * Limpa todo o cache de rate limiting (útil para testes)
 */
export function clearRateLimitCache(): void {
  rateLimitCache.clear();
}
