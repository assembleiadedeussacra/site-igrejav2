/**
 * Sistema de logging estruturado
 * Em desenvolvimento: loga no console
 * Em produção: pode ser configurado para enviar para serviço externo
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: string;
}

/**
 * Logger principal da aplicação
 */
export const logger = {
  /**
   * Log de informações gerais
   */
  info: (message: string, context?: Record<string, any>) => {
    log('info', message, context);
  },
  
  /**
   * Log de avisos
   */
  warn: (message: string, context?: Record<string, any>) => {
    log('warn', message, context);
  },
  
  /**
   * Log de erros
   */
  error: (message: string, error?: Error | unknown, context?: Record<string, any>) => {
    const errorDetails = error instanceof Error 
      ? { 
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : error;
    
    log('error', message, { ...context, error: errorDetails });
  },
  
  /**
   * Log de debug (apenas em desenvolvimento)
   */
  debug: (message: string, context?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'development') {
      log('debug', message, context);
    }
  },
};

/**
 * Função interna de logging
 */
function log(level: LogLevel, message: string, context?: Record<string, any>) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };
  
  // Em produção, pode enviar para serviço de logging (Datadog, LogRocket, etc)
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrar com serviço de logging externo
    // Por enquanto, apenas loga no console em produção também
    // Em produção real, você pode fazer:
    // fetch('/api/logs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(entry),
    // }).catch(() => {});
    
    // Log apenas erros em produção no console
    if (level === 'error') {
      console.error(JSON.stringify(entry, null, 2));
    }
  } else {
    // Em desenvolvimento, loga tudo no console formatado
    const emoji = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      debug: '🔍',
    }[level];
    
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
      `${emoji} [${entry.timestamp}] ${message}`,
      context ? context : ''
    );
  }
}
