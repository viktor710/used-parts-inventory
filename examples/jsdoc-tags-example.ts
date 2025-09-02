/**
 * @fileoverview Примеры использования JSDoc тегов для Cursor
 * @description Демонстрация правильного документирования функций с @tags
 * @author Система учета б/у запчастей
 * @since 1.0.0
 */

import { PrismaClient } from '@prisma/client';
import { Car, CreateCarInput, UpdateCarInput } from '@/types';

// Кастомные классы ошибок
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class SecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecurityError';
  }
}

/**
 * @description Создает новый автомобиль в базе данных с валидацией данных
 * @param {CreateCarInput} carData - Данные автомобиля для создания
 * @param {PrismaClient} prisma - Экземпляр Prisma клиента
 * @returns {Promise<Car>} Созданный автомобиль
 * @throws {ValidationError} При ошибке валидации данных
 * @throws {DatabaseError} При ошибке базы данных
 * 
 * @example
 * ```typescript
 * const car = await createCar({
 *   brand: 'Toyota',
 *   model: 'Camry',
 *   year: 2020,
 *   vin: '1HGBH41JXMN109186'
 * }, prisma);
 * 
 * console.log(car.id); // "uuid-123"
 * ```
 * 
 * @see {@link updateCar} для обновления автомобиля
 * @see {@link deleteCar} для удаления автомобиля
 * @see {@link getCarById} для получения по ID
 * @since 1.2.0 - Добавлена поддержка VIN кодов
 * @since 1.3.0 - Добавлена валидация года выпуска
 */
export async function createCar(carData: CreateCarInput, prisma: PrismaClient): Promise<Car> {
  try {
    // Валидация данных
    validateCarData(carData);
    
    // Создание автомобиля
    const car = await prisma.car.create({
      data: carData
    });
    
    return car;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new DatabaseError('Ошибка создания автомобиля в базе данных');
  }
}

/**
 * @description Обновляет существующий автомобиль в базе данных
 * @param {string} id - Уникальный идентификатор автомобиля
 * @param {UpdateCarInput} updateData - Данные для обновления
 * @param {PrismaClient} prisma - Экземпляр Prisma клиента
 * @returns {Promise<Car>} Обновленный автомобиль
 * @throws {NotFoundError} Когда автомобиль не найден
 * @throws {ValidationError} При ошибке валидации данных
 * @throws {DatabaseError} При ошибке базы данных
 * 
 * @example
 * ```typescript
 * const updatedCar = await updateCar('car-123', {
 *   year: 2021,
 *   description: 'Обновленное описание'
 * }, prisma);
 * ```
 * 
 * @see {@link createCar} для создания автомобиля
 * @see {@link deleteCar} для удаления автомобиля
 * @since 1.1.0
 */
export async function updateCar(
  id: string, 
  updateData: UpdateCarInput, 
  prisma: PrismaClient
): Promise<Car> {
  try {
    // Проверка существования автомобиля
    const existingCar = await prisma.car.findUnique({ where: { id } });
    if (!existingCar) {
      throw new NotFoundError('Автомобиль не найден');
    }
    
    // Валидация данных обновления
    validateCarUpdateData(updateData);
    
    // Обновление автомобиля
    const car = await prisma.car.update({
      where: { id },
      data: updateData
    });
    
    return car;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ValidationError) {
      throw error;
    }
    throw new DatabaseError('Ошибка обновления автомобиля в базе данных');
  }
}

/**
 * @description Удаляет автомобиль из базы данных
 * @param {string} id - Уникальный идентификатор автомобиля
 * @param {PrismaClient} prisma - Экземпляр Prisma клиента
 * @returns {Promise<void>}
 * @throws {NotFoundError} Когда автомобиль не найден
 * @throws {DatabaseError} При ошибке базы данных
 * 
 * @example
 * ```typescript
 * await deleteCar('car-123', prisma);
 * console.log('Автомобиль успешно удален');
 * ```
 * 
 * @see {@link createCar} для создания автомобиля
 * @see {@link updateCar} для обновления автомобиля
 * @since 1.1.0
 */
export async function deleteCar(id: string, prisma: PrismaClient): Promise<void> {
  try {
    // Проверка существования автомобиля
    const existingCar = await prisma.car.findUnique({ where: { id } });
    if (!existingCar) {
      throw new NotFoundError('Автомобиль не найден');
    }
    
    // Удаление автомобиля
    await prisma.car.delete({ where: { id } });
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new DatabaseError('Ошибка удаления автомобиля из базы данных');
  }
}

/**
 * @description Получает автомобиль по уникальному идентификатору
 * @param {string} id - Уникальный идентификатор автомобиля
 * @param {PrismaClient} prisma - Экземпляр Prisma клиента
 * @returns {Promise<Car | null>} Автомобиль или null если не найден
 * @throws {DatabaseError} При ошибке базы данных
 * 
 * @example
 * ```typescript
 * const car = await getCarById('car-123', prisma);
 * if (car) {
 *   console.log(`Найден автомобиль: ${car.brand} ${car.model}`);
 * } else {
 *   console.log('Автомобиль не найден');
 * }
 * ```
 * 
 * @see {@link getAllCars} для получения всех автомобилей
 * @see {@link searchCars} для поиска автомобилей
 * @since 1.0.0
 */
export async function getCarById(id: string, prisma: PrismaClient): Promise<Car | null> {
  try {
    return await prisma.car.findUnique({ where: { id } });
  } catch (error) {
    throw new DatabaseError('Ошибка получения автомобиля из базы данных');
  }
}

/**
 * @description Получает все автомобили из базы данных с пагинацией
 * @param {Object} options - Опции запроса
 * @param {number} [options.page=1] - Номер страницы
 * @param {number} [options.limit=10] - Количество элементов на странице
 * @param {PrismaClient} prisma - Экземпляр Prisma клиента
 * @returns {Promise<{cars: Car[], total: number, page: number, totalPages: number}>} 
 *   Объект с автомобилями и метаданными пагинации
 * @throws {DatabaseError} При ошибке базы данных
 * 
 * @example
 * ```typescript
 * const result = await getAllCars({ page: 1, limit: 20 }, prisma);
 * console.log(`Найдено ${result.total} автомобилей`);
 * console.log(`Страница ${result.page} из ${result.totalPages}`);
 * ```
 * 
 * @see {@link getCarById} для получения одного автомобиля
 * @see {@link searchCars} для поиска автомобилей
 * @since 1.0.0
 */
export async function getAllCars(
  options: { page?: number; limit?: number } = {},
  prisma: PrismaClient
): Promise<{cars: Car[], total: number, page: number, totalPages: number}> {
  try {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;
    
    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.car.count()
    ]);
    
    return {
      cars,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    throw new DatabaseError('Ошибка получения автомобилей из базы данных');
  }
}

/**
 * @description Ищет автомобили по различным критериям
 * @param {Object} searchCriteria - Критерии поиска
 * @param {string} [searchCriteria.brand] - Марка автомобиля
 * @param {string} [searchCriteria.model] - Модель автомобиля
 * @param {number} [searchCriteria.yearFrom] - Год выпуска от
 * @param {number} [searchCriteria.yearTo] - Год выпуска до
 * @param {PrismaClient} prisma - Экземпляр Prisma клиента
 * @returns {Promise<Car[]>} Массив найденных автомобилей
 * @throws {DatabaseError} При ошибке базы данных
 * 
 * @example
 * ```typescript
 * const cars = await searchCars({
 *   brand: 'Toyota',
 *   yearFrom: 2020,
 *   yearTo: 2022
 * }, prisma);
 * 
 * console.log(`Найдено ${cars.length} автомобилей Toyota 2020-2022`);
 * ```
 * 
 * @see {@link getAllCars} для получения всех автомобилей
 * @see {@link getCarById} для получения одного автомобиля
 * @since 1.2.0
 */
export async function searchCars(
  searchCriteria: {
    brand?: string;
    model?: string;
    yearFrom?: number;
    yearTo?: number;
  },
  prisma: PrismaClient
): Promise<Car[]> {
  try {
    const where: any = {};
    
    if (searchCriteria.brand) {
      where.brand = { contains: searchCriteria.brand, mode: 'insensitive' };
    }
    
    if (searchCriteria.model) {
      where.model = { contains: searchCriteria.model, mode: 'insensitive' };
    }
    
    if (searchCriteria.yearFrom || searchCriteria.yearTo) {
      where.year = {};
      if (searchCriteria.yearFrom) where.year.gte = searchCriteria.yearFrom;
      if (searchCriteria.yearTo) where.year.lte = searchCriteria.yearTo;
    }
    
    return await prisma.car.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    throw new DatabaseError('Ошибка поиска автомобилей в базе данных');
  }
}

/**
 * @business Правило валидации VIN кода
 * @description VIN код должен содержать ровно 17 символов
 * @business Правило проверки года выпуска
 * @description Год выпуска не может быть в будущем
 * @business Правило уникальности VIN
 * @description VIN код должен быть уникальным в системе
 * 
 * @description Валидирует данные автомобиля согласно бизнес-правилам
 * @param {CreateCarInput} carData - Данные автомобиля для валидации
 * @returns {boolean} true если данные валидны
 * @throws {ValidationError} При нарушении правил валидации
 * 
 * @example
 * ```typescript
 * try {
 *   validateCarData({
 *     brand: 'Toyota',
 *     model: 'Camry',
 *     year: 2020,
 *     vin: '1HGBH41JXMN109186'
 *   });
 *   console.log('Данные валидны');
 * } catch (error) {
 *   console.error('Ошибка валидации:', error.message);
 * }
 * ```
 * 
 * @since 1.2.0 - Добавлена поддержка VIN кодов
 * @since 1.3.0 - Добавлена валидация года выпуска
 */
export function validateCarData(carData: CreateCarInput): boolean {
  // Валидация VIN кода
  if (!carData.vin || carData.vin.length !== 17) {
    throw new ValidationError('VIN код должен содержать ровно 17 символов');
  }
  
  // Валидация года выпуска
  const currentYear = new Date().getFullYear();
  if (carData.year > currentYear) {
    throw new ValidationError('Год выпуска не может быть в будущем');
  }
  
  // Валидация обязательных полей
  if (!carData.brand || !carData.model) {
    throw new ValidationError('Марка и модель автомобиля обязательны');
  }
  
  return true;
}

/**
 * @description Валидирует данные для обновления автомобиля
 * @param {UpdateCarInput} updateData - Данные для обновления
 * @returns {boolean} true если данные валидны
 * @throws {ValidationError} При нарушении правил валидации
 * 
 * @example
 * ```typescript
 * validateCarUpdateData({
 *   year: 2021,
 *   description: 'Обновленное описание'
 * });
 * ```
 * 
 * @see {@link validateCarData} для валидации полных данных автомобиля
 * @since 1.1.0
 */
export function validateCarUpdateData(updateData: UpdateCarInput): boolean {
  // Валидация года выпуска если он указан
  if (updateData.year) {
    const currentYear = new Date().getFullYear();
    if (updateData.year > currentYear) {
      throw new ValidationError('Год выпуска не может быть в будущем');
    }
  }
  
  // Валидация VIN кода если он указан
  if (updateData.vin && updateData.vin.length !== 17) {
    throw new ValidationError('VIN код должен содержать ровно 17 символов');
  }
  
  return true;
}

/**
 * @security Проверка прав доступа
 * @description Только пользователи с ролью MANAGER+ могут создавать автомобили
 * @security Валидация входных данных
 * @description Все входные данные проходят строгую валидацию
 * @security Логирование действий
 * @description Все операции с автомобилями логируются
 * 
 * @description Создает автомобиль с дополнительными проверками безопасности
 * @param {CreateCarInput} carData - Данные автомобиля для создания
 * @param {User} user - Пользователь, выполняющий операцию
 * @param {PrismaClient} prisma - Экземпляр Prisma клиента
 * @returns {Promise<Car>} Созданный автомобиль
 * @throws {ValidationError} При ошибке валидации данных
 * @throws {DatabaseError} При ошибке базы данных
 * @throws {SecurityError} При недостатке прав доступа
 * 
 * @example
 * ```typescript
 * const car = await createCarSecure({
 *   brand: 'Toyota',
 *   model: 'Camry',
 *   year: 2020,
 *   vin: '1HGBH41JXMN109186'
 * }, currentUser, prisma);
 * ```
 * 
 * @see {@link createCar} для базового создания автомобиля
 * @since 1.4.0 - Добавлены проверки безопасности
 */
export async function createCarSecure(
  carData: CreateCarInput, 
  user: any, 
  prisma: PrismaClient
): Promise<Car> {
  // Проверка прав доступа
  if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
    throw new SecurityError('Недостаточно прав для создания автомобиля');
  }
  
  // Логирование действия
  console.log(`Пользователь ${user.email} создает автомобиль ${carData.brand} ${carData.model}`);
  
  // Создание автомобиля с базовой логикой
  return await createCar(carData, prisma);
}

/**
 * @deprecated Используйте createCarSecure вместо этой функции
 * @description Устаревшая функция создания автомобиля без проверок безопасности
 * @param {CreateCarInput} carData - Данные автомобиля для создания
 * @param {PrismaClient} prisma - Экземпляр Prisma клиента
 * @returns {Promise<Car>} Созданный автомобиль
 * 
 * @example
 * ```typescript
 * // УСТАРЕЛО: используйте createCarSecure
 * const car = await createCarOld(carData, prisma);
 * ```
 * 
 * @see {@link createCarSecure} для безопасного создания автомобиля
 * @since 1.0.0
 * @deprecated 1.4.0
 */
export async function createCarOld(carData: CreateCarInput, prisma: PrismaClient): Promise<Car> {
  console.warn('createCarOld устарел, используйте createCarSecure');
  return await createCar(carData, prisma);
}
