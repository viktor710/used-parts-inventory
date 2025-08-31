"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CategoryBadge, ConditionBadge, StatusBadge } from '@/components/ui/Badge';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { PartsPageHeader } from '@/components/ui/PageHeader';
import { PartImage } from '@/components/ui/PartImage';


import { DebugPanel } from '@/components/debug/DebugPanel';
import { ToastContainer, useToast } from '@/components/ui/Toast';
import { formatPartsCount } from '@/utils/format';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  AlertCircle,
  Package,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { Part, Car } from '@/types';

/**
 * Компонент карточки запчасти
 */
const PartCard: React.FC<{ part: Part; car?: Car }> = ({ part, car }) => {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Отладочная информация
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 [DEBUG] PartCard: Рендеринг карточки запчасти:', part.id, part.zapchastName);
  }

  // Обработка просмотра запчасти
  const handleView = () => {
    router.push(`/parts/${part.id}`);
  };

  // Обработка редактирования запчасти
  const handleEdit = () => {
    router.push(`/parts/${part.id}/edit`);
  };

  // Обработка удаления запчасти
  const handleDelete = async () => {
    try {
      setDeleting(true);

      const response = await fetch(`/api/parts/${part.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        showSuccess('Успешно', 'Запчасть удалена');
        // Перезагружаем страницу для обновления списка
        window.location.reload();
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
  
  return (
    <>
      <Card className="card-hover group">
        {/* Изображения запчасти */}
        <div className="relative">
          {part.images && part.images.length > 0 ? (
            <div className="p-4 pb-0">
              {(() => {
                // Отладочная информация
                if (process.env.NODE_ENV === 'development') {
                  console.log('🔧 [DEBUG] PartCard: Запчасть:', part.zapchastName, 'Количество изображений:', part.images.length);
                }
                
                if (part.images.length === 1) {
                  if (process.env.NODE_ENV === 'development') {
                    console.log('🔧 [DEBUG] PartCard: Используем PartImage для одного изображения');
                  }
                  return (
                    // Для одного изображения используем PartImage
                    <PartImage
                      images={part.images}
                      aspectRatio="video"
                      className="mb-3"
                      onClick={() => {
                        // Можно добавить логику открытия галереи
                        console.log('Открыть изображение:', part.images[0]);
                      }}
                    />
                  );
                } else {
                  if (process.env.NODE_ENV === 'development') {
                    console.log('🔧 [DEBUG] PartCard: Используем ImageGallery для', part.images.length, 'изображений');
                  }
                  return (
                    // Для нескольких изображений используем ImageGallery
                    <ImageGallery 
                      images={part.images} 
                      maxPreview={3}
                      showCount={false}
                      className="mb-3"
                    />
                  );
                }
              })()}
            </div>
          ) : (
            // Заглушка для отсутствующих изображений
            <div className="p-4 pb-0">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center group-hover:from-neutral-200 group-hover:to-neutral-300 transition-all duration-200">
                <div className="text-center">
                  <Package className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                  <p className="text-sm text-neutral-500 font-medium">Нет фото</p>
                  <p className="text-xs text-neutral-400">Добавьте изображения запчасти</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary transition-colors cursor-pointer" onClick={handleView}>
                {part.zapchastName}
              </h3>
              {car && (
                <p className="text-sm text-neutral-600 mb-3 flex items-center">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2"></span>
                  {car.brand} {car.model} ({car.year})
                </p>
              )}
              <div className="flex flex-wrap gap-2 mb-3">
                <CategoryBadge category={part.category} />
                <ConditionBadge condition={part.condition} />
                <StatusBadge status={part.status} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                ₽{part.price.toLocaleString()}
              </p>
              <p className="text-sm text-neutral-500">
                Место: {part.location}
              </p>
            </div>
          </div>
          
          <p className="text-sm text-neutral-700 mb-4 line-clamp-2">
            {part.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-500">
              Поставщик: {part.supplier}
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover:bg-primary/10 hover:text-primary"
                onClick={handleView}
                title="Просмотреть"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover:bg-primary/10 hover:text-primary"
                onClick={handleEdit}
                title="Редактировать"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setShowDeleteConfirm(true)}
                title="Удалить"
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
    </>
  );
};

/**
 * Компонент фильтров
 */
const Filters: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Фильтры
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Поиск */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Поиск
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Название, бренд, модель..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Категория */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Категория
            </label>
            <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="">Все категории</option>
              <option value="engine">Двигатель</option>
              <option value="transmission">Трансмиссия</option>
              <option value="suspension">Подвеска</option>
              <option value="brakes">Тормоза</option>
              <option value="electrical">Электрика</option>
              <option value="body">Кузов</option>
              <option value="interior">Салон</option>
              <option value="exterior">Внешние элементы</option>
              <option value="other">Прочее</option>
            </select>
          </div>

          {/* Статус */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Статус
            </label>
            <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="">Все статусы</option>
              <option value="available">Доступна</option>
              <option value="reserved">Зарезервирована</option>
              <option value="sold">Продана</option>
              <option value="scrapped">Утилизирована</option>
            </select>
          </div>
        </div>

        {/* Дополнительные фильтры */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Цена от
            </label>
            <input
              type="number"
              placeholder="₽"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Цена до
            </label>
            <input
              type="number"
              placeholder="₽"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Год
            </label>
            <input
              type="number"
              placeholder="Год выпуска"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Кнопки фильтров */}
        <div className="flex justify-between items-center mt-6">
          <Button variant="outline">
            Сбросить фильтры
          </Button>
          <Button variant="primary">
            Применить фильтры
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Страница списка запчастей
 */
export default function PartsPage() {
  const { toasts, removeToast } = useToast();
  const [parts, setParts] = useState<Part[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Отладочная информация
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 [DEBUG] PartsPage: Компонент рендерится');
  }

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔧 [DEBUG] PartsPage: Начинаем загрузку данных из API');
        setLoading(true);
        setError(null);
        
        // Загружаем запчасти и автомобили параллельно
        const [partsResponse, carsResponse] = await Promise.all([
          fetch('/api/parts'),
          fetch('/api/cars')
        ]);

        console.log('🔧 [DEBUG] PartsPage: Ответы получены', { 
          partsStatus: partsResponse.status,
          carsStatus: carsResponse.status 
        });

        const [partsResult, carsResult] = await Promise.all([
          partsResponse.json(),
          carsResponse.json()
        ]);

        console.log('🔧 [DEBUG] PartsPage: JSON данные получены', { 
          partsSuccess: partsResult.success,
          carsSuccess: carsResult.success 
        });

        if (partsResult.success && carsResult.success) {
          console.log('🔧 [DEBUG] PartsPage: Загружено запчастей:', partsResult.data.data.length);
          console.log('🔧 [DEBUG] PartsPage: Загружено автомобилей:', carsResult.data.cars.length);
          
          // Отладочная информация о запчастях
          partsResult.data.data.forEach((part: Part, index: number) => {
            console.log(`🔧 [DEBUG] PartsPage: Запчасть ${index + 1}:`, {
              name: part.zapchastName,
              id: part.id,
              status: part.status,
              imagesCount: part.images.length
            });
          });
          
          console.log('🔧 [DEBUG] PartsPage: Устанавливаем данные в состояние');
          setParts(partsResult.data.data);
          setCars(carsResult.data.cars);
          console.log('🔧 [DEBUG] PartsPage: Данные установлены в состояние');
        } else {
          console.error('🔧 [DEBUG] PartsPage: Ошибка загрузки:', partsResult.error || carsResult.error);
          setError(partsResult.error || carsResult.error);
        }
      } catch (error) {
        console.error('🔧 [DEBUG] PartsPage: Ошибка сети:', error);
        setError('Ошибка сети при загрузке данных');
      } finally {
        console.log('🔧 [DEBUG] PartsPage: Загрузка завершена');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="flex h-[calc(100vh-4rem)]">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="container-custom py-8">
              {/* Заголовок страницы во время загрузки */}
              <PartsPageHeader
                title="Запчасти"
                subtitle="Загружаем данные из базы..."
                count={0}
              >
                <Button variant="primary" disabled>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Загрузка...
                </Button>
              </PartsPageHeader>
              
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-neutral-600 mb-2">Загружаем запчасти из базы данных...</p>
                  <p className="text-sm text-neutral-500">Это займет всего несколько секунд</p>
                </div>
              </div>
            </div>
          </main>
        </div>
        <DebugPanel />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="flex h-[calc(100vh-4rem)]">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="container-custom py-8">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Ошибка загрузки</h3>
                  <p className="text-neutral-600 mb-4">{error}</p>
                  <Button variant="primary" onClick={() => window.location.reload()}>
                    Попробовать снова
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
        <DebugPanel />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container-custom py-8">
            {/* Заголовок страницы */}
            <PartsPageHeader
              title="Запчасти"
              subtitle="Управление инвентарем б/у запчастей"
              count={parts.length}
            >
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Импорт
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Экспорт
                </Button>
                <Link href="/parts/new">
                  <Button variant="primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить запчасть
                  </Button>
                </Link>
              </div>
            </PartsPageHeader>

            {/* Фильтры */}
            <div className="mb-8">
              <Filters />
            </div>

            {/* Панель управления */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-neutral-600">
                  Найдено: {formatPartsCount(parts.length)}
                </span>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="bg-primary text-white">
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-neutral-600">Сортировка:</span>
                <select className="text-sm border border-neutral-300 rounded px-2 py-1">
                  <option>По дате добавления</option>
                  <option>По цене (возрастание)</option>
                  <option>По цене (убывание)</option>
                  <option>По названию</option>
                </select>
              </div>
            </div>

            {/* Список запчастей */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parts.map((part) => {
                const car = cars.find(c => c.id === part.carId);
                return <PartCard key={part.id} part={part} {...(car && { car })} />;
              })}
            </div>

            {/* Сообщение об отсутствии запчастей */}
            {parts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Запчасти не найдены</h3>
                <p className="text-neutral-600 mb-4">
                  В базе данных пока нет запчастей. Добавьте первую запчасть!
                </p>
                <Link href="/parts/new">
                  <Button variant="primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить запчасть
                  </Button>
                </Link>
              </div>
            )}

            {/* Пагинация */}
            {parts.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
                <div className="text-sm text-neutral-600">
                  Показано 1-{parts.length} из {formatPartsCount(parts.length)}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Предыдущая
                  </Button>
                  <Button variant="primary" size="sm">1</Button>
                  <Button variant="outline" size="sm" disabled>
                    Следующая
                  </Button>
                </div>
              </div>
            )}


          </div>
        </main>
      </div>
      
      {/* Панель отладки */}
      <DebugPanel />
      
      {/* Toast уведомления */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
