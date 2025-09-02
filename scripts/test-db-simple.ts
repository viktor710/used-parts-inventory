import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🔧 [TEST] Начинаем тестирование подключения к базе данных...');
  console.log('🔧 [TEST] DATABASE_URL установлена:', !!process.env['DATABASE_URL']);
  
  if (process.env['DATABASE_URL']) {
    console.log('🔧 [TEST] DATABASE_URL начинается с:', process.env['DATABASE_URL'].substring(0, 30) + '...');
  }
  
  try {
    // Пробуем подключиться
    await prisma.$connect();
    console.log('✅ Подключение к базе данных успешно');
    
    // Пробуем выполнить простой запрос
    const carCount = await prisma.car.count();
    console.log('📊 Количество автомобилей в базе:', carCount);
    
    const partCount = await prisma.part.count();
    console.log('📦 Количество запчастей в базе:', partCount);
    
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
