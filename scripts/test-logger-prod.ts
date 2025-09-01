/**
 * Тестовый скрипт для проверки работы Winston в продакшен режиме
 * 
 * Примечание: Для запуска в продакшен режиме используйте:
 * NODE_ENV=production node scripts/test-logger-prod.ts
 */

import { Logger } from '../lib/logger';

async function testLoggerProduction() {
  console.log('🧪 Тестирование Winston в продакшен режиме...\n');

  // Тест базового логирования
  Logger.info('Продакшен тест: базовое логирование', { 
    environment: 'production', 
    timestamp: new Date().toISOString() 
  });
  
  Logger.error('Продакшен тест: ошибка', { 
    errorCode: 'PROD_ERR_001',
    details: 'Тестовая ошибка в продакшене'
  });

  // Тест API логирования
  Logger.api('GET', '/api/production/test', 200, 150, { 
    userAgent: 'production-test-agent',
    ip: '192.168.1.1'
  });

  // Тест базы данных
  Logger.database('SELECT', 'parts', 45, { 
    query: 'SELECT * FROM parts WHERE active = true',
    rowsAffected: 150
  });

  console.log('\n✅ Продакшен тестирование завершено!');
  console.log('📁 Проверьте папку logs/ для создания файлов логов с ротацией');
}

// Запуск теста
testLoggerProduction().catch(console.error);
