/**
 * Финальный тест Winston с ротацией файлов
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

console.log('🧪 Финальный тест Winston с ротацией файлов...\n');

// Создаем логгер с ротацией
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Консольный транспорт
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // Ротация для всех логов
    new DailyRotateFile({
      filename: path.join(logsDir, 'final-combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    }),
    
    // Ротация для ошибок
    new DailyRotateFile({
      filename: path.join(logsDir, 'final-error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error'
    })
  ]
});

// Тестируем логирование
logger.info('Финальный тест: информационное сообщение', { 
  test: 'final', 
  timestamp: new Date().toISOString(),
  environment: 'test'
});

logger.warn('Финальный тест: предупреждение', { 
  warning: 'test warning',
  severity: 'medium'
});

logger.error('Финальный тест: ошибка', { 
  errorCode: 'FINAL_ERR_001',
  details: 'Тестовая ошибка для проверки ротации',
  stack: new Error().stack
});

logger.info('Финальный тест: еще одно информационное сообщение', { 
  message: 'Дополнительная информация',
  data: { key: 'value', number: 42 }
});

console.log('\n✅ Финальный тест завершен!');
console.log('📁 Проверьте папку logs/ для файлов:');
console.log('   - final-combined-YYYY-MM-DD.log');
console.log('   - final-error-YYYY-MM-DD.log');
console.log('🔄 Файлы будут автоматически ротироваться по дням');
console.log('📦 Старые файлы будут сжиматься в .gz архивы');
