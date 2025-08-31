/**
 * Упрощенная система логирования для Next.js
 * Совместима с Edge Runtime
 */

/**
 * Простой логгер для Next.js
 */
class SimpleLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private getPrefix(level: string): string {
    const prefixes: Record<string, string> = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      debug: '🔧'
    };
    return prefixes[level] || '📝';
  }

  private writeLog(level: string, message: string, meta?: any, error?: any) {
    // В разработке выводим в консоль
    if (this.isDevelopment) {
      const prefix = this.getPrefix(level);
      console.log(`${prefix} [${level.toUpperCase()}] ${message}`, {
        timestamp: new Date().toISOString(),
        ...meta,
        ...(error && { error })
      });
    }

    // В продакшене можно отправлять в внешний сервис
    if (this.isProduction && level === 'error') {
      console.error(`[PROD ERROR] ${message}`, { error, meta });
    }
  }

  info(message: string, meta?: any) {
    this.writeLog('info', message, meta);
  }

  warn(message: string, meta?: any) {
    this.writeLog('warn', message, meta);
  }

  error(message: string, error?: any, meta?: any) {
    this.writeLog('error', message, meta, error);
  }

  debug(message: string, meta?: any) {
    if (this.isDevelopment) {
      this.writeLog('debug', message, meta);
    }
  }

  api(method: string, path: string, statusCode: number, duration: number, meta?: any) {
    const level = statusCode >= 400 ? 'warn' : 'info';
    this.writeLog(level, `API ${method} ${path}`, {
      method,
      path,
      statusCode,
      duration: `${duration}ms`,
      ...meta
    });
  }

  database(operation: string, error: any, meta?: any) {
    this.error(`Database error in ${operation}`, error, meta);
  }

  validation(schema: string, errors: string[], data?: any) {
    this.warn(`Validation error in ${schema}`, {
      schema,
      errors,
      data: data ? JSON.stringify(data) : undefined
    });
  }

  fileUpload(filename: string, error: any, meta?: any) {
    this.error(`File upload error for ${filename}`, error, meta);
  }

  auth(action: string, error: any, meta?: any) {
    this.warn(`Authentication error in ${action}`, { error, ...meta });
  }

  performance(operation: string, duration: number, meta?: any) {
    const level = duration > 1000 ? 'warn' : 'info';
    this.writeLog(level, `Performance: ${operation} took ${duration}ms`, {
      operation,
      duration,
      ...meta
    });
  }

  fix(component: string, issue: string, solution: string, meta?: any) {
    this.info(`Fix applied: ${component}`, {
      component,
      issue,
      solution,
      ...meta
    });
  }
}

// Создаем единственный экземпляр логгера
const logger = new SimpleLogger();

/**
 * Экспортируем класс Logger для совместимости
 */
export class Logger {
  static info = logger.info.bind(logger);
  static warn = logger.warn.bind(logger);
  static error = logger.error.bind(logger);
  static debug = logger.debug.bind(logger);
  static api = logger.api.bind(logger);
  static database = logger.database.bind(logger);
  static validation = logger.validation.bind(logger);
  static fileUpload = logger.fileUpload.bind(logger);
  static auth = logger.auth.bind(logger);
  static performance = logger.performance.bind(logger);
  static fix = logger.fix.bind(logger);
}

export default logger;
