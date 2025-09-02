# Потоки данных в системе

## Общий поток данных

### Схема взаимодействия компонентов

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Клиент    │    │  Middleware │    │  API Route  │    │  Business   │
│  (Browser)  │◄──►│   (Auth)    │◄──►│  (Handler)  │◄──►│   Logic     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                              │
                                                              ▼
                                                    ┌─────────────┐
                                                    │  Database   │
                                                    │ (PostgreSQL)│
                                                    └─────────────┘
                                                              │
                                                              ▼
                                                    ┌─────────────┐
                                                    │  External   │
                                                    │    APIs     │
                                                    └─────────────┘
```

### Интеграция с внешними API
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Клиент    │    │  API Route  │    │  External   │    │  External   │
│  (Browser)  │◄──►│  (Handler)  │◄──►│   Service   │◄──►│    API      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Детальные потоки данных

### 1. Аутентификация пользователя

```
1. Пользователь вводит логин/пароль
   ↓
2. Форма отправляется на /api/auth/signin
   ↓
3. NextAuth.js обрабатывает запрос
   ↓
4. bcryptjs проверяет хеш пароля (cost factor 12+)
   ↓
5. Prisma ищет пользователя в БД
   ↓
6. JWT токен создается и отправляется клиенту
   ↓
7. Сессия сохраняется в БД через Prisma Adapter
   ↓
8. Winston логирует успешную аутентификацию
```

**Файлы:**
- `app/auth/signin/page.tsx` - форма входа
- `app/api/auth/[...nextauth]/route.ts` - обработка аутентификации
- `lib/auth.ts` - логика аутентификации
- `prisma/schema.prisma` - модель User

### 2. Создание автомобиля

```
1. Пользователь заполняет форму создания автомобиля
   ↓
2. Форма отправляется на POST /api/cars
   ↓
3. Middleware проверяет права доступа (MANAGER+)
   ↓
4. API Route получает данные
   ↓
5. Zod валидирует входные данные
   ↓
6. lib/cars.ts обрабатывает бизнес-логику
   ↓
7. Prisma создает запись в таблице cars
   ↓
8. Winston логирует операцию
   ↓
9. Ответ возвращается клиенту с данными автомобиля
```

**Файлы:**
- `app/cars/new/page.tsx` - форма создания
- `app/api/cars/route.ts` - API обработчик
- `lib/cars.ts` - бизнес-логика
- `lib/validation.ts` - схемы валидации

### 3. Загрузка изображений

```
1. Пользователь выбирает файлы для загрузки
   ↓
2. DragDropUpload компонент обрабатывает файлы
   ↓
3. POST /api/upload отправляет файлы
   ↓
4. lib/cloudinary.ts загружает файлы в Cloudinary
   ↓
5. Sharp оптимизирует изображения
   ↓
6. URL изображений сохраняется в БД
   ↓
7. Winston логирует операцию загрузки
   ↓
8. Ответ с URL возвращается клиенту
```

**Файлы:**
- `components/ui/DragDropUpload.tsx` - компонент загрузки
- `app/api/upload/route.ts` - API загрузки
- `lib/cloudinary.ts` - интеграция с Cloudinary
- `lib/logger.ts` - логирование процесса

### 4. Поиск запчастей

```
1. Пользователь вводит критерии поиска
   ↓
2. Форма отправляется на GET /api/parts?search=...
   ↓
3. Middleware проверяет аутентификацию
   ↓
4. API Route извлекает параметры запроса
   ↓
5. lib/parts.ts выполняет поиск через Prisma
   ↓
6. Prisma выполняет SQL запрос с фильтрами
   ↓
7. Результаты пагинируются
   ↓
8. Winston логирует поисковый запрос
   ↓
9. JSON ответ возвращается клиенту
```

**Файлы:**
- `app/parts/page.tsx` - страница поиска
- `app/api/parts/route.ts` - API поиска
- `lib/parts.ts` - логика поиска
- `components/ui/PartCard.tsx` - отображение результатов

### 5. Создание продажи

```
1. Пользователь выбирает запчасть и клиента
   ↓
2. Форма отправляется на POST /api/sales
   ↓
3. Middleware проверяет права (MANAGER+)
   ↓
4. Zod валидирует данные продажи
   ↓
5. lib/sales.ts обрабатывает бизнес-логику:
   - Проверяет доступность запчасти
   - Обновляет статус запчасти на "sold"
   - Создает запись продажи
   ↓
6. Prisma выполняет транзакцию
   ↓
7. Winston логирует операцию
   ↓
8. Ответ возвращается клиенту
```

**Файлы:**
- `app/sales/page.tsx` - форма продажи
- `app/api/sales/route.ts` - API продаж
- `lib/sales.ts` - бизнес-логика продаж
- `lib/logger.ts` - логирование

### 6. Интеграция с внешними API

```
1. Внутренний запрос к внешнему API
   ↓
2. lib/[service].ts обрабатывает запрос
   ↓
3. Валидация параметров запроса
   ↓
4. Отправка запроса к внешнему API
   ↓
5. Обработка ответа/ошибки
   ↓
6. Валидация ответа через Zod
   ↓
7. Winston логирует API вызов
   ↓
8. Возврат результата клиенту
```

**Файлы:**
- `lib/cloudinary.ts` - интеграция с Cloudinary
- `lib/supabase.ts` - интеграция с Supabase
- `lib/external-api.ts` - общие утилиты для внешних API

## Потоки данных по модулям

### Модуль автомобилей (Cars)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Cars UI   │◄──►│  Cars API   │◄──►│  Cars Logic │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                              ▼
                                    ┌─────────────┐
                                    │   Cars DB   │
                                    └─────────────┘
```

**Данные:**
- Информация об автомобиле (марка, модель, год, VIN)
- Изображения автомобиля
- Связанные запчасти

### Модуль запчастей (Parts)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Parts UI   │◄──►│  Parts API  │◄──►│ Parts Logic │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                              ▼
                                    ┌─────────────┐
                                    │  Parts DB   │
                                    └─────────────┘
```

**Данные:**
- Информация о запчасти (название, категория, состояние)
- Цена и статус
- Связь с автомобилем
- Изображения запчасти

### Модуль клиентов (Customers)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Customers UI│◄──►│Customers API│◄──►│Customers L. │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                              ▼
                                    ┌─────────────┐
                                    │Customers DB │
                                    └─────────────┘
```

**Данные:**
- Контактная информация клиента
- История покупок
- Предпочтения

### Модуль продаж (Sales)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Sales UI   │◄──►│  Sales API  │◄──►│ Sales Logic │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                              ▼
                                    ┌─────────────┐
                                    │  Sales DB   │
                                    └─────────────┘
```

**Данные:**
- Информация о продаже (дата, цена, комиссия)
- Связи с запчастями и клиентами
- Статус оплаты

### Модуль внешних API (External APIs)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ External UI │◄──►│ External API│◄──►│External L.  │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                              ▼
                                    ┌─────────────┐
                                    │  External   │
                                    │    APIs     │
                                    └─────────────┘
```

**Данные:**
- API ключи и конфигурация
- Ответы от внешних сервисов
- Логи интеграций

## Кэширование данных

### Уровни кэширования

#### 1. Браузерный кэш
- Статические ресурсы (CSS, JS, изображения)
- API ответы с соответствующими заголовками

#### 2. Серверный кэш
- Часто запрашиваемые данные
- Результаты сложных запросов

#### 3. Кэш базы данных
- Индексы для ускорения поиска
- Query cache в Prisma

### Стратегии кэширования

```typescript
// Кэширование статистики
export async function getStats() {
  const cacheKey = 'stats';
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const stats = await calculateStats();
  await redis.setex(cacheKey, 300, JSON.stringify(stats)); // 5 минут
  
  return stats;
}

// Кэширование внешних API
export async function getExternalData() {
  const cacheKey = 'external-data';
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const data = await fetchExternalApi();
  await redis.setex(cacheKey, 600, JSON.stringify(data)); // 10 минут
  
  return data;
}
```

## Обработка ошибок

### Иерархия обработки ошибок

```
1. Валидация данных (Zod)
   ↓
2. Бизнес-логика (try/catch)
   ↓
3. API Route (error handler)
   ↓
4. Middleware (global error handler)
   ↓
5. Клиент (error boundary)
```

### Логирование ошибок

```typescript
// lib/logger.ts
export function logError(error: Error, context: string) {
  logger.error('Ошибка в системе', {
    error: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    userId: getCurrentUserId(),
  });
}

// Логирование ошибок внешних API
export function logExternalApiError(
  apiName: string, 
  operation: string, 
  error: Error
) {
  logger.error('Ошибка внешнего API', {
    apiName,
    operation,
    error: error.message,
    timestamp: new Date().toISOString(),
  });
}
```

### Обработка ошибок внешних API

```typescript
// lib/external-api.ts
export async function handleExternalApiCall<T>(
  apiCall: () => Promise<T>,
  apiName: string,
  operation: string
): Promise<T> {
  try {
    const startTime = Date.now();
    const result = await apiCall();
    const duration = Date.now() - startTime;
    
    // Логирование успешного вызова
    logExternalApiCall(apiName, operation, duration, true);
    
    return result;
  } catch (error) {
    // Логирование ошибки
    logExternalApiError(apiName, operation, error as Error);
    
    // Возврат fallback данных или повторный вызов
    throw new ExternalApiError(
      `Ошибка ${apiName} при выполнении ${operation}`,
      (error as any).code
    );
  }
}
```

## Синхронизация данных

### Реактивные обновления

#### 1. Оптимистичные обновления
```typescript
// Обновление UI до подтверждения сервера
const updatePart = async (id: string, data: PartData) => {
  // Оптимистичное обновление
  setParts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  
  try {
    await api.updatePart(id, data);
  } catch (error) {
    // Откат при ошибке
    setParts(prev => prev.map(p => p.id === id ? originalPart : p));
  }
};
```

#### 2. Реальное время
- WebSocket для уведомлений
- Polling для обновления данных
- Server-Sent Events для push уведомлений

### Синхронизация с внешними API

```typescript
// lib/sync.ts
export class DataSyncService {
  async syncWithExternalApi(apiName: string) {
    try {
      const lastSync = await this.getLastSyncTime(apiName);
      const changes = await this.fetchChanges(apiName, lastSync);
      
      await this.applyChanges(changes);
      await this.updateLastSyncTime(apiName);
      
      logger.info(`Синхронизация с ${apiName} завершена`, {
        changesCount: changes.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Ошибка синхронизации с ${apiName}`, {
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
}
```

## Безопасность данных

### Шифрование
- Пароли хешируются с bcrypt (cost factor 12+)
- JWT токены подписываются
- HTTPS для всех соединений

### Валидация
- Входные данные валидируются с Zod
- SQL инъекции предотвращаются Prisma
- XSS атаки блокируются санитизацией

### Авторизация
- RBAC на уровне middleware
- Проверка прав на каждую операцию
- Аудит действий пользователей

### Безопасность внешних API

```typescript
// lib/security.ts
export class ExternalApiSecurity {
  validateApiKey(apiKey: string): boolean {
    // Валидация API ключей
    return apiKey.length >= 32 && /^[A-Za-z0-9]+$/.test(apiKey);
  }
  
  sanitizeExternalData(data: any): any {
    // Санитизация данных от внешних API
    return JSON.parse(JSON.stringify(data, (key, value) => {
      if (typeof value === 'string') {
        return DOMPurify.sanitize(value);
      }
      return value;
    }));
  }
  
  rateLimit(apiName: string, userId: string): boolean {
    // Rate limiting для внешних API
    const key = `rate_limit:${apiName}:${userId}`;
    const current = redis.incr(key);
    
    if (current === 1) {
      redis.expire(key, 60); // 1 минута
    }
    
    return current <= 100; // Максимум 100 запросов в минуту
  }
}
```

## Мониторинг потоков данных

### Метрики
- Время ответа API
- Количество запросов
- Ошибки и их типы
- Использование ресурсов

### Алерты
- Высокое время ответа
- Много ошибок
- Необычная активность
- Проблемы с БД
- Проблемы с внешними API

### Логирование
- Все API запросы
- Ошибки и исключения
- Действия пользователей
- Производительность
- Интеграции с внешними API

### Мониторинг внешних API

```typescript
// lib/monitoring.ts
export class ExternalApiMonitor {
  private metrics = new Map<string, {
    responseTimes: number[];
    errorCount: number;
    totalCalls: number;
  }>();
  
  trackResponseTime(apiName: string, duration: number) {
    const api = this.metrics.get(apiName) || {
      responseTimes: [],
      errorCount: 0,
      totalCalls: 0
    };
    
    api.responseTimes.push(duration);
    api.totalCalls++;
    
    // Оставляем только последние 100 измерений
    if (api.responseTimes.length > 100) {
      api.responseTimes = api.responseTimes.slice(-100);
    }
    
    this.metrics.set(apiName, api);
    
    // Алерт при медленном ответе
    if (duration > 5000) { // 5 секунд
      this.sendAlert(`Медленный ответ от ${apiName}: ${duration}ms`);
    }
  }
  
  trackError(apiName: string) {
    const api = this.metrics.get(apiName);
    if (api) {
      api.errorCount++;
      
      // Алерт при высокой частоте ошибок
      const errorRate = api.errorCount / api.totalCalls;
      if (errorRate > 0.1) { // 10% ошибок
        this.sendAlert(`Высокая частота ошибок от ${apiName}: ${(errorRate * 100).toFixed(1)}%`);
      }
    }
  }
  
  private sendAlert(message: string) {
    logger.warn('Алерт мониторинга', { message, timestamp: new Date().toISOString() });
    // Отправка уведомления команде
  }
}
```

## Документирование кода

### JSDoc комментарии с @tags
Система использует структурированное документирование для лучшего понимания контекста Cursor:

#### Основные принципы
- **Всегда документируй функции** с помощью JSDoc комментариев
- **Используй @tags** для структурирования документации
- **Пиши комментарии на русском языке** для лучшего понимания
- **Связывай функции с контекстом** через теги

#### Обязательные теги
```typescript
/**
 * @description Создает новый автомобиль в базе данных с валидацией данных
 * @param {CarData} carData - Данные автомобиля для создания
 * @param {PrismaClient} prisma - Экземпляр Prisma клиента
 * @returns {Promise<Car>} Созданный автомобиль
 * @throws {ValidationError} При ошибке валидации данных
 * @throws {DatabaseError} При ошибке базы данных
 */
export async function createCar(carData: CarData, prisma: PrismaClient): Promise<Car>
```

#### Дополнительные теги
- **@example** - Примеры использования
- **@since** - Версия добавления функции
- **@deprecated** - Устаревшие функции
- **@see** - Ссылки на связанные функции
- **@component** - React компоненты
- **@hook** - React хуки
- **@api** - API эндпоинты
- **@interface** - TypeScript интерфейсы
- **@type** - TypeScript типы
- **@business** - Бизнес-правила
- **@security** - Безопасность
- **@external** - Интеграция с внешними API

### Связывание контекста
- **@see** теги для связывания связанных функций
- **@example** теги для примеров использования
- **@since** теги для версионности
- **@deprecated** теги для устаревшего кода

### Документирование потоков данных

```typescript
/**
 * @description Обрабатывает поток данных от внешнего API
 * @flow
 * 1. Получение данных от внешнего API
 * 2. Валидация входящих данных
 * 3. Трансформация в внутренний формат
 * 4. Сохранение в базу данных
 * 5. Логирование операции
 * @param {string} apiName - Название внешнего API
 * @param {string} endpoint - Эндпоинт для вызова
 * @returns {Promise<ProcessedData>} Обработанные данные
 * @throws {ExternalApiError} При ошибке внешнего API
 * @throws {ValidationError} При ошибке валидации
 */
export async function processExternalApiData(
  apiName: string, 
  endpoint: string
): Promise<ProcessedData>
```

---

**Последнее обновление**: Сентябрь 2024
**Версия документа**: 2.0.0
**Соответствует правилам**: .cursor/rules/main.mdc v2.0.0
