"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { InteractiveStatCard } from '@/components/ui/InteractiveStatCard';
import { QuickActions } from '@/components/ui/QuickActions';
import { ActivityFeed } from '@/components/ui/ActivityFeed';
import { InteractiveCharts } from '@/components/ui/InteractiveCharts';
import { SmartWidgets } from '@/components/ui/SmartWidgets';
import { useResponsiveStats } from '@/hooks/useStats';

// Динамический импорт компонентов с интерактивностью
const DebugPanel = dynamic(() => import('@/components/debug/DebugPanel').then(mod => ({ default: mod.DebugPanel })), {
  ssr: false
});
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  BarChart3
} from 'lucide-react';

/**
 * Главная страница с панелью управления
 */
export default function HomePage() {
  // Отладочная информация
  if (process.env.NODE_ENV === 'development') {
  if (process.env.NODE_ENV === 'development') {
  console.log('🔧 [DEBUG] HomePage: Компонент рендерится');
};
};
  
  // Используем хук для получения статистики
  const { stats, loading, error, refresh, isMobile, lastUpdated } = useResponsiveStats();

  // Если данные загружаются, показываем состояние загрузки
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="flex h-[calc(100vh-4rem)]">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="container-custom py-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                  Панель управления
                </h1>
                <p className="text-neutral-600">
                  Обзор вашего бизнеса по продаже б/у запчастей
                </p>
              </div>
              
              {/* Скелетон для статистических карточек */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                          <div className="h-8 bg-neutral-200 rounded w-1/2"></div>
                        </div>
                        <div className="w-12 h-12 bg-neutral-200 rounded-lg"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
        <DebugPanel />
      </div>
    );
  }

  // Если произошла ошибка, показываем сообщение об ошибке
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="flex h-[calc(100vh-4rem)]">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="container-custom py-8">
              <div className="text-center py-12">
                <div className="text-error text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Ошибка загрузки статистики
                </h3>
                <p className="text-neutral-600 mb-4">{error}</p>
                <Button variant="primary" onClick={refresh}>
                  Попробовать снова
                </Button>
              </div>
            </div>
          </main>
        </div>
        <DebugPanel />
      </div>
    );
  }

  // Подготавливаем данные для статистических карточек
  const statsData = stats ? [
    {
      title: 'Всего запчастей',
      value: stats.totalParts,
      change: 5,
      icon: Package,
      color: 'primary' as const,
      format: 'count' as const,
      countType: 'parts' as const,
      details: {
        description: 'Общее количество запчастей в системе',
        items: [
          { id: '1', name: 'Двигатели', value: 12, status: 'active' },
          { id: '2', name: 'Трансмиссия', value: 8, status: 'active' },
          { id: '3', name: 'Подвеска', value: 15, status: 'active' }
        ]
      }
    },
    {
      title: 'Доступные',
      value: stats.availableParts,
      change: 12,
      icon: Package,
      color: 'success' as const,
      format: 'count' as const,
      countType: 'parts' as const,
      details: {
        description: 'Запчасти готовые к продаже',
        items: [
          { id: '1', name: 'Отличное состояние', value: 25, status: 'active' },
          { id: '2', name: 'Хорошее состояние', value: 18, status: 'active' },
          { id: '3', name: 'Удовлетворительное', value: 7, status: 'active' }
        ]
      }
    },
    {
      title: 'Зарезервированные',
      value: stats.reservedParts,
      change: -3,
      icon: Users,
      color: 'secondary' as const,
      format: 'count' as const,
      countType: 'parts' as const,
      details: {
        description: 'Запчасти зарезервированные клиентами',
        items: [
          { id: '1', name: 'Ожидают оплаты', value: 8, status: 'active' },
          { id: '2', name: 'В процессе', value: 4, status: 'active' }
        ]
      }
    },
    {
      title: 'Продано',
      value: stats.soldParts,
      change: 8,
      icon: ShoppingCart,
      color: 'warning' as const,
      format: 'count' as const,
      countType: 'parts' as const,
      details: {
        description: 'Запчасти проданные в этом месяце',
        items: [
          { id: '1', name: 'Этот месяц', value: 15, status: 'active' },
          { id: '2', name: 'Прошлый месяц', value: 12, status: 'active' }
        ]
      }
    },
    {
      title: 'Общая стоимость',
      value: stats.totalValue,
      change: 15,
      icon: DollarSign,
      color: 'success' as const,
      format: 'currency' as const,
      details: {
        description: 'Общая стоимость всех запчастей',
        items: [
          { id: '1', name: 'Двигатели', value: 1800000, status: 'active' },
          { id: '2', name: 'Трансмиссия', value: 960000, status: 'active' },
          { id: '3', name: 'Подвеска', value: 450000, status: 'active' }
        ]
      }
    },
    {
      title: 'Средняя цена',
      value: stats.averagePrice,
      change: 2,
      icon: BarChart3,
      color: 'primary' as const,
      format: 'currency' as const,
      details: {
        description: 'Средняя цена за запчасть',
        items: [
          { id: '1', name: 'Двигатели', value: 150000, status: 'active' },
          { id: '2', name: 'Трансмиссия', value: 120000, status: 'active' },
          { id: '3', name: 'Подвеска', value: 30000, status: 'active' }
        ]
      }
    },
  ] : [];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container-custom py-8">
            {/* Заголовок страницы */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Панель управления
              </h1>
              <p className="text-neutral-600">
                Обзор вашего бизнеса по продаже б/у запчастей
              </p>
            </div>

            {/* Статистические карточки */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {statsData.map((stat, index) => (
                <InteractiveStatCard key={index} {...stat} />
              ))}
            </div>

            {/* Индикатор обновления данных */}
            {lastUpdated && (
              <div className="text-xs text-neutral-500 text-center mb-4">
                Последнее обновление: {lastUpdated.toLocaleTimeString('ru-RU')}
                {isMobile && ' (мобильный режим)'}
              </div>
            )}

            {/* Основной контент */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Быстрые действия */}
              <div className="lg:col-span-1">
                <QuickActions />
              </div>

              {/* Последние действия */}
              <div className="lg:col-span-2">
                <ActivityFeed />
              </div>
            </div>

            {/* Графики и аналитика */}
            <div className="mt-8">
              <InteractiveCharts />
            </div>

            {/* Умные виджеты */}
            <div className="mt-8">
              <SmartWidgets />
            </div>
          </div>
        </main>
      </div>
      
      {/* Панель отладки */}
      <DebugPanel />
    </div>
  );
}
