#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config({ path: '.env.local' });

console.log('🔧 Тестирование подключения к базе данных...');

// Проверяем переменные окружения
console.log('📋 Проверка переменных окружения:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL установлена:', !!process.env['DATABASE_URL']);
console.log('DIRECT_URL установлена:', !!process.env['DIRECT_URL']);

if (process.env['DATABASE_URL']) {
  console.log('DATABASE_URL начинается с:', process.env['DATABASE_URL'].substring(0, 30) + '...');
}

if (process.env['DIRECT_URL']) {
  console.log('DIRECT_URL начинается с:', process.env['DIRECT_URL'].substring(0, 30) + '...');
}

// Создаем Prisma клиент
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
  datasources: {
    db: {
      url: process.env['DATABASE_URL'] || '',
    },
  },
});

async function testConnection() {
  try {
    console.log('\n🔌 Попытка подключения к базе данных...');
    
    // Подключаемся к базе данных
    await prisma.$connect();
    console.log('✅ Подключение к базе данных успешно!');
    
    // Тестируем простые запросы
    console.log('\n📊 Тестирование запросов...');
    
    // Подсчет автомобилей
    const carCount = await prisma.car.count();
    console.log('🚗 Количество автомобилей:', carCount);
    
    // Подсчет запчастей
    const partCount = await prisma.part.count();
    console.log('🔧 Количество запчастей:', partCount);
    
    // Подсчет поставщиков
    const supplierCount = await prisma.supplier.count();
    console.log('🏢 Количество поставщиков:', supplierCount);
    
    // Подсчет клиентов
    const customerCount = await prisma.customer.count();
    console.log('👥 Количество клиентов:', customerCount);
    
    // Подсчет продаж
    const saleCount = await prisma.sale.count();
    console.log('💰 Количество продаж:', saleCount);
    
    console.log('\n✅ Все тесты прошли успешно!');
    
  } catch (error) {
    console.error('\n❌ Ошибка при тестировании базы данных:');
    
    if (error instanceof Error) {
      console.error('Тип ошибки:', error.constructor.name);
      console.error('Сообщение:', error.message);
    } else {
      console.error('Неизвестная ошибка:', error);
    }
    
    // Проверяем дополнительные свойства ошибки
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Код ошибки:', (error as any).code);
    }
    
    if (error && typeof error === 'object' && 'meta' in error) {
      console.error('Метаданные:', (error as any).meta);
    }
    
    // Предложения по исправлению
    console.log('\n💡 Возможные решения:');
    console.log('1. Проверьте правильность DATABASE_URL в .env.local');
    console.log('2. Убедитесь, что база данных Supabase доступна');
    console.log('3. Проверьте настройки сети и файрвола');
    console.log('4. Убедитесь, что IP адрес разрешен в Supabase');
    
  } finally {
    // Закрываем соединение
    await prisma.$disconnect();
    console.log('\n🔌 Соединение с базой данных закрыто');
  }
}

// Запускаем тест
testConnection()
  .then(() => {
    console.log('\n🏁 Тестирование завершено');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Критическая ошибка:', error);
    process.exit(1);
  });
