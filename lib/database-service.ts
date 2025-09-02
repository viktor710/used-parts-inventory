import { prisma } from './prisma'
import { 
  Part, 
  CreatePartInput, 
  UpdatePartInput, 
  Car, 
  CreateCarInput, 
  UpdateCarInput, 
  CarFilters,
  CarStats,
  PaginatedResult,
  InventoryStats,
  PartCategory,
  PartCondition
} from '@/types'

/**
 * Сервис для работы с базой данных через Prisma
 * Заменяет моковые данные на реальную работу с PostgreSQL
 */
export class DatabaseService {
  /**
   * Безопасное выполнение операций с базой данных
   */
  private async safeDbOperation<T>(operation: () => Promise<T>): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      console.error('❌ Ошибка при выполнении операции с БД:', error);
      return null;
    }
  }
  /**
   * Получение всех запчастей с пагинацией и фильтрацией
   */
  async getParts(
    page: number = 1, 
    limit: number = 20, 
    filters?: Partial<Part>
  ): Promise<PaginatedResult<Part>> {
    console.log('🔧 [DEBUG] DatabaseService.getParts: Запрос с параметрами:', { page, limit, filters })
    
    const result = await this.safeDbOperation(async () => {
      const skip = (page - 1) * limit
      
      // Строим условия WHERE
      const where: Record<string, unknown> = {}
      
      if (filters?.category) {
        where['category'] = filters.category
      }
      if (filters?.status) {
        where['status'] = filters.status
      }
      if (filters?.carId) {
        where['carId'] = filters.carId
      }
      if (filters?.location) {
        where['location'] = {
          contains: filters.location,
          mode: 'insensitive'
        }
      }

      // Получаем общее количество записей
      const total = await prisma.part.count({ where })
      
      // Получаем данные с пагинацией
      const parts = await prisma.part.findMany({
        where,
        include: {
          car: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      })

      // Преобразуем в формат, совместимый с нашими типами
      const transformedParts: Part[] = parts.map(part => ({
        id: part.id,
        zapchastName: part.zapchastName,
        category: part.category,
        carId: part.carId,
        condition: part.condition,
        status: part.status,
        price: part.price,
        description: part.description,
        location: part.location,
        supplier: part.supplier,
        purchaseDate: new Date(part.purchaseDate),
        purchasePrice: part.purchasePrice,
        images: part.images,
        notes: part.notes || '',
        createdAt: new Date(part.createdAt),
        updatedAt: new Date(part.updatedAt)
      }))

      console.log('🔧 [DEBUG] DatabaseService.getParts: Возвращено запчастей:', transformedParts.length)
      
      return {
        data: transformedParts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

    // Если база данных недоступна, возвращаем пустой результат
    if (!result) {
      console.warn('⚠️ DatabaseService.getParts: База данных недоступна, возвращаем пустой результат');
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0
      };
    }

    return result;
  }

  /**
   * Получение запчасти по ID
   */
  async getPartById(id: string): Promise<Part | null> {
    const part = await prisma.part.findUnique({
      where: { id },
      include: { car: true }
    })

    if (!part) return null

    return {
      id: part.id,
      zapchastName: part.zapchastName,
      category: part.category,
      carId: part.carId,
      condition: part.condition,
      status: part.status,
      price: part.price,
      description: part.description,
      location: part.location,
      supplier: part.supplier,
      purchaseDate: new Date(part.purchaseDate),
      purchasePrice: part.purchasePrice,
      images: part.images,
      notes: part.notes || '',
      createdAt: new Date(part.createdAt),
      updatedAt: new Date(part.updatedAt)
    }
  }

  /**
   * Создание новой запчасти
   */
  async createPart(partData: CreatePartInput): Promise<Part> {
    const part = await prisma.part.create({
      data: {
        zapchastName: partData.zapchastName,
        category: partData.category,
        carId: partData.carId,
        condition: partData.condition,
        status: partData.status,
        price: partData.price,
        description: partData.description,
        location: partData.location,
        supplier: partData.supplier,
        purchaseDate: partData.purchaseDate,
        purchasePrice: partData.purchasePrice,
        images: partData.images,
        notes: partData.notes
      },
      include: { car: true }
    })

    return {
      id: part.id,
      zapchastName: part.zapchastName,
      category: part.category,
      carId: part.carId,
      condition: part.condition,
      status: part.status,
      price: part.price,
      description: part.description,
      location: part.location,
      supplier: part.supplier,
      purchaseDate: new Date(part.purchaseDate),
      purchasePrice: part.purchasePrice,
      images: part.images,
      notes: part.notes || '',
      createdAt: new Date(part.createdAt),
      updatedAt: new Date(part.updatedAt)
    }
  }

  /**
   * Обновление запчасти
   */
  async updatePart(id: string, updates: UpdatePartInput): Promise<Part | null> {
    const part = await prisma.part.update({
      where: { id },
      data: updates,
      include: { car: true }
    })

    if (!part) return null

    return {
      id: part.id,
      zapchastName: part.zapchastName,
      category: part.category,
      carId: part.carId,
      condition: part.condition,
      status: part.status,
      price: part.price,
      description: part.description,
      location: part.location,
      supplier: part.supplier,
      purchaseDate: new Date(part.purchaseDate),
      purchasePrice: part.purchasePrice,
      images: part.images,
      notes: part.notes || '',
      createdAt: new Date(part.createdAt),
      updatedAt: new Date(part.updatedAt)
    }
  }

  /**
   * Удаление запчасти
   */
  async deletePart(id: string): Promise<boolean> {
    try {
      await prisma.part.delete({
        where: { id }
      })
      return true
    } catch (error) {
      console.error('Ошибка при удалении запчасти:', error)
      return false
    }
  }

  /**
   * Получение статистики инвентаря
   */
  async getInventoryStats(): Promise<InventoryStats> {
    console.log('🔧 [DEBUG] getInventoryStats: Начинаем получение статистики');
    
    try {
      console.log('🔧 [DEBUG] getInventoryStats: Выполняем запросы к БД');
      
      const [
        totalParts,
        availableParts,
        reservedParts,
        soldParts,
        totalCars,
        totalValue,
        categoryStats,
        conditionStats
      ] = await Promise.all([
        prisma.part.count(),
        prisma.part.count({ where: { status: 'available' } }),
        prisma.part.count({ where: { status: 'reserved' } }),
        prisma.part.count({ where: { status: 'sold' } }),
        prisma.car.count(),
        prisma.part.aggregate({
          _sum: { price: true }
        }),
        prisma.part.groupBy({
          by: ['category'],
          _count: { category: true }
        }),
        prisma.part.groupBy({
          by: ['condition'],
          _count: { condition: true }
        })
      ])

      console.log('🔧 [DEBUG] getInventoryStats: Результаты запросов:', {
        totalParts,
        availableParts,
        reservedParts,
        soldParts,
        totalCars,
        totalValue: totalValue._sum.price
      });

      const categoryDistribution: Record<PartCategory, number> = {
        engine: 0,
        transmission: 0,
        suspension: 0,
        brakes: 0,
        electrical: 0,
        body: 0,
        interior: 0,
        exterior: 0,
        other: 0
      }
      categoryStats.forEach(stat => {
        categoryDistribution[stat.category as PartCategory] = stat._count.category
      })

      const conditionDistribution: Record<PartCondition, number> = {
        excellent: 0,
        good: 0,
        fair: 0,
        poor: 0,
        broken: 0
      }
      conditionStats.forEach(stat => {
        conditionDistribution[stat.condition as PartCondition] = stat._count.condition
      })

      const stats = {
        totalParts,
        availableParts,
        reservedParts,
        soldParts,
        totalCars,
        totalValue: totalValue._sum.price || 0,
        averagePrice: totalParts > 0 ? (totalValue._sum.price || 0) / totalParts : 0,
        categoryDistribution,
        conditionDistribution
      };

      console.log('🔧 [DEBUG] getInventoryStats: Возвращаем статистику:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Ошибка при получении статистики:', error);
      return {
        totalParts: 0,
        availableParts: 0,
        reservedParts: 0,
        soldParts: 0,
        totalCars: 0,
        totalValue: 0,
        averagePrice: 0,
        categoryDistribution: {
          engine: 0,
          transmission: 0,
          suspension: 0,
          brakes: 0,
          electrical: 0,
          body: 0,
          interior: 0,
          exterior: 0,
          other: 0
        },
        conditionDistribution: {
          excellent: 0,
          good: 0,
          fair: 0,
          poor: 0,
          broken: 0
        }
      }
    }
  }

  /**
   * Поиск запчастей по тексту
   */
  async searchParts(query: string): Promise<Part[]> {
    const parts = await prisma.part.findMany({
      where: {
        OR: [
          { zapchastName: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { car: { brand: { contains: query, mode: 'insensitive' } } },
          { car: { model: { contains: query, mode: 'insensitive' } } }
        ]
      },
      include: { car: true }
    })

    return parts.map(part => ({
      id: part.id,
      zapchastName: part.zapchastName,
      category: part.category,
      carId: part.carId,
      condition: part.condition,
      status: part.status,
      price: part.price,
      description: part.description,
      location: part.location,
      supplier: part.supplier,
      purchaseDate: new Date(part.purchaseDate),
      purchasePrice: part.purchasePrice,
      images: part.images,
      notes: part.notes || '',
      createdAt: new Date(part.createdAt),
      updatedAt: new Date(part.updatedAt)
    }))
  }

  // ===== МЕТОДЫ ДЛЯ РАБОТЫ С АВТОМОБИЛЯМИ =====

  /**
   * Получение всех автомобилей с пагинацией и фильтрацией
   */
  async getCars(
    page: number = 1, 
    limit: number = 20, 
    filters?: CarFilters
  ): Promise<PaginatedResult<Car>> {
    console.log('🔧 [DEBUG] DatabaseService.getCars: Запрос с параметрами:', { page, limit, filters })
    
    const result = await this.safeDbOperation(async () => {
      const skip = (page - 1) * limit
      
      // Строим условия WHERE
      const where: Record<string, unknown> = {}
      
      if (filters?.brand) {
        where['brand'] = { contains: filters.brand, mode: 'insensitive' }
      }
      if (filters?.model) {
        where['model'] = { contains: filters.model, mode: 'insensitive' }
      }
      if (filters?.year) {
        where['year'] = filters.year
      }
      if (filters?.bodyType) {
        where['bodyType'] = filters.bodyType
      }
      if (filters?.fuelType) {
        where['fuelType'] = filters.fuelType
      }
      if (filters?.minMileage) {
        where['mileage'] = { gte: filters.minMileage }
      }
      if (filters?.maxMileage) {
        const existingMileage = where['mileage'] as Record<string, unknown> || {};
        where['mileage'] = { ...existingMileage, lte: filters.maxMileage }
      }

      // Получаем общее количество записей
      const total = await prisma.car.count({ where })
      
      // Получаем данные с пагинацией
      const cars = await prisma.car.findMany({
        where,
        include: {
          parts: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      })

      // Преобразуем в формат, совместимый с нашими типами
      const transformedCars: Car[] = cars.map(car => ({
        id: car.id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        bodyType: car.bodyType,
        fuelType: car.fuelType,
        engineVolume: car.engineVolume,
        transmission: car.transmission,
        mileage: car.mileage,
        vin: car.vin,
        color: car.color,
        description: car.description,
        images: car.images,
        notes: car.notes || '',
        createdAt: new Date(car.createdAt),
        updatedAt: new Date(car.updatedAt)
      }))

      console.log('🔧 [DEBUG] DatabaseService.getCars: Возвращено автомобилей:', transformedCars.length)
      
      return {
        data: transformedCars,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

    // Если база данных недоступна, возвращаем пустой результат
    if (!result) {
      console.warn('⚠️ DatabaseService.getCars: База данных недоступна, возвращаем пустой результат');
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0
      };
    }

    return result;
  }

  /**
   * Получение автомобиля по ID
   */
  async getCarById(id: string): Promise<Car | null> {
    const car = await prisma.car.findUnique({
      where: { id },
      include: { parts: true }
    })

    if (!car) return null

    return {
      id: car.id,
      brand: car.brand,
      model: car.model,
      year: car.year,
      bodyType: car.bodyType,
      fuelType: car.fuelType,
      engineVolume: car.engineVolume,
      transmission: car.transmission,
      mileage: car.mileage,
      vin: car.vin,
      color: car.color,
      description: car.description,
      images: car.images,
      notes: car.notes || '',
      createdAt: new Date(car.createdAt),
      updatedAt: new Date(car.updatedAt)
    }
  }

  /**
   * Создание нового автомобиля
   */
  async createCar(carData: CreateCarInput): Promise<Car> {
    const car = await prisma.car.create({
      data: {
        brand: carData.brand,
        model: carData.model,
        year: carData.year,
        bodyType: carData.bodyType,
        fuelType: carData.fuelType,
        engineVolume: carData.engineVolume,
        transmission: carData.transmission,
        mileage: carData.mileage,
        vin: carData.vin,
        color: carData.color,
        description: carData.description,
        images: carData.images,
        notes: carData.notes
      }
    })

    console.log('🔧 [DEBUG] DatabaseService.createCar: Создан новый автомобиль:', car)
    
    return {
      id: car.id,
      brand: car.brand,
      model: car.model,
      year: car.year,
      bodyType: car.bodyType,
      fuelType: car.fuelType,
      engineVolume: car.engineVolume,
      transmission: car.transmission,
      mileage: car.mileage,
      vin: car.vin,
      color: car.color,
      description: car.description,
      images: car.images,
      notes: car.notes || '',
      createdAt: new Date(car.createdAt),
      updatedAt: new Date(car.updatedAt)
    }
  }

  /**
   * Обновление автомобиля
   */
  async updateCar(id: string, updates: UpdateCarInput): Promise<Car | null> {
    const car = await prisma.car.update({
      where: { id },
      data: updates
    })

    if (!car) return null

    console.log('🔧 [DEBUG] DatabaseService.updateCar: Обновлен автомобиль:', car)
    
    return {
      id: car.id,
      brand: car.brand,
      model: car.model,
      year: car.year,
      bodyType: car.bodyType,
      fuelType: car.fuelType,
      engineVolume: car.engineVolume,
      transmission: car.transmission,
      mileage: car.mileage,
      vin: car.vin,
      color: car.color,
      description: car.description,
      images: car.images,
      notes: car.notes || '',
      createdAt: new Date(car.createdAt),
      updatedAt: new Date(car.updatedAt)
    }
  }

  /**
   * Удаление автомобиля
   */
  async deleteCar(id: string): Promise<boolean> {
    try {
      // Проверяем, есть ли запчасти, связанные с этим автомобилем
      const relatedParts = await prisma.part.count({
        where: { carId: id }
      })

      if (relatedParts > 0) {
        console.log('🔧 [DEBUG] DatabaseService.deleteCar: Нельзя удалить автомобиль с запчастями:', relatedParts)
        return false
      }

      await prisma.car.delete({
        where: { id }
      })

      console.log('🔧 [DEBUG] DatabaseService.deleteCar: Удален автомобиль:', id)
      return true
    } catch (error) {
      console.error('Ошибка при удалении автомобиля:', error)
      return false
    }
  }

  /**
   * Получение статистики автомобилей
   */
  async getCarStats(): Promise<CarStats> {
    const [
      totalCars,
      brandStats,
      yearStats,
      bodyTypeStats,
      fuelTypeStats
    ] = await Promise.all([
      prisma.car.count(),
      prisma.car.groupBy({
        by: ['brand'],
        _count: { brand: true }
      }),
      prisma.car.groupBy({
        by: ['year'],
        _count: { year: true }
      }),
      prisma.car.groupBy({
        by: ['bodyType'],
        _count: { bodyType: true }
      }),
      prisma.car.groupBy({
        by: ['fuelType'],
        _count: { fuelType: true }
      })
    ])

    const brandDistribution: Record<string, number> = {}
    brandStats.forEach(stat => {
      brandDistribution[stat.brand] = stat._count.brand
    })

    const yearDistribution: Record<number, number> = {}
    yearStats.forEach(stat => {
      yearDistribution[stat.year] = stat._count.year
    })

    const bodyTypeDistribution: Record<string, number> = {}
    bodyTypeStats.forEach(stat => {
      bodyTypeDistribution[stat.bodyType] = stat._count.bodyType
    })

    const fuelTypeDistribution: Record<string, number> = {}
    fuelTypeStats.forEach(stat => {
      fuelTypeDistribution[stat.fuelType] = stat._count.fuelType
    })

    return {
      totalCars,
      brandDistribution,
      yearDistribution,
      bodyTypeDistribution,
      fuelTypeDistribution
    }
  }

  /**
   * Поиск автомобилей по тексту
   */
  async searchCars(query: string): Promise<Car[]> {
    const cars = await prisma.car.findMany({
      where: {
        OR: [
          { brand: { contains: query, mode: 'insensitive' } },
          { model: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { vin: { contains: query, mode: 'insensitive' } }
        ]
      }
    })

    return cars.map(car => ({
      id: car.id,
      brand: car.brand,
      model: car.model,
      year: car.year,
      bodyType: car.bodyType,
      fuelType: car.fuelType,
      engineVolume: car.engineVolume,
      transmission: car.transmission,
      mileage: car.mileage,
      vin: car.vin,
      color: car.color,
      description: car.description,
      images: car.images,
      notes: car.notes || '',
      createdAt: new Date(car.createdAt),
      updatedAt: new Date(car.updatedAt)
    }))
  }

  /**
   * Получение автомобиля для запчасти
   */
  async getCarForPart(carId: string): Promise<Car | null> {
    return this.getCarById(carId)
  }
}

// Экспортируем единственный экземпляр
export const dbService = new DatabaseService()
