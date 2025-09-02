import React from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

import { InteractiveStatCard } from '@/components/ui/InteractiveStatCard';
import { QuickActions } from '@/components/ui/QuickActions';
import { ActivityFeed } from '@/components/ui/ActivityFeed';
import { InteractiveCharts } from '@/components/ui/InteractiveCharts';
import { SmartWidgets } from '@/components/ui/SmartWidgets';
import { getInventoryStats } from '@/lib/stats';

/**
 * Главная страница с панелью управления (статическая)
 */
export default async function HomePage() {
  // Отладочная информация
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 [DEBUG] HomePage: Компонент рендерится (статический)');
  }
  
  // Получаем статистику на сервере
  const stats = await getInventoryStats();

  // Подготавливаем данные для статистических карточек
  const statsData = [
    {
      title: 'Всего запчастей',
      value: stats.totalParts,
      change: 5,
      icon: 'Package',
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
      icon: 'Package',
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
      icon: 'Users',
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
      icon: 'ShoppingCart',
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
      icon: 'DollarSign',
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
      icon: 'BarChart3',
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
  ];

  return (
    <ProtectedRoute>
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
              <div className="text-xs text-neutral-500 text-center mb-4">
                Последнее обновление: {new Date().toLocaleTimeString('ru-RU')}
              </div>

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
      </div>
    </ProtectedRoute>
  );
}
