/**
 * Скрипт для мониторинга логов в реальном времени
 * Запуск: node scripts/monitor-logs.js
 */

const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
const errorLogPath = path.join(logDir, 'error.log');
const combinedLogPath = path.join(logDir, 'combined.log');

/**
 * Читает и парсит логи
 */
function readLogs(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.trim().split('\n').filter(line => line.length > 0);
    
    return lines.map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return { message: line, timestamp: new Date().toISOString() };
      }
    });
  } catch (error) {
    console.error(`Ошибка чтения логов из ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Отображает статистику логов
 */
function showLogStats() {
  console.log('\n📊 Статистика логов:');
  console.log('='.repeat(50));
  
  const errorLogs = readLogs(errorLogPath);
  const combinedLogs = readLogs(combinedLogPath);
  
  console.log(`🔴 Ошибки: ${errorLogs.length}`);
  console.log(`📝 Всего записей: ${combinedLogs.length}`);
  
  if (errorLogs.length > 0) {
    const recentErrors = errorLogs.slice(-5);
    console.log('\n🚨 Последние 5 ошибок:');
    recentErrors.forEach((log, index) => {
      console.log(`${index + 1}. ${log.timestamp} - ${log.message}`);
      if (log.error) {
        console.log(`   Ошибка: ${log.error.message}`);
      }
    });
  }
  
  // Анализ по типам ошибок
  const errorTypes = {};
  errorLogs.forEach(log => {
    const type = log.error?.name || 'Unknown';
    errorTypes[type] = (errorTypes[type] || 0) + 1;
  });
  
  if (Object.keys(errorTypes).length > 0) {
    console.log('\n📈 Типы ошибок:');
    Object.entries(errorTypes).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });
  }
  
  // Анализ API запросов
  const apiLogs = combinedLogs.filter(log => log.message && log.message.includes('API'));
  if (apiLogs.length > 0) {
    console.log(`\n🌐 API запросы: ${apiLogs.length}`);
    
    const apiStats = {};
    apiLogs.forEach(log => {
      const match = log.message.match(/API (\w+) (\/api\/[^\s]+)/);
      if (match) {
        const method = match[1];
        const path = match[2];
        const key = `${method} ${path}`;
        apiStats[key] = (apiStats[key] || 0) + 1;
      }
    });
    
    console.log('📊 Популярные API endpoints:');
    Object.entries(apiStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([endpoint, count]) => {
        console.log(`   ${endpoint}: ${count} запросов`);
      });
  }
}

/**
 * Мониторинг логов в реальном времени
 */
function monitorLogs() {
  console.log('🔍 Мониторинг логов в реальном времени...');
  console.log('Нажмите Ctrl+C для остановки\n');
  
  let lastErrorSize = 0;
  let lastCombinedSize = 0;
  
  const checkForNewLogs = () => {
    try {
      // Проверяем размер файлов логов
      const errorSize = fs.existsSync(errorLogPath) ? fs.statSync(errorLogPath).size : 0;
      const combinedSize = fs.existsSync(combinedLogPath) ? fs.statSync(combinedLogPath).size : 0;
      
      // Если размер изменился, читаем новые записи
      if (errorSize > lastErrorSize) {
        const newErrorLogs = readLogs(errorLogPath).slice(-1);
        newErrorLogs.forEach(log => {
          console.log(`🚨 ${log.timestamp} - ${log.message}`);
          if (log.error) {
            console.log(`   Ошибка: ${log.error.message}`);
          }
        });
        lastErrorSize = errorSize;
      }
      
      if (combinedSize > lastCombinedSize) {
        const newCombinedLogs = readLogs(combinedLogPath).slice(-1);
        newCombinedLogs.forEach(log => {
          if (log.level === 'warn') {
            console.log(`⚠️  ${log.timestamp} - ${log.message}`);
          } else if (log.level === 'info' && log.message.includes('API')) {
            console.log(`🌐 ${log.timestamp} - ${log.message}`);
          }
        });
        lastCombinedSize = combinedSize;
      }
      
    } catch (error) {
      console.error('Ошибка мониторинга:', error.message);
    }
  };
  
  // Проверяем каждую секунду
  const interval = setInterval(checkForNewLogs, 1000);
  
  // Обработка остановки
  process.on('SIGINT', () => {
    clearInterval(interval);
    console.log('\n\n📊 Финальная статистика:');
    showLogStats();
    process.exit(0);
  });
}

/**
 * Очистка старых логов
 */
function cleanupLogs() {
  console.log('🧹 Очистка старых логов...');
  
  try {
    if (fs.existsSync(errorLogPath)) {
      const stats = fs.statSync(errorLogPath);
      const fileSizeInMB = stats.size / (1024 * 1024);
      
      if (fileSizeInMB > 10) { // Если файл больше 10MB
        console.log(`Файл error.log слишком большой (${fileSizeInMB.toFixed(2)}MB), очищаем...`);
        fs.writeFileSync(errorLogPath, '');
      }
    }
    
    if (fs.existsSync(combinedLogPath)) {
      const stats = fs.statSync(combinedLogPath);
      const fileSizeInMB = stats.size / (1024 * 1024);
      
      if (fileSizeInMB > 20) { // Если файл больше 20MB
        console.log(`Файл combined.log слишком большой (${fileSizeInMB.toFixed(2)}MB), очищаем...`);
        fs.writeFileSync(combinedLogPath, '');
      }
    }
    
    console.log('✅ Очистка завершена');
  } catch (error) {
    console.error('❌ Ошибка при очистке логов:', error.message);
  }
}

/**
 * Основная функция
 */
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'stats':
      showLogStats();
      break;
    case 'monitor':
      monitorLogs();
      break;
    case 'cleanup':
      cleanupLogs();
      break;
    default:
      console.log('🔍 Мониторинг логов');
      console.log('='.repeat(30));
      console.log('Команды:');
      console.log('  node scripts/monitor-logs.js stats    - Показать статистику');
      console.log('  node scripts/monitor-logs.js monitor  - Мониторинг в реальном времени');
      console.log('  node scripts/monitor-logs.js cleanup  - Очистить старые логи');
      break;
  }
}

// Запуск скрипта
if (require.main === module) {
  main();
}

module.exports = { showLogStats, monitorLogs, cleanupLogs };
