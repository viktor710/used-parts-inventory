/**
 * Скрипт для применения индексов производительности к базе данных
 * Запуск: node scripts/apply-indexes.js
 */

const fs = require('fs');
const path = require('path');

async function applyIndexes() {
  console.log('🔧 Применение индексов производительности...');
  
  try {
    // Читаем SQL файл с индексами
    const indexPath = path.join(__dirname, '../prisma/migrations/add_performance_indexes.sql');
    const sqlContent = fs.readFileSync(indexPath, 'utf8');
    
    console.log('📋 SQL файл загружен:', indexPath);
    
    // Разделяем SQL на отдельные команды
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📊 Найдено ${commands.length} команд для выполнения`);
    
    // Здесь должна быть логика подключения к БД и выполнения команд
    // Для демонстрации выводим команды
    commands.forEach((command, index) => {
      console.log(`\n${index + 1}. ${command.substring(0, 100)}...`);
    });
    
    console.log('\n✅ Индексы готовы к применению!');
    console.log('\n📝 Для применения индексов выполните:');
    console.log('1. Подключитесь к вашей PostgreSQL базе данных');
    console.log('2. Выполните содержимое файла: prisma/migrations/add_performance_indexes.sql');
    console.log('3. Или используйте Prisma Studio для выполнения команд');
    
  } catch (error) {
    console.error('❌ Ошибка при применении индексов:', error);
    process.exit(1);
  }
}

// Запуск скрипта
if (require.main === module) {
  applyIndexes();
}

module.exports = { applyIndexes };
