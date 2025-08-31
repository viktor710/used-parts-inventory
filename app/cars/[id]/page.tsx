"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { Toast } from '@/components/ui/Toast';
import { Car, BodyType, FuelType } from '@/types';

import { 
  Car as CarIcon, 
  Edit, 
  Trash2, 
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';

/**
 * Страница просмотра автомобиля
 */
export default function CarDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
    show: boolean;
  }>({ type: 'success', message: '', show: false });

  // Загрузка данных автомобиля
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`/api/cars/${params.id}`);
        const result = await response.json();
        
        if (result.success) {
          setCar(result.data);
        } else {
          setError(result.error || 'Ошибка при загрузке автомобиля');
        }
      } catch (error) {
        setError('Ошибка при загрузке автомобиля');
        console.error('Ошибка при загрузке автомобиля:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [params.id]);

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

  // Функция удаления автомобиля
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/cars/${params.id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setToast({
          type: 'success',
          message: 'Автомобиль успешно удален',
          show: true
        });
        
        // Перенаправление на страницу автомобилей через 1 секунду
        setTimeout(() => {
          router.push('/cars');
        }, 1000);
      } else {
        setToast({
          type: 'error',
          message: result.error || 'Ошибка при удалении автомобиля',
          show: true
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Ошибка при удалении автомобиля',
        show: true
      });
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-neutral-200 rounded w-1/4 mb-6"></div>
              <div className="h-64 bg-neutral-200 rounded mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-48 bg-neutral-200 rounded"></div>
                <div className="h-48 bg-neutral-200 rounded"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  Ошибка загрузки
                </h3>
                <p className="text-neutral-600 mb-4">
                  {error || 'Автомобиль не найден'}
                </p>
                <Link href="/cars">
                  <Button>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Вернуться к списку
                  </Button>
                </Link>
              </CardContent>
            </Card>
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
            <div className="flex items-center gap-4">
              <Link href="/cars">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  {car.brand} {car.model}
                </h1>
                <p className="text-sm text-neutral-500">
                  ID: {car.id}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/cars/${car.id}/edit`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Редактировать
                </Button>
              </Link>
              <Button 
                variant="danger" 
                className="flex items-center gap-2"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="w-4 h-4" />
                Удалить
              </Button>
            </div>
          </div>

          {/* Основная информация */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Изображения */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Изображения автомобиля</CardTitle>
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
                    <div className="text-center py-8 text-neutral-500">
                      <CarIcon className="w-12 h-12 mx-auto mb-2" />
                      <p>Изображения не загружены</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Детали автомобиля */}
            <div className="space-y-6">
              {/* Основные характеристики */}
              <Card>
                <CardHeader>
                  <CardTitle>Основные характеристики</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Год выпуска</span>
                    <Badge variant="default">{car.year}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Тип кузова</span>
                    <Badge variant="info">{getBodyTypeLabel(car.bodyType)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Тип топлива</span>
                    <Badge variant="info">{getFuelTypeLabel(car.fuelType)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Объем двигателя</span>
                    <span className="font-medium">{car.engineVolume}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Трансмиссия</span>
                    <span className="font-medium">{car.transmission}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Цвет</span>
                    <span className="font-medium">{car.color}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Пробег</span>
                    <span className="font-medium">{car.mileage.toLocaleString()} км</span>
                  </div>
                </CardContent>
              </Card>

              {/* VIN и описание */}
              <Card>
                <CardHeader>
                  <CardTitle>Дополнительная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">VIN номер</label>
                    <p className="text-sm text-neutral-600 font-mono bg-neutral-100 p-2 rounded mt-1">
                      {car.vin}
                    </p>
                  </div>
                  
                  {car.description && (
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Описание</label>
                      <p className="text-sm text-neutral-600 mt-1">
                        {car.description}
                      </p>
                    </div>
                  )}
                  
                  {car.notes && (
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Заметки</label>
                      <p className="text-sm text-neutral-600 mt-1">
                        {car.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Даты */}
              <Card>
                <CardHeader>
                  <CardTitle>Системная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Создано:</span>
                    <span>{new Date(car.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Обновлено:</span>
                    <span>{new Date(car.updatedAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Модальное окно подтверждения удаления */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Подтверждение удаления
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 mb-4">
                Вы уверены, что хотите удалить автомобиль <strong>{car.brand} {car.model}</strong>?
                Это действие нельзя отменить.
              </p>
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                >
                  Отмена
                </Button>
                                 <Button 
                   variant="danger" 
                   onClick={handleDelete}
                   disabled={deleting}
                   className="flex items-center gap-2"
                 >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Удаление...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Удалить
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Toast уведомления */}
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
