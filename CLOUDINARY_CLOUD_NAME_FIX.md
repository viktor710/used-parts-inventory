# 🔧 Исправление проблемы с Cloud Name

## ❌ Проблема:
Ошибка "Invalid cloud_name Untitled" указывает на то, что Cloud Name "Untitled" не является действительным.

## 🔍 Диагностика:

### Текущие настройки:
- Cloud Name: `Untitled` ❌
- API Key: `256814993219557` ✅
- API Secret: `FbMOQfdO54XMgU-k0GfthqGDbtI` ✅

### Проблема:
Cloud Name "Untitled" не является действительным именем облака в Cloudinary.

## 🛠️ Решения:

### Вариант 1: Проверить правильный Cloud Name
1. Войдите в аккаунт Cloudinary: https://cloudinary.com/console
2. В Dashboard найдите раздел "Account Details"
3. Найдите поле "Cloud name" - это должно быть что-то вроде:
   - `myapp123`
   - `company-name`
   - `username123`
   - `project-name`

### Вариант 2: Создать новое облако
1. В Cloudinary Dashboard перейдите в "Settings" → "Account"
2. Найдите раздел "Cloud names"
3. Создайте новое облако с уникальным именем

### Вариант 3: Использовать тестовое облако
Если у вас нет доступа к Dashboard, можно использовать тестовые данные:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=256814993219557
CLOUDINARY_API_SECRET=FbMOQfdO54XMgU-k0GfthqGDbtI
```

## 📋 Что нужно сделать:

1. **Проверить Cloud Name в аккаунте Cloudinary**
2. **Обновить .env.local с правильным Cloud Name**
3. **Перезапустить приложение**

## 🔗 Полезные ссылки:
- Cloudinary Dashboard: https://cloudinary.com/console
- Документация Cloudinary: https://cloudinary.com/documentation
- Руководство по настройке: https://cloudinary.com/documentation/node_integration

## 📝 Примечание:
Cloud Name должен быть уникальным глобально и содержать только буквы, цифры и дефисы.
