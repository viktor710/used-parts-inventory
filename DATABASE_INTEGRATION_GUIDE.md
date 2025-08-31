# 🗄️ Руководство по интеграции с базой данных

## Обзор

Данный проект использует **Prisma ORM** для работы с **PostgreSQL** через **Supabase** как Backend-as-a-Service (BaaS) платформу.

## 🏗️ Архитектура

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   Prisma ORM    │    │   Supabase      │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Компоненты:

1. **Prisma ORM** - основной ORM для строгой типизации и миграций
2. **Supabase** - хостинг PostgreSQL + дополнительные сервисы
3. **Row Level Security (RLS)** - безопасность на уровне строк
4. **Резервное копирование** - автоматические бэкапы

## 🚀 Быстрый старт

### 1. Настройка Supabase

1. Создайте проект на [supabase.com](https://supabase.com)
2. Получите URL и ключи из настроек проекта
3. Скопируйте `env.example` в `.env.local` и заполните переменные:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration (Prisma)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### 2. Инициализация базы данных

```bash
# Генерируем Prisma клиент
npm run db:generate

# Применяем схему к базе данных
npm run db:push

# Создаем миграцию (если нужно)
npm run db:migrate

# Заполняем начальными данными
npm run db:seed
```

### 3. Настройка RLS в Supabase

1. Откройте SQL Editor в Supabase Dashboard
2. Выполните скрипт `scripts/setup-rls.sql`
3. Проверьте, что RLS включен для всех таблиц

## 📊 Структура базы данных

### Основные таблицы:

- **`cars`** - автомобили (источник запчастей)
- **`parts`** - запчасти
- **`suppliers`** - поставщики
- **`customers`** - клиенты
- **`sales`** - продажи

### Связи:

```sql
parts.car_id → cars.id (Many-to-One)
sales.part_id → parts.id (Many-to-One)
sales.customer_id → customers.id (Many-to-One)
```

## 🔧 Использование в коде

### Серверные API роуты (Prisma)

```typescript
import { dbService } from '@/lib/database-service'

// Получение запчастей
export async function GET(request: Request) {
  const parts = await dbService.getParts(1, 20)
  return Response.json(parts)
}

// Создание запчасти
export async function POST(request: Request) {
  const data = await request.json()
  const part = await dbService.createPart(data)
  return Response.json(part)
}
```

### Клиентские запросы (Supabase)

```typescript
import { supabase } from '@/lib/supabase'

// Простые запросы с клиента
const { data, error } = await supabase
  .from('parts')
  .select('*')
  .eq('status', 'available')
  .limit(10)
```

## 🔒 Безопасность

### Row Level Security (RLS)

RLS включен для всех таблиц. Политики:

- **Чтение**: Только аутентифицированные пользователи
- **Запись**: Только аутентифицированные пользователи
- **Обновление**: Только аутентифицированные пользователи
- **Удаление**: Только аутентифицированные пользователи

### Рекомендации по безопасности:

1. **Всегда используйте RLS** - без него данные доступны всем
2. **Серверная валидация** - проверяйте данные на сервере
3. **Ограниченные права** - используйте минимальные необходимые права
4. **Аудит** - логируйте важные операции

## 📈 Производительность

### Индексы

Созданы индексы для часто используемых полей:

```sql
-- Запчасти
CREATE INDEX idx_parts_category ON parts(category);
CREATE INDEX idx_parts_status ON parts(status);
CREATE INDEX idx_parts_car_id ON parts(car_id);

-- Автомобили
CREATE INDEX idx_cars_brand ON cars(brand);
CREATE INDEX idx_cars_model ON cars(model);
CREATE INDEX idx_cars_vin ON cars(vin);
```

### Оптимизация запросов:

1. **Используйте `include`** для связанных данных
2. **Пагинация** для больших списков
3. **Фильтрация** на уровне базы данных
4. **Кэширование** для часто запрашиваемых данных

## 💾 Резервное копирование

### Автоматические бэкапы

```bash
# Создать резервную копию
npm run db:backup

# Список резервных копий
npm run db:backup:list

# Восстановить из бэкапа
npm run db:restore ./backups/backup-2024-01-15.sql

# Очистить старые бэкапы
npm run db:backup:cleanup 5
```

### Ручные операции:

```bash
# Создать бэкап с именем
node scripts/backup-restore.js backup my-backup.sql

# Проверить целостность
node scripts/backup-restore.js validate ./backups/backup.sql
```

## 🔄 Миграции

### Создание миграции

```bash
# Создать новую миграцию
npm run db:migrate

# Применить миграции в продакшене
npx prisma migrate deploy
```

### Откат миграции

```bash
# Откатить последнюю миграцию
npx prisma migrate reset
```

## 🛠️ Инструменты разработки

### Prisma Studio

```bash
# Открыть веб-интерфейс для просмотра данных
npm run db:studio
```

### Отладка

```bash
# Проверить подключение к БД
npx prisma db pull

# Сгенерировать типы
npm run db:generate
```

## 📋 Чек-лист развертывания

### Локальная разработка:

- [ ] Установлены зависимости (`npm install`)
- [ ] Настроены переменные окружения (`.env.local`)
- [ ] Создан проект Supabase
- [ ] Применена схема базы данных (`npm run db:push`)
- [ ] Настроен RLS (`scripts/setup-rls.sql`)
- [ ] Заполнены начальные данные (`npm run db:seed`)

### Продакшен:

- [ ] Настроены переменные окружения на сервере
- [ ] Применены миграции (`npx prisma migrate deploy`)
- [ ] Настроен RLS в продакшен базе
- [ ] Настроено автоматическое резервное копирование
- [ ] Проверена безопасность

## 🚨 Устранение неполадок

### Частые проблемы:

1. **Ошибка подключения к БД**
   - Проверьте `DATABASE_URL` в переменных окружения
   - Убедитесь, что Supabase проект активен

2. **Ошибки RLS**
   - Проверьте, что RLS включен для таблиц
   - Убедитесь, что пользователь аутентифицирован

3. **Ошибки миграции**
   - Проверьте схему Prisma на синтаксические ошибки
   - Убедитесь, что база данных доступна

4. **Медленные запросы**
   - Проверьте наличие индексов
   - Оптимизируйте запросы с помощью `EXPLAIN`

### Логи и отладка:

```bash
# Включить логи Prisma
export DEBUG="prisma:*"

# Проверить состояние базы данных
npx prisma db seed --preview-feature
```

## 📚 Дополнительные ресурсы

- [Документация Prisma](https://www.prisma.io/docs)
- [Документация Supabase](https://supabase.com/docs)
- [PostgreSQL документация](https://www.postgresql.org/docs)
- [Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

## 🤝 Поддержка

При возникновении проблем:

1. Проверьте логи в консоли
2. Убедитесь, что все зависимости установлены
3. Проверьте настройки переменных окружения
4. Обратитесь к документации выше
5. Создайте issue в репозитории проекта
