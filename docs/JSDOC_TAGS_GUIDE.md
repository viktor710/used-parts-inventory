# Руководство по использованию @tags в комментариях для Cursor

## Обзор

Это руководство описывает правильное использование JSDoc тегов в комментариях для улучшения понимания контекста Cursor и создания качественной документации кода.

## Основные принципы

### 1. Всегда документируй функции
Каждая функция, компонент или класс должен иметь JSDoc комментарий с соответствующими тегами.

### 2. Используй русский язык
Все комментарии и описания пиши на русском языке для лучшего понимания командой.

### 3. Структурируй документацию
Используй теги для организации информации в логические блоки.

### 4. Связывай контекст
Используй теги для связывания связанных функций и компонентов.

## Обязательные теги

### @description
Краткое описание назначения функции.

```typescript
/**
 * @description Создает новый автомобиль в базе данных с валидацией данных
 */
export async function createCar(carData: CarData): Promise<Car>
```

### @param
Описание параметров функции.

```typescript
/**
 * @param {CarData} carData - Данные автомобиля для создания
 * @param {PrismaClient} prisma - Экземпляр Prisma клиента
 */
export async function createCar(carData: CarData, prisma: PrismaClient): Promise<Car>
```

### @returns
Описание возвращаемого значения.

```typescript
/**
 * @returns {Promise<Car>} Созданный автомобиль
 * @returns {Promise<null>} null если автомобиль не найден
 */
export async function getCarById(id: string): Promise<Car | null>
```

### @throws
Описание возможных ошибок.

```typescript
/**
 * @throws {ValidationError} При ошибке валидации данных
 * @throws {DatabaseError} При ошибке базы данных
 * @throws {NotFoundError} Когда автомобиль не найден
 */
export async function updateCar(id: string, data: CarData): Promise<Car>
```

## Дополнительные теги

### @example
Примеры использования функции.

```typescript
/**
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
 */
export async function createCar(carData: CarData, prisma: PrismaClient): Promise<Car>
```

### @since
Версия добавления функции.

```typescript
/**
 * @since 1.2.0 - Добавлена поддержка VIN кодов
 * @since 1.3.0 - Добавлена валидация года выпуска
 */
export function validateCarData(data: CarData): boolean
```

### @deprecated
Устаревшие функции.

```typescript
/**
 * @deprecated Используйте createCarSecure вместо этой функции
 * @param carData - Данные автомобиля
 * @returns Promise<Car>
 */
export async function createCarOld(carData: CarData): Promise<Car>
```

### @see
Ссылки на связанные функции.

```typescript
/**
 * @see {@link updateCar} для обновления автомобиля
 * @see {@link deleteCar} для удаления автомобиля
 * @see {@link getCarById} для получения по ID
 */
export async function createCar(carData: CarData): Promise<Car>
```

## Специальные теги для React

### @component
React компоненты.

```typescript
/**
 * @component CarCard
 * @description Карточка для отображения информации об автомобиле
 * @param {CarCardProps} props - Свойства компонента
 * @param {Car} props.car - Данные автомобиля
 * @param {boolean} props.isEditable - Разрешить редактирование
 * @param {Function} props.onEdit - Callback для редактирования
 * @returns {JSX.Element} React компонент карточки
 */
export function CarCard({ car, isEditable, onEdit }: CarCardProps): JSX.Element
```

### @hook
React хуки.

```typescript
/**
 * @hook useCarData
 * @description Хук для работы с данными автомобилей
 * @param {string} carId - ID автомобиля
 * @returns {UseCarDataResult} Объект с данными и методами
 * @example
 * ```typescript
 * const { car, loading, error, updateCar } = useCarData('car-123');
 * ```
 */
export function useCarData(carId: string): UseCarDataResult
```

## Теги для API роутов

### @api
API эндпоинты.

```typescript
/**
 * @api POST /api/cars
 * @description Создает новый автомобиль
 * @body {CarCreateData} carData - Данные для создания автомобиля
 * @returns {ApiResponse<Car>} Ответ с созданным автомобилем
 * @throws {400} При ошибке валидации
 * @throws {401} При отсутствии аутентификации
 * @throws {403} При недостатке прав
 * @throws {500} При внутренней ошибке сервера
 */
export async function POST(request: Request): Promise<Response>
```

## Теги для типов и интерфейсов

### @interface
TypeScript интерфейсы.

```typescript
/**
 * @interface CarData
 * @description Основные данные автомобиля
 * @property {string} brand - Марка автомобиля
 * @property {string} model - Модель автомобиля
 * @property {number} year - Год выпуска
 * @property {string} vin - VIN код (17 символов)
 * @property {string} [description] - Описание (опционально)
 */
interface CarData {
  brand: string;
  model: string;
  year: number;
  vin: string;
  description?: string;
}
```

### @type
TypeScript типы.

```typescript
/**
 * @type CarStatus
 * @description Статус автомобиля в системе
 * @value 'available' - Доступен для продажи
 * @value 'sold' - Продан
 * @value 'reserved' - Зарезервирован
 * @value 'maintenance' - На обслуживании
 */
type CarStatus = 'available' | 'sold' | 'reserved' | 'maintenance';
```

## Теги для бизнес-логики

### @business
Бизнес-правила.

```typescript
/**
 * @business Правило валидации VIN кода
 * @description VIN код должен содержать ровно 17 символов
 * @business Правило проверки года выпуска
 * @description Год выпуска не может быть в будущем
 * @business Правило уникальности VIN
 * @description VIN код должен быть уникальным в системе
 */
export function validateCarBusinessRules(carData: CarData): ValidationResult
```

### @security
Безопасность.

```typescript
/**
 * @security Проверка прав доступа
 * @description Только пользователи с ролью MANAGER+ могут создавать автомобили
 * @security Валидация входных данных
 * @description Все входные данные проходят строгую валидацию
 * @security Логирование действий
 * @description Все операции с автомобилями логируются
 */
export async function createCarSecure(carData: CarData, user: User): Promise<Car>
```

## Структура JSDoc комментария

### Рекомендуемый порядок тегов

```typescript
/**
 * @description Краткое описание функции
 * 
 * @param {Type} paramName - Описание параметра
 * @returns {ReturnType} Описание возвращаемого значения
 * @throws {ErrorType} Описание возможных ошибок
 * 
 * @example
 * ```typescript
 * // Пример использования
 * ```
 * 
 * @see {@link relatedFunction} Ссылка на связанную функцию
 * @since 1.0.0 Версия добавления
 */
```

### Пример полного комментария

```typescript
/**
 * @description Создает новый автомобиль в базе данных с валидацией данных
 * 
 * @param {CarData} carData - Данные автомобиля для создания
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
export async function createCar(carData: CarData, prisma: PrismaClient): Promise<Car>
```

## Лучшие практики

### 1. Консистентность
- Используй одинаковые теги для похожих функций
- Следуй единому стилю документации
- Применяй стандартные названия для тегов

### 2. Актуальность
- Обновляй документацию при изменении функций
- Удаляй устаревшие комментарии
- Проверяй точность примеров

### 3. Интеграция с Cursor
- Используй теги для лучшего понимания контекста
- Связывай функции через @see теги
- Добавляй примеры для сложных функций
- Документируй ошибки для отладки

### 4. Читаемость
- Пиши понятные описания
- Используй правильную грамматику
- Структурируй информацию логически

## Примеры по категориям

### Функции работы с данными

```typescript
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
 */
export async function getAllCars(
  options: { page?: number; limit?: number } = {},
  prisma: PrismaClient
): Promise<{cars: Car[], total: number, page: number, totalPages: number}>
```

### Валидационные функции

```typescript
/**
 * @business Правило валидации VIN кода
 * @description VIN код должен содержать ровно 17 символов
 * @business Правило проверки года выпуска
 * @description Год выпуска не может быть в будущем
 * 
 * @description Валидирует данные автомобиля согласно бизнес-правилам
 * @param {CarData} carData - Данные автомобиля для валидации
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
 */
export function validateCarData(carData: CarData): boolean
```

### React компоненты

```typescript
/**
 * @component CarCard
 * @description Карточка для отображения информации об автомобиле
 * @param {CarCardProps} props - Свойства компонента
 * @param {Car} props.car - Данные автомобиля
 * @param {boolean} props.isEditable - Разрешить редактирование
 * @param {Function} props.onEdit - Callback для редактирования
 * @returns {JSX.Element} React компонент карточки
 * 
 * @example
 * ```typescript
 * <CarCard
 *   car={carData}
 *   isEditable={true}
 *   onEdit={(id) => handleEdit(id)}
 * />
 * ```
 */
export function CarCard({ car, isEditable, onEdit }: CarCardProps): JSX.Element
```

### API роуты

```typescript
/**
 * @api POST /api/cars
 * @description Создает новый автомобиль
 * @body {CarCreateData} carData - Данные для создания автомобиля
 * @returns {ApiResponse<Car>} Ответ с созданным автомобилем
 * @throws {400} При ошибке валидации
 * @throws {401} При отсутствии аутентификации
 * @throws {403} При недостатке прав
 * @throws {500} При внутренней ошибке сервера
 * 
 * @example
 * ```typescript
 * const response = await fetch('/api/cars', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     brand: 'Toyota',
 *     model: 'Camry',
 *     year: 2020,
 *     vin: '1HGBH41JXMN109186'
 *   })
 * });
 * 
 * const result = await response.json();
 * console.log(result.data); // Созданный автомобиль
 * ```
 */
export async function POST(request: Request): Promise<Response>
```

## Интеграция с Cursor

### Преимущества использования @tags

1. **Лучшее понимание контекста** - Cursor может лучше понять назначение и связи функций
2. **Автодополнение** - Улучшенные подсказки при написании кода
3. **Навигация** - Быстрый переход между связанными функциями
4. **Документация** - Автоматическая генерация документации
5. **Отладка** - Лучшее понимание ошибок и их причин

### Рекомендации для Cursor

1. **Используй @see теги** для связывания связанных функций
2. **Добавляй @example теги** для сложных функций
3. **Документируй @throws** для лучшей отладки
4. **Используй @since теги** для версионности
5. **Применяй @deprecated** для устаревшего кода

## Заключение

Правильное использование JSDoc тегов значительно улучшает качество документации и помогает Cursor лучше понимать контекст кода. Следуйте этим рекомендациям для создания понятной и структурированной документации.

## Полезные ссылки

- [JSDoc документация](https://jsdoc.app/)
- [TypeScript JSDoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [Примеры JSDoc](https://github.com/jsdoc/jsdoc)
