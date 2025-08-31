/**
 * Тестовый скрипт для проверки загрузки нескольких изображений
 */

const fs = require('fs');
const path = require('path');

// Создаем несколько тестовых изображений (1x1 пиксель PNG)
const createTestImage = (name) => {
  const testImageData = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
    0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00,
    0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33,
    0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ]);
  
  const testImagePath = path.join(__dirname, `${name}.png`);
  fs.writeFileSync(testImagePath, testImageData);
  return { path: testImagePath, data: testImageData };
};

async function testMultipleImageUpload() {
  console.log('🧪 Тестирование загрузки нескольких изображений...');
  
  try {
    // Создаем 3 тестовых изображения
    const testImages = [
      createTestImage('test-image-1'),
      createTestImage('test-image-2'),
      createTestImage('test-image-3')
    ];
    
    console.log('✅ Тестовые изображения созданы');
    
    // Тестируем загрузку каждого изображения отдельно
    const uploadedUrls = [];
    
    for (let i = 0; i < testImages.length; i++) {
      const testImage = testImages[i];
      console.log(`📤 Загрузка изображения ${i + 1}/${testImages.length}...`);
      
      const formData = new FormData();
      const file = new File([testImage.data], `test-image-${i + 1}.png`, { type: 'image/png' });
      formData.append('file', file);
      formData.append('folder', 'parts');
      
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        uploadedUrls.push(result.data.secure_url);
        console.log(`✅ Изображение ${i + 1} загружено:`, result.data.secure_url);
      } else {
        console.error(`❌ Ошибка загрузки изображения ${i + 1}:`, await response.text());
      }
    }
    
    console.log('📋 Все загруженные URL:', uploadedUrls);
    
    // Тестируем создание запчасти с несколькими изображениями
    if (uploadedUrls.length > 0) {
      const partData = {
        zapchastName: 'Тестовая запчасть с несколькими изображениями',
        category: 'other',
        carId: '1',
        condition: 'good',
        status: 'available',
        price: 1000,
        description: 'Тестовая запчасть с несколькими изображениями',
        location: 'Тест',
        supplier: 'Тест',
        purchaseDate: new Date().toISOString(),
        purchasePrice: 800,
        images: uploadedUrls,
        notes: 'Тест множественной загрузки'
      };
      
      console.log('📤 Создание запчасти с несколькими изображениями...');
      console.log('📋 Изображения для запчасти:', partData.images);
      
      const partResponse = await fetch('http://localhost:3001/api/parts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partData),
      });
      
      if (partResponse.ok) {
        const partResult = await partResponse.json();
        console.log('✅ Запчасть создана с несколькими изображениями:', {
          id: partResult.data.id,
          imagesCount: partResult.data.images?.length,
          images: partResult.data.images
        });
      } else {
        console.error('❌ Ошибка создания запчасти:', await partResponse.text());
      }
    }
    
    // Удаляем тестовые файлы
    testImages.forEach(testImage => {
      fs.unlinkSync(testImage.path);
    });
    console.log('🗑️ Тестовые файлы удалены');
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  }
}

// Запускаем тест только если скрипт вызван напрямую
if (require.main === module) {
  testMultipleImageUpload();
}

module.exports = { testMultipleImageUpload };
