import { prisma } from '../lib/prisma';

async function checkDatabase() {
  try {
    console.log('🔍 Проверка подключения к базе данных...');
    
    // Проверяем подключение
    await prisma.$connect();
    console.log('✅ Подключение к базе данных успешно');
    
    // Проверяем количество запчастей
    const partsCount = await prisma.part.count();
    console.log(`📦 Количество запчастей в базе: ${partsCount}`);
    
    // Проверяем количество автомобилей
    const carsCount = await prisma.car.count();
    console.log(`🚗 Количество автомобилей в базе: ${carsCount}`);
    
    // Получаем несколько запчастей для примера
    const parts = await prisma.part.findMany({
      take: 5,
      include: {
        car: true
      }
    });
    
    console.log('\n📋 Примеры запчастей:');
    parts.forEach((part, index) => {
      console.log(`${index + 1}. ${part.zapchastName} (ID: ${part.id})`);
      console.log(`   Автомобиль: ${part.car?.brand} ${part.car?.model}`);
      console.log(`   Статус: ${part.status}`);
      console.log(`   Цена: ${part.price} ₽`);
      console.log('');
    });
    
    // Получаем несколько автомобилей для примера
    const cars = await prisma.car.findMany({
      take: 3
    });
    
    console.log('🚗 Примеры автомобилей:');
    cars.forEach((car, index) => {
      console.log(`${index + 1}. ${car.brand} ${car.model} (${car.year})`);
      console.log(`   ID: ${car.id}`);
      console.log(`   VIN: ${car.vin}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Ошибка при проверке базы данных:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
