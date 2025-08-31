#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Настройка Prisma для Vercel...');

try {
  // Проверяем, что мы в production окружении
  if (process.env.NODE_ENV === 'production') {
    console.log('📦 Production окружение обнаружено');
    
    // Генерируем Prisma Client
    console.log('🔨 Генерация Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Проверяем, что файлы сгенерированы
    const prismaClientPath = path.join(process.cwd(), 'node_modules', '@prisma', 'client');
    if (fs.existsSync(prismaClientPath)) {
      console.log('✅ Prisma Client успешно сгенерирован');
    } else {
      console.error('❌ Prisma Client не найден после генерации');
      process.exit(1);
    }
    
    // Проверяем подключение к базе данных
    console.log('🔍 Проверка подключения к базе данных...');
    try {
      execSync('npx prisma db pull', { stdio: 'inherit' });
      console.log('✅ Подключение к базе данных успешно');
    } catch (error) {
      console.warn('⚠️ Не удалось подключиться к базе данных, но это может быть нормально для сборки');
    }
  } else {
    console.log('🛠️ Development окружение - пропускаем настройку Prisma');
  }
  
  console.log('✅ Настройка Prisma завершена');
} catch (error) {
  console.error('❌ Ошибка при настройке Prisma:', error);
  process.exit(1);
}
