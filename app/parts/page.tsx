import React from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CategoryBadge, ConditionBadge, StatusBadge } from '@/components/ui/Badge';
import { DebugPanel } from '@/components/debug/DebugPanel';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { Part } from '@/types';

/**
 * Моковые данные для демонстрации
 */
const mockParts: Part[] = [
  {
    id: '1',
    name: 'Двигатель BMW M54',
    category: 'engine',
    brand: 'BMW',
    model: 'E46',
    year: 2003,
    condition: 'good',
    status: 'available',
    price: 85000,
    description: 'Двигатель BMW M54 2.5L в хорошем состоянии',
    location: 'Склад А, полка 1',
    supplier: 'Авторазборка BMW',
    purchaseDate: new Date('2024-01-15'),
    purchasePrice: 65000,
    images: [],
    notes: 'Проверен, готов к установке',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Коробка передач 5MT',
    category: 'transmission',
    brand: 'Toyota',
    model: 'Camry',
    year: 2010,
    condition: 'excellent',
    status: 'reserved',
    price: 45000,
    description: 'Механическая коробка передач в отличном состоянии',
    location: 'Склад Б, полка 3',
    supplier: 'Toyota Parts',
    purchaseDate: new Date('2024-01-10'),
    purchasePrice: 35000,
    images: [],
    notes: 'Зарезервирована для клиента',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '3',
    name: 'Тормозные колодки',
    category: 'brakes',
    brand: 'Brembo',
    model: 'Универсальные',
    year: 2020,
    condition: 'excellent',
    status: 'sold',
    price: 8000,
    description: 'Передние тормозные колодки Brembo',
    location: 'Склад А, полка 5',
    supplier: 'Brembo Official',
    purchaseDate: new Date('2024-01-05'),
    purchasePrice: 6000,
    images: [],
    notes: 'Проданы 15.01.2024',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15'),
  },
];

/**
 * Компонент карточки запчасти
 */
const PartCard: React.FC<{ part: Part }> = ({ part }) => {
  // Отладочная информация
  console.log('🔧 [DEBUG] PartCard: Рендеринг карточки запчасти:', part.id, part.name);
  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              {part.name}
            </h3>
            <p className="text-sm text-neutral-600 mb-3">
              {part.brand} {part.model} ({part.year})
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              <CategoryBadge category={part.category} />
              <ConditionBadge condition={part.condition} />
              <StatusBadge status={part.status} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              ₽{part.price.toLocaleString()}
            </p>
            <p className="text-sm text-neutral-500">
              Место: {part.location}
            </p>
          </div>
        </div>
        
        <p className="text-sm text-neutral-700 mb-4 line-clamp-2">
          {part.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-500">
            Поставщик: {part.supplier}
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-error hover:text-error">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Компонент фильтров
 */
const Filters: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Фильтры
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Поиск */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Поиск
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Название, бренд, модель..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Категория */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Категория
            </label>
            <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="">Все категории</option>
              <option value="engine">Двигатель</option>
              <option value="transmission">Трансмиссия</option>
              <option value="suspension">Подвеска</option>
              <option value="brakes">Тормоза</option>
              <option value="electrical">Электрика</option>
              <option value="body">Кузов</option>
              <option value="interior">Салон</option>
              <option value="exterior">Внешние элементы</option>
              <option value="other">Прочее</option>
            </select>
          </div>

          {/* Статус */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Статус
            </label>
            <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="">Все статусы</option>
              <option value="available">Доступна</option>
              <option value="reserved">Зарезервирована</option>
              <option value="sold">Продана</option>
              <option value="scrapped">Утилизирована</option>
            </select>
          </div>
        </div>

        {/* Дополнительные фильтры */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Цена от
            </label>
            <input
              type="number"
              placeholder="₽"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Цена до
            </label>
            <input
              type="number"
              placeholder="₽"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Год
            </label>
            <input
              type="number"
              placeholder="Год выпуска"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Кнопки фильтров */}
        <div className="flex justify-between items-center mt-6">
          <Button variant="outline">
            Сбросить фильтры
          </Button>
          <Button variant="primary">
            Применить фильтры
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Страница списка запчастей
 */
export default function PartsPage() {
  // Отладочная информация
  console.log('🔧 [DEBUG] PartsPage: Компонент рендерится');
  console.log('🔧 [DEBUG] PartsPage: Загружено запчастей:', mockParts.length);
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container-custom py-8">
            {/* Заголовок страницы */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                  Запчасти
                </h1>
                <p className="text-neutral-600">
                  Управление инвентарем б/у запчастей
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Импорт
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Экспорт
                </Button>
                <Button variant="primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить запчасть
                </Button>
              </div>
            </div>

            {/* Фильтры */}
            <div className="mb-8">
              <Filters />
            </div>

            {/* Панель управления */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-neutral-600">
                  Найдено: {mockParts.length} запчастей
                </span>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="bg-primary text-white">
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-neutral-600">Сортировка:</span>
                <select className="text-sm border border-neutral-300 rounded px-2 py-1">
                  <option>По дате добавления</option>
                  <option>По цене (возрастание)</option>
                  <option>По цене (убывание)</option>
                  <option>По названию</option>
                </select>
              </div>
            </div>

            {/* Список запчастей */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockParts.map((part) => (
                <PartCard key={part.id} part={part} />
              ))}
            </div>

            {/* Пагинация */}
            <div className="flex items-center justify-between mt-8">
              <div className="text-sm text-neutral-600">
                Показано 1-{mockParts.length} из {mockParts.length} запчастей
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Предыдущая
                </Button>
                <Button variant="primary" size="sm">1</Button>
                <Button variant="outline" size="sm" disabled>
                  Следующая
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Панель отладки */}
      <DebugPanel />
    </div>
  );
}
