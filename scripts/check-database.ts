import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  console.log('🔍 Проверка состояния базы данных...')
  
  try {
    // Проверяем подключение
    await prisma.$connect()
    console.log('✅ Подключение к базе данных успешно')
    
    // Подсчитываем записи в таблицах
    const carsCount = await prisma.car.count()
    const partsCount = await prisma.part.count()
    const suppliersCount = await prisma.supplier.count()
    const customersCount = await prisma.customer.count()
    const salesCount = await prisma.sale.count()
    
    console.log('\n📊 Статистика базы данных:')
    console.log(`🚗 Автомобили: ${carsCount}`)
    console.log(`🔧 Запчасти: ${partsCount}`)
    console.log(`🏢 Поставщики: ${suppliersCount}`)
    console.log(`👥 Клиенты: ${customersCount}`)
    console.log(`💰 Продажи: ${salesCount}`)
    
    // Получаем несколько записей для проверки
    if (carsCount > 0) {
      console.log('\n🚗 Примеры автомобилей:')
      const cars = await prisma.car.findMany({ take: 3 })
      cars.forEach(car => {
        console.log(`  - ${car.brand} ${car.model} (${car.year})`)
      })
    }
    
    if (partsCount > 0) {
      console.log('\n🔧 Примеры запчастей:')
      const parts = await prisma.part.findMany({ take: 3 })
      parts.forEach(part => {
        console.log(`  - ${part.zapchastName} (${part.status})`)
      })
    }
    
  } catch (error) {
    console.error('❌ Ошибка при проверке базы данных:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
