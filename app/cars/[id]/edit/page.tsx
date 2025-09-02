"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Toast } from '@/components/ui/Toast';
import { Car, BodyType, FuelType, UpdateCarInput } from '@/types';

import { 
  ArrowLeft,
  Save,
  X,
  AlertTriangle
} from 'lucide-react';

/**
 * Страница редактирования автомобиля
 */
export default function EditCarPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
    show: boolean;
  }>({ type: 'success', message: '', show: false });

  // Состояние формы
  const [formData, setFormData] = useState<UpdateCarInput>({
    brand: '',
    model: '',
    year: 0,
    bodyType: 'sedan',
    fuelType: 'gasoline',
    engineVolume: '',
    transmission: '',
    mileage: 0,
    vin: '',
    color: '',
    description: '',
    notes: '',
    images: []
  });

  // Загрузка данных автомобиля
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`/api/cars/${params.id}`);
        const result = await response.json();
        
        if (result.success) {
          setCar(result.data);
          setFormData({
            brand: result.data.brand,
            model: result.data.model,
            year: result.data.year,
            bodyType: result.data.bodyType,
            fuelType: result.data.fuelType,
            engineVolume: result.data.engineVolume,
            transmission: result.data.transmission,
            mileage: result.data.mileage,
            vin: result.data.vin,
            color: result.data.color,
            description: result.data.description || '',
            notes: result.data.notes || '',
            images: result.data.images || []
          });
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

  // Обработчики изменения полей формы
  const handleInputChange = (field: keyof UpdateCarInput, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Обработчик изменения изображений
  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
  };

  // Валидация формы
  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.brand?.trim()) errors.push('Бренд обязателен');
    if (!formData.model?.trim()) errors.push('Модель обязательна');
    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      errors.push('Год выпуска должен быть корректным');
    }
    if (!formData.engineVolume?.trim()) errors.push('Объем двигателя обязателен');
    if (!formData.transmission?.trim()) errors.push('Трансмиссия обязательна');
    if (!formData.mileage || formData.mileage < 0) errors.push('Пробег должен быть положительным');
    if (!formData.vin?.trim()) errors.push('VIN обязателен');
    if (!formData.color?.trim()) errors.push('Цвет обязателен');
    
    return errors;
  };

  // Сохранение изменений
  const handleSave = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setToast({
        type: 'error',
        message: `Ошибки валидации: ${errors.join(', ')}`,
        show: true
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/cars/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setToast({
          type: 'success',
          message: 'Автомобиль успешно обновлен',
          show: true
        });
        
        // Перенаправление на страницу просмотра через 1 секунду
        setTimeout(() => {
          router.push(`/cars/${params.id}`);
        }, 1000);
      } else {
        setToast({
          type: 'error',
          message: result.error || 'Ошибка при обновлении автомобиля',
          show: true
        });
      }
    } catch {
      setToast({
        type: 'error',
        message: 'Ошибка при обновлении автомобиля',
        show: true
      });
    } finally {
      setSaving(false);
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
              <Link href={`/cars/${car.id}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  Редактирование автомобиля
                </h1>
                <p className="text-sm text-neutral-500">
                  {car.brand} {car.model} - ID: {car.id}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/cars/${car.id}`}>
                <Button variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Отмена
                </Button>
              </Link>
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Сохранить
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Форма редактирования */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Основная информация */}
            <div className="lg:col-span-2 space-y-6">
              {/* Основные характеристики */}
              <Card>
                <CardHeader>
                  <CardTitle>Основные характеристики</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Бренд *
                      </label>
                      <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) => handleInputChange('brand', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Например: Toyota"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Модель *
                      </label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Например: Camry"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Год выпуска *
                      </label>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="2020"
                        min="1900"
                        max={new Date().getFullYear() + 1}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Тип кузова *
                      </label>
                      <select
                        value={formData.bodyType}
                        onChange={(e) => handleInputChange('bodyType', e.target.value as BodyType)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="sedan">Седан</option>
                        <option value="hatchback">Хэтчбек</option>
                        <option value="wagon">Универсал</option>
                        <option value="suv">Внедорожник</option>
                        <option value="coupe">Купе</option>
                        <option value="convertible">Кабриолет</option>
                        <option value="pickup">Пикап</option>
                        <option value="van">Минивэн</option>
                        <option value="other">Прочее</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Тип топлива *
                      </label>
                      <select
                        value={formData.fuelType}
                        onChange={(e) => handleInputChange('fuelType', e.target.value as FuelType)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="gasoline">Бензин</option>
                        <option value="diesel">Дизель</option>
                        <option value="hybrid">Гибрид</option>
                        <option value="electric">Электро</option>
                        <option value="lpg">Газ</option>
                        <option value="other">Прочее</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Объем двигателя *
                      </label>
                      <input
                        type="text"
                        value={formData.engineVolume}
                        onChange={(e) => handleInputChange('engineVolume', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Например: 2.0L"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Трансмиссия *
                      </label>
                      <input
                        type="text"
                        value={formData.transmission}
                        onChange={(e) => handleInputChange('transmission', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Например: Автомат"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Пробег (км) *
                      </label>
                      <input
                        type="number"
                        value={formData.mileage}
                        onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="100000"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Цвет *
                      </label>
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Например: Белый"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      VIN номер *
                    </label>
                    <input
                      type="text"
                      value={formData.vin}
                      onChange={(e) => handleInputChange('vin', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
                      placeholder="1HGBH41JXMN109186"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Описание и заметки */}
              <Card>
                <CardHeader>
                  <CardTitle>Дополнительная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Описание
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Описание автомобиля..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Заметки
                    </label>
                    <textarea
                      value={formData.notes || ''}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Дополнительные заметки..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Изображения */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Изображения</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    images={formData.images || []}
                    onImagesChange={handleImagesChange}
                    maxImages={10}
                    className="w-full"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

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
