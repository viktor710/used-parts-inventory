import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkImages() {
  try {
    console.log('🔍 Проверка изображений в базе данных...');
    
    const parts = await prisma.part.findMany();
    
    console.log(`📊 Найдено запчастей: ${parts.length}`);
    
    parts.forEach((part, index) => {
      console.log(`${index + 1}. ${part.zapchastName}`);
      console.log(`   - ID: ${part.id}`);
      console.log(`   - Изображений: ${part.images.length}`);
      console.log(`   - URL изображений:`, part.images);
      console.log('');
    });
    
    // Статистика
    const partsWithOneImage = parts.filter(part => part.images.length === 1);
    const partsWithTwoImages = parts.filter(part => part.images.length === 2);
    const partsWithThreeImages = parts.filter(part => part.images.length === 3);
    const partsWithMoreImages = parts.filter(part => part.images.length > 3);
    
    console.log('📈 Статистика по количеству изображений:');
    console.log(`   - 1 изображение: ${partsWithOneImage.length} запчастей`);
    console.log(`   - 2 изображения: ${partsWithTwoImages.length} запчастей`);
    console.log(`   - 3 изображения: ${partsWithThreeImages.length} запчастей`);
    console.log(`   - 4+ изображений: ${partsWithMoreImages.length} запчастей`);
    
  } catch (error) {
    console.error('❌ Ошибка при проверке изображений:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем скрипт
checkImages();
