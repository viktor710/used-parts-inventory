import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testAPIDetailed() {
  console.log('🧪 Детальное тестирование API...')
  
  try {
    // Проверяем подключение к базе данных
    await prisma.$connect()
    console.log('✅ Подключение к базе данных успешно')
    
    // Тестируем прямое обращение к базе данных
    console.log('\n🔍 Прямое обращение к базе данных:')
    
    const carsCount = await prisma.car.count()
    const partsCount = await prisma.part.count()
    
    console.log(`🚗 Автомобили в БД: ${carsCount}`)
    console.log(`🔧 Запчасти в БД: ${partsCount}`)
    
    if (carsCount > 0) {
      const cars = await prisma.car.findMany({ take: 2 })
      console.log('🚗 Примеры автомобилей из БД:')
      cars.forEach(car => {
        console.log(`  - ${car.brand} ${car.model} (${car.year})`)
      })
    }
    
    if (partsCount > 0) {
      const parts = await prisma.part.findMany({ take: 2 })
      console.log('🔧 Примеры запчастей из БД:')
      parts.forEach(part => {
        console.log(`  - ${part.zapchastName} (${part.status})`)
      })
    }
    
    // Тестируем API
    console.log('\n🌐 Тестирование API:')
    
    const baseUrl = 'http://localhost:3000'
    
    // Тестируем API автомобилей
    console.log('\n🚗 Тестирование API автомобилей:')
    try {
      const carsResponse = await fetch(`${baseUrl}/api/cars`)
      console.log('Статус ответа:', carsResponse.status)
      console.log('Заголовки:', Object.fromEntries(carsResponse.headers.entries()))
      
      const carsData = await carsResponse.json()
      console.log('Данные:', JSON.stringify(carsData, null, 2))
    } catch (error) {
      console.error('❌ Ошибка при запросе к API автомобилей:', error)
    }
    
    // Тестируем API запчастей
    console.log('\n🔧 Тестирование API запчастей:')
    try {
      const partsResponse = await fetch(`${baseUrl}/api/parts`)
      console.log('Статус ответа:', partsResponse.status)
      console.log('Заголовки:', Object.fromEntries(partsResponse.headers.entries()))
      
      const partsData = await partsResponse.json()
      console.log('Данные:', JSON.stringify(partsData, null, 2))
    } catch (error) {
      console.error('❌ Ошибка при запросе к API запчастей:', error)
    }
    
  } catch (error) {
    console.error('❌ Общая ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAPIDetailed()
