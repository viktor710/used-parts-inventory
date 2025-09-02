import 'dotenv/config';

console.log('🔧 [TEST] Проверка переменных окружения...');

console.log('NODE_ENV:', process.env['NODE_ENV']);
console.log('DATABASE_URL:', process.env['DATABASE_URL'] ? 'Установлена' : 'НЕ УСТАНОВЛЕНА');
console.log('DIRECT_URL:', process.env['DIRECT_URL'] ? 'Установлена' : 'НЕ УСТАНОВЛЕНА');

if (!process.env['DATABASE_URL']) {
  console.error('❌ DATABASE_URL не установлена!');
  process.exit(1);
}

if (!process.env['DIRECT_URL']) {
  console.error('❌ DIRECT_URL не установлена!');
  process.exit(1);
}

console.log('✅ Все необходимые переменные окружения установлены');
