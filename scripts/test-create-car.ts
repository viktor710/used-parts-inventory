async function testCreateCar() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🚗 Тестирование создания автомобиля...');
  
  try {
    const carData = {
      brand: 'Test Brand 2',
      model: 'Test Model 2',
      year: 2021,
      bodyType: 'hatchback',
      fuelType: 'diesel',
      engineVolume: '1.6L',
      transmission: '5MT',
      mileage: 75000,
      vin: 'TEST987654321',
      color: 'Зеленый',
      description: 'Второй тестовый автомобиль',
      images: [],
      notes: 'Тестовая заметка 2'
    };

    console.log('📤 Отправляем данные:', carData);

    const response = await fetch(`${baseUrl}/api/cars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    });

    const result = await response.json();
    
    console.log('Статус:', response.status);
    console.log('Ответ:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('✅ Автомобиль успешно создан!');
    } else {
      console.log('❌ Ошибка при создании автомобиля:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error);
  }
}

testCreateCar();
