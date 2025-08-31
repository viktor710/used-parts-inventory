#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Исправление проблем с Prisma для Vercel...');

try {
  // Проверяем, что мы в production окружении
  if (process.env.NODE_ENV === 'production') {
    console.log('📦 Production окружение обнаружено');
    
    // Удаляем старый Prisma Client если он существует
    const prismaClientPath = path.join(process.cwd(), 'node_modules', '@prisma', 'client');
    if (fs.existsSync(prismaClientPath)) {
      console.log('🗑️ Удаляем старый Prisma Client...');
      fs.rmSync(prismaClientPath, { recursive: true, force: true });
    }
    
    // Генерируем новый Prisma Client
    console.log('🔨 Генерация нового Prisma Client...');
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      env: { ...process.env, PRISMA_GENERATE_DATAPROXY: 'true' }
    });
    
    // Проверяем, что файлы сгенерированы
    if (fs.existsSync(prismaClientPath)) {
      console.log('✅ Prisma Client успешно сгенерирован');
      
      // Проверяем наличие основных файлов
      const indexFile = path.join(prismaClientPath, 'index.js');
      if (fs.existsSync(indexFile)) {
        console.log('✅ Основные файлы Prisma Client найдены');
      } else {
        console.error('❌ Основные файлы Prisma Client не найдены');
        process.exit(1);
      }
    } else {
      console.error('❌ Prisma Client не найден после генерации');
      process.exit(1);
    }
  } else {
    console.log('🛠️ Development окружение - пропускаем исправления');
  }
  
  console.log('✅ Исправления Prisma завершены');
} catch (error) {
  console.error('❌ Ошибка при исправлении Prisma:', error);
  process.exit(1);
}
