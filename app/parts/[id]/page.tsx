"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CategoryBadge, ConditionBadge, StatusBadge } from '@/components/ui/Badge';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { DebugPanel } from '@/components/debug/DebugPanel';
import { ToastContainer, useToast } from '@/components/ui/Toast';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Eye,
  Car,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  User,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { Part, Car as CarType } from '@/types';

/**
 * Страница просмотра запчасти
 */
export default function PartDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toasts, removeToast, showSuccess, showError } = useToast();
  
  const [part, setPart] = useState<Part | null>(null);
  const [car, setCar] = useState<CarType | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const partId = params['id'] as string;

  // Загрузка данных запчасти
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔧 [DEBUG] Загрузка данных запчасти для ID:', partId);
        setLoading(true);
        
        const response = await fetch(`/api/parts/${partId}`);
        console.log('🔧 [DEBUG] Ответ API:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error('Запчасть не найдена');
        }

        const result = await response.json();
        console.log('🔧 [DEBUG] Результат API:', result);

        if (result.success) {
          const partData = result.data;
          console.log('🔧 [DEBUG] Данные запчасти:', partData);
          setPart(partData);
          
          // Загружаем информацию об автомобиле
          if (partData.carId) {
            console.log('🔧 [DEBUG] Загрузка автомобиля для carId:', partData.carId);
            const carResponse = await fetch(`/api/cars/${partData.carId}`);
            console.log('🔧 [DEBUG] Ответ API автомобиля:', carResponse.status, carResponse.statusText);
            if (carResponse.ok) {
              const carResult = await carResponse.json();
              console.log('🔧 [DEBUG] Результат API автомобиля:', carResult);
              if (carResult.success) {
                setCar(carResult.data);
              }
            }
          }
        } else {
          throw new Error(result.error || 'Ошибка загрузки данных');
        }
      } catch (error) {
        console.error('❌ Ошибка загрузки данных:', error);
        setError(error instanceof Error ? error.message : 'Ошибка загрузки данных');
        showError('Ошибка', 'Не удалось загрузить данные запчасти');
      } finally {
        setLoading(false);
      }
    };

    if (partId) {
      fetchData();
    }
  }, [partId]); // Убрали showError из зависимостей

  // Обработка удаления запчасти
  const handleDelete = async () => {
    if (!part) return;

    try {
      setDeleting(true);

      const response = await fetch(`/api/parts/${part.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        showSuccess('Успешно', 'Запчасть удалена');
        router.push('/parts');
      } else {
        throw new Error(result.error || 'Ошибка удаления');
      }
    } catch (error) {
      console.error('Ошибка удаления запчасти:', error);
      showError('Ошибка', error instanceof Error ? error.message : 'Ошибка удаления запчасти');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Обработка перехода к редактированию
  const handleEdit = () => {
    if (part) {
      router.push(`/parts/${part.id}/edit`);
    }
  };

  // Обработка возврата к списку
  const handleBack = () => {
    router.push('/parts');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-neutral-600">Загрузка данных запчасти...</p>
                <p className="text-sm text-neutral-500 mt-2">ID: {partId}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !part) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">Ошибка загрузки</h2>
                <p className="text-neutral-600 mb-4">{error || 'Запчасть не найдена'}</p>
                <p className="text-sm text-neutral-500 mb-4">ID: {partId}</p>
                <Button onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Вернуться к списку
                </Button>
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
          <div className="max-w-4xl mx-auto">
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="text-neutral-600 hover:text-neutral-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
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
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Редактировать
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Удалить
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Основная информация */}
              <div className="lg:col-span-2 space-y-6">
                {/* Изображения */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
                      Изображения
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {part.images && part.images.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {part.images.slice(0, 6).map((image, index) => (
                          <div
                            key={index}
                            className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setShowGallery(true)}
                          >
                            <img
                              src={image}
                              alt={`${part.zapchastName} - изображение ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {part.images.length > 6 && (
                          <div className="aspect-square rounded-lg bg-neutral-100 flex items-center justify-center">
                            <span className="text-sm text-neutral-600">
                              +{part.images.length - 6} еще
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                        <p className="text-neutral-600">Изображения не добавлены</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Описание */}
                <Card>
                  <CardHeader>
                    <CardTitle>Описание</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {part.description ? (
                      <p className="text-neutral-700 whitespace-pre-wrap">
                        {part.description}
                      </p>
                    ) : (
                      <p className="text-neutral-500 italic">
                        Описание не добавлено
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Заметки */}
                {part.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Заметки</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutral-700 whitespace-pre-wrap">
                        {part.notes}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Боковая панель */}
              <div className="space-y-6">
                {/* Статус и категория */}
                <Card>
                  <CardHeader>
                    <CardTitle>Статус</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <CategoryBadge category={part.category} />
                      <ConditionBadge condition={part.condition} />
                      <StatusBadge status={part.status} />
                    </div>
                  </CardContent>
                </Card>

                {/* Цена */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Цена
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-neutral-600">Цена продажи</p>
                      <p className="text-2xl font-bold text-primary">
                        ₽{part.price.toLocaleString()}
                      </p>
                    </div>
                    {part.purchasePrice > 0 && (
                      <div>
                        <p className="text-sm text-neutral-600">Цена приобретения</p>
                        <p className="text-lg font-semibold text-neutral-700">
                          ₽{part.purchasePrice.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Автомобиль */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Car className="w-5 h-5 mr-2" />
                      Автомобиль
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {car ? (
                      <div className="space-y-2">
                        <p className="font-semibold text-neutral-900">
                          {car.brand} {car.model}
                        </p>
                        <p className="text-sm text-neutral-600">
                          Год: {car.year}
                        </p>
                        <p className="text-sm text-neutral-600">
                          Двигатель: {car.engineVolume}
                        </p>
                      </div>
                    ) : (
                      <p className="text-neutral-500 italic">
                        Автомобиль не найден
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Местоположение */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Местоположение
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-700">
                      {part.location || 'Не указано'}
                    </p>
                  </CardContent>
                </Card>

                {/* Поставщик */}
                {part.supplier && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Поставщик
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutral-700">
                        {part.supplier}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Дата приобретения */}
                {part.purchaseDate && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Дата приобретения
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutral-700">
                        {new Date(part.purchaseDate).toLocaleDateString('ru-RU')}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Даты создания и обновления */}
                <Card>
                  <CardHeader>
                    <CardTitle>Системная информация</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <p className="text-neutral-600">Создано:</p>
                      <p className="text-neutral-700">
                        {new Date(part.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-600">Обновлено:</p>
                      <p className="text-neutral-700">
                        {new Date(part.updatedAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Модальное окно подтверждения удаления */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-neutral-900">
                Подтверждение удаления
              </h3>
            </div>
            <p className="text-neutral-600 mb-6">
              Вы уверены, что хотите удалить запчасть "{part.zapchastName}"? 
              Это действие нельзя отменить.
            </p>
            <div className="flex justify-end space-x-3">
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
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Удаление...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Удалить
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Галерея изображений */}
      {showGallery && part.images && part.images.length > 0 && (
        <ImageGallery
          images={part.images}
        />
      )}

      {/* Отладочная панель */}
      {process.env.NODE_ENV === 'development' && (
        <DebugPanel />
      )}

      {/* Уведомления */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
