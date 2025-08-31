import { Part, CreatePartInput, UpdatePartInput, Car, CreateCarInput, UpdateCarInput, CarFilters, CarStats } from '@/types';

/**
 * Моковые данные для автомобилей
 */
const mockCars: Car[] = [
  {
    id: 'car1',
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
    notes: 'Автомобиль разобран на запчасти',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'car2',
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
    notes: 'Автомобиль разобран на запчасти',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: 'car3',
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
    notes: 'Автомобиль разобран на запчасти',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: 'car4',
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
    notes: 'Автомобиль разобран на запчасти',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
];

/**
 * Моковые данные для запчастей (обновленные с ссылками на автомобили)
 */
const mockParts: Part[] = [
  {
    id: '1',
    zapchastName: 'Двигатель BMW M54 2.5L',
    category: 'engine',
    carId: 'car1',
    condition: 'good',
    status: 'available',
    price: 85000,
    description: 'Двигатель BMW M54 2.5L в хорошем состоянии, пробег 150,000 км',
    location: 'Склад А, полка 1',
    supplier: 'Авторазборка BMW',
    purchaseDate: new Date('2024-01-15'),
    purchasePrice: 65000,
    images: [],
    notes: 'Проверен, готов к установке. Комплект полный.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    zapchastName: 'Коробка передач 5MT Toyota',
    category: 'transmission',
    carId: 'car2',
    condition: 'excellent',
    status: 'reserved',
    price: 45000,
    description: 'Механическая коробка передач в отличном состоянии',
    location: 'Склад Б, полка 3',
    supplier: 'Toyota Parts',
    purchaseDate: new Date('2024-01-10'),
    purchasePrice: 35000,
    images: [],
    notes: 'Проверена на стенде, работает идеально.',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '3',
    zapchastName: 'Тормозные колодки Brembo',
    category: 'brakes',
    carId: 'car1',
    condition: 'excellent',
    status: 'sold',
    price: 8000,
    description: 'Передние тормозные колодки Brembo, новые',
    location: 'Склад А, полка 5',
    supplier: 'Brembo Official',
    purchaseDate: new Date('2024-01-05'),
    purchasePrice: 6000,
    images: [],
    notes: 'Проданы 15.01.2024',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '4',
    zapchastName: 'Амортизаторы передние KYB',
    category: 'suspension',
    carId: 'car3',
    condition: 'good',
    status: 'available',
    price: 12000,
    description: 'Передние амортизаторы KYB для Honda Civic',
    location: 'Склад В, полка 2',
    supplier: 'KYB Parts',
    purchaseDate: new Date('2024-01-08'),
    purchasePrice: 9000,
    images: [],
    notes: 'Б/у, но в хорошем состоянии.',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
  },
  {
    id: '5',
    zapchastName: 'Генератор Bosch',
    category: 'electrical',
    carId: 'car4',
    condition: 'fair',
    status: 'available',
    price: 15000,
    description: 'Генератор Bosch для VW Golf',
    location: 'Склад А, полка 7',
    supplier: 'Bosch Service',
    purchaseDate: new Date('2024-01-12'),
    purchasePrice: 12000,
    images: [],
    notes: 'Требует проверки перед установкой.',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
];

/**
 * Класс для работы с моковыми данными
 * Имитирует работу с базой данных для демонстрации
 */
class MockDatabaseManager {
  private parts: Part[] = [...mockParts];
  private cars: Car[] = [...mockCars];
  private static instance: MockDatabaseManager;

  private constructor() {
    console.log('🔧 [DEBUG] MockDatabaseManager: Инициализация базы данных');
    console.log('🔧 [DEBUG] MockDatabaseManager: Загружено запчастей:', this.parts.length);
  }

  /**
   * Singleton паттерн для обеспечения единственного экземпляра
   */
  public static getInstance(): MockDatabaseManager {
    if (!MockDatabaseManager.instance) {
      MockDatabaseManager.instance = new MockDatabaseManager();
    }
    return MockDatabaseManager.instance;
  }

  /**
   * Получение всех запчастей с пагинацией и фильтрацией
   */
  public getParts(page: number = 1, limit: number = 20, filters?: Partial<Part>): Part[] {
    console.log('🔧 [DEBUG] MockDatabaseManager.getParts: Запрос с параметрами:', { page, limit, filters });
    
    let filteredParts = [...this.parts];

    // Применяем фильтры
    if (filters?.category) {
      filteredParts = filteredParts.filter(part => part.category === filters.category);
    }
    if (filters?.status) {
      filteredParts = filteredParts.filter(part => part.status === filters.status);
    }
    if (filters?.carId) {
      filteredParts = filteredParts.filter(part => part.carId === filters.carId);
    }
    if (filters?.location) {
      filteredParts = filteredParts.filter(part => 
        part.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Сортируем по дате создания (новые сначала)
    filteredParts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Применяем пагинацию
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const result = filteredParts.slice(startIndex, endIndex);
    console.log('🔧 [DEBUG] MockDatabaseManager.getParts: Возвращено запчастей:', result.length);
    
    return result;
  }

  /**
   * Получение запчасти по ID
   */
  public getPartById(id: string): Part | null {
    return this.parts.find(part => part.id === id) || null;
  }

  /**
   * Создание новой запчасти
   */
  public createPart(part: CreatePartInput): Part {
    const id = crypto.randomUUID();
    const now = new Date();
    
    const newPart: Part = {
      ...part,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.parts.unshift(newPart); // Добавляем в начало массива
    return newPart;
  }

  /**
   * Обновление запчасти
   */
  public updatePart(id: string, updates: UpdatePartInput): Part | null {
    const index = this.parts.findIndex(part => part.id === id);
    if (index === -1) return null;

    this.parts[index] = {
      ...this.parts[index],
      ...updates,
      updatedAt: new Date(),
    } as Part;

    return this.parts[index] || null;
  }

  /**
   * Удаление запчасти
   */
  public deletePart(id: string): boolean {
    const index = this.parts.findIndex(part => part.id === id);
    if (index === -1) return false;

    this.parts.splice(index, 1);
    return true;
  }

  /**
   * Получение статистики инвентаря
   */
  public getInventoryStats(): any {
    const totalParts = this.parts.length;
    const availableParts = this.parts.filter(part => part.status === 'available').length;
    const reservedParts = this.parts.filter(part => part.status === 'reserved').length;
    const soldParts = this.parts.filter(part => part.status === 'sold').length;
    const totalValue = this.parts.reduce((sum, part) => sum + part.price, 0);
    const averagePrice = totalParts > 0 ? totalValue / totalParts : 0;

    // Распределение по категориям
    const categoryDistribution: Record<string, number> = {};
    this.parts.forEach(part => {
      categoryDistribution[part.category] = (categoryDistribution[part.category] || 0) + 1;
    });

    // Распределение по состоянию
    const conditionDistribution: Record<string, number> = {};
    this.parts.forEach(part => {
      conditionDistribution[part.condition] = (conditionDistribution[part.condition] || 0) + 1;
    });

    return {
      totalParts,
      availableParts,
      reservedParts,
      soldParts,
      totalValue,
      averagePrice,
      categoryDistribution,
      conditionDistribution,
    };
  }

  /**
   * Поиск запчастей по тексту
   */
  public searchParts(query: string): Part[] {
    const lowerQuery = query.toLowerCase();
    return this.parts.filter(part => {
      const car = this.getCarForPart(part.carId);
      return part.zapchastName.toLowerCase().includes(lowerQuery) ||
             part.description.toLowerCase().includes(lowerQuery) ||
             (car && car.brand.toLowerCase().includes(lowerQuery)) ||
             (car && car.model.toLowerCase().includes(lowerQuery));
    });
  }

  // ===== МЕТОДЫ ДЛЯ РАБОТЫ С АВТОМОБИЛЯМИ =====

  /**
   * Получение всех автомобилей с пагинацией и фильтрацией
   */
  public getCars(page: number = 1, limit: number = 20, filters?: CarFilters): Car[] {
    console.log('🔧 [DEBUG] MockDatabaseManager.getCars: Запрос с параметрами:', { page, limit, filters });
    
    let filteredCars = [...this.cars];

    // Применяем фильтры
    if (filters?.brand) {
      filteredCars = filteredCars.filter(car => 
        car.brand.toLowerCase().includes(filters.brand!.toLowerCase())
      );
    }
    if (filters?.model) {
      filteredCars = filteredCars.filter(car => 
        car.model.toLowerCase().includes(filters.model!.toLowerCase())
      );
    }
    if (filters?.year) {
      filteredCars = filteredCars.filter(car => car.year === filters.year);
    }
    if (filters?.bodyType) {
      filteredCars = filteredCars.filter(car => car.bodyType === filters.bodyType);
    }
    if (filters?.fuelType) {
      filteredCars = filteredCars.filter(car => car.fuelType === filters.fuelType);
    }
    if (filters?.minMileage) {
      filteredCars = filteredCars.filter(car => car.mileage >= filters.minMileage!);
    }
    if (filters?.maxMileage) {
      filteredCars = filteredCars.filter(car => car.mileage <= filters.maxMileage!);
    }

    // Сортируем по дате создания (новые сначала)
    filteredCars.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Применяем пагинацию
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const result = filteredCars.slice(startIndex, endIndex);
    console.log('🔧 [DEBUG] MockDatabaseManager.getCars: Возвращено автомобилей:', result.length);
    
    return result;
  }

  /**
   * Получение автомобиля по ID
   */
  public getCarById(id: string): Car | null {
    return this.cars.find(car => car.id === id) || null;
  }

  /**
   * Создание нового автомобиля
   */
  public createCar(car: CreateCarInput): Car {
    const id = `car${Date.now()}`;
    const now = new Date();
    
    const newCar: Car = {
      ...car,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.cars.unshift(newCar); // Добавляем в начало массива
    console.log('🔧 [DEBUG] MockDatabaseManager.createCar: Создан новый автомобиль:', newCar);
    return newCar;
  }

  /**
   * Обновление автомобиля
   */
  public updateCar(id: string, updates: UpdateCarInput): Car | null {
    const index = this.cars.findIndex(car => car.id === id);
    if (index === -1) return null;

    this.cars[index] = {
      ...this.cars[index],
      ...updates,
      updatedAt: new Date(),
    } as Car;

    console.log('🔧 [DEBUG] MockDatabaseManager.updateCar: Обновлен автомобиль:', this.cars[index]);
    return this.cars[index] || null;
  }

  /**
   * Удаление автомобиля
   */
  public deleteCar(id: string): boolean {
    const index = this.cars.findIndex(car => car.id === id);
    if (index === -1) return false;

    // Проверяем, есть ли запчасти, связанные с этим автомобилем
    const relatedParts = this.parts.filter(part => part.carId === id);
    if (relatedParts.length > 0) {
      console.log('🔧 [DEBUG] MockDatabaseManager.deleteCar: Нельзя удалить автомобиль с запчастями:', relatedParts.length);
      return false;
    }

    this.cars.splice(index, 1);
    console.log('🔧 [DEBUG] MockDatabaseManager.deleteCar: Удален автомобиль:', id);
    return true;
  }

  /**
   * Получение статистики автомобилей
   */
  public getCarStats(): CarStats {
    const totalCars = this.cars.length;

    // Распределение по брендам
    const brandDistribution: Record<string, number> = {};
    this.cars.forEach(car => {
      brandDistribution[car.brand] = (brandDistribution[car.brand] || 0) + 1;
    });

    // Распределение по годам
    const yearDistribution: Record<number, number> = {};
    this.cars.forEach(car => {
      yearDistribution[car.year] = (yearDistribution[car.year] || 0) + 1;
    });

    // Распределение по типам кузова
    const bodyTypeDistribution: Record<string, number> = {};
    this.cars.forEach(car => {
      bodyTypeDistribution[car.bodyType] = (bodyTypeDistribution[car.bodyType] || 0) + 1;
    });

    // Распределение по типам топлива
    const fuelTypeDistribution: Record<string, number> = {};
    this.cars.forEach(car => {
      fuelTypeDistribution[car.fuelType] = (fuelTypeDistribution[car.fuelType] || 0) + 1;
    });

    return {
      totalCars,
      brandDistribution,
      yearDistribution,
      bodyTypeDistribution,
      fuelTypeDistribution,
    };
  }

  /**
   * Поиск автомобилей по тексту
   */
  public searchCars(query: string): Car[] {
    const lowerQuery = query.toLowerCase();
    return this.cars.filter(car => 
      car.brand.toLowerCase().includes(lowerQuery) ||
      car.model.toLowerCase().includes(lowerQuery) ||
      car.description.toLowerCase().includes(lowerQuery) ||
      car.vin.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Получение автомобиля для запчасти
   */
  public getCarForPart(carId: string): Car | null {
    return this.getCarById(carId);
  }
}

// Экспортируем единственный экземпляр
export const db = MockDatabaseManager.getInstance();
