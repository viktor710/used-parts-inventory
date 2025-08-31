/**
 * Тестовый скрипт для проверки загрузки изображений
 */

const fs = require('fs');
const path = require('path');

// Создаем тестовое изображение (1x1 пиксель PNG)
const testImageData = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
  0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00,
  0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33,
  0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
]);

async function testImageUpload() {
  console.log('🧪 Тестирование загрузки изображений...');
  
  try {
    // Создаем тестовый файл
    const testImagePath = path.join(__dirname, 'test-image.png');
    fs.writeFileSync(testImagePath, testImageData);
    console.log('✅ Тестовое изображение создано:', testImagePath);
    
    // Тестируем API загрузки
    const formData = new FormData();
    const file = new File([testImageData], 'test-image.png', { type: 'image/png' });
    formData.append('file', file);
    formData.append('folder', 'parts');
    
    console.log('📤 Отправка запроса на загрузку...');
    
    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Изображение успешно загружено:', result.data.secure_url);
      
      // Тестируем создание запчасти с изображением
      const partData = {
        zapchastName: 'Тестовая запчасть',
        category: 'other',
        carId: '1',
        condition: 'good',
        status: 'available',
        price: 1000,
        description: 'Тестовая запчасть с изображением',
        location: 'Тест',
        supplier: 'Тест',
        purchaseDate: new Date().toISOString(),
        purchasePrice: 800,
        images: [result.data.secure_url],
        notes: 'Тест'
      };
      
      console.log('📤 Создание запчасти с изображением...');
      
      const partResponse = await fetch('http://localhost:3000/api/parts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partData),
      });
      
      if (partResponse.ok) {
        const partResult = await partResponse.json();
        console.log('✅ Запчасть создана с изображением:', partResult.data);
      } else {
        console.error('❌ Ошибка создания запчасти:', await partResponse.text());
      }
      
    } else {
      console.error('❌ Ошибка загрузки изображения:', await response.text());
    }
    
    // Удаляем тестовый файл
    fs.unlinkSync(testImagePath);
    console.log('🗑️ Тестовый файл удален');
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  }
}

// Запускаем тест только если скрипт вызван напрямую
if (require.main === module) {
  testImageUpload();
}

module.exports = { testImageUpload };
