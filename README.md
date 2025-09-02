# Система учета б/у запчастей

Современная веб-приложение для учета и управления б/у автомобильными запчастями, построенное на Next.js 14, TypeScript, Prisma ORM и PostgreSQL с интеграцией Cloudinary для управления изображениями.

## 🚀 Технологии

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS с кастомной дизайн-системой
- **Database**: PostgreSQL с Prisma ORM
- **Cloud Storage**: Cloudinary для изображений
- **Authentication**: Готово к интеграции (Supabase Auth)
- **Icons**: Lucide React
- **Logging**: Winston с ротацией файлов
- **Performance**: React.memo, useCallback, динамические импорты
- **Deployment**: Vercel (готово к деплою)

## 🔐 Безопасность

Система реализует многоуровневую защиту:

- **Аутентификация**: NextAuth.js с JWT сессиями
- **Авторизация**: Ролевая модель (USER, MANAGER, ADMIN)
- **Защита API**: Middleware с проверкой прав доступа
- **Валидация**: Zod схемы и серверная проверка данных
- **Логирование**: Winston с ротацией и детализацией

📖 Подробности: [SECURITY.md](docs/SECURITY.md)

### 🚀 Быстрый старт с безопасностью

1. **Настройка переменных окружения**:
   ```bash
   cp env.example .env
   # Измените NEXTAUTH_SECRET на уникальный ключ!
   ```

2. **Инициализация базы данных**:
   ```bash
   npm run db:migrate
   npm run db:init-users
   ```

3. **Демо-аккаунты**:
   - Администратор: `admin@example.com` / `admin123`
   - Менеджер: `manager@example.com` / `manager123`
   - Пользователь: `user@example.com` / `user123`

## 📋 Правила разработки

### 🎯 Основные принципы
- **TypeScript First** - Строгая типизация для всего кода
- **Component-Based Architecture** - Модульная структура компонентов
- **Performance First** - Оптимизация производительности с самого начала
- **Accessibility** - Полная доступность для всех пользователей
- **Mobile-First** - Адаптивный дизайн для всех устройств

### 📝 Стандарты кодирования

#### TypeScript
```typescript
// ✅ Правильно - строгая типизация
interface UserProps {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

const UserComponent: React.FC<UserProps> = ({ id, name, email, isActive }) => {
  return <div>{name}</div>;
};

// ❌ Неправильно - any типы
const UserComponent = (props: any) => {
  return <div>{props.name}</div>;
};
```

#### React компоненты
```typescript
// ✅ Правильно - функциональные компоненты с мемоизацией
const OptimizedComponent = React.memo<ComponentProps>(({ data, onAction }) => {
  const handleClick = useCallback(() => {
    onAction(data);
  }, [data, onAction]);

  return <button onClick={handleClick}>{data.label}</button>;
});

// ❌ Неправильно - классовые компоненты
class OldComponent extends React.Component {
  // устаревший подход
}
```

#### Именование
- **Файлы**: PascalCase для компонентов, camelCase для утилит
- **Компоненты**: PascalCase (например, `UserProfile.tsx`)
- **Функции**: camelCase (например, `handleUserClick`)
- **Константы**: UPPER_SNAKE_CASE (например, `API_ENDPOINTS`)
- **Типы/Интерфейсы**: PascalCase (например, `UserProfileProps`)

### 🏗 Архитектурные правила

#### Структура папок
```
components/
├── ui/           # Переиспользуемые UI компоненты
├── layout/       # Компоненты макета
├── forms/        # Формы и валидация
├── charts/       # Графики и диаграммы
└── business/     # Бизнес-логика компоненты

lib/
├── services/     # Бизнес-логика сервисы
├── utils/        # Утилиты и хелперы
├── hooks/        # Кастомные React хуки
├── types/        # TypeScript типы
└── constants/    # Константы приложения
```

#### Импорты
```typescript
// ✅ Правильно - группировка и порядок импортов
// 1. React и Next.js
import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';

// 2. Сторонние библиотеки
import { z } from 'zod';
import { toast } from 'react-hot-toast';

// 3. Внутренние компоненты
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// 4. Утилиты и типы
import { cn } from '@/utils/cn';
import type { User } from '@/types';

// 5. Стили
import './Component.module.css';
```

### 🎨 Дизайн-система правила

#### Цвета
- Используйте только цвета из дизайн-системы
- Не хардкодите цвета в компонентах
- Используйте CSS переменные для тем

```typescript
// ✅ Правильно - использование дизайн-системы
const colors = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  background: 'var(--color-background)',
  text: 'var(--color-text)',
};

// ❌ Неправильно - хардкод цветов
const colors = {
  primary: '#0A2472',
  secondary: '#0B6623',
};
```

#### Компоненты
- Все компоненты должны быть переиспользуемыми
- Используйте composition pattern для сложных компонентов
- Поддерживайте все варианты использования через props

### 🔧 Правила производительности

#### React оптимизации
```typescript
// ✅ Правильно - мемоизация и оптимизация
const ExpensiveComponent = React.memo<Props>(({ data, onAction }) => {
  const memoizedValue = useMemo(() => {
    return expensiveCalculation(data);
  }, [data]);

  const memoizedCallback = useCallback(() => {
    onAction(memoizedValue);
  }, [onAction, memoizedValue]);

  return <div onClick={memoizedCallback}>{memoizedValue}</div>;
});

// ❌ Неправильно - создание объектов в рендере
const BadComponent = ({ data }) => {
  const badObject = { id: data.id, name: data.name }; // ❌ Создается каждый рендер
  return <div>{badObject.name}</div>;
};
```

#### Изображения
- Всегда используйте `next/image` для оптимизации
- Предоставляйте `alt` текст для доступности
- Используйте lazy loading для изображений ниже fold

### 🧪 Тестирование правила

#### Компоненты
- Каждый компонент должен иметь тесты
- Тестируйте все варианты использования
- Используйте React Testing Library
- Мокайте внешние зависимости

```typescript
// ✅ Правильно - полное покрытие тестами
describe('UserProfile', () => {
  it('отображает информацию пользователя', () => {
    const user = { name: 'John', email: 'john@example.com' };
    render(<UserProfile user={user} />);
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('вызывает onEdit при клике на кнопку редактирования', () => {
    const onEdit = jest.fn();
    render(<UserProfile user={user} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByText('Редактировать'));
    expect(onEdit).toHaveBeenCalledWith(user);
  });
});
```

### 📚 Документация правила

#### JSDoc комментарии
```typescript
/**
 * Компонент профиля пользователя
 * Отображает основную информацию о пользователе с возможностью редактирования
 * 
 * @param user - Объект пользователя для отображения
 * @param onEdit - Callback функция для редактирования профиля
 * @param isEditable - Флаг, разрешающий редактирование
 * @returns JSX элемент профиля пользователя
 * 
 * @example
 * ```tsx
 * <UserProfile 
 *   user={currentUser} 
 *   onEdit={handleEdit} 
 *   isEditable={true} 
 * />
 * ```
 */
const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  onEdit, 
  isEditable = false 
}) => {
  // Реализация компонента
};
```

#### README для компонентов
Каждый сложный компонент должен иметь README с:
- Описанием назначения
- Примеры использования
- Props интерфейс
- Варианты стилизации
- Примеры тестирования

### 🚫 Запрещенные практики

#### Код
- ❌ Использование `any` типов
- ❌ Хардкод значений в компонентах
- ❌ Создание объектов в рендере
- ❌ Использование `console.log` в продакшене
- ❌ Необработанные ошибки

#### Архитектура
- ❌ Дублирование кода между компонентами
- ❌ Смешивание бизнес-логики и UI
- ❌ Глобальные переменные состояния
- ❌ Прямые DOM манипуляции

### 🔄 Git workflow правила

#### Коммиты
```bash
# ✅ Правильно - семантические коммиты
feat: добавить систему уведомлений
fix: исправить баг с загрузкой изображений
docs: обновить документацию API
refactor: оптимизировать компонент UserProfile
test: добавить тесты для AuthService

# ❌ Неправильно
update
fix bug
changes
```

#### Ветки
- `main` - продакшен код
- `develop` - основная ветка разработки
- `feature/feature-name` - новые функции
- `fix/bug-description` - исправления багов
- `hotfix/critical-issue` - критические исправления

### 📊 Метрики качества

#### Код
- Покрытие тестами: минимум 80%
- TypeScript strict mode: включен
- ESLint ошибки: 0
- Prettier: автоматическое форматирование

#### Производительность
- Lighthouse score: минимум 90
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

### 🛠 Инструменты разработки

#### Обязательные
- **TypeScript** - строгая типизация
- **ESLint** - линтинг кода
- **Prettier** - форматирование
- **Husky** - pre-commit хуки
- **Jest** - тестирование
- **React Testing Library** - тестирование компонентов

#### Рекомендуемые
- **Storybook** - документация компонентов
- **Playwright** - E2E тестирование
- **Bundle Analyzer** - анализ бандла
- **Lighthouse CI** - автоматическая проверка производительности

### 📱 Responsive правила

#### Breakpoints
```typescript
// ✅ Правильно - использование Tailwind breakpoints
const responsiveClasses = {
  container: 'px-4 sm:px-6 lg:px-8',
  grid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  text: 'text-sm md:text-base lg:text-lg',
};

// ❌ Неправильно - кастомные breakpoints
const customBreakpoints = {
  mobile: 'max-width: 768px',
  tablet: 'max-width: 1024px',
};
```

#### Мобильная адаптация
- Все компоненты должны работать на мобильных устройствах
- Используйте touch-friendly размеры (минимум 44px)
- Поддерживайте gesture навигацию
- Оптимизируйте для медленных соединений

### 🔒 Безопасность правила

#### Валидация
- Всегда валидируйте пользовательский ввод
- Используйте Zod для схем валидации
- Санитизируйте данные перед отображением
- Проверяйте права доступа

```typescript
// ✅ Правильно - валидация с Zod
const userSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(8, 'Пароль минимум 8 символов'),
  age: z.number().min(18, 'Возраст должен быть 18+'),
});

// ❌ Неправильно - отсутствие валидации
const createUser = (data: any) => {
  // Прямое использование данных без валидации
  return db.users.create(data);
};
```

#### API безопасность
- Используйте HTTPS в продакшене
- Валидируйте все API endpoints
- Ограничивайте размер загружаемых файлов
- Логируйте подозрительную активность

### 📈 Мониторинг и логирование

#### Логирование
```typescript
// ✅ Правильно - структурированное логирование
import { logger } from '@/lib/logger';

logger.info('Пользователь залогинился', {
  userId: user.id,
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent,
});

logger.error('Ошибка загрузки данных', {
  error: error.message,
  stack: error.stack,
  context: { userId, action },
});

// ❌ Неправильно - простые console.log
console.log('User logged in');
console.error('Error loading data');
```

#### Метрики
- Отслеживайте производительность компонентов
- Логируйте время загрузки страниц
- Мониторьте ошибки пользователей
- Анализируйте использование функций

### 🎯 Code Review правила

#### Что проверять
- Соответствие TypeScript стандартам
- Покрытие тестами
- Производительность компонентов
- Доступность (accessibility)
- Безопасность кода
- Соответствие дизайн-системе

#### Процесс
1. Автоматические проверки (ESLint, TypeScript, тесты)
2. Code review от коллег
3. Проверка производительности
4. Тестирование на разных устройствах
5. Проверка доступности

### 🚀 Деплой правила

#### Pre-deploy проверки
- Все тесты проходят
- Нет ESLint ошибок
- TypeScript компилируется без ошибок
- Lighthouse score соответствует требованиям
- Бандл не превышает лимиты

#### Post-deploy проверки
- Мониторинг ошибок
- Проверка производительности
- Тестирование критических функций
- Проверка доступности

## 🎨 Дизайн-система

### Цветовая палитра
- **Основной фон**: Чистый белый (#FFFFFF) и светлый серый (#F9F9F9)
- **Акцентные цвета**: 
  - Синий (#0A2472) - основной акцент
  - Зеленый (#0B6623) - вторичный акцент
- **Нейтральные цвета**: 
  - Темно-серый (#333333) - основной текст
  - Светло-серый (#DDDDDD) - разделители

### Стиль
- Минималистичный дизайн
- Responsive breakpoints (xs, sm, md, lg, xl, 2xl)
- Плавные анимации и переходы
- Полная доступность (accessibility)
- Интерактивные элементы с hover-эффектами

## 📁 Структура проекта

```
Sait/
├── app/                    # Next.js App Router
│   ├── api/               # API роуты
│   │   ├── cars/          # API для работы с автомобилями
│   │   ├── parts/         # API для работы с запчастями
│   │   ├── stats/         # API статистики
│   │   ├── upload/        # API загрузки изображений
│   │   ├── zapchasti/     # API поиска запчастей
│   │   ├── test-db/       # Тестирование БД
│   │   └── test-env/      # Тестирование окружения
│   ├── cars/              # Страницы автомобилей
│   │   ├── [id]/         # Просмотр, редактирование, удаление
│   │   └── new/          # Добавление нового
│   ├── parts/             # Страницы запчастей
│   │   ├── [id]/         # Просмотр, редактирование, удаление
│   │   ├── available/    # Доступные запчасти
│   │   ├── reserved/     # Зарезервированные
│   │   └── new/          # Добавление новой
│   ├── customers/         # Управление клиентами
│   ├── finance/           # Финансовая отчетность
│   ├── reports/           # Отчеты и аналитика
│   ├── sales/             # Управление продажами
│   ├── settings/          # Настройки системы
│   ├── suppliers/         # Управление поставщиками
│   ├── globals.css        # Глобальные стили
│   ├── layout.tsx         # Корневой layout
│   └── page.tsx           # Главная страница с дашбордом
├── components/            # React компоненты
│   ├── debug/            # Отладочные компоненты
│   │   └── DebugPanel.tsx # Панель отладки для разработки
│   ├── layout/           # Компоненты layout
│   │   ├── Header.tsx    # Хедер с навигацией
│   │   └── Sidebar.tsx   # Боковая панель
│   └── ui/               # UI компоненты (20+ компонентов)
│       ├── InteractiveStatCard.tsx    # Интерактивные статистические карточки
│       ├── QuickActions.tsx           # Быстрые действия с модалами
│       ├── ActivityFeed.tsx           # Лента активности
│       ├── InteractiveCharts.tsx      # Интерактивные графики
│       ├── SmartWidgets.tsx           # Умные виджеты
│       ├── DragDropUpload.tsx         # Drag & Drop загрузка
│       ├── ImageGallery.tsx           # Галерея изображений
│       ├── ImageUpload.tsx            # Загрузка изображений
│       ├── OptimizedImage.tsx         # Оптимизированные изображения
│       ├── PartCard.tsx               # Карточки запчастей
│       ├── StatCard.tsx               # Статистические карточки
│       ├── Autocomplete.tsx           # Автодополнение
│       ├── Badge.tsx                  # Бейджи статусов
│       ├── Button.tsx                 # Кнопки
│       ├── Card.tsx                   # Базовые карточки
│       ├── CountBadge.tsx             # Счетчики
│       ├── PageHeader.tsx             # Заголовки страниц
│       ├── PartImage.tsx              # Изображения запчастей
│       └── Toast.tsx                  # Уведомления
├── hooks/                # React хуки
│   └── useStats.ts       # Хук для работы со статистикой
├── lib/                  # Утилиты и библиотеки
│   ├── actions.ts        # Server Actions
│   ├── cars.ts           # Логика работы с автомобилями
│   ├── parts.ts          # Логика работы с запчастями
│   ├── stats.ts          # Логика статистики
│   ├── cloudinary.ts     # Конфигурация Cloudinary
│   ├── database-service.ts # Сервис работы с БД
│   ├── prisma.ts         # Prisma клиент
│   ├── logger.ts         # Winston логгер с ротацией
│   ├── validation.ts     # Zod валидация
│   ├── mock-data.ts      # Моковые данные
│   ├── zapchasti-categories.ts # Категории запчастей
│   └── zapchasti-data.ts # База данных запчастей (808 элементов)
├── prisma/               # Prisma схема и миграции
│   ├── schema.prisma     # Схема базы данных
│   └── migrations/       # Миграции БД
├── scripts/              # Скрипты для работы с системой
│   ├── init-database.ts  # Инициализация БД
│   ├── backup-restore.js # Резервное копирование
│   ├── test-db-connection.ts # Тест подключения к БД
│   ├── test-api.ts       # Тестирование API
│   ├── test-env.ts       # Тестирование окружения
│   └── test-ssr.ts       # Тестирование SSR
├── types/                # TypeScript типы
│   ├── index.ts          # Основные типы
│   └── actions.ts        # Типы для действий
├── utils/                # Утилиты
│   ├── cn.ts             # Утилита для className
│   ├── debounce.ts       # Debounce функция
│   └── format.ts         # Форматирование данных
├── docs/                 # Документация
│   ├── LOGGING.md        # Документация по логированию
│   └── TROUBLESHOOTING.md # Руководство по устранению неполадок
├── package.json          # Зависимости
├── tailwind.config.ts    # Конфигурация Tailwind
├── tsconfig.json         # Конфигурация TypeScript
├── next.config.js        # Конфигурация Next.js
├── middleware.ts         # Next.js middleware
├── vercel.json           # Конфигурация Vercel
├── CHANGELOG.md          # История изменений
└── README.md            # Документация
```

## 🛠 Установка и запуск

### Предварительные требования
- Node.js 18+ 
- npm или yarn
- PostgreSQL база данных (Supabase или локальная)
- Cloudinary аккаунт (для изображений)

### Переменные окружения
Создайте файл `.env.local` на основе `env.example`:

**⚠️ Важно:** Убедитесь, что файл `.env.local` создан и содержит правильные переменные окружения. Без этого приложение не сможет подключиться к базе данных.

```bash
# База данных
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Supabase (опционально)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### Установка зависимостей
```bash
npm install
```

### Настройка базы данных
```bash
# Генерация Prisma клиента
npm run db:generate

# Применение миграций
npm run db:migrate

# Инициализация данных
npm run db:seed
```

### Запуск в режиме разработки
```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

### Сборка для продакшена
```bash
npm run build
npm start
```

### Тестирование подключения к базе данных
```bash
npm run test:db
```

Этот скрипт проверит:
- Наличие переменных окружения
- Подключение к базе данных
- Выполнение простых запросов
- Подсчет записей в таблицах

## 📊 Функциональность

### 🎯 Основные возможности
- ✅ **Управление автомобилями**: CRUD операции с полной информацией
- ✅ **Учет запчастей**: Добавление, редактирование, удаление с фото
- ✅ **Категоризация**: 9 категорий запчастей с автодополнением
- ✅ **Статусы**: Доступна, зарезервирована, продана, утилизирована
- ✅ **Фильтрация и поиск**: По категории, статусу, цене, году
- ✅ **Панель управления**: Интерактивная статистика и аналитика
- ✅ **Загрузка изображений**: Drag & Drop с Cloudinary
- ✅ **Responsive дизайн**: Адаптация под все устройства
- ✅ **TypeScript**: Строгая типизация всего кода
- ✅ **Система логирования**: Winston с ротацией файлов
- ✅ **Система отладки**: Комплексная отладка в режиме разработки
- ✅ **Оптимизация производительности**: React.memo, динамические импорты

### 🎯 Интерактивные элементы главной страницы
- ✅ **Интерактивные статистические карточки**: Кликабельные карточки с модальными окнами
- ✅ **Быстрые действия с модальными окнами**: Поиск, добавление запчастей, клиентов, продажи
- ✅ **Живая лента активности**: Фильтрация, отметка как прочитанное, приоритеты
- ✅ **Интерактивные графики**: Переключение типов, фильтры, экспорт данных
- ✅ **Умные виджеты**: Прогнозы продаж, рекомендации, алерты
- ✅ **Drag & Drop загрузка**: Загрузка изображений с предварительным просмотром
- ✅ **Анимированные счетчики**: Плавные анимации при загрузке данных
- ✅ **Real-time уведомления**: Живые обновления и алерты

### 🎨 Современные UI компоненты
- **InteractiveStatCard** - Интерактивные статистические карточки с модалами
- **QuickActions** - Панель быстрых действий с модальными формами
- **ActivityFeed** - Лента активности с фильтрацией и приоритетами
- **InteractiveCharts** - Графики с переключением типов и экспорт данных
- **SmartWidgets** - Умные виджеты с прогнозами и рекомендациями
- **DragDropUpload** - Drag & Drop загрузка с предварительным просмотром
- **ImageGallery** - Галерея с полноэкранным просмотром и навигацией
- **OptimizedImage** - Оптимизированные изображения с плейсхолдерами
- **Autocomplete** - Быстрое автодополнение с поиском
- **Toast** - Система уведомлений

### Категории запчастей
1. **Двигатель** - Моторы и компоненты
2. **Трансмиссия** - КПП, сцепления, карданы
3. **Подвеска** - Амортизаторы, рычаги, пружины
4. **Тормоза** - Колодки, диски, суппорты
5. **Электрика** - Генераторы, стартеры, провода
6. **Кузов** - Панели, бамперы, крылья
7. **Салон** - Сиденья, панели, коврики
8. **Внешние элементы** - Зеркала, стекла, фары
9. **Прочее** - Различные компоненты

### Состояния запчастей
- **Отличное** - Как новое
- **Хорошее** - Минимальный износ
- **Удовлетворительное** - Средний износ
- **Плохое** - Значительный износ
- **Сломанное** - Требует ремонта

### Типы кузова автомобилей
- **Седан** - Классический тип кузова
- **Хэтчбек** - Компактный тип
- **Универсал** - Увеличенный багажник
- **Внедорожник** - SUV
- **Купе** - Спортивный тип
- **Кабриолет** - Открытый верх
- **Пикап** - Грузовой отсек
- **Минивэн** - Многофункциональный
- **Прочее** - Другие типы

## 🔧 API Endpoints

### Автомобили
- `GET /api/cars` - Получение списка автомобилей
- `POST /api/cars` - Создание нового автомобиля
- `GET /api/cars/[id]` - Получение конкретного автомобиля
- `PUT /api/cars/[id]` - Обновление автомобиля
- `DELETE /api/cars/[id]` - Удаление автомобиля

### Запчасти
- `GET /api/parts` - Получение списка запчастей
- `POST /api/parts` - Создание новой запчасти
- `GET /api/parts/[id]` - Получение конкретной запчасти
- `PUT /api/parts/[id]` - Обновление запчасти
- `DELETE /api/parts/[id]` - Удаление запчасти

### Статистика
- `GET /api/stats` - Получение статистики инвентаря

### Загрузка изображений
- `POST /api/upload` - Загрузка изображений на Cloudinary
- `DELETE /api/upload` - Удаление изображений из Cloudinary

### Поиск запчастей
- `GET /api/zapchasti/search` - Поиск запчастей с автодополнением
- `GET /api/zapchasti/validate` - Валидация существования запчасти

### Тестирование системы
- `GET /api/test-db` - Тестирование подключения к БД
- `GET /api/test-env` - Проверка переменных окружения

### Параметры запросов
- `page` - Номер страницы (по умолчанию: 1)
- `limit` - Количество записей на странице (по умолчанию: 20)
- `category` - Фильтр по категории
- `status` - Фильтр по статусу
- `brand` - Фильтр по бренду
- `model` - Фильтр по модели
- `minPrice` - Минимальная цена
- `maxPrice` - Максимальная цена
- `year` - Год выпуска

## 🗄 База данных

### Prisma Schema
Проект использует Prisma ORM с PostgreSQL. Основные модели:

- **Car** - Автомобили с полной информацией и изображениями
- **Part** - Запчасти, связанные с автомобилями и изображениями
- **Supplier** - Поставщики запчастей
- **Customer** - Клиенты
- **Sale** - Продажи запчастей

### Миграции и управление
```bash
# Создание новой миграции
npm run db:migrate

# Применение миграций
npm run db:push

# Просмотр базы данных
npm run db:studio

# Резервное копирование
npm run db:backup

# Восстановление
npm run db:restore

# Список резервных копий
npm run db:backup:list

# Очистка старых копий
npm run db:backup:cleanup
```

## 🎯 TypeScript особенности

### Строгая типизация
- Все интерфейсы и типы строго определены
- Использование union types для enum значений
- Generic типы для переиспользуемых компонентов
- Utility types для создания производных типов
- Полная типизация для Server Actions

### Основные типы
```typescript
// Категории запчастей
type PartCategory = 'engine' | 'transmission' | 'suspension' | ...;

// Состояния запчастей
type PartCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'broken';

// Статусы запчастей
type PartStatus = 'available' | 'reserved' | 'sold' | 'scrapped';

// Типы кузова
type BodyType = 'sedan' | 'hatchback' | 'wagon' | 'suv' | ...;

// Типы топлива
type FuelType = 'gasoline' | 'diesel' | 'hybrid' | 'electric' | ...;

// Интерфейсы с полной типизацией
interface Part {
  id: string;
  zapchastName: string;
  category: PartCategory;
  carId: string;
  images?: string[];
  // ... остальные поля
}

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  bodyType: BodyType;
  images?: string[];
  // ... остальные поля
}
```

## 🚀 Деплой на Vercel

### Подготовка к деплою
1. Создайте аккаунт на [Vercel](https://vercel.com)
2. Подключите ваш GitHub репозиторий
3. Настройте переменные окружения в Vercel Dashboard
4. Убедитесь, что база данных доступна из Vercel

### Команды для деплоя
```bash
# Локальная сборка для проверки
npm run build

# Деплой через Vercel CLI
vercel

# Продакшен деплой
vercel --prod
```

### Особенности деплоя
- Статические файлы оптимизированы
- API роуты работают на сервере Vercel
- Автоматические деплои при push в main ветку
- Интеграция с PostgreSQL через Supabase
- Cloudinary для хранения изображений
- Автоматическая оптимизация изображений

## 🔧 Разработка

### Добавление новых компонентов
1. Создайте файл в `components/ui/` или `components/layout/`
2. Используйте строгую типизацию TypeScript
3. Следуйте принципам дизайн-системы
4. Добавьте JSDoc комментарии
5. Используйте React.memo для оптимизации производительности

### Добавление новых страниц
1. Создайте папку в `app/`
2. Добавьте `page.tsx` файл
3. Используйте существующие компоненты layout
4. Добавьте типы в `types/index.ts`
5. Добавьте Server Actions в `lib/actions.ts`

### Работа с базой данных
1. Используйте `DatabaseService` из `lib/database-service.ts`
2. Добавьте новые методы в сервис
3. Создайте миграции для изменений схемы
4. Обновите типы в `types/index.ts`

### Логирование
```typescript
import { logger } from '@/lib/logger';

// Различные уровни логирования
logger.info('Информационное сообщение');
logger.warn('Предупреждение');
logger.error('Ошибка', error);
logger.debug('Отладочная информация');
```

### Оптимизация производительности
```typescript
// Используйте React.memo для предотвращения лишних ре-рендеров
const MyComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});

// Используйте useCallback для стабильных функций
const handleClick = useCallback(() => {
  // обработчик
}, [dependency]);

// Динамические импорты для code splitting
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Загрузка...</div>
});
```

## 📝 Комментарии в коде

Все функции и компоненты содержат подробные комментарии:

```typescript
/**
 * Интерактивная карточка статистики с модальным окном
 * Отображает статистическую информацию и позволяет взаимодействие
 * 
 * @param title - Заголовок карточки
 * @param value - Значение статистики
 * @param icon - Иконка для отображения
 * @param onClick - Обработчик клика для модального окна
 * @returns JSX элемент интерактивной карточки
 */
const InteractiveStatCard: React.FC<Props> = ({ title, value, icon, onClick }) => {
  // Реализация компонента с мемоизацией
};
```

## 🐛 Система отладки

### Отладочные возможности
- **Консольные логи** - Детальная информация о работе компонентов
- **Панель отладки** - Интерактивная панель в правом нижнем углу (только в dev режиме)
- **API мониторинг** - Отслеживание запросов к серверу
- **База данных** - Логирование операций с данными
- **Winston логи** - Структурированное логирование с ротацией (5MB, 5 файлов)
- **Performance мониторинг** - Отслеживание производительности компонентов

### Использование отладки
1. Откройте консоль браузера (F12)
2. Фильтруйте логи по `[DEBUG]`
3. Нажмите на кнопку жука 🐛 для панели отладки
4. Просматривайте информацию о системе и логах
5. Используйте `/api/test-db` для проверки БД
6. Используйте `/api/test-env` для проверки окружения

## 🎨 UI Компоненты

### Современные интерактивные компоненты
- **InteractiveStatCard** - Кликабельные статистические карточки с модальными окнами
- **QuickActions** - Быстрые действия с модальными формами
- **ActivityFeed** - Интерактивная лента активности с фильтрацией
- **InteractiveCharts** - Графики с переключением типов и фильтрами
- **SmartWidgets** - Умные виджеты с прогнозами и рекомендациями
- **DragDropUpload** - Drag & Drop загрузка изображений
- **ImageGallery** - Галерея изображений с полноэкранным просмотром
- **OptimizedImage** - Оптимизированные изображения с плейсхолдерами
- **Autocomplete** - Автодополнение с дебаунсингом
- **Toast** - Система уведомлений

### Базовые UI компоненты
- **Button** - Кнопки с различными вариантами
- **Card** - Карточки для отображения контента
- **Badge** - Бейджи для статусов и категорий
- **PageHeader** - Заголовки страниц
- **CountBadge** - Счетчики с анимацией
- **PartCard** - Карточки запчастей (оптимизированы с React.memo)
- **StatCard** - Статистические карточки

### Использование
```typescript
import { InteractiveStatCard } from '@/components/ui/InteractiveStatCard';
import { QuickActions } from '@/components/ui/QuickActions';
import { DragDropUpload } from '@/components/ui/DragDropUpload';

// Пример использования интерактивных компонентов
<InteractiveStatCard
  title="Запчасти в наличии"
  value={150}
  icon={<Package />}
  onClick={() => openModal('parts')}
/>

<QuickActions />

<DragDropUpload
  onUpload={handleImageUpload}
  maxFiles={5}
  acceptedTypes={['image/jpeg', 'image/png']}
/>
```

## 📊 Управление данными

### Server Actions
Используются современные Server Actions для обработки данных:

```typescript
// lib/actions.ts
export async function createCar(formData: FormData) {
  // Валидация и создание автомобиля
}

export async function createPart(formData: FormData) {
  // Валидация и создание запчасти
}
```

### Скрипты для работы с базой данных
```bash
# Инициализация базы данных
npm run db:seed

# Резервное копирование
npm run db:backup

# Восстановление из резервной копии
npm run db:restore

# Список резервных копий
npm run db:backup:list

# Очистка старых резервных копий
npm run db:backup:cleanup

# Тестирование
npm run test:db
```

### Автодополнение запчастей
Система включает базу из 808 запчастей с автоматическим определением категорий:
- Поиск с дебаунсингом (300ms)
- Ленивая загрузка данных
- Валидация существования
- Автоматическое определение категории
- Кэширование результатов поиска

## 🚀 Оптимизация производительности

### Реализованные оптимизации
- **React.memo** - Предотвращение лишних ре-рендеров для PartCard и ImageGallery
- **useCallback** - Стабильные ссылки на функции
- **Динамические импорты** - Ленивая загрузка тяжелых компонентов
- **Оптимизация изображений** - Автоматическое сжатие через Cloudinary
- **Дебаунсинг** - Оптимизация поиска и автодополнения
- **Кэширование** - Кэширование результатов поиска

### Метрики производительности
- Время загрузки главной страницы: < 2 сек
- First Contentful Paint: < 1.5 сек
- Largest Contentful Paint: < 2.5 сек
- Cumulative Layout Shift: < 0.1

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature ветку
3. Внесите изменения с учетом стандартов кода
4. Добавьте тесты и документацию
5. Используйте TypeScript строго
6. Создайте Pull Request

## 📄 Лицензия

MIT License - см. файл LICENSE для деталей.

## 🆘 Поддержка

Если у вас есть вопросы или проблемы:

### 🔧 Устранение неполадок
Подробная документация по решению проблем: [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)

### Быстрая диагностика
```bash
# Тест подключения к базе данных
npm run test:db

# Проверка API endpoints
curl http://localhost:3000/api/test-db
curl http://localhost:3000/api/test-env

# Проверка логов
ls -la logs/
```

### Создание Issue
1. Проверьте документацию по устранению неполадок
2. Запустите диагностические скрипты
3. Просмотрите логи системы
4. Создайте Issue в GitHub с подробным описанием проблемы

## 🚀 Следующие шаги

### Для продакшена
1. ✅ Интегрировать реальную базу данных (PostgreSQL)
2. ✅ Добавить загрузку изображений (Cloudinary)
3. ✅ Оптимизировать производительность (React.memo, динамические импорты)
4. ✅ Система логирования (Winston с ротацией)
5. 🔄 Добавить аутентификацию (Supabase Auth)
6. 🔄 Реализовать push-уведомления
7. 🔄 Создать мобильное приложение

### Для разработки
1. 🔄 Добавить тесты (Jest, React Testing Library)
2. 🔄 Настроить CI/CD пайплайн
3. 🔄 Добавить Storybook для компонентов
4. 🔄 Реализовать PWA функциональность
5. 🔄 Добавить E2E тесты (Playwright)

## 📈 Версии

Текущая версия: **1.0.11**

Последние изменения:
- ✅ Полная интеграция Winston с ротацией логов
- ✅ Оптимизация производительности с React.memo
- ✅ Динамические импорты для code splitting
- ✅ Интерактивные UI компоненты
- ✅ Система загрузки изображений с Cloudinary

Подробная история изменений: [CHANGELOG.md](./CHANGELOG.md)

---

**Создано с ❤️ для эффективного управления б/у запчастями**

*Готово к использованию и дальнейшей разработке!*
