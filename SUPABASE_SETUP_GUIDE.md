# 🚀 Настройка Supabase - Краткое руководство

## ✅ Что уже сделано

- ✅ Подключение к базе данных настроено
- ✅ Схема базы данных создана
- ✅ Тестовые данные загружены
- ✅ Prisma клиент сгенерирован

## 🔧 Следующие шаги

### 1. Настройка Row Level Security (RLS)

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект `fkffeemwflechywrmnlv`
3. Перейдите в **SQL Editor**
4. Выполните скрипт из файла `scripts/setup-rls.sql`

### 2. Получение ключей Supabase

1. В Supabase Dashboard перейдите в **Settings** → **API**
2. Скопируйте:
   - **Project URL**: `https://fkffeemwflechywrmnlv.supabase.co`
   - **anon public key**: (длинный ключ)
   - **service_role secret key**: (длинный ключ)

### 3. Обновление переменных окружения

Добавьте в файл `.env`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://fkffeemwflechywrmnlv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_ключ
SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_ключ

# Database Configuration (Prisma)
DATABASE_URL=postgresql://postgres.fkffeemwflechywrmnlv:r5iymaFUTV0%23CHoc@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres.fkffeemwflechywrmnlv:r5iymaFUTV0%23CHoc@aws-1-eu-central-1.pooler.supabase.com:5432/postgres

# Environment
NODE_ENV=development
```

### 4. Проверка работы

```bash
# Запуск сервера разработки
npm run dev

# Открытие Prisma Studio
npm run db:studio
```

## 📊 Текущее состояние базы данных

- **Автомобили**: 4 записи
- **Запчасти**: 5 записей
- **Поставщики**: 3 записи
- **Клиенты**: 2 записи
- **Продажи**: 1 запись

## 🔒 Безопасность

После настройки RLS:
- Все таблицы будут защищены
- Доступ только для аутентифицированных пользователей
- Созданы индексы для производительности
- Добавлены SQL функции для поиска и статистики

## 🎯 Результат

После выполнения всех шагов у вас будет:
- ✅ Полностью настроенная база данных PostgreSQL
- ✅ Безопасность через Row Level Security
- ✅ Работающий API для запчастей и автомобилей
- ✅ Готовое приложение для управления инвентарем

## 📚 Дополнительная документация

- [DATABASE_INTEGRATION_GUIDE.md](./DATABASE_INTEGRATION_GUIDE.md) - Подробное руководство
- [README_DATABASE.md](./README_DATABASE.md) - Краткая справка
- [DATABASE_INTEGRATION_SUMMARY.md](./DATABASE_INTEGRATION_SUMMARY.md) - Резюме интеграции
