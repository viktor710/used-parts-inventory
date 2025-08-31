import { DatabaseService } from '@/lib/database-service'

const dbService = new DatabaseService()

async function testDatabaseService() {
  console.log('🧪 Тестирование сервиса базы данных...')
  
  try {
    // Тестируем получение автомобилей
    console.log('\n🚗 Тестирование getCars:')
    const carsResult = await dbService.getCars(1, 20)
    console.log('Результат getCars:', {
      count: carsResult.data.length,
      total: carsResult.total,
      page: carsResult.page,
      totalPages: carsResult.totalPages
    })
    
    if (carsResult.data.length > 0) {
      console.log('Примеры автомобилей:')
      carsResult.data.slice(0, 2).forEach(car => {
        console.log(`  - ${car.brand} ${car.model} (${car.year})`)
      })
    }
    
    // Тестируем получение запчастей
    console.log('\n🔧 Тестирование getParts:')
    const partsResult = await dbService.getParts(1, 20)
    console.log('Результат getParts:', {
      count: partsResult.data.length,
      total: partsResult.total,
      page: partsResult.page,
      totalPages: partsResult.totalPages
    })
    
    if (partsResult.data.length > 0) {
      console.log('Примеры запчастей:')
      partsResult.data.slice(0, 2).forEach(part => {
        console.log(`  - ${part.zapchastName} (${part.status})`)
      })
    }
    
    // Тестируем статистику
    console.log('\n📊 Тестирование getInventoryStats:')
    const stats = await dbService.getInventoryStats()
    console.log('Статистика:', {
      totalParts: stats.totalParts,
      availableParts: stats.availableParts,
      totalCars: stats.totalCars,
      totalValue: stats.totalValue
    })
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании сервиса:', error)
  }
}

testDatabaseService()
