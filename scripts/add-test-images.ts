import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Тестовые изображения для запчастей
 * Используем реальные URL изображений запчастей
 */
const testImages = {
  engine: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562141964-3d5d5b5b5b5b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
  ],
  transmission: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562141964-3d5d5b5b5b5b?w=800&h=600&fit=crop'
  ],
  brakes: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562141964-3d5d5b5b5b5b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop'
  ],
  suspension: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562141964-3d5d5b5b5b5b?w=800&h=600&fit=crop'
  ],
  electrical: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1562141964-3d5d5b5b5b5b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
  ]
};

async function addTestImages() {
  try {
    console.log('🖼️ Добавление тестовых изображений к запчастям...');

    // Получаем все запчасти
    const parts = await prisma.part.findMany();
    
    if (parts.length === 0) {
      console.log('❌ Запчасти не найдены. Сначала создайте запчасти.');
      return;
    }

    // Добавляем изображения к каждой запчасти в зависимости от категории
    for (const part of parts) {
      const categoryImages = testImages[part.category as keyof typeof testImages] || testImages.engine;
      
      // Выбираем случайное количество изображений (1-4)
      const imageCount = Math.floor(Math.random() * categoryImages.length) + 1;
      const selectedImages = categoryImages.slice(0, imageCount);

      await prisma.part.update({
        where: { id: part.id },
        data: { images: selectedImages }
      });

      console.log(`✅ Добавлено ${selectedImages.length} изображений к запчасти: ${part.zapchastName}`);
    }

    console.log('🎉 Тестовые изображения успешно добавлены!');
    
    // Показываем статистику
    const updatedParts = await prisma.part.findMany();
    const partsWithImages = updatedParts.filter(part => part.images.length > 0);
    
    console.log(`📊 Статистика:`);
    console.log(`   - Всего запчастей: ${updatedParts.length}`);
    console.log(`   - С изображениями: ${partsWithImages.length}`);
    console.log(`   - Без изображений: ${updatedParts.length - partsWithImages.length}`);

  } catch (error) {
    console.error('❌ Ошибка при добавлении тестовых изображений:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем скрипт
addTestImages();
