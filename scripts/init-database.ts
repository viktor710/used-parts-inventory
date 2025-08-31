import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Скрипт для инициализации базы данных с начальными данными
 * Запускается после создания миграций
 */

async function main() {
  console.log('🚀 Начинаем инициализацию базы данных...')

  // Очищаем существующие данные
  console.log('🧹 Очищаем существующие данные...')
  await prisma.sale.deleteMany()
  await prisma.part.deleteMany()
  await prisma.car.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.supplier.deleteMany()

  // Создаем автомобили
  console.log('🚗 Создаем автомобили...')
  const cars = await Promise.all([
    prisma.car.create({
      data: {
        brand: 'BMW',
        model: 'E46 325i',
        year: 2003,
        bodyType: 'sedan',
        fuelType: 'gasoline',
        engineVolume: '2.5L',
        transmission: '5MT',
        mileage: 150000,
        vin: 'WBAVB13506PT12345',
        color: 'Черный',
        description: 'BMW E46 325i в хорошем состоянии, полная комплектация',
        images: [],
        notes: 'Автомобиль разобран на запчасти'
      }
    }),
    prisma.car.create({
      data: {
        brand: 'Toyota',
        model: 'Camry',
        year: 2010,
        bodyType: 'sedan',
        fuelType: 'gasoline',
        engineVolume: '2.4L',
        transmission: '5MT',
        mileage: 120000,
        vin: '4T1BF1FK0CU123456',
        color: 'Серебристый',
        description: 'Toyota Camry в отличном состоянии',
        images: [],
        notes: 'Автомобиль разобран на запчасти'
      }
    }),
    prisma.car.create({
      data: {
        brand: 'Honda',
        model: 'Civic',
        year: 2015,
        bodyType: 'hatchback',
        fuelType: 'gasoline',
        engineVolume: '1.8L',
        transmission: '6MT',
        mileage: 80000,
        vin: '1HGBH41JXMN123456',
        color: 'Белый',
        description: 'Honda Civic в хорошем состоянии',
        images: [],
        notes: 'Автомобиль разобран на запчасти'
      }
    }),
    prisma.car.create({
      data: {
        brand: 'Volkswagen',
        model: 'Golf',
        year: 2012,
        bodyType: 'hatchback',
        fuelType: 'diesel',
        engineVolume: '2.0L',
        transmission: '6MT',
        mileage: 180000,
        vin: 'WVWZZZ1KZAW123456',
        color: 'Синий',
        description: 'VW Golf с дизельным двигателем',
        images: [],
        notes: 'Автомобиль разобран на запчасти'
      }
    })
  ])

  console.log(`✅ Создано ${cars.length} автомобилей`)

  // Создаем запчасти
  console.log('🔧 Создаем запчасти...')
  const parts = await Promise.all([
    prisma.part.create({
      data: {
        zapchastName: 'Двигатель BMW M54 2.5L',
        category: 'engine',
        carId: cars[0].id,
        condition: 'good',
        status: 'available',
        price: 85000,
        description: 'Двигатель BMW M54 2.5L в хорошем состоянии, пробег 150,000 км',
        location: 'Склад А, полка 1',
        supplier: 'Авторазборка BMW',
        purchaseDate: new Date('2024-01-15'),
        purchasePrice: 65000,
        images: [],
        notes: 'Проверен, готов к установке. Комплект полный.'
      }
    }),
    prisma.part.create({
      data: {
        zapchastName: 'Коробка передач 5MT Toyota',
        category: 'transmission',
        carId: cars[1].id,
        condition: 'excellent',
        status: 'reserved',
        price: 45000,
        description: 'Механическая коробка передач в отличном состоянии',
        location: 'Склад Б, полка 3',
        supplier: 'Toyota Parts',
        purchaseDate: new Date('2024-01-10'),
        purchasePrice: 35000,
        images: [],
        notes: 'Проверена на стенде, работает идеально.'
      }
    }),
    prisma.part.create({
      data: {
        zapchastName: 'Тормозные колодки Brembo',
        category: 'brakes',
        carId: cars[0].id,
        condition: 'excellent',
        status: 'sold',
        price: 8000,
        description: 'Передние тормозные колодки Brembo, новые',
        location: 'Склад А, полка 5',
        supplier: 'Brembo Official',
        purchaseDate: new Date('2024-01-05'),
        purchasePrice: 6000,
        images: [],
        notes: 'Проданы 15.01.2024'
      }
    }),
    prisma.part.create({
      data: {
        zapchastName: 'Амортизаторы передние KYB',
        category: 'suspension',
        carId: cars[2].id,
        condition: 'good',
        status: 'available',
        price: 12000,
        description: 'Передние амортизаторы KYB для Honda Civic',
        location: 'Склад В, полка 2',
        supplier: 'KYB Parts',
        purchaseDate: new Date('2024-01-08'),
        purchasePrice: 9000,
        images: [],
        notes: 'Б/у, но в хорошем состоянии.'
      }
    }),
    prisma.part.create({
      data: {
        zapchastName: 'Генератор Bosch',
        category: 'electrical',
        carId: cars[3].id,
        condition: 'fair',
        status: 'available',
        price: 15000,
        description: 'Генератор Bosch для VW Golf',
        location: 'Склад А, полка 7',
        supplier: 'Bosch Service',
        purchaseDate: new Date('2024-01-12'),
        purchasePrice: 12000,
        images: [],
        notes: 'Требует проверки перед установкой.'
      }
    })
  ])

  console.log(`✅ Создано ${parts.length} запчастей`)

  // Создаем поставщиков
  console.log('🏢 Создаем поставщиков...')
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        name: 'Авторазборка BMW',
        contact: 'Иван Петров',
        phone: '+7 (999) 123-45-67',
        email: 'bmw@autoparts.ru',
        address: 'г. Москва, ул. Автозаводская, 15',
        notes: 'Специализация на BMW'
      }
    }),
    prisma.supplier.create({
      data: {
        name: 'Toyota Parts',
        contact: 'Мария Сидорова',
        phone: '+7 (999) 234-56-78',
        email: 'toyota@autoparts.ru',
        address: 'г. Санкт-Петербург, пр. Невский, 100',
        notes: 'Официальный поставщик Toyota'
      }
    }),
    prisma.supplier.create({
      data: {
        name: 'Brembo Official',
        contact: 'Алексей Козлов',
        phone: '+7 (999) 345-67-89',
        email: 'brembo@autoparts.ru',
        address: 'г. Екатеринбург, ул. Машиностроителей, 25',
        notes: 'Тормозные системы'
      }
    })
  ])

  console.log(`✅ Создано ${suppliers.length} поставщиков`)

  // Создаем клиентов
  console.log('👥 Создаем клиентов...')
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Дмитрий Волков',
        phone: '+7 (999) 456-78-90',
        email: 'volkov@email.ru',
        address: 'г. Москва, ул. Тверская, 10',
        notes: 'Постоянный клиент'
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Анна Морозова',
        phone: '+7 (999) 567-89-01',
        email: 'morozova@email.ru',
        address: 'г. Казань, ул. Баумана, 5',
        notes: 'Интересуется тормозными системами'
      }
    })
  ])

  console.log(`✅ Создано ${customers.length} клиентов`)

  // Создаем продажи
  console.log('💰 Создаем продажи...')
  const sales = await Promise.all([
    prisma.sale.create({
      data: {
        partId: parts[2].id, // Тормозные колодки
        customerId: customers[0].id,
        price: 8000,
        saleDate: new Date('2024-01-15'),
        notes: 'Продажа тормозных колодок'
      }
    })
  ])

  console.log(`✅ Создано ${sales.length} продаж`)

  console.log('🎉 Инициализация базы данных завершена успешно!')
  
  // Выводим статистику
  const stats = await prisma.part.groupBy({
    by: ['status'],
    _count: { status: true }
  })
  
  console.log('\n📊 Статистика запчастей:')
  stats.forEach(stat => {
    console.log(`  ${stat.status}: ${stat._count.status}`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при инициализации базы данных:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
