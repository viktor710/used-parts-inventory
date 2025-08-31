# 🗄️ Настройка базы данных

## Быстрая настройка

### 1. Создайте проект Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Запомните URL и ключи из настроек

### 2. Настройте переменные окружения

Скопируйте `env.example` в `.env.local` и заполните:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### 3. Инициализируйте базу данных

```bash
# Установите зависимости
npm install

# Сгенерируйте Prisma клиент
npm run db:generate

# Примените схему к базе данных
npm run db:push

# Настройте RLS в Supabase Dashboard (выполните scripts/setup-rls.sql)

# Заполните начальными данными
npm run db:seed
```

### 4. Проверьте работу

```bash
# Запустите сервер разработки
npm run dev

# Откройте Prisma Studio для просмотра данных
npm run db:studio
```

## Основные команды

```bash
# Работа с базой данных
npm run db:generate    # Генерировать Prisma клиент
npm run db:push        # Применить схему
npm run db:migrate     # Создать миграцию
npm run db:studio      # Открыть Prisma Studio
npm run db:seed        # Заполнить данными

# Резервное копирование
npm run db:backup      # Создать бэкап
npm run db:backup:list # Список бэкапов
npm run db:restore     # Восстановить из бэкапа
```

## Структура проекта

```
├── prisma/
│   └── schema.prisma          # Схема базы данных
├── lib/
│   ├── prisma.ts              # Prisma клиент
│   ├── supabase.ts            # Supabase клиент
│   └── database-service.ts    # Сервис для работы с БД
├── scripts/
│   ├── init-database.ts       # Инициализация данных
│   ├── setup-rls.sql          # Настройка RLS
│   └── backup-restore.js      # Резервное копирование
└── app/api/                   # API роуты
```

## Безопасность

- ✅ Row Level Security (RLS) включен
- ✅ Все таблицы защищены политиками
- ✅ Валидация данных на сервере
- ✅ Резервное копирование настроено

## Поддержка

Подробная документация: [DATABASE_INTEGRATION_GUIDE.md](./DATABASE_INTEGRATION_GUIDE.md)
