/**
 * Полная система логирования Winston для Next.js
 * Совместима с Edge Runtime и продакшеном
 * С ротацией файлов по дням
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';

// Создаем папку logs если её нет
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Настройки для разных окружений
const isDevelopment = process.env['NODE_ENV'] === 'development';
const isProduction = process.env['NODE_ENV'] === 'production';

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

// Настройки ротации файлов
const rotateOptions = {
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d', // Хранить логи за 14 дней
  format: logFormat
};

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
    
    // Файловые транспорты с ротацией для продакшена
    ...(isProduction ? [
      // Ротация для ошибок
      new DailyRotateFile({
        ...rotateOptions,
        filename: path.join(logsDir, 'error-%DATE%.log'),
        level: 'error',
      }),
      
      // Ротация для всех логов
      new DailyRotateFile({
        ...rotateOptions,
        filename: path.join(logsDir, 'combined-%DATE%.log'),
      }),
      
      // Ротация для API логов
      new DailyRotateFile({
        ...rotateOptions,
        filename: path.join(logsDir, 'api-%DATE%.log'),
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            if (meta['method'] && meta['path']) {
              return JSON.stringify({
                timestamp,
                level,
                message,
                ...meta
              });
            }
            return ''; // Не логируем если это не API запрос
          })
        )
      }),
      
      // Ротация для базы данных
      new DailyRotateFile({
        ...rotateOptions,
        filename: path.join(logsDir, 'database-%DATE%.log'),
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            if (meta['operation'] && meta['table']) {
              return JSON.stringify({
                timestamp,
                level,
                message,
                ...meta
              });
            }
            return ''; // Не логируем если это не операция с БД
          })
        )
      })
    ] : [])
  ],
  // Обработка исключений
  exceptionHandlers: isProduction ? [
    new DailyRotateFile({
      ...rotateOptions,
      filename: path.join(logsDir, 'exceptions-%DATE%.log')
    })
  ] : [],
  // Обработка rejections
  rejectionHandlers: isProduction ? [
    new DailyRotateFile({
      ...rotateOptions,
      filename: path.join(logsDir, 'rejections-%DATE%.log')
    })
  ] : []
});

/**
 * Специализированные методы логирования
 */
export class Logger {
  static info = (message: string, meta?: Record<string, unknown>) => logger.info(message, meta);
  static warn = (message: string, meta?: Record<string, unknown>) => logger.warn(message, meta);
  static error = (message: string, meta?: Record<string, unknown>) => logger.error(message, meta);
  static debug = (message: string, meta?: Record<string, unknown>) => logger.debug(message, meta);
  
  // Специализированные методы
  static api = (method: string, path: string, status: number, duration: number, meta?: Record<string, unknown>) => {
    logger.info(`API ${method} ${path}`, {
      method,
      path,
      status,
      duration: `${duration}ms`,
      ...meta
    });
  };
  
  static database = (operation: string, table: string, duration: number, meta?: Record<string, unknown>) => {
    logger.info(`Database ${operation} on ${table}`, {
      operation,
      table,
      duration: `${duration}ms`,
      ...meta
    });
  };
  
  static validation = (schema: string, errors: string[], data?: Record<string, unknown>) => {
    logger.warn(`Validation failed for ${schema}`, {
      schema,
      errors,
      data: data ? JSON.stringify(data) : undefined
    });
  };
  
  static fileUpload = (fileName: string, size: number, status: string, meta?: Record<string, unknown>) => {
    logger.info(`File upload ${status}`, {
      fileName,
      size: `${(size / 1024 / 1024).toFixed(2)}MB`,
      status,
      ...meta
    });
  };
  
  static auth = (action: string, userId?: string, meta?: Record<string, unknown>) => {
    logger.info(`Authentication ${action}`, {
      action,
      userId,
      ...meta
    });
  };
  
  static performance = (operation: string, duration: number, meta?: Record<string, unknown>) => {
    logger.info(`Performance: ${operation}`, {
      operation,
      duration: `${duration}ms`,
      ...meta
    });
  };
  
  static fix = (component: string, issue: string, solution: string, meta?: Record<string, unknown>) => {
    logger.info(`Fix applied: ${component}`, {
      component,
      issue,
      solution,
      ...meta
    });
  };
}

export default logger;
