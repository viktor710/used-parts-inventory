async function testAPI() {
  const baseUrl = 'http://localhost:3000';
  
  try {
    console.log('🧪 Тестирование API endpoints...');
    
    // Тест 1: Получение списка запчастей
    console.log('\n1. Тестирование GET /api/parts');
    const partsResponse = await fetch(`${baseUrl}/api/parts`);
    const partsResult = await partsResponse.json();
    console.log('Статус:', partsResponse.status);
    console.log('Успех:', partsResult.success);
    console.log('Количество запчастей:', partsResult.data?.data?.length || 0);
    
    if (partsResult.data?.data?.length > 0) {
      const firstPartId = partsResult.data.data[0].id;
      console.log('ID первой запчасти:', firstPartId);
      
      // Тест 2: Получение конкретной запчасти
      console.log('\n2. Тестирование GET /api/parts/[id]');
      const partResponse = await fetch(`${baseUrl}/api/parts/${firstPartId}`);
      const partResult = await partResponse.json();
      console.log('Статус:', partResponse.status);
      console.log('Успех:', partResult.success);
      console.log('Название запчасти:', partResult.data?.zapchastName);
      console.log('carId:', partResult.data?.carId);
      
      if (partResult.data?.carId) {
        // Тест 3: Получение автомобиля
        console.log('\n3. Тестирование GET /api/cars/[id]');
        const carResponse = await fetch(`${baseUrl}/api/cars/${partResult.data.carId}`);
        const carResult = await carResponse.json();
        console.log('Статус:', carResponse.status);
        console.log('Успех:', carResult.success);
        console.log('Автомобиль:', carResult.data?.brand, carResult.data?.model);
      }
    }
    
    // Тест 4: Получение списка автомобилей
    console.log('\n4. Тестирование GET /api/cars');
    const carsResponse = await fetch(`${baseUrl}/api/cars`);
    const carsResult = await carsResponse.json();
    console.log('Статус:', carsResponse.status);
    console.log('Успех:', carsResult.success);
    console.log('Количество автомобилей:', carsResult.data?.data?.length || 0);
    
    console.log('\n✅ Все тесты завершены');
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании API:', error);
  }
}

testAPI();
