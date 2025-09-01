/**
 * Тестовый скрипт для проверки работы Winston с ротацией файлов
 */

import { Logger } from '../lib/logger';

async function testLogger() {
  console.log('🧪 Начинаем тестирование Winston с ротацией файлов...\n');

  // Тест базового логирования
  Logger.info('Тест базового логирования', { test: true, timestamp: new Date().toISOString() });
  Logger.warn('Тест предупреждения', { warning: 'test warning' });
  Logger.error('Тест ошибки', { error: 'test error', stack: new Error().stack });
  Logger.debug('Тест отладки', { debug: 'test debug info' });

  // Тест специализированного логирования
  Logger.api('GET', '/api/test', 200, 150, { userAgent: 'test-agent' });
  Logger.database('SELECT', 'parts', 45, { query: 'SELECT * FROM parts' });
  Logger.validation('TestSchema', ['Field is required'], { field: 'name' });
  Logger.fileUpload('test-image.jpg', 1024 * 1024, 'success', { userId: '123' });
  Logger.auth('login', 'user123', { ip: '127.0.0.1' });
  Logger.performance('database_query', 250, { table: 'parts' });
  Logger.fix('TestComponent', 'Missing prop', 'Added default value', { component: 'TestComponent' });

  // Тест множественных записей для проверки ротации
  console.log('\n📝 Создаем множественные записи для тестирования ротации...');
  
  for (let i = 1; i <= 10; i++) {
    Logger.info(`Тестовая запись #${i}`, { 
      iteration: i, 
      timestamp: new Date().toISOString(),
      data: `Тестовые данные для записи ${i}`
    });
    
    if (i % 3 === 0) {
      Logger.error(`Тестовая ошибка #${i}`, { 
        errorCode: `ERR_${i}`, 
        details: `Детали ошибки ${i}` 
      });
    }
    
    if (i % 2 === 0) {
      Logger.api('POST', `/api/test/${i}`, 201, 100 + i * 10, { 
        requestId: `req_${i}`,
        payload: { test: i }
      });
    }
  }

  console.log('\n✅ Тестирование завершено!');
  console.log('📁 Проверьте папку logs/ для создания файлов логов');
  console.log('🔄 Файлы будут автоматически ротироваться по дням');
}

// Запуск теста
testLogger().catch(console.error);
