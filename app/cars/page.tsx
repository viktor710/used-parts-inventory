"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Car, BodyType, FuelType } from '@/types';
import { 
  Car as CarIcon, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Gauge,
  Hash,
  Palette
} from 'lucide-react';

/**
 * Компонент карточки автомобиля
 */
const CarCard: React.FC<{ car: Car }> = ({ car }) => {
  console.log('🔧 [DEBUG] CarCard: Рендеринг карточки автомобиля:', car);

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
            <Button variant="outline" size="sm">
              Просмотр
            </Button>
            <Button variant="outline" size="sm">
              Редактировать
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Страница автомобилей
 */
export default function CarsPage() {
  console.log('🔧 [DEBUG] CarsPage: Компонент рендерится');
  
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterYear, setFilterYear] = useState('');

  // Загрузка автомобилей
  useEffect(() => {
    const fetchCars = async () => {
      try {
        console.log('🔧 [DEBUG] CarsPage: Загрузка автомобилей');
        const response = await fetch('/api/cars');
        const result = await response.json();
        
        if (result.success) {
          setCars(result.data.cars);
        } else {
          console.error('Ошибка при загрузке автомобилей:', result.error);
        }
      } catch (error) {
        console.error('Ошибка при загрузке автомобилей:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Фильтрация автомобилей
  const filteredCars = cars.filter(car => {
    const matchesSearch = car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         car.vin.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBrand = !filterBrand || car.brand.toLowerCase().includes(filterBrand.toLowerCase());
    const matchesYear = !filterYear || car.year.toString() === filterYear;
    
    return matchesSearch && matchesBrand && matchesYear;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-neutral-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-neutral-200 rounded"></div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Заголовок и кнопки */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Автомобили</h1>
              <p className="text-neutral-600 mt-1">
                Управление автомобилями в системе учета запчастей
              </p>
            </div>
            <Link href="/cars/new">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Добавить автомобиль
              </Button>
            </Link>
          </div>

          {/* Фильтры и поиск */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Поиск по бренду, модели, VIN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Фильтр по бренду"
                    value={filterBrand}
                    onChange={(e) => setFilterBrand(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Фильтр по году"
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Сбросить фильтры
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Список автомобилей */}
          {filteredCars.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CarIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  Автомобили не найдены
                </h3>
                <p className="text-neutral-600 mb-4">
                  {cars.length === 0 
                    ? 'В системе пока нет автомобилей. Добавьте первый автомобиль для начала работы.'
                    : 'Попробуйте изменить параметры поиска или фильтры.'
                  }
                </p>
                {cars.length === 0 && (
                  <Link href="/cars/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить первый автомобиль
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
