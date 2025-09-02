import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

import dynamic from 'next/dynamic';

// Динамический импорт ImageGallery для избежания проблем с SSR
const ImageGallery = dynamic(() => import('@/components/ui/ImageGallery').then(mod => ({ default: mod.ImageGallery })), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 rounded-lg h-32"></div>
});
import { BodyType, FuelType } from '@/types';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

import { 
  Car as CarIcon, 
  Edit, 
  Trash2, 
  ArrowLeft
} from 'lucide-react';

// Убираем generateStaticParams для избежания проблем с подключением к БД во время сборки
// Страница будет рендериться динамически

// Получаем данные автомобиля на сервере
async function getCarData(id: string) {
  console.log('🔧 [DEBUG] getCarData: Запрос автомобиля с ID:', id);
  
  try {
    const car = await prisma.car.findUnique({
      where: { id }
    });
    
    if (!car) {
      console.log('🔧 [DEBUG] getCarData: Автомобиль не найден');
      return null;
    }
    
    console.log('🔧 [DEBUG] getCarData: Автомобиль найден:', car.brand, car.model);
    return car;
  } catch (error) {
    console.error('Ошибка при получении данных автомобиля:', error);
    return null;
  }
}

// Генерируем метаданные для SEO
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const car = await getCarData(params.id);
  
  if (!car) {
    return {
      title: 'Автомобиль не найден',
      description: 'Запрашиваемый автомобиль не найден в системе'
    };
  }

  return {
    title: `${car.brand} ${car.model} (${car.year}) - Детали автомобиля`,
    description: `Подробная информация об автомобиле ${car.brand} ${car.model} ${car.year} года выпуска. VIN: ${car.vin}, пробег: ${car.mileage} км`,
    keywords: [`${car.brand}`, `${car.model}`, 'автомобиль', 'запчасти', 'VIN', `${car.year}`],
    openGraph: {
      title: `${car.brand} ${car.model} (${car.year})`,
      description: `Автомобиль ${car.brand} ${car.model} ${car.year} года выпуска`,
      type: 'website',
    }
  };
}

// Функции для перевода типов
const getBodyTypeLabel = (type: BodyType): string => {
  const labels: Record<BodyType, string> = {
    sedan: 'Седан',
    hatchback: 'Хэтчбек',
    wagon: 'Универсал',
    suv: 'Внедорожник',
    coupe: 'Купе',
    convertible: 'Кабриолет',
    pickup: 'Пикап',
    van: 'Минивэн',
    other: 'Прочее'
  };
  return labels[type];
};

const getFuelTypeLabel = (type: FuelType): string => {
  const labels: Record<FuelType, string> = {
    gasoline: 'Бензин',
    diesel: 'Дизель',
    hybrid: 'Гибрид',
    electric: 'Электро',
    lpg: 'Газ',
    other: 'Прочее'
  };
  return labels[type];
};

/**
 * Страница просмотра автомобиля (серверный компонент)
 */
export default async function CarDetailPage({ params }: { params: { id: string } }) {
  console.log('🔧 [DEBUG] CarDetailPage: Рендеринг страницы для ID:', params.id);
  
  const car = await getCarData(params.id);
  
  if (!car) {
    console.log('🔧 [DEBUG] CarDetailPage: Автомобиль не найден, показываем 404');
    notFound();
  }
  
  console.log('🔧 [DEBUG] CarDetailPage: Автомобиль найден, рендерим страницу');

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Заголовок и кнопки */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/cars">
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
                  {car.brand} {car.model}
                </h1>
                <p className="text-neutral-600">
                  Детальная информация об автомобиле
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href={`/cars/${car.id}/edit`}>
                <Button
                  variant="outline"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Редактировать
                </Button>
              </Link>
              <Link href={`/cars/${car.id}/delete`}>
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
                {car.images && car.images.length > 0 ? (
                  <ImageGallery 
                    images={car.images} 
                    alt={`Изображения автомобиля ${car.brand} ${car.model}`}
                    maxPreview={5}
                    showCount={true}
                  />
                ) : (
                  <div className="h-64 bg-neutral-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <CarIcon className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
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
                      <label className="text-sm font-medium text-neutral-600">Бренд</label>
                      <p className="text-lg">{car.brand}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Модель</label>
                      <p className="text-lg">{car.model}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Год выпуска</label>
                      <p className="text-lg">{car.year}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Тип кузова</label>
                      <p className="text-lg">{getBodyTypeLabel(car.bodyType)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Объем двигателя</label>
                      <p className="text-lg">{car.engineVolume}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Трансмиссия</label>
                      <p className="text-lg">{car.transmission}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Тип топлива</label>
                      <p className="text-lg">{getFuelTypeLabel(car.fuelType)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Цвет</label>
                      <p className="text-lg">{car.color}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-neutral-600">Пробег</label>
                    <p className="text-lg">{car.mileage.toLocaleString()} км</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-neutral-600">VIN</label>
                    <p className="text-lg font-mono">{car.vin}</p>
                  </div>
                  
                  {car.description && (
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Описание</label>
                      <p className="text-neutral-700">{car.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Дополнительная информация */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Дополнительная информация</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <label className="font-medium text-neutral-600">Дата добавления</label>
                  <p>{new Date(car.createdAt).toLocaleDateString('ru-RU')}</p>
                </div>
                <div>
                  <label className="font-medium text-neutral-600">Последнее обновление</label>
                  <p>{new Date(car.updatedAt).toLocaleDateString('ru-RU')}</p>
                </div>
                <div>
                  <label className="font-medium text-neutral-600">ID в системе</label>
                  <p className="font-mono text-xs">{car.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
