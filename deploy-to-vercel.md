# 🚀 Пошаговая инструкция деплоя на Vercel

## 📋 Что нужно сделать:

### Шаг 1: Подготовка
✅ Проект готов к деплою
✅ Все файлы отправлены на GitHub
✅ Vercel CLI установлен

### Шаг 2: Вход в Vercel

**Вариант A: Через браузер (Рекомендуется)**
1. Откройте [vercel.com](https://vercel.com)
2. Нажмите "Continue with GitHub"
3. Авторизуйтесь через GitHub

**Вариант B: Через CLI**
```bash
vercel login
# Выберите "Continue with GitHub"
# Следуйте инструкциям в браузере
```

### Шаг 3: Деплой проекта

**Вариант A: Через веб-интерфейс**
1. Нажмите "New Project"
2. Выберите репозиторий `viktor710/used-parts-inventory`
3. Нажмите "Deploy"

**Вариант B: Через CLI**
```bash
vercel --prod
```

## 🎯 Ожидаемый результат:

После успешного деплоя вы получите:
- **URL**: `https://your-project-name.vercel.app`
- **Автоматические деплои** при push в master
- **SSL сертификат** и **CDN**

## 🔧 Если возникнут проблемы:

### Проблема: Не могу войти в Vercel
**Решение**: Используйте веб-интерфейс на [vercel.com](https://vercel.com)

### Проблема: Репозиторий не найден
**Решение**: Убедитесь, что репозиторий публичный или у Vercel есть доступ

### Проблема: Ошибка сборки
**Решение**: Проверьте локальную сборку командой `npm run build`

## 📞 Поддержка:

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- [GitHub Repository](https://github.com/viktor710/used-parts-inventory)

---

**Статус**: Готов к деплою  
**Версия**: 1.0.2  
**Дата**: 2024-12-19
