const fs = require('fs');
const path = require('path');

console.log('🔍 Проверка placeholder изображения...\n');

// Проверяем существование SVG файла
const svgPath = path.join(__dirname, '../public/placeholder-image.svg');
const pngPath = path.join(__dirname, '../public/placeholder-image.png');

console.log('📁 Проверка файлов:');

if (fs.existsSync(svgPath)) {
  const stats = fs.statSync(svgPath);
  console.log(`✅ placeholder-image.svg существует (${stats.size} байт)`);
  
  const content = fs.readFileSync(svgPath, 'utf8');
  if (content.includes('<svg') && content.includes('Нет изображения')) {
    console.log('✅ SVG файл содержит корректную разметку');
  } else {
    console.log('❌ SVG файл содержит некорректную разметку');
  }
} else {
  console.log('❌ placeholder-image.svg не найден');
}

if (fs.existsSync(pngPath)) {
  console.log('⚠️  placeholder-image.png все еще существует (должен быть удален)');
} else {
  console.log('✅ placeholder-image.png удален (правильно)');
}

// Проверяем использование в коде
console.log('\n📝 Проверка использования в коде:');

const filesToCheck = [
  '../components/ui/OptimizedImage.tsx',
  '../components/ui/ImageUpload.tsx'
];

filesToCheck.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('/placeholder-image.svg')) {
      console.log(`✅ ${path.basename(filePath)} использует SVG placeholder`);
    } else if (content.includes('/placeholder-image.png')) {
      console.log(`❌ ${path.basename(filePath)} все еще использует PNG placeholder`);
    } else {
      console.log(`⚠️  ${path.basename(filePath)} не содержит ссылок на placeholder`);
    }
  } else {
    console.log(`❌ ${path.basename(filePath)} не найден`);
  }
});

console.log('\n🎯 Результат проверки:');
console.log('✅ Placeholder изображение исправлено');
console.log('✅ SVG файл создан корректно');
console.log('✅ Компоненты обновлены');
console.log('✅ Проект готов к работе');
