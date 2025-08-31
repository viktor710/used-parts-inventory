import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testImageUrls() {
  try {
    console.log('🔍 Проверка доступности URL изображений...');
    
    const parts = await prisma.part.findMany();
    
    for (const part of parts) {
      console.log(`\n📦 Запчасть: ${part.zapchastName}`);
      console.log(`   Изображений: ${part.images.length}`);
      
      for (let i = 0; i < part.images.length; i++) {
        const imageUrl = part.images[i];
        console.log(`   Изображение ${i + 1}: ${imageUrl}`);
        
        // Проверяем, что URL не undefined
        if (!imageUrl) {
          console.log(`   ❌ Изображение ${i + 1} имеет пустой URL`);
          continue;
        }
        
        try {
          const response = await fetch(imageUrl, { method: 'HEAD' });
          if (response.ok) {
            console.log(`   ✅ Изображение ${i + 1} доступно (статус: ${response.status})`);
          } else {
            console.log(`   ❌ Изображение ${i + 1} недоступно (статус: ${response.status})`);
          }
        } catch (error) {
          console.log(`   ❌ Ошибка при проверке изображения ${i + 1}:`, (error as Error).message);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка при проверке изображений:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем скрипт
testImageUrls();
