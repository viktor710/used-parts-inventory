# Единый стиль сборки проекта

## Обзор

Система использует единый стиль для всех сообщений в терминале при выполнении команды `npm run build`. Это обеспечивает консистентность и улучшает пользовательский опыт.

## Структура файлов

```
scripts/
├── build-styles.js      # Основные стили и цвета
├── custom-build.js      # Главный скрипт сборки
├── build-analyzer.js    # Анализатор результатов
└── fix-prisma-vercel.js # Исправления Prisma
```

## Основные стили

### Цветовая схема

- **ℹ️ Info** - Голубой (`#36`)
- **✅ Success** - Зеленый (`#32`)
- **⚠️ Warning** - Желтый (`#33`)
- **❌ Error** - Красный (`#31`)
- **🔧 Step** - Синий (`#34`)
- **⚙️ Process** - Пурпурный (`#35`)
- **🏗️ Build** - Голубой (`#36`)
- **🔨 Generate** - Синий (`#34`)

### Типы сообщений

#### Основные
```javascript
style.info('Информационное сообщение');
style.success('Успешное выполнение');
style.warning('Предупреждение');
style.error('Ошибка');
```

#### Этапы процесса
```javascript
style.step('Начало этапа');
style.process('Выполнение операции');
style.build('Сборка приложения');
style.generate('Генерация файлов');
```

#### Операции
```javascript
style.clean('Очистка файлов');
style.check('Проверка');
style.install('Установка');
style.test('Тестирование');
```

#### Статусы
```javascript
style.loading('Загрузка...');
style.done('Завершено!');
style.skip('Пропущено');
```

#### Специальные
```javascript
style.header('Заголовок раздела');
style.section('Подраздел');
style.divider(); // Разделительная линия
```

## Использование

### В скриптах

```javascript
const { style } = require('./build-styles');

console.log(style.header('🚀 Запуск процесса'));
console.log(style.step('Выполнение задачи...'));
console.log(style.success('Задача выполнена'));
```

### В анализаторе сборки

```javascript
const { BuildAnalyzer } = require('./build-analyzer');

const analyzer = new BuildAnalyzer();
const stats = analyzer.analyzeBuildOutput(buildOutput);
analyzer.displayBuildStats();
```

## Пример вывода

```
🚀 Запуск сборки проекта
────────────────────────────────────────────────────────────
🔧 Проверка зависимостей...
✅ Зависимости проверены
🔨 Генерация Prisma Client...
✅ Prisma Client сгенерирован
🏗️ Сборка Next.js приложения...
✅ Сборка завершена успешно!
⏱️  Общее время сборки: 15420ms
────────────────────────────────────────────────────────────
📊 Анализ результатов сборки
────────────────────────────────────────────────────────────
📋 Общие показатели:
ℹ️  Всего маршрутов: 32
ℹ️  Статических страниц: 24
ℹ️  Динамических страниц: 8
📊 Общий размер JS: 196 kB
⏱️  Время компиляции: 2300ms
```

## Кастомизация

### Добавление новых стилей

```javascript
// В build-styles.js
const style = {
  // ... существующие стили
  
  custom: (text) => `${colors.yellow}🎯 ${text}${colors.reset}`,
  special: (text) => `${colors.bright}${colors.magenta}⭐ ${text}${colors.reset}`
};
```

### Изменение цветов

```javascript
const colors = {
  // ... существующие цвета
  
  custom: '\x1b[38;5;208m', // Оранжевый
  highlight: '\x1b[38;5;87m'  // Светло-голубой
};
```

## Интеграция с существующими скриптами

### Обновление package.json

```json
{
  "scripts": {
    "build": "node scripts/custom-build.js",
    "build:analyze": "node scripts/build-analyzer.js",
    "build:fix-prisma": "node scripts/fix-prisma-vercel.js"
  }
}
```

### Добавление в другие скрипты

```javascript
// В любом скрипте
const { style } = require('./build-styles');

console.log(style.info('Скрипт запущен'));
console.log(style.success('Операция завершена'));
```

## Преимущества

1. **Консистентность** - Единый стиль для всех сообщений
2. **Читаемость** - Цветовое кодирование для быстрого понимания
3. **Профессиональность** - Красивый и структурированный вывод
4. **Масштабируемость** - Легко добавлять новые стили
5. **Переиспользование** - Один файл стилей для всех скриптов

## Совместимость

- **Node.js** - 16+ (использует ES6 модули)
- **Терминалы** - Поддерживает ANSI цвета
- **ОС** - Windows, macOS, Linux
- **Скрипты** - CommonJS и ES6 модули

## Troubleshooting

### Проблемы с цветами

Если цвета не отображаются:

```javascript
// Проверьте поддержку ANSI
const supportsColor = require('supports-color');
if (!supportsColor.stdout) {
  // Отключите цвета
  colors.reset = '';
}
```

### Проблемы с кодировкой

```javascript
// Установите правильную кодировку
process.stdout.setEncoding('utf8');
```

## Примеры использования

### Простой скрипт

```javascript
#!/usr/bin/env node
const { style } = require('./build-styles');

console.log(style.header('Мой скрипт'));
console.log(style.step('Выполняю задачу...'));
console.log(style.success('Готово!'));
```

### Скрипт с прогрессом

```javascript
const { style } = require('./build-styles');

for (let i = 1; i <= 5; i++) {
  console.log(style.progress(i, 5, 'Обработка файлов'));
  // ... обработка
}
console.log(style.done('Все файлы обработаны!'));
```

---

**Последнее обновление**: Сентябрь 2024  
**Версия**: 1.0.0  
**Автор**: Система автоматизации сборки
