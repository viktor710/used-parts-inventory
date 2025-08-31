# Исправление проблем с Prisma на Vercel

## Проблема
При деплое на Vercel возникает ошибка:
```
PrismaClientInitializationError: Prisma has detected that this project was built on Vercel, which caches dependencies. This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered.
```

## Решение

### 1. Обновленные файлы конфигурации

#### package.json
- Добавлен скрипт `postinstall: "prisma generate"`
- Обновлен скрипт сборки для правильной генерации Prisma Client

#### vercel.json
- Добавлены `buildCommand` и `installCommand`
- Настроены переменные окружения для Prisma

#### next.config.js
- Добавлен `output: 'standalone'`
- Настроен webpack для правильной работы с Prisma

#### prisma/schema.prisma
- Указан правильный путь для output Prisma Client

### 2. Новые скрипты

#### scripts/fix-prisma-vercel.js
Скрипт для исправления проблем с Prisma на Vercel:
- Удаляет старый Prisma Client
- Генерирует новый с правильными настройками
- Проверяет корректность генерации

### 3. Переменные окружения

Убедитесь, что в Vercel установлены следующие переменные:
- `DATABASE_URL` - URL подключения к базе данных
- `DIRECT_URL` - прямой URL для миграций
- `NODE_ENV=production`

### 4. Процесс деплоя

1. Закоммитьте все изменения
2. Запушьте в репозиторий
3. Vercel автоматически запустит сборку с новыми настройками

### 5. Проверка

После деплоя проверьте:
- Логи сборки на отсутствие ошибок Prisma
- Работу API endpoints
- Подключение к базе данных

## Дополнительные рекомендации

1. Используйте `prisma db push` для синхронизации схемы
2. Регулярно обновляйте Prisma до последней версии
3. Мониторьте логи на предмет ошибок подключения к БД
