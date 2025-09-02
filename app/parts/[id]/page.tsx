import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CategoryBadge, ConditionBadge, StatusBadge } from '@/components/ui/Badge';
import { DebugPanel } from '@/components/debug/DebugPanel';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Eye,
  Car,
  Package
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

// Убираем generateStaticParams для избежания проблем с подключением к БД во время сборки
// Страница будет рендериться динамически

// Получаем данные запчасти на сервере
async function getPartData(id: string) {
  try {
    const part = await prisma.part.findUnique({
      where: { id },
      include: {
        car: true
      }
    });
    
    if (!part) {
      return null;
    }
    
    return part;
  } catch (error) {
    console.error('Ошибка при получении данных запчасти:', error);
    return null;
  }
}

// Генерируем метаданные для SEO
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const part = await getPartData(params.id);
  
  if (!part) {
    return {
      title: 'Запчасть не найдена',
      description: 'Запрашиваемая запчасть не найдена в системе'
    };
  }

  const carInfo = part.car ? ` для ${part.car.brand} ${part.car.model} (${part.car.year})` : '';

  return {
    title: `${part.zapchastName} - Детали запчасти`,
    description: `Подробная информация о запчасти ${part.zapchastName}${carInfo}. Цена: ${part.price} ₽, состояние: ${part.condition}`,
    keywords: [part.zapchastName, part.category, 'запчасть', 'автозапчасти', part.car?.brand, part.car?.model].filter(Boolean),
    openGraph: {
      title: `${part.zapchastName} - Запчасть`,
      description: `Запчасть ${part.zapchastName}${carInfo}`,
      type: 'website',
    }
  };
}

/**
 * Страница просмотра запчасти (серверный компонент)
 */
export default async function PartDetailPage({ params }: { params: { id: string } }) {
  const part = await getPartData(params.id);
  
  if (!part) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Link href="/parts">
                  <Button
                    variant="ghost"
                    className="text-neutral-600 hover:text-neutral-900"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900">
                    {part.zapchastName}
                  </h1>
                  <p className="text-neutral-600">
                    Детальная информация о запчасти
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link href={`/parts/${part.id}/edit`}>
                  <Button
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Редактировать
                  </Button>
                </Link>
                <Link href={`/parts/${part.id}/delete`}>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Удалить
                  </Button>
                </Link>
              </div>
            </div>

            {/* Основная информация */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Изображения */}
              <Card>
                <CardHeader>
                  <CardTitle>Изображения</CardTitle>
                </CardHeader>
                <CardContent>
                  {part.images && part.images.length > 0 ? (
                    <div className="space-y-4">
                      {part.images.map((image, index) => (
                        <div key={index} className="relative h-64 bg-neutral-100 rounded-lg overflow-hidden">
                          <Image
                            src={image}
                            alt={`${part.zapchastName} - изображение ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Package className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                        <p className="text-neutral-600">Нет изображений</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Характеристики */}
              <Card>
                <CardHeader>
                  <CardTitle>Характеристики</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Название</label>
                        <p className="text-lg">{part.zapchastName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Категория</label>
                        <div className="mt-1">
                          <CategoryBadge category={part.category} />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Состояние</label>
                        <div className="mt-1">
                          <ConditionBadge condition={part.condition} />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Статус</label>
                        <div className="mt-1">
                          <StatusBadge status={part.status} />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Цена</label>
                        <p className="text-lg font-semibold text-primary">
                          {part.price.toLocaleString('ru-RU')} ₽
                        </p>
                      </div>

                    </div>
                    
                    {part.location && (
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Местоположение</label>
                        <p className="text-lg">{part.location}</p>
                      </div>
                    )}
                    
                    {part.supplier && (
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Поставщик</label>
                        <p className="text-lg">{part.supplier}</p>
                      </div>
                    )}
                    
                    {part.description && (
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Описание</label>
                        <p className="text-neutral-700">{part.description}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Информация об автомобиле */}
            {part.car && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Car className="w-5 h-5 mr-2" />
                    Автомобиль
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Бренд</label>
                      <p className="text-lg">{part.car.brand}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Модель</label>
                      <p className="text-lg">{part.car.model}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Год выпуска</label>
                      <p className="text-lg">{part.car.year}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href={`/cars/${part.car.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Просмотреть автомобиль
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Дополнительная информация */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Дополнительная информация</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-neutral-600">Дата добавления</label>
                    <p>{new Date(part.createdAt).toLocaleDateString('ru-RU')}</p>
                  </div>
                  <div>
                    <label className="font-medium text-neutral-600">Последнее обновление</label>
                    <p>{new Date(part.updatedAt).toLocaleDateString('ru-RU')}</p>
                  </div>
                  <div>
                    <label className="font-medium text-neutral-600">ID в системе</label>
                    <p className="font-mono text-xs">{part.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Отладочная панель */}
      {process.env.NODE_ENV === 'development' && (
        <DebugPanel />
      )}
    </div>
  );
}
