# 🔧 Устранение неполадок

Этот документ содержит решения для наиболее распространенных проблем в проекте.

## 🚨 Критические проблемы

### 1. Ошибки подключения к базе данных

**Симптомы:**
```
Can't reach database server at `aws-1-eu-central-1.pooler.supabase.com:5432`
```

**Причины:**
- Неправильная конфигурация переменных окружения
- Проблемы с сетью
- Блокировка IP адреса в Supabase
- Неправильные учетные данные

**Решения:**

#### Шаг 1: Проверка переменных окружения
```bash
# Запустите тест подключения к БД
npm run test:db
```

#### Шаг 2: Создание файла .env.local
Создайте файл `.env.local` в корне проекта:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://fkffeemwflechywrmnlv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrZmZlZW13ZmxlY2h5d3Jtbmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2Mzg1MzcsImV4cCI6MjA3MjIxNDUzN30.Mf5z7GfCJ1NnyvFcQbGAtUkMEsyMnFcumHHWNu-FtLo
SUPABASE_SERVICE_ROLE_KEY=r5iymaFUTV0#CHoc

# Database Configuration (Prisma) - Direct connection
DATABASE_URL="postgresql://postgres.fkffeemwflechywrmnlv:r5iymaFUTV0#CHoc@aws-1-eu-central-1.pooler.supabase.com:5432/postgres"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres.fkffeemwflechywrmnlv:r5iymaFUTV0#CHoc@aws-1-eu-central-1.pooler.supabase.com:5432/postgres"

# Environment
NODE_ENV=development

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Шаг 3: Проверка настроек Supabase
1. Войдите в [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект
3. Перейдите в Settings > Database
4. Проверьте, что ваш IP адрес разрешен в "Connection pooling"

#### Шаг 4: Перезапуск Prisma
```bash
# Очистка и перегенерация Prisma клиента
rm -rf node_modules/.prisma
npm run db:generate
```

### 2. Предупреждения при сборке

**Симптомы:**
```
⚠ The "images.domains" configuration is deprecated. Please use "images.remotePatterns" configuration instead.
```

**Решение:**
Конфигурация уже исправлена в `next.config.js`. Используется `remotePatterns` вместо устаревшего `domains`.

**Симптомы:**
```
⚠ "next start" does not work with "output: standalone" configuration. Use "node .next/standalone/server.js" instead.
```

**Решение:**
Опция `output: standalone` закомментирована в `next.config.js` для совместимости с `next start`.

### 3. Ошибки TypeScript

**Симптомы:**
```
Type error: Cannot find module '@prisma/client'
```

**Решение:**
```bash
# Переустановка зависимостей
rm -rf node_modules package-lock.json
npm install

# Генерация Prisma клиента
npm run db:generate
```

## 🔍 Диагностика

### Тестирование подключения к базе данных
```bash
npm run test:db
```

Этот скрипт проверит:
- Наличие переменных окружения
- Подключение к базе данных
- Выполнение простых запросов
- Подсчет записей в таблицах

### Проверка API endpoints
```bash
# Тест подключения к БД
curl http://localhost:3000/api/test-db

# Тест переменных окружения
curl http://localhost:3000/api/test-env

# Тест статистики
curl http://localhost:3000/api/stats
```

### Проверка логов
```bash
# Просмотр логов приложения
tail -f logs/app.log

# Просмотр логов ошибок
tail -f logs/error.log
```

## 🛠️ Общие решения

### Очистка кэша
```bash
# Очистка Next.js кэша
rm -rf .next

# Очистка node_modules
rm -rf node_modules package-lock.json
npm install

# Очистка Prisma кэша
rm -rf node_modules/.prisma
npm run db:generate
```

### Перезапуск сервисов
```bash
# Остановка всех процессов Node.js
pkill -f node

# Перезапуск в режиме разработки
npm run dev
```

### Проверка портов
```bash
# Проверка занятых портов
netstat -tulpn | grep :3000

# Убийство процесса на порту 3000
lsof -ti:3000 | xargs kill -9
```

## 📊 Мониторинг

### Проверка состояния системы
```bash
# Проверка использования памяти
free -h

# Проверка дискового пространства
df -h

# Проверка процессов Node.js
ps aux | grep node
```

### Логирование
Все ошибки логируются в папку `logs/`:
- `app.log` - общие логи приложения
- `error.log` - только ошибки
- `debug.log` - отладочная информация

## 🚀 Производительность

### Оптимизация сборки
```bash
# Анализ размера бандла
npm run build
# Проверьте вывод на предмет больших файлов

# Оптимизация изображений
# Убедитесь, что используете next/image для всех изображений
```

### Оптимизация базы данных
```bash
# Проверка индексов
npm run db:studio
# В Prisma Studio проверьте индексы в таблицах

# Анализ запросов
# Включите логирование запросов в development режиме
```

## 🔐 Безопасность

### Проверка переменных окружения
```bash
# Убедитесь, что .env.local не в git
git status

# Проверьте, что секретные ключи не закоммичены
git log --all --full-history -- .env*
```

### Обновление зависимостей
```bash
# Проверка уязвимостей
npm audit

# Исправление уязвимостей
npm audit fix

# Обновление зависимостей
npm update
```

## 📞 Поддержка

Если проблема не решена:

1. **Соберите информацию:**
   - Версия Node.js: `node --version`
   - Версия npm: `npm --version`
   - Операционная система
   - Полный текст ошибки
   - Логи из папки `logs/`

2. **Проверьте документацию:**
   - [Next.js Troubleshooting](https://nextjs.org/docs/advanced-features/debugging)
   - [Prisma Troubleshooting](https://www.prisma.io/docs/guides/troubleshooting)
   - [Supabase Documentation](https://supabase.com/docs)

3. **Создайте Issue:**
   - Опишите проблему подробно
   - Приложите логи и скриншоты
   - Укажите шаги для воспроизведения

## 🎯 Профилактика

### Регулярные проверки
```bash
# Еженедельно запускайте
npm audit
npm run test:db
npm run build
```

### Мониторинг логов
```bash
# Настройте алерты на критические ошибки
grep -i "error\|fatal" logs/error.log
```

### Резервное копирование
```bash
# Регулярное резервное копирование БД
npm run db:backup
```

---

**💡 Совет:** Всегда начинайте диагностику с `npm run test:db` - это поможет быстро выявить проблемы с базой данных.
