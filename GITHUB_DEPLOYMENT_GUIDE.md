# 🚀 Деплой через GitHub на Vercel

## 📋 Пошаговая инструкция

### Шаг 1: Откройте Vercel
1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите "Continue with GitHub" (если не вошли)
3. Авторизуйтесь через GitHub

### Шаг 2: Создание нового проекта
1. Нажмите **"New Project"** (синяя кнопка)
2. В списке репозиториев найдите `viktor710/used-parts-inventory`
3. Нажмите **"Import"** рядом с репозиторием

### Шаг 3: Настройка проекта
Vercel автоматически определит настройки:
- **Framework Preset**: Next.js ✅
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `.next` ✅
- **Install Command**: `npm install` ✅

### Шаг 4: Деплой
1. Нажмите **"Deploy"** (синяя кнопка)
2. Дождитесь завершения сборки (2-3 минуты)
3. Получите URL вашего приложения

## 🎯 Ожидаемый результат

После успешного деплоя:
- **URL**: `https://used-parts-inventory-xxx.vercel.app`
- **Автоматические деплои** при push в master
- **SSL сертификат** и **CDN**

## 🔧 Проверка деплоя

### Тестирование функций:
1. **Главная страница** - статистика
2. **Добавление автомобиля** - `/cars/new`
3. **Добавление запчасти** - `/parts/new`
4. **Автодополнение** - в форме добавления запчасти
5. **API роуты** - все должны работать

### Проверка API:
- `https://your-app.vercel.app/api/stats`
- `https://your-app.vercel.app/api/cars`
- `https://your-app.vercel.app/api/parts`

## 📊 Мониторинг

### В Vercel Dashboard:
- **Deployments** - история деплоев
- **Functions** - логи API роутов
- **Analytics** - метрики производительности
- **Settings** - настройки проекта

## 🔄 Автоматические деплои

После первого деплоя:
- **Push в master** → автоматический деплой
- **Pull Request** → превью деплой
- **Теги** → релиз деплой

## 🚨 Возможные проблемы

### Проблема: Репозиторий не найден
**Решение**: Убедитесь, что репозиторий публичный или у Vercel есть доступ

### Проблема: Ошибка сборки
**Решение**: Проверьте логи в Vercel Dashboard

### Проблема: API не работает
**Решение**: Проверьте Function Logs в Vercel Dashboard

## 📞 Поддержка

### Полезные ссылки:
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Project Settings](https://vercel.com/docs/projects/project-configuration)
- [Function Logs](https://vercel.com/docs/functions/logs)

### Команды для проверки:
```bash
# Локальная проверка
npm run build
npm start

# Проверка статуса
git status
git log --oneline -5
```

## 🎉 Результат

После успешного деплоя у вас будет:
- ✅ **Рабочее приложение** в интернете
- ✅ **Автоматические обновления** при изменениях
- ✅ **Профессиональный домен** с SSL
- ✅ **Глобальный CDN** для быстрой загрузки
- ✅ **Мониторинг** и аналитика

---

**Статус**: Готов к деплою  
**Версия**: 1.0.2  
**Платформа**: Vercel + GitHub  
**Дата**: 2024-12-19
