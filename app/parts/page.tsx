import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CategoryBadge, ConditionBadge, StatusBadge } from '@/components/ui/Badge';
import { PartsPageHeader } from '@/components/ui/PageHeader';
import { getAllParts } from '@/lib/parts';
import { 
  Plus, 
  Eye,
  Edit,
  Package
} from 'lucide-react';
import { Part, Car } from '@/types';

/**
 * Компонент карточки запчасти (статический)
 */
const PartCard: React.FC<{ part: Part; car?: Car | null }> = ({ part, car }) => {
  // Отладочная информация
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 [DEBUG] PartCard: Рендеринг карточки запчасти:', part.id, part.zapchastName);
  }
  
  return (
    <Card className="card-hover group">
      {/* Изображения запчасти */}
      <div className="relative">
        {part.images && part.images.length > 0 ? (
          <div className="p-4 pb-0">
            <div className="relative h-32 bg-neutral-100 rounded-lg overflow-hidden mb-3">
              <Image
                src={part.images[0] || ''}
                alt={part.zapchastName}
                fill
                className="object-cover"
              />
              {part.images.length > 1 && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  +{part.images.length - 1}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 pb-0">
            <div className="h-32 bg-neutral-100 rounded-lg flex items-center justify-center mb-3">
              <Package className="w-8 h-8 text-neutral-400" />
            </div>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {part.zapchastName}
          </CardTitle>
          <div className="flex gap-2">
            <CategoryBadge category={part.category} />
            <ConditionBadge condition={part.condition} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Информация о запчасти */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Цена:</span>
            <span className="font-semibold text-lg">
              {part.price.toLocaleString('ru-RU')} ₽
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Статус:</span>
            <StatusBadge status={part.status} />
          </div>
          

        </div>
        
        {/* Информация об автомобиле */}
        {car && (
          <div className="pt-2 border-t border-neutral-200">
            <div className="text-sm text-neutral-600 mb-1">Автомобиль:</div>
            <div className="text-sm font-medium">
              {car.brand} {car.model} ({car.year})
            </div>
          </div>
        )}
        
        {/* Описание */}
        {part.description && (
          <p className="text-sm text-neutral-600 line-clamp-2">
            {part.description}
          </p>
        )}
        
        {/* Кнопки действий */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-neutral-500">
            ID: {part.id.slice(0, 8)}...
          </div>
          <div className="flex gap-2">
            <Link href={`/parts/${part.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                Просмотр
              </Button>
            </Link>
            <Link href={`/parts/${part.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" />
                Редактировать
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Страница запчастей (статическая)
 */
export default async function PartsPage() {
  // Отладочная информация
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 [DEBUG] PartsPage: Компонент рендерится (статический)');
  }

  // Получаем запчасти на сервере
  const parts = await getAllParts();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Заголовок и кнопки */}
          <PartsPageHeader
            title="Запчасти"
            subtitle="Управление запчастями в системе учета"
            count={parts.length}
          >
            <div className="flex gap-2">
              <Link href="/parts/new">
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Добавить запчасть
                </Button>
              </Link>
            </div>
          </PartsPageHeader>

          {/* Информация о фильтрации */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="text-sm text-neutral-600">
                <p>Для поиска и фильтрации используйте браузер (Ctrl+F) или добавьте клиентские компоненты для интерактивности.</p>
              </div>
            </CardContent>
          </Card>

          {/* Список запчастей */}
          {parts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  Запчасти не найдены
                </h3>
                <p className="text-neutral-600 mb-4">
                  В системе пока нет запчастей. Добавьте первую запчасть для начала работы.
                </p>
                <Link href="/parts/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить первую запчасть
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parts.map((part) => (
                <PartCard key={part.id} part={part} car={part.car} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
