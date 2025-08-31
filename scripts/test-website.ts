async function testWebsite() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🌐 Тестирование веб-сайта...');
  
  try {
    // Тестируем главную страницу
    console.log('\n🏠 Тестирование главной страницы:');
    const homeResponse = await fetch(`${baseUrl}/`);
    console.log('Статус:', homeResponse.status);
    
    // Тестируем страницу автомобилей
    console.log('\n🚗 Тестирование страницы автомобилей:');
    const carsPageResponse = await fetch(`${baseUrl}/cars`);
    console.log('Статус:', carsPageResponse.status);
    
    // Тестируем страницу запчастей
    console.log('\n🔧 Тестирование страницы запчастей:');
    const partsPageResponse = await fetch(`${baseUrl}/parts`);
    console.log('Статус:', partsPageResponse.status);
    
    // Тестируем API автомобилей
    console.log('\n🚗 Тестирование API автомобилей:');
    const carsApiResponse = await fetch(`${baseUrl}/api/cars`);
    const carsApiData = await carsApiResponse.json();
    console.log('Статус:', carsApiResponse.status);
    console.log('Количество автомобилей:', carsApiData.data?.cars?.length || 0);
    
    // Тестируем API запчастей
    console.log('\n🔧 Тестирование API запчастей:');
    const partsApiResponse = await fetch(`${baseUrl}/api/parts`);
    const partsApiData = await partsApiResponse.json();
    console.log('Статус:', partsApiResponse.status);
    console.log('Количество запчастей:', partsApiData.data?.data?.length || 0);
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании веб-сайта:', error);
  }
}

testWebsite();
