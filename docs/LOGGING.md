# Система логирования Winston с ротацией файлов

## Обзор

В проекте используется **Winston** - мощная библиотека логирования для Node.js с автоматической ротацией файлов по дням.

## Установленные пакеты

- `winston` (^3.17.0) - основная библиотека логирования
- `winston-daily-rotate-file` (^4.7.1) - плагин для ротации файлов
- `@types/winston` (^2.4.4) - типы TypeScript

## Конфигурация

### Основной логгер (`lib/logger.ts`)

```typescript
import { Logger } from '@/lib/logger';

// Базовое логирование
Logger.info('Информационное сообщение', { meta: 'data' });
Logger.warn('Предупреждение', { warning: 'details' });
Logger.error('Ошибка', { error: 'details' });
Logger.debug('Отладочная информация', { debug: 'data' });
```

### Специализированные методы

```typescript
// API логирование
Logger.api('GET', '/api/parts', 200, 150, { userAgent: 'browser' });

// База данных
Logger.database('SELECT', 'parts', 45, { query: 'SELECT * FROM parts' });

// Валидация
Logger.validation('PartSchema', ['Field required'], { field: 'name' });

// Загрузка файлов
Logger.fileUpload('image.jpg', 1024 * 1024, 'success', { userId: '123' });

// Аутентификация
Logger.auth('login', 'user123', { ip: '127.0.0.1' });

// Производительность
Logger.performance('database_query', 250, { table: 'parts' });

// Исправления
Logger.fix('Component', 'Issue', 'Solution', { component: 'Test' });
```

## Ротация файлов

### Настройки ротации

- **Паттерн даты**: `YYYY-MM-DD`
- **Максимальный размер файла**: 20MB
- **Хранение**: 14 дней
- **Сжатие**: автоматическое в .gz архивы

### Типы файлов логов

В продакшен режиме создаются следующие файлы:

1. **`combined-YYYY-MM-DD.log`** - все логи
2. **`error-YYYY-MM-DD.log`** - только ошибки
3. **`api-YYYY-MM-DD.log`** - API запросы
4. **`database-YYYY-MM-DD.log`** - операции с БД
5. **`exceptions-YYYY-MM-DD.log`** - необработанные исключения
6. **`rejections-YYYY-MM-DD.log`** - необработанные промисы

## Режимы работы

### Разработка (development)
- Логи выводятся только в консоль
- Уровень логирования: `debug`
- Цветной вывод с эмодзи

### Продакшен (production)
- Логи записываются в файлы с ротацией
- Уровень логирования: `info`
- JSON формат для машинного чтения

## Структура логов

### JSON формат
```json
{
  "level": "info",
  "message": "API GET /api/parts",
  "timestamp": "2025-09-01 21:40:02",
  "service": "used-parts-inventory",
  "method": "GET",
  "path": "/api/parts",
  "status": 200,
  "duration": "150ms"
}
```

### Консольный формат
```
🌐 [21:40:02] INFO: API GET /api/parts {
  "method": "GET",
  "path": "/api/parts",
  "status": 200,
  "duration": "150ms"
}
```

## Эмодзи для разных типов логов

- ℹ️ **info** - общая информация
- ⚠️ **warn** - предупреждения
- ❌ **error** - ошибки
- 🔧 **debug** - отладка
- 🌐 **api** - API запросы
- 🗄️ **database** - операции с БД
- ✅ **validation** - валидация
- 📁 **fileUpload** - загрузка файлов
- 🔐 **auth** - аутентификация
- ⚡ **performance** - производительность
- 🔧 **fix** - исправления

## Тестирование

### Запуск тестов
```bash
# Тест в режиме разработки
npx tsx scripts/test-logger.ts

# Тест в продакшен режиме
npx tsx scripts/test-logger-prod.ts

# Финальный тест с ротацией
npx tsx scripts/final-logger-test.ts
```

### Проверка файлов
```bash
# Просмотр содержимого папки logs
dir logs

# Просмотр конкретного файла
type logs\combined-2025-09-01.log
```

## Мониторинг и обслуживание

### Автоматическая очистка
- Старые файлы (старше 14 дней) удаляются автоматически
- Файлы сжимаются в .gz архивы для экономии места

### Ручная очистка
```bash
# Удаление всех логов (осторожно!)
rm -rf logs/*

# Удаление только старых архивов
rm logs/*.gz
```

## Интеграция с приложением

### API роуты
```typescript
// app/api/parts/route.ts
import { Logger } from '@/lib/logger';

export async function GET(request: Request) {
  Logger.info('API /api/parts GET: Запрос получен', { 
    page, 
    limit, 
    filters 
  });
  
  // ... логика обработки
  
  Logger.api('GET', '/api/parts', 200, duration, { 
    userAgent: request.headers.get('user-agent') 
  });
}
```

### Middleware
```typescript
// middleware.ts
import { Logger } from '@/lib/logger';

export function middleware(request: NextRequest) {
  const start = Date.now();
  
  // ... обработка запроса
  
  const duration = Date.now() - start;
  Logger.performance('middleware', duration, { 
    path: request.nextUrl.pathname 
  });
}
```

## Лучшие практики

1. **Используйте специализированные методы** для разных типов событий
2. **Добавляйте контекст** в метаданные логов
3. **Не логируйте чувствительную информацию** (пароли, токены)
4. **Используйте правильные уровни логирования**
5. **Мониторьте размер файлов логов** в продакшене

## Устранение неполадок

### Проблема: Файлы логов не создаются
**Решение**: Проверьте права доступа к папке `logs/` и убедитесь, что `NODE_ENV=production`

### Проблема: Ротация не работает
**Решение**: Убедитесь, что установлен `winston-daily-rotate-file` и правильно настроен

### Проблема: Слишком много логов
**Решение**: Настройте уровень логирования и фильтры для уменьшения объема
