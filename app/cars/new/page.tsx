"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { BodyType, FuelType, CreateCarInput } from '@/types';
import { 
  Car as CarIcon, 
  ArrowLeft, 
  Save,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

/**
 * Страница добавления нового автомобиля
 */
export default function AddCarPage() {
  if (process.env.NODE_ENV === 'development') {
  if (process.env.NODE_ENV === 'development') {
  console.log('🔧 [DEBUG] AddCarPage: Компонент рендерится');
};
};
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Состояние формы
  const [formData, setFormData] = useState<CreateCarInput>({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    bodyType: 'sedan',
    fuelType: 'gasoline',
    engineVolume: '',
    transmission: '',
    mileage: 0,
    vin: '',
    color: '',
    description: '',
    images: [],
    notes: '',
  });

  // Обработчики изменения полей
  const handleInputChange = (field: keyof CreateCarInput, value: any) => {
    if (process.env.NODE_ENV === 'development') {
  console.log('🔧 [DEBUG] AddCarPage: Изменение поля', field, 'на', value);
};
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (process.env.NODE_ENV === 'development') {
  console.log('🔧 [DEBUG] AddCarPage: Отправка формы с данными:', formData);
};
      
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        if (process.env.NODE_ENV === 'development') {
  console.log('🔧 [DEBUG] AddCarPage: Автомобиль успешно создан:', result.data);
};
        router.push('/cars');
      } else {
        setError(result.error || 'Ошибка при создании автомобиля');
        console.error('🔧 [DEBUG] AddCarPage: Ошибка при создании автомобиля:', result.error);
      }
    } catch (error) {
      setError('Ошибка сети при создании автомобиля');
      console.error('🔧 [DEBUG] AddCarPage: Ошибка сети:', error);
    } finally {
      setLoading(false);
    }
  };

  // Опции для селектов
  const bodyTypeOptions: { value: BodyType; label: string }[] = [
    { value: 'sedan', label: 'Седан' },
    { value: 'hatchback', label: 'Хэтчбек' },
    { value: 'wagon', label: 'Универсал' },
    { value: 'suv', label: 'Внедорожник' },
    { value: 'coupe', label: 'Купе' },
    { value: 'convertible', label: 'Кабриолет' },
    { value: 'pickup', label: 'Пикап' },
    { value: 'van', label: 'Минивэн' },
    { value: 'other', label: 'Прочее' },
  ];

  const fuelTypeOptions: { value: FuelType; label: string }[] = [
    { value: 'gasoline', label: 'Бензин' },
    { value: 'diesel', label: 'Дизель' },
    { value: 'hybrid', label: 'Гибрид' },
    { value: 'electric', label: 'Электро' },
    { value: 'lpg', label: 'Газ' },
    { value: 'other', label: 'Прочее' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Заголовок */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/cars">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Назад
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Добавить автомобиль</h1>
              <p className="text-neutral-600 mt-1">
                Заполните информацию о новом автомобиле
              </p>
            </div>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Основная информация */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CarIcon className="w-5 h-5" />
                    Основная информация
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Бренд *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.brand}
                        onChange={(e) => handleInputChange('brand', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="BMW"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Модель *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="E46 325i"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Год выпуска *
                      </label>
                      <input
                        type="number"
                        required
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Цвет *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.color}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Черный"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Тип кузова *
                      </label>
                      <select
                        required
                        value={formData.bodyType}
                        onChange={(e) => handleInputChange('bodyType', e.target.value as BodyType)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {bodyTypeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Тип топлива *
                      </label>
                      <select
                        required
                        value={formData.fuelType}
                        onChange={(e) => handleInputChange('fuelType', e.target.value as FuelType)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {fuelTypeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Технические характеристики */}
              <Card>
                <CardHeader>
                  <CardTitle>Технические характеристики</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Объем двигателя *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.engineVolume}
                        onChange={(e) => handleInputChange('engineVolume', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="2.5L"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Трансмиссия *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.transmission}
                        onChange={(e) => handleInputChange('transmission', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="5MT"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Пробег (км) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.mileage}
                      onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="150000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      VIN номер *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.vin}
                      onChange={(e) => handleInputChange('vin', e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="WBAVB13506PT12345"
                      maxLength={17}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Изображения */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Фотографии автомобиля</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    images={formData.images}
                    onImagesChange={(images) => handleInputChange('images', images)}
                    folder="cars"
                    maxImages={10}
                  />
                </CardContent>
              </Card>

              {/* Дополнительная информация */}
              <Card className="lg:col-span-2">
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
                      placeholder="Описание состояния автомобиля..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Заметки
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Дополнительные заметки..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ошибка */}
            {error && (
              <Card className="mt-6 border-error">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-error">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Кнопки */}
            <div className="flex items-center justify-end gap-4 mt-6">
              <Link href="/cars">
                <Button variant="outline" type="button">
                  Отмена
                </Button>
              </Link>
              <Button type="submit" disabled={loading} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {loading ? 'Сохранение...' : 'Сохранить автомобиль'}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
