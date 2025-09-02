# Контекст разработки

## Принципы архитектуры

### 1. Разделение ответственности (Separation of Concerns)
- **Презентационный слой**: Только отображение данных и обработка пользовательского ввода
- **Бизнес-логика**: В папке `lib/` - вся логика приложения
- **Данные**: Prisma схемы и миграции в `prisma/`
- **API**: Next.js API роуты в `app/api/`

### 2. Принцип единственной ответственности (Single Responsibility)
Каждый модуль отвечает за одну конкретную область:
- `lib/auth.ts` - только аутентификация и авторизация
- `lib/cars.ts` - только работа с автомобилями
- `lib/parts.ts` - только работа с запчастями

### 3. Dependency Injection
Зависимости инжектируются через параметры функций:
```typescript
// Хорошо
export async function createCar(data: CarData, prisma: PrismaClient) {
  return await prisma.car.create({ data });
}

// Плохо
export async function createCar(data: CarData) {
  return await prisma.car.create({ data }); // Прямая зависимость
}
```

### 4. Интеграция с внешними API
- **Всегда изучай документацию** через Context7 инструменты
- **Проверяй совместимость** с текущим стеком
- **Документируй интеграции** в соответствующих файлах
- **Тестируй интеграции** локально и в staging

## Паттерны проектирования

### 1. Repository Pattern
Используется для абстракции доступа к данным:
```typescript
// lib/cars.ts
export class CarRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findAll() {
    return await this.prisma.car.findMany();
  }
  
  async findById(id: string) {
    return await this.prisma.car.findUnique({ where: { id } });
  }
}
```

### 2. Service Layer Pattern
Бизнес-логика инкапсулирована в сервисах:
```typescript
// lib/parts.ts
export class PartService {
  constructor(private prisma: PrismaClient) {}
  
  async createPart(data: CreatePartData) {
    // Валидация
    // Бизнес-правила
    // Создание записи
  }
}
```

### 3. Factory Pattern
Для создания сложных объектов:
```typescript
// lib/validation.ts
export const createCarSchema = z.object({
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  // ...
});
```

### 4. Adapter Pattern
Для интеграции с внешними API:
```typescript
// lib/cloudinary.ts
export class CloudinaryAdapter {
  constructor(private config: CloudinaryConfig) {}
  
  async uploadImage(file: File): Promise<string> {
    // Адаптация внешнего API к внутреннему интерфейсу
  }
}
```

## Конвенции именования

### Файлы и папки
- **Компоненты**: PascalCase (`CarCard.tsx`, `PartList.tsx`)
- **Утилиты**: camelCase (`format.ts`, `validation.ts`)
- **API роуты**: kebab-case (`[id]/route.ts`)
- **Типы**: PascalCase (`CarData`, `PartStatus`)

### Переменные и функции
- **Константы**: UPPER_SNAKE_CASE (`DATABASE_URL`, `MAX_FILE_SIZE`)
- **Переменные**: camelCase (`carData`, `partList`)
- **Функции**: camelCase (`createCar`, `getPartsByCategory`)
- **Классы**: PascalCase (`CarRepository`, `PartService`)

### База данных
- **Таблицы**: snake_case (`cars`, `parts`, `sales`)
- **Колонки**: snake_case (`created_at`, `updated_at`)
- **Индексы**: `idx_` + snake_case (`idx_cars_brand_model`)

## Структура API

### RESTful принципы
- **GET** `/api/cars` - получение списка автомобилей
- **POST** `/api/cars` - создание автомобиля
- **GET** `/api/cars/[id]` - получение конкретного автомобиля
- **PUT** `/api/cars/[id]` - обновление автомобиля
- **DELETE** `/api/cars/[id]` - удаление автомобиля

### Стандартные ответы
```typescript
// Успешный ответ
{
  success: true,
  data: CarData,
  message?: string
}

// Ошибка
{
  success: false,
  error: string,
  details?: any
}
```

### Интеграция с внешними API
```typescript
// lib/external-api.ts
export class ExternalApiService {
  constructor(private apiKey: string, private baseUrl: string) {}
  
  async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Стандартизированная обработка внешних API
  }
}
```

## Обработка ошибок

### Иерархия ошибок
```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} не найден`, 404, 'NOT_FOUND');
  }
}

export class ExternalApiError extends AppError {
  constructor(message: string, public externalCode?: string) {
    super(message, 502, 'EXTERNAL_API_ERROR');
  }
}
```

### Middleware для обработки ошибок
```typescript
// middleware.ts
export async function errorHandler(error: Error, req: NextRequest) {
  if (error instanceof AppError) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code
    }, { status: error.statusCode });
  }
  
  // Логирование неизвестных ошибок
  logger.error('Неизвестная ошибка:', error);
  
  return NextResponse.json({
    success: false,
    error: 'Внутренняя ошибка сервера'
  }, { status: 500 });
}
```

## Валидация данных

### Zod схемы
```typescript
// lib/validation.ts
export const carSchema = z.object({
  brand: z.string().min(1, 'Марка обязательна'),
  model: z.string().min(1, 'Модель обязательна'),
  year: z.number()
    .min(1900, 'Год должен быть не менее 1900')
    .max(new Date().getFullYear() + 1, 'Год не может быть в будущем'),
  vin: z.string().regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'Неверный формат VIN'),
});

export type CarData = z.infer<typeof carSchema>;
```

### Валидация в API
```typescript
// app/api/cars/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = carSchema.parse(body);
    
    const car = await createCar(validatedData);
    return NextResponse.json({ success: true, data: car });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Ошибка валидации',
        details: error.errors
      }, { status: 400 });
    }
    throw error;
  }
}
```

### Валидация внешних API
```typescript
// lib/validation.ts
export const externalApiResponseSchema = z.object({
  status: z.enum(['success', 'error']),
  data: z.any(),
  message: z.string().optional(),
});

export function validateExternalApiResponse(response: any) {
  return externalApiResponseSchema.parse(response);
}
```

## Логирование

### Уровни логирования
- **ERROR**: Критические ошибки, требующие немедленного внимания
- **WARN**: Предупреждения, которые могут привести к проблемам
- **INFO**: Общая информация о работе приложения
- **DEBUG**: Детальная информация для отладки

### Структурированное логирование
```typescript
// lib/logger.ts
logger.info('Создан новый автомобиль', {
  carId: car.id,
  brand: car.brand,
  model: car.model,
  userId: user.id,
  timestamp: new Date().toISOString()
});

logger.info('Интеграция с внешним API', {
  apiName: 'Cloudinary',
  operation: 'upload',
  fileSize: file.size,
  duration: Date.now() - startTime,
  success: true
});
```

### Логирование внешних API
```typescript
// lib/external-api.ts
export async function logExternalApiCall(
  apiName: string,
  operation: string,
  duration: number,
  success: boolean,
  error?: Error
) {
  logger.info('Внешний API вызов', {
    apiName,
    operation,
    duration,
    success,
    error: error?.message,
    timestamp: new Date().toISOString()
  });
}
```

## Безопасность

### Аутентификация
- JWT токены с коротким временем жизни
- Refresh токены для продления сессий
- Хеширование паролей с bcrypt (cost factor 12+)

### Авторизация
- Ролевая модель (RBAC)
- Проверка прав на уровне middleware
- Принцип наименьших привилегий

### Защита данных
- Валидация всех входных данных
- Санитизация HTML контента
- Защита от SQL-инъекций через Prisma
- CORS настройки

### Дополнительная защита
- Rate limiting для API
- Защита от XSS и CSRF атак
- Аудит действий пользователей
- Мониторинг подозрительной активности

### Безопасность внешних API
```typescript
// lib/security.ts
export class ApiSecurityManager {
  validateApiKey(apiKey: string): boolean {
    // Валидация API ключей внешних сервисов
  }
  
  sanitizeExternalData(data: any): any {
    // Санитизация данных от внешних API
  }
}
```

## Производительность

### Оптимизации базы данных
- Индексы на часто используемых полях
- Пагинация для больших списков
- Оптимизация запросов через Prisma

### Кэширование
- Кэширование статических данных
- Кэширование результатов API
- Оптимизация изображений

### Мониторинг
- Логирование времени выполнения запросов
- Метрики производительности
- Алерты при превышении порогов

### Целевые показатели
- Время ответа API: < 200ms
- Время загрузки страниц: < 2s
- Lighthouse score: > 90
- Покрытие тестами: > 80%

### Мониторинг внешних API
```typescript
// lib/monitoring.ts
export class ExternalApiMonitor {
  trackResponseTime(apiName: string, duration: number) {
    // Отслеживание времени ответа внешних API
  }
  
  trackErrorRate(apiName: string, success: boolean) {
    // Отслеживание частоты ошибок
  }
}
```

## Тестирование

### Типы тестов
- **Unit тесты**: Тестирование отдельных функций
- **Integration тесты**: Тестирование взаимодействия модулей
- **E2E тесты**: Тестирование полного пользовательского сценария
- **Performance тесты**: Тестирование производительности

### Структура тестов
```
__tests__/
├── unit/
│   ├── lib/
│   └── utils/
├── integration/
│   ├── api/
│   └── database/
└── e2e/
    ├── auth/
    └── crud/
```

### Тестирование внешних API
```typescript
// __tests__/integration/external-api.test.ts
describe('External API Integration', () => {
  it('should handle successful API response', async () => {
    // Тестирование успешных ответов
  });
  
  it('should handle API errors gracefully', async () => {
    // Тестирование обработки ошибок
  });
  
  it('should respect rate limits', async () => {
    // Тестирование ограничений
  });
});
```

## Развертывание

### Окружения
- **Development**: Локальная разработка
- **Staging**: Тестовое окружение
- **Production**: Продакшн окружение

### CI/CD Pipeline
1. **Build**: Сборка приложения
2. **Test**: Запуск тестов
3. **Lint**: Проверка кода
4. **Deploy**: Развертывание

### Мониторинг продакшена
- Логирование ошибок
- Метрики производительности
- Алерты при проблемах
- Резервное копирование данных

### Переменные окружения для внешних API
```env
# Cloudinary
CLOUDINARY_URL=cloudinary://...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Supabase
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Другие внешние сервисы
EXTERNAL_API_KEY=...
EXTERNAL_API_URL=...
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

### Документирование внешних API
```typescript
/**
 * @external Cloudinary API
 * @description Интеграция с Cloudinary для управления изображениями
 * @see {@link https://cloudinary.com/documentation} Официальная документация
 * @example
 * ```typescript
 * const imageUrl = await uploadToCloudinary(file);
 * ```
 */
export async function uploadToCloudinary(file: File): Promise<string>
```

## Документация

### Код документация
- JSDoc комментарии с @tags для функций
- README файлы для модулей
- Примеры использования

### API документация
- OpenAPI/Swagger спецификация
- Примеры запросов и ответов
- Описание ошибок

### Архитектурная документация
- Диаграммы компонентов
- Схемы базы данных
- Потоки данных

### Документация интеграций
- Описание внешних API
- Примеры использования
- Troubleshooting
- Migration guides

---

**Последнее обновление**: Сентябрь 2024
**Версия документа**: 2.0.0
**Соответствует правилам**: .cursor/rules/main.mdc v2.0.0
