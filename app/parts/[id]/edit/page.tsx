"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { DebugPanel } from '@/components/debug/DebugPanel';
import { ToastContainer, useToast } from '@/components/ui/Toast';
import { 
  ArrowLeft, 
  Save, 
  X, 
  AlertCircle,
  Car,
  Check,
  Loader2
} from 'lucide-react';
import { PartCondition, PartStatus, UpdatePartInput, Car as CarType } from '@/types';


import { getCategoryByZapchastName } from '@/lib/zapchasti-categories';

/**
 * Интерфейс для формы редактирования запчасти
 */
interface EditPartFormData {
  zapchastName: string;
  condition: PartCondition | '';
  status: PartStatus | '';
  price: string;
  description: string;
  location: string;
  supplier: string;
  purchaseDate: string;
  purchasePrice: string;
  notes: string;
  images: string[];
}

/**
 * Начальное состояние формы
 */
const initialFormData: EditPartFormData = {
  zapchastName: '',
  condition: '',
  status: '',
  price: '',
  description: '',
  location: '',
  supplier: '',
  purchaseDate: '',
  purchasePrice: '',
  notes: '',
  images: []
};

/**
 * Страница редактирования запчасти
 */
export default function EditPartPage() {
  const router = useRouter();
  const params = useParams();
  const { toasts, removeToast, showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState<EditPartFormData>(initialFormData);
  const [cars, setCars] = useState<CarType[]>([]);
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const partId = params['id'] as string;

  // Мемоизируем функцию showError для стабильности зависимостей
  const handleError = useCallback((title: string, message: string) => {
    showError(title, message);
  }, [showError]);

  // Загрузка данных запчасти и автомобилей
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔧 [DEBUG] Загрузка данных для редактирования запчасти ID:', partId);
        setLoading(true);
        
        // Загружаем запчасть и автомобили параллельно
        const [partResponse, carsResponse] = await Promise.all([
          fetch(`/api/parts/${partId}`),
          fetch('/api/cars')
        ]);

        console.log('🔧 [DEBUG] Ответы API:', {
          partStatus: partResponse.status,
          carsStatus: carsResponse.status
        });

        if (!partResponse.ok) {
          throw new Error('Запчасть не найдена');
        }

        const [partResult, carsResult] = await Promise.all([
          partResponse.json(),
          carsResponse.json()
        ]);

        console.log('🔧 [DEBUG] Результаты API:', {
          partSuccess: partResult.success,
          carsSuccess: carsResult.success,
          partData: partResult.data,
          carsData: carsResult.data
        });

        if (partResult.success && carsResult.success) {
          const partData = partResult.data;
          const carsData = carsResult.data.cars || carsResult.data.data || [];
          
          console.log('🔧 [DEBUG] Данные запчасти:', partData);
          console.log('🔧 [DEBUG] Данные автомобилей:', carsData);

          setCars(carsData);
          
          // Находим автомобиль для этой запчасти
          const car = carsData.find((c: CarType) => c.id === partData.carId);
          console.log('🔧 [DEBUG] Найденный автомобиль:', car);
          setSelectedCar(car || null);
          
                     // Заполняем форму данными запчасти
           const formDataToSet = {
             zapchastName: partData.zapchastName || '',
             condition: partData.condition || '',
             status: partData.status || '',
             price: partData.price?.toString() || '',
             description: partData.description || '',
             location: partData.location || '',
             supplier: partData.supplier || '',
             purchaseDate: partData.purchaseDate ? 
               (typeof partData.purchaseDate === 'string' ? 
                 new Date(partData.purchaseDate).toISOString().split('T')[0] : 
                 partData.purchaseDate.toISOString().split('T')[0]) || '' : '',
             purchasePrice: partData.purchasePrice?.toString() || '',
             notes: partData.notes || '',
             images: partData.images || []
           };
          
          console.log('🔧 [DEBUG] Данные формы:', formDataToSet);
          setFormData(formDataToSet);
        } else {
          throw new Error('Ошибка загрузки данных');
        }
      } catch (error) {
        console.error('❌ Ошибка загрузки данных:', error);
        setError(error instanceof Error ? error.message : 'Ошибка загрузки данных');
        handleError('Ошибка', 'Не удалось загрузить данные запчасти');
      } finally {
        setLoading(false);
      }
    };

    if (partId) {
      fetchData();
    }
  }, [partId, handleError]);

  // Обработка изменения полей формы
  const handleInputChange = (field: keyof EditPartFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };



  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCar) {
      showError('Ошибка', 'Выберите автомобиль');
      return;
    }

    try {
      setSaving(true);

      const updateData: UpdatePartInput = {
        zapchastName: formData.zapchastName,
        category: getCategoryByZapchastName(formData.zapchastName),
        carId: selectedCar.id,
        condition: formData.condition as PartCondition,
        status: formData.status as PartStatus,
        price: parseFloat(formData.price) || 0,
        description: formData.description,
        location: formData.location,
        supplier: formData.supplier,
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : new Date(),
        purchasePrice: parseFloat(formData.purchasePrice) || 0,
        images: formData.images.filter((url): url is string => url !== undefined),
        notes: formData.notes
      };

      const response = await fetch(`/api/parts/${partId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.success) {
        showSuccess('Успешно', 'Запчасть обновлена');
        router.push('/parts');
      } else {
        throw new Error(result.error || 'Ошибка обновления');
      }
    } catch (error) {
      console.error('Ошибка обновления запчасти:', error);
      showError('Ошибка', error instanceof Error ? error.message : 'Ошибка обновления запчасти');
    } finally {
      setSaving(false);
    }
  };

  // Обработка отмены
  const handleCancel = () => {
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
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">Ошибка загрузки</h2>
                <p className="text-neutral-600 mb-4">{error}</p>
                <Button onClick={() => router.push('/parts')}>
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
                  onClick={handleCancel}
                  className="text-neutral-600 hover:text-neutral-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900">
                    Редактирование запчасти
                  </h1>
                  <p className="text-neutral-600">
                    Измените информацию о запчасти
                  </p>
                </div>
              </div>
            </div>

            {/* Форма */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Основная информация */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Car className="w-5 h-5 mr-2" />
                      Основная информация
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Название запчасти */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Название запчасти *
                      </label>
                      <input
                        type="text"
                        value={formData.zapchastName}
                        onChange={(e) => handleInputChange('zapchastName', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Введите название запчасти"
                        required
                      />
                    </div>

                                         {/* Автомобиль */}
                     <div>
                       <label className="block text-sm font-medium text-neutral-700 mb-2">
                         Автомобиль *
                       </label>
                       <select
                         value={selectedCar?.id || ''}
                         onChange={(e) => {
                           const car = cars.find(c => c.id === e.target.value);
                           setSelectedCar(car || null);
                         }}
                         className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                         required
                       >
                         <option value="">Выберите автомобиль</option>
                         {cars.map((car) => (
                           <option key={car.id} value={car.id}>
                             {car.brand} {car.model} ({car.year})
                           </option>
                         ))}
                       </select>
                     </div>

                                         {/* Состояние */}
                     <div>
                       <label className="block text-sm font-medium text-neutral-700 mb-2">
                         Состояние *
                       </label>
                       <select
                         value={formData.condition}
                         onChange={(e) => handleInputChange('condition', e.target.value)}
                         className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                         required
                       >
                         <option value="">Выберите состояние</option>
                         <option value="excellent">Отличное</option>
                         <option value="good">Хорошее</option>
                         <option value="fair">Удовлетворительное</option>
                         <option value="poor">Плохое</option>
                         <option value="broken">Сломанное</option>
                       </select>
                     </div>

                    {/* Статус */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Статус *
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="">Выберите статус</option>
                        <option value="available">Доступна</option>
                        <option value="reserved">Зарезервирована</option>
                        <option value="sold">Продана</option>
                        <option value="scrapped">Утилизирована</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Цена и местоположение */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Check className="w-5 h-5 mr-2" />
                      Цена и местоположение
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Цена */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Цена продажи (₽) *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    {/* Цена приобретения */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Цена приобретения (₽)
                      </label>
                      <input
                        type="number"
                        value={formData.purchasePrice}
                        onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    {/* Местоположение */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Местоположение *
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Склад, полка, ящик и т.д."
                        required
                      />
                    </div>

                    {/* Поставщик */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Поставщик
                      </label>
                      <input
                        type="text"
                        value={formData.supplier}
                        onChange={(e) => handleInputChange('supplier', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Название поставщика"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Дополнительная информация */}
              <Card>
                <CardHeader>
                  <CardTitle>Дополнительная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Описание */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Описание
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Подробное описание запчасти, особенности, дефекты и т.д."
                    />
                  </div>

                  {/* Заметки */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Заметки
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Дополнительные заметки, комментарии"
                    />
                  </div>

                  {/* Дата приобретения */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Дата приобретения
                    </label>
                    <input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Изображения */}
              <Card>
                <CardHeader>
                  <CardTitle>Изображения</CardTitle>
                </CardHeader>
                <CardContent>
                                     <ImageUpload
                     images={formData.images}
                     onImagesChange={(images) => handleInputChange('images', images)}
                     maxImages={5}
                   />
                </CardContent>
              </Card>

              {/* Кнопки действий */}
              <div className="flex items-center justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить изменения
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>

             {/* Отладочная панель */}
       {process.env.NODE_ENV === 'development' && <DebugPanel />}

             {/* Уведомления */}
       <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
