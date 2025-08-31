/**
 * Полная система логирования Winston для Next.js
 * Совместима с Edge Runtime и продакшеном
 */

import winston from 'winston';

// Настройки для разных окружений
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Форматы для логов
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const emoji = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      debug: '🔧',
      api: '🌐',
      database: '🗄️',
      validation: '✅',
      fileUpload: '📁',
      auth: '🔐',
      performance: '⚡',
      fix: '🔧'
    }[level] || '📝';
    
    return `${emoji} [${timestamp}] ${level.toUpperCase()}: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
    }`;
  })
);

// Создаем логгер
const logger = winston.createLogger({
  level: isDevelopment ? 'debug' : 'info',
  format: logFormat,
  defaultMeta: { service: 'used-parts-inventory' },
  transports: [
    // Консольный транспорт для разработки
    new winston.transports.Console({
      format: consoleFormat,
      level: isDevelopment ? 'debug' : 'info'
    }),
    
    // Файловый транспорт для ошибок
    ...(isProduction ? [
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      })
    ] : [])
  ],
  // Обработка исключений
  exceptionHandlers: isProduction ? [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ] : [],
  // Обработка rejections
  rejectionHandlers: isProduction ? [
    new winston.transports.File({ filename: 'logs/rejections.log' })
  ] : []
});

/**
 * Специализированные методы логирования
 */
export class Logger {
  static info = (message: string, meta?: any) => logger.info(message, meta);
  static warn = (message: string, meta?: any) => logger.warn(message, meta);
  static error = (message: string, meta?: any) => logger.error(message, meta);
  static debug = (message: string, meta?: any) => logger.debug(message, meta);
  
  // Специализированные методы
  static api = (method: string, path: string, status: number, duration: number, meta?: any) => {
    logger.info(`API ${method} ${path}`, {
      method,
      path,
      status,
      duration: `${duration}ms`,
      ...meta
    });
  };
  
  static database = (operation: string, table: string, duration: number, meta?: any) => {
    logger.info(`Database ${operation} on ${table}`, {
      operation,
      table,
      duration: `${duration}ms`,
      ...meta
    });
  };
  
  static validation = (schema: string, errors: string[], data?: any) => {
    logger.warn(`Validation failed for ${schema}`, {
      schema,
      errors,
      data: data ? JSON.stringify(data) : undefined
    });
  };
  
  static fileUpload = (fileName: string, size: number, status: string, meta?: any) => {
    logger.info(`File upload ${status}`, {
      fileName,
      size: `${(size / 1024 / 1024).toFixed(2)}MB`,
      status,
      ...meta
    });
  };
  
  static auth = (action: string, userId?: string, meta?: any) => {
    logger.info(`Authentication ${action}`, {
      action,
      userId,
      ...meta
    });
  };
  
  static performance = (operation: string, duration: number, meta?: any) => {
    logger.info(`Performance: ${operation}`, {
      operation,
      duration: `${duration}ms`,
      ...meta
    });
  };
  
  static fix = (component: string, issue: string, solution: string, meta?: any) => {
    logger.info(`Fix applied: ${component}`, {
      component,
      issue,
      solution,
      ...meta
    });
  };
}

export default logger;
