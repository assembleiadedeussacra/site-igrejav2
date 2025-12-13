/**
 * Classe de erro customizada para a aplicação
 * Permite tratamento estruturado de erros com códigos e status HTTP
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    
    // Mantém o stack trace correto
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Converte qualquer erro desconhecido em AppError
 */
export function handleApiError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new AppError(
      error.message,
      500,
      'UNKNOWN_ERROR',
      { originalError: error.name }
    );
  }
  
  return new AppError(
    'Erro desconhecido',
    500,
    'UNKNOWN_ERROR'
  );
}

/**
 * Erros comuns pré-definidos
 */
export const Errors = {
  NOT_FOUND: (resource: string = 'Recurso') => 
    new AppError(`${resource} não encontrado`, 404, 'NOT_FOUND'),
  
  UNAUTHORIZED: () => 
    new AppError('Não autorizado', 401, 'UNAUTHORIZED'),
  
  FORBIDDEN: () => 
    new AppError('Acesso negado', 403, 'FORBIDDEN'),
  
  VALIDATION_ERROR: (message: string) => 
    new AppError(message, 400, 'VALIDATION_ERROR'),
  
  RATE_LIMIT_EXCEEDED: () => 
    new AppError(
      'Muitas requisições. Tente novamente em alguns instantes.',
      429,
      'RATE_LIMIT_EXCEEDED'
    ),
  
  INTERNAL_ERROR: (message: string = 'Erro interno do servidor') => 
    new AppError(message, 500, 'INTERNAL_ERROR'),
};
