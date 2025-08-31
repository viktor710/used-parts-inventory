# Настройка переменных окружения на Vercel

## Обязательные переменные окружения

Для корректной работы приложения на Vercel необходимо настроить следующие переменные окружения в панели управления Vercel:

### 1. База данных (Supabase)
```
DATABASE_URL=postgresql://postgres.fkffeemwflechywrmnlv:r5iymaFUTV0#CHoc@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres.fkffeemwflechywrmnlv:r5iymaFUTV0#CHoc@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
```

### 2. Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://fkffeemwflechywrmnlv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrZmZlZW13ZmxlY2h5d3Jtbmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2Mzg1MzcsImV4cCI6MjA3MjIxNDUzN30.Mf5z7GfCJ1NnyvFcQbGAtUkMEsyMnFcumHHWNu-FtLo
SUPABASE_SERVICE_ROLE_KEY=r5iymaFUTV0#CHoc
```

### 3. Cloudinary
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Prisma (автоматически устанавливаются)
```
NODE_ENV=production
PRISMA_GENERATE_DATAPROXY=true
PRISMA_CLI_QUERY_ENGINE_TYPE=binary
```

## Инструкция по настройке

1. Перейдите в панель управления Vercel
2. Выберите ваш проект
3. Перейдите в раздел "Settings" → "Environment Variables"
4. Добавьте каждую переменную из списка выше
5. Убедитесь, что переменные применяются к Production, Preview и Development окружениям
6. Перезапустите деплой

## Проверка настройки

После настройки переменных окружения:

1. Запустите новый деплой
2. Проверьте логи сборки на наличие ошибок Prisma
3. Убедитесь, что API endpoints работают корректно

## Устранение проблем

Если возникают проблемы с Prisma:

1. Проверьте, что `DATABASE_URL` и `DIRECT_URL` настроены правильно
2. Убедитесь, что база данных доступна из Vercel
3. Проверьте, что Prisma Client генерируется во время сборки
4. Посмотрите логи сборки на наличие ошибок подключения к базе данных
