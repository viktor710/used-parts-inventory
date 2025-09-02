const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🔧 [TEST] Начинаем тестирование API...');
  
  try {
    // Тест 1: Получение всех автомобилей
    console.log('\n📋 Тест 1: Получение всех автомобилей');
    const carsResponse = await fetch(`${BASE_URL}/api/cars`);
    const carsData = await carsResponse.json();
    
    console.log('Статус ответа:', carsResponse.status);
    console.log('Успех:', carsData.success);
    
    if (carsData.success) {
      console.log('Количество автомобилей:', carsData.data.cars.length);
      console.log('Первый автомобиль:', carsData.data.cars[0]?.brand, carsData.data.cars[0]?.model);
    } else {
      console.log('Ошибка:', carsData.error);
    }
    
    // Тест 2: Получение конкретного автомобиля
    if (carsData.success && carsData.data.cars.length > 0) {
      const carId = carsData.data.cars[0].id;
      console.log(`\n📋 Тест 2: Получение автомобиля с ID ${carId}`);
      
      const carResponse = await fetch(`${BASE_URL}/api/cars/${carId}`);
      const carData = await carResponse.json();
      
      console.log('Статус ответа:', carResponse.status);
      console.log('Успех:', carData.success);
      
      if (carData.success) {
        console.log('Автомобиль:', carData.data.brand, carData.data.model);
        console.log('VIN:', carData.data.vin);
      } else {
        console.log('Ошибка:', carData.error);
      }
    }
    
    // Тест 3: Получение статистики
    console.log('\n📋 Тест 3: Получение статистики');
    const statsResponse = await fetch(`${BASE_URL}/api/stats`);
    const statsData = await statsResponse.json();
    
    console.log('Статус ответа:', statsResponse.status);
    console.log('Успех:', statsData.success);
    
    if (statsData.success) {
      console.log('Общее количество автомобилей:', statsData.data.totalCars);
      console.log('Общее количество запчастей:', statsData.data.totalParts);
    } else {
      console.log('Ошибка:', statsData.error);
    }
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании API:', error);
  }
  
  console.log('\n🔧 [TEST] Тестирование API завершено');
}

testAPI();
