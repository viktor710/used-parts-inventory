/**
 * Простой тест для проверки создания файлов логов
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';

// Убеждаемся, что папка logs существует
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('📁 Создана папка logs');
}

// Создаем простой логгер
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    new DailyRotateFile({
      filename: path.join(logsDir, 'test-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

console.log('🧪 Тестирование простого логгера...');

// Тестируем логирование
logger.info('Тестовая запись 1', { test: true, timestamp: new Date().toISOString() });
logger.error('Тестовая ошибка 1', { error: 'test error' });
logger.warn('Тестовое предупреждение 1', { warning: 'test warning' });

console.log('✅ Тест завершен!');
console.log('📁 Проверьте папку logs/ для файлов логов');
