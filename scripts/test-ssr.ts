import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSSR() {
  console.log('🔧 [TEST] Начинаем тестирование серверного рендеринга...');
  
  try {
    // Получаем все автомобили для генерации статических путей
    const cars = await prisma.car.findMany({
      select: { id: true, brand: true, model: true }
    });
    
    console.log(`📊 Найдено автомобилей для SSR: ${cars.length}`);
    
    // Тестируем получение каждого автомобиля
    for (const car of cars.slice(0, 3)) { // Тестируем только первые 3
      console.log(`\n🔍 Тестируем автомобиль: ${car.brand} ${car.model} (ID: ${car.id})`);
      
      const fullCar = await prisma.car.findUnique({
        where: { id: car.id },
        include: { parts: true }
      });
      
      if (fullCar) {
        console.log(`✅ Автомобиль найден: ${fullCar.brand} ${fullCar.model}`);
        console.log(`   VIN: ${fullCar.vin}`);
        console.log(`   Год: ${fullCar.year}`);
        console.log(`   Запчастей: ${fullCar.parts.length}`);
        console.log(`   Изображений: ${fullCar.images?.length || 0}`);
      } else {
        console.log(`❌ Автомобиль не найден`);
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании SSR:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔧 [TEST] Тестирование SSR завершено');
  }
}

testSSR();
