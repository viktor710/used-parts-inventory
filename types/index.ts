/**
 * Основные типы для системы учета б/у запчастей
 * Все типы строго типизированы для обеспечения надежности кода
 */

// Тип для категорий запчастей
export type PartCategory = 
  | 'engine'           // Двигатель
  | 'transmission'     // Трансмиссия
  | 'suspension'       // Подвеска
  | 'brakes'           // Тормоза
  | 'electrical'       // Электрика
  | 'body'             // Кузов
  | 'interior'         // Салон
  | 'exterior'         // Внешние элементы
  | 'other';           // Прочее

// Тип для состояния запчасти
export type PartCondition = 
  | 'excellent'        // Отличное
  | 'good'             // Хорошее
  | 'fair'             // Удовлетворительное
  | 'poor'             // Плохое
  | 'broken';          // Сломанное

// Тип для статуса запчасти
export type PartStatus = 
  | 'available'        // Доступна
  | 'reserved'         // Зарезервирована
  | 'sold'             // Продана
  | 'scrapped';        // Утилизирована

// Интерфейс для запчасти
export interface Part {
  id: string;                    // Уникальный идентификатор
  name: string;                  // Название запчасти
  category: PartCategory;        // Категория
  brand: string;                 // Бренд/производитель
  model: string;                 // Модель автомобиля
  year: number;                  // Год выпуска
  condition: PartCondition;      // Состояние
  status: PartStatus;            // Статус
  price: number;                 // Цена
  description: string;           // Описание
  location: string;              // Место хранения
  supplier: string;              // Поставщик
  purchaseDate: Date;            // Дата приобретения
  purchasePrice: number;         // Цена приобретения
  images: string[];              // Массив URL изображений
  notes: string;                 // Дополнительные заметки
  createdAt: Date;               // Дата создания записи
  updatedAt: Date;               // Дата последнего обновления
}

// Интерфейс для создания новой запчасти (без id и дат)
export type CreatePartInput = Omit<Part, 'id' | 'createdAt' | 'updatedAt'>;

// Интерфейс для обновления запчасти (все поля опциональны)
export type UpdatePartInput = Partial<Omit<Part, 'id' | 'createdAt' | 'updatedAt'>>;

// Интерфейс для фильтров поиска
export interface PartFilters {
  category?: PartCategory;
  condition?: PartCondition;
  status?: PartStatus;
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  year?: number;
  location?: string;
  supplier?: string;
}

// Интерфейс для пагинации
export interface PaginationParams {
  page: number;
  limit: number;
}

// Интерфейс для результата с пагинацией
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Интерфейс для статистики
export interface InventoryStats {
  totalParts: number;
  availableParts: number;
  reservedParts: number;
  soldParts: number;
  totalValue: number;
  averagePrice: number;
  categoryDistribution: Record<PartCategory, number>;
  conditionDistribution: Record<PartCondition, number>;
}

// Интерфейс для поставщика
export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Интерфейс для клиента
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Интерфейс для продажи
export interface Sale {
  id: string;
  partId: string;
  customerId: string;
  price: number;
  saleDate: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Тип для API ответов
export type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

// Тип для формы поиска
export interface SearchFormData {
  query: string;
  category: PartCategory | '';
  condition: PartCondition | '';
  status: PartStatus | '';
  minPrice: string;
  maxPrice: string;
  year: string;
}
