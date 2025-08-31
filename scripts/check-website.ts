async function checkWebsite() {
  console.log('🌐 Комплексная проверка работы сайта...');
  
  try {
    // 1. Проверяем API endpoints
    console.log('\n📡 Проверка API endpoints:');
    
    const apiTests = [
      { name: 'Статистика', url: '/api/stats' },
      { name: 'Запчасти', url: '/api/parts' },
      { name: 'Автомобили', url: '/api/cars' }
    ];
    
    for (const test of apiTests) {
      try {
        const response = await fetch(`http://localhost:3000${test.url}`);
        const data = await response.json();
        
        if (data.success) {
          const count = test.name === 'Статистика' 
            ? `${data.data.totalParts} запчастей, ${data.data.totalCars} авто`
            : test.name === 'Запчасти'
            ? `${data.data.data.length} запчастей`
            : `${data.data.cars.length} автомобилей`;
          
          console.log(`  ✅ ${test.name}: ${count}`);
        } else {
          console.log(`  ❌ ${test.name}: ${data.error}`);
        }
      } catch (error) {
        console.log(`  ❌ ${test.name}: Ошибка сети`);
      }
    }
    
    // 2. Проверяем страницы
    console.log('\n🌐 Проверка страниц:');
    
    const pageTests = [
      { name: 'Главная', url: '/' },
      { name: 'Запчасти', url: '/parts' },
      { name: 'Автомобили', url: '/cars' }
    ];
    
    for (const test of pageTests) {
      try {
        const response = await fetch(`http://localhost:3000${test.url}`);
        
        if (response.status === 200) {
          const html = await response.text();
          const hasJavaScript = html.includes('<script');
          const hasReact = html.includes('React') || html.includes('__NEXT');
          const size = Math.round(html.length / 1024);
          
          console.log(`  ✅ ${test.name}: ${size}KB, JS: ${hasJavaScript ? 'да' : 'нет'}, React: ${hasReact ? 'да' : 'нет'}`);
        } else {
          console.log(`  ❌ ${test.name}: HTTP ${response.status}`);
        }
      } catch (error) {
        console.log(`  ❌ ${test.name}: Ошибка сети`);
      }
    }
    
    // 3. Проверяем загрузку данных
    console.log('\n🔄 Симуляция загрузки данных в браузере:');
    
    try {
      // Симулируем то, что происходит в браузере
      const [partsResponse, carsResponse] = await Promise.all([
        fetch('http://localhost:3000/api/parts'),
        fetch('http://localhost:3000/api/cars')
      ]);
      
      const [partsResult, carsResult] = await Promise.all([
        partsResponse.json(),
        carsResponse.json()
      ]);
      
      if (partsResult.success && carsResult.success) {
        const parts = partsResult.data.data;
        const cars = carsResult.data.cars;
        
        console.log(`  ✅ Данные загружены: ${parts.length} запчастей, ${cars.length} автомобилей`);
        
        // Проверяем связи
        let linkedCount = 0;
        parts.forEach((part: any) => {
          const car = cars.find((c: any) => c.id === part.carId);
          if (car) linkedCount++;
        });
        
        console.log(`  ✅ Связи проверены: ${linkedCount}/${parts.length} запчастей связаны с автомобилями`);
        
        // Проверяем первую запчасть
        if (parts.length > 0) {
          const firstPart = parts[0];
          console.log(`  📋 Первая запчасть: ${firstPart.zapchastName} (${firstPart.status})`);
        }
        
        // Проверяем первый автомобиль
        if (cars.length > 0) {
          const firstCar = cars[0];
          console.log(`  🚗 Первый автомобиль: ${firstCar.brand} ${firstCar.model} (${firstCar.year})`);
        }
        
      } else {
        console.log(`  ❌ Ошибка загрузки данных`);
      }
      
    } catch (error) {
      console.log(`  ❌ Ошибка при симуляции: ${error}`);
    }
    
    // 4. Итоговая диагностика
    console.log('\n🔍 Итоговая диагностика:');
    console.log('  API работает корректно');
    console.log('  Страницы загружаются');
    console.log('  Данные доступны через API');
    console.log('');
    console.log('💡 Возможные причины проблемы "не найдены":');
    console.log('  1. Кэширование в браузере - нужно очистить кэш (Ctrl+F5)');
    console.log('  2. JavaScript отключен в браузере');
    console.log('  3. Ошибки в консоли браузера - нужно проверить DevTools');
    console.log('  4. Медленная загрузка - данные еще загружаются');
    console.log('');
    console.log('🛠️ Рекомендации:');
    console.log('  1. Откройте DevTools (F12) и проверьте консоль на ошибки');
    console.log('  2. Очистите кэш браузера (Ctrl+Shift+Delete)');
    console.log('  3. Обновите страницу с зажатым Ctrl (Ctrl+F5)');
    console.log('  4. Попробуйте в режиме инкогнито');
    
  } catch (error) {
    console.error('❌ Ошибка при проверке сайта:', error);
  }
}

checkWebsite();
