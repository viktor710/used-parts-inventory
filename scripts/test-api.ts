async function testAPI() {
  const baseUrl = 'http://localhost:3000'
  
  console.log('🧪 Тестирование API...')
  
  try {
    // Тестируем API автомобилей
    console.log('\n🚗 Тестирование API автомобилей:')
    const carsResponse = await fetch(`${baseUrl}/api/cars`)
    const carsData = await carsResponse.json()
    
    console.log('Статус:', carsResponse.status)
    console.log('Данные:', JSON.stringify(carsData, null, 2))
    
    // Тестируем API запчастей
    console.log('\n🔧 Тестирование API запчастей:')
    const partsResponse = await fetch(`${baseUrl}/api/parts`)
    const partsData = await partsResponse.json()
    
    console.log('Статус:', partsResponse.status)
    console.log('Данные:', JSON.stringify(partsData, null, 2))
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании API:', error)
  }
}

testAPI()
