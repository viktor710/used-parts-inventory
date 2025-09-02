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
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

/**
 * Страница добавления нового автомобиля
 */
export default function AddCarPage() {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 [DEBUG] AddCarPage: Компонент рендерится');
  }
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown> | null>(null);
  
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
  const handleInputChange = (field: keyof CreateCarInput, value: string | number | string[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 [DEBUG] AddCarPage: Изменение поля', field, 'на', value);
    }
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
    setSuccess(false);
    setDebugInfo(null);

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 [DEBUG] AddCarPage: Отправка формы с данными:', formData);
      }
      
      // Проверяем обязательные поля
      const requiredFields = ['brand', 'model', 'year', 'bodyType', 'fuelType', 'engineVolume', 'transmission', 'mileage', 'vin', 'color'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof CreateCarInput]);
      
      if (missingFields.length > 0) {
        setError(`Отсутствуют обязательные поля: ${missingFields.join(', ')}`);
        setLoading(false);
        return;
      }

      // Проверяем VIN (должен быть 17 символов)
      if (formData.vin.length !== 17) {
        setError('VIN номер должен содержать ровно 17 символов');
        setLoading(false);
        return;
      }

      const requestData = {
        ...formData,
        year: parseInt(formData.year.toString()),
        mileage: parseInt(formData.mileage.toString())
      };

      console.log('🔧 [DEBUG] AddCarPage: Отправляем запрос на /api/cars');
      
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('🔧 [DEBUG] AddCarPage: Получен ответ:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔧 [DEBUG] AddCarPage: Ошибка HTTP:', response.status, errorText);
        
        let errorMessage = 'Ошибка сети при создании автомобиля';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        setError(errorMessage);
        setDebugInfo({
          status: response.status,
          statusText: response.statusText,
          errorText,
          requestData
        });
        setLoading(false);
        return;
      }

      const result = await response.json();
      console.log('🔧 [DEBUG] AddCarPage: Результат запроса:', result);

      if (result.success) {
        console.log('🔧 [DEBUG] AddCarPage: Автомобиль успешно создан:', result.data);
        setSuccess(true);
        setTimeout(() => {
          router.push('/cars');
        }, 2000);
      } else {
        setError(result.error || 'Ошибка при создании автомобиля');
        setDebugInfo({
          result,
          requestData
        });
        console.error('🔧 [DEBUG] AddCarPage: Ошибка при создании автомобиля:', result.error);
      }
    } catch (error) {
      console.error('🔧 [DEBUG] AddCarPage: Ошибка сети:', error);
      setError(`Ошибка сети: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
      setDebugInfo({
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
        stack: error instanceof Error ? error.stack : undefined,
        requestData: formData
      });
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
                      VIN номер * (17 символов)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.vin}
                      onChange={(e) => handleInputChange('vin', e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="WBAVB13506PT12345"
                      maxLength={17}
                      minLength={17}
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      Должен содержать ровно 17 символов
                    </p>
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

            {/* Успех */}
            {success && (
              <Card className="mt-6 border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span>Автомобиль успешно создан! Перенаправление...</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ошибка */}
            {error && (
              <Card className="mt-6 border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                  {debugInfo && process.env.NODE_ENV === 'development' && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-red-600">Отладочная информация</summary>
                      <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
                        {JSON.stringify(debugInfo, null, 2)}
                      </pre>
                    </details>
                  )}
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
