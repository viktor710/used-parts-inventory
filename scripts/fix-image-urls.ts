import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Рабочие URL изображений
const workingImageUrls = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format'
];

async function fixImageUrls() {
  try {
    console.log('🔧 Исправление недействительных URL изображений...');
    
    const parts = await prisma.part.findMany();
    
    for (const part of parts) {
      console.log(`\n📦 Запчасть: ${part.zapchastName}`);
      console.log(`   Было изображений: ${part.images.length}`);
      
      // Проверяем и исправляем каждый URL
      const fixedImages = [];
      for (let i = 0; i < part.images.length; i++) {
        const imageUrl = part.images[i];
        
        // Проверяем, что URL не undefined
        if (!imageUrl) {
          console.log(`   ❌ Изображение ${i + 1} имеет пустой URL, заменяем...`);
          const replacementUrl = workingImageUrls[i % workingImageUrls.length];
          fixedImages.push(replacementUrl);
          console.log(`   ✅ Заменено на: ${replacementUrl}`);
          continue;
        }
        
        try {
          const response = await fetch(imageUrl, { method: 'HEAD' });
          if (response.ok) {
            console.log(`   ✅ Изображение ${i + 1} работает: ${imageUrl}`);
            fixedImages.push(imageUrl);
          } else {
            console.log(`   ❌ Изображение ${i + 1} не работает (${response.status}), заменяем...`);
            // Заменяем на рабочий URL
            const replacementUrl = workingImageUrls[i % workingImageUrls.length];
            fixedImages.push(replacementUrl);
            console.log(`   ✅ Заменено на: ${replacementUrl}`);
          }
        } catch (error) {
          console.log(`   ❌ Ошибка при проверке изображения ${i + 1}, заменяем...`);
          const replacementUrl = workingImageUrls[i % workingImageUrls.length];
          fixedImages.push(replacementUrl);
          console.log(`   ✅ Заменено на: ${replacementUrl}`);
        }
      }
      
      // Обновляем запчасть с исправленными URL
      if (JSON.stringify(part.images) !== JSON.stringify(fixedImages)) {
        // Фильтруем undefined значения
        const validImages = fixedImages.filter((url): url is string => url !== undefined);
        
        await prisma.part.update({
          where: { id: part.id },
          data: { images: validImages }
        });
        console.log(`   ✅ Запчасть обновлена с ${validImages.length} изображениями`);
      } else {
        console.log(`   ℹ️ Изменений не требуется`);
      }
    }
    
    console.log('\n🎉 Исправление URL изображений завершено!');
    
  } catch (error) {
    console.error('❌ Ошибка при исправлении изображений:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем скрипт
fixImageUrls();
