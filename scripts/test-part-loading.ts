async function testPartLoading() {
  const baseUrl = 'http://localhost:3000';
  
  try {
    console.log('🧪 Тестирование загрузки данных запчасти...');
    
    // Получаем список запчастей
    console.log('\n1. Получение списка запчастей');
    const partsResponse = await fetch(`${baseUrl}/api/parts`);
    const partsResult = await partsResponse.json();
    
    if (!partsResult.success || !partsResult.data?.data?.length) {
      console.error('❌ Нет запчастей в базе данных');
      return;
    }
    
    const firstPart = partsResult.data.data[0];
    console.log('✅ Первая запчасть:', firstPart.zapchastName, '(ID:', firstPart.id + ')');
    
    // Получаем конкретную запчасть
    console.log('\n2. Получение конкретной запчасти');
    const partResponse = await fetch(`${baseUrl}/api/parts/${firstPart.id}`);
    const partResult = await partResponse.json();
    
    if (!partResult.success) {
      console.error('❌ Ошибка получения запчасти:', partResult.error);
      return;
    }
    
    const partData = partResult.data;
    console.log('✅ Данные запчасти получены:');
    console.log('   - Название:', partData.zapchastName);
    console.log('   - Категория:', partData.category);
    console.log('   - Состояние:', partData.condition);
    console.log('   - Статус:', partData.status);
    console.log('   - Цена:', partData.price);
    console.log('   - carId:', partData.carId);
    console.log('   - purchaseDate:', partData.purchaseDate);
    console.log('   - createdAt:', partData.createdAt);
    
    // Получаем автомобиль
    if (partData.carId) {
      console.log('\n3. Получение автомобиля');
      const carResponse = await fetch(`${baseUrl}/api/cars/${partData.carId}`);
      const carResult = await carResponse.json();
      
      if (carResult.success) {
        const carData = carResult.data;
        console.log('✅ Данные автомобиля получены:');
        console.log('   - Марка:', carData.brand);
        console.log('   - Модель:', carData.model);
        console.log('   - Год:', carData.year);
        console.log('   - VIN:', carData.vin);
      } else {
        console.error('❌ Ошибка получения автомобиля:', carResult.error);
      }
    }
    
    // Получаем список автомобилей
    console.log('\n4. Получение списка автомобилей');
    const carsResponse = await fetch(`${baseUrl}/api/cars`);
    const carsResult = await carsResponse.json();
    
    if (carsResult.success) {
      const carsData = carsResult.data.cars || carsResult.data.data || [];
      console.log('✅ Получено автомобилей:', carsData.length);
      carsData.forEach((car: any, index: number) => {
        console.log(`   ${index + 1}. ${car.brand} ${car.model} (${car.year}) - ID: ${car.id}`);
      });
    } else {
      console.error('❌ Ошибка получения списка автомобилей:', carsResult.error);
    }
    
    console.log('\n✅ Все тесты завершены успешно!');
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error);
  }
}

testPartLoading();
