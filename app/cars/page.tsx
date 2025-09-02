import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CarsPageHeader } from '@/components/ui/PageHeader';
import { getAllCars } from '@/lib/cars';
import { Car, BodyType, FuelType } from '@/types';

import { 
  Car as CarIcon, 
  Plus, 
  Calendar,
  Gauge,
  Hash,
  Palette
} from 'lucide-react';

/**
 * Компонент карточки автомобиля
 */
const CarCard: React.FC<{ car: Car }> = ({ car }) => {
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

  return (
    <Card className="card-hover">
      {/* Изображения автомобиля */}
      {car.images && Array.isArray(car.images) && car.images.length > 0 && (
        <div className="p-4 pb-0">
          <div className="relative h-32 bg-neutral-100 rounded-lg overflow-hidden mb-3">
            <Image
              src={car.images[0] || ''}
              alt={`${car.brand} ${car.model}`}
              fill
              className="object-cover"
            />
            {car.images.length > 1 && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                +{car.images.length - 1}
              </div>
            )}
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {car.brand} {car.model}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="default" className="text-xs">
              {car.year}
            </Badge>
            <Badge variant="info" className="text-xs">
              {getBodyTypeLabel(car.bodyType)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-neutral-500" />
            <span>{car.engineVolume}</span>
          </div>
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-neutral-500" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-2">
            <CarIcon className="w-4 h-4 text-neutral-500" />
            <span>{getFuelTypeLabel(car.fuelType)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-neutral-500" />
            <span>{car.color}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Calendar className="w-4 h-4" />
          <span>Пробег: {car.mileage.toLocaleString()} км</span>
        </div>
        
        {car.description && (
          <p className="text-sm text-neutral-600 line-clamp-2">
            {car.description}
          </p>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-neutral-500">
            VIN: {car.vin}
          </div>
          <div className="flex gap-2">
            <Link href={`/cars/${car.id}`}>
              <Button variant="outline" size="sm">
                Просмотр
              </Button>
            </Link>
            <Link href={`/cars/${car.id}/edit`}>
              <Button variant="outline" size="sm">
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
 * Страница автомобилей (статическая)
 */
export default async function CarsPage() {
  // Отладочная информация
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 [DEBUG] CarsPage: Компонент рендерится (статический)');
  }

  // Получаем автомобили на сервере
  const cars = await getAllCars();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Заголовок и кнопки */}
          <CarsPageHeader
            title="Автомобили"
            subtitle="Управление автомобилями в системе учета запчастей"
            count={cars.length}
          >
            <Link href="/cars/new">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Добавить автомобиль
              </Button>
            </Link>
          </CarsPageHeader>

          {/* Информация о фильтрации */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="text-sm text-neutral-600">
                <p>Для поиска и фильтрации используйте браузер (Ctrl+F) или добавьте клиентские компоненты для интерактивности.</p>
              </div>
            </CardContent>
          </Card>

          {/* Список автомобилей */}
          {cars.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CarIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  Автомобили не найдены
                </h3>
                <p className="text-neutral-600 mb-4">
                  В системе пока нет автомобилей. Добавьте первый автомобиль для начала работы.
                </p>
                <Link href="/cars/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить первый автомобиль
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
