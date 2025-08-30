import { Part, CreatePartInput, UpdatePartInput } from '@/types';

/**
 * Моковые данные для демонстрации
 */
const mockParts: Part[] = [
  {
    id: '1',
    name: 'Двигатель BMW M54 2.5L',
    category: 'engine',
    brand: 'BMW',
    model: 'E46',
    year: 2003,
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
    name: 'Коробка передач 5MT Toyota',
    category: 'transmission',
    brand: 'Toyota',
    model: 'Camry',
    year: 2010,
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
    name: 'Тормозные колодки Brembo',
    category: 'brakes',
    brand: 'Brembo',
    model: 'Универсальные',
    year: 2020,
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
    name: 'Амортизаторы передние KYB',
    category: 'suspension',
    brand: 'KYB',
    model: 'Honda Civic',
    year: 2015,
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
    name: 'Генератор Bosch',
    category: 'electrical',
    brand: 'Bosch',
    model: 'VW Golf',
    year: 2012,
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
    if (filters?.brand) {
      filteredParts = filteredParts.filter(part => 
        part.brand.toLowerCase().includes(filters.brand!.toLowerCase())
      );
    }
    if (filters?.model) {
      filteredParts = filteredParts.filter(part => 
        part.model.toLowerCase().includes(filters.model!.toLowerCase())
      );
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
    return this.parts.filter(part => 
      part.name.toLowerCase().includes(lowerQuery) ||
      part.brand.toLowerCase().includes(lowerQuery) ||
      part.model.toLowerCase().includes(lowerQuery) ||
      part.description.toLowerCase().includes(lowerQuery)
    );
  }
}

// Экспортируем единственный экземпляр
export const db = MockDatabaseManager.getInstance();
