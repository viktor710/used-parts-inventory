"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
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
  Plus,
  Search,
  BarChart3
} from 'lucide-react';

/**
 * Главная страница с панелью управления
 */
export default function HomePage() {
  // Отладочная информация
  console.log('🔧 [DEBUG] HomePage: Компонент рендерится');
  
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
      change: 0,
      icon: Package,
      color: 'primary' as const,
      format: 'count' as const,
      countType: 'parts' as const,
    },
    {
      title: 'Доступные',
      value: stats.availableParts,
      change: 0,
      icon: Package,
      color: 'success' as const,
      format: 'count' as const,
      countType: 'parts' as const,
    },
    {
      title: 'Зарезервированные',
      value: stats.reservedParts,
      change: 0,
      icon: Users,
      color: 'secondary' as const,
      format: 'count' as const,
      countType: 'parts' as const,
    },
    {
      title: 'Продано',
      value: stats.soldParts,
      change: 0,
      icon: ShoppingCart,
      color: 'warning' as const,
      format: 'count' as const,
      countType: 'parts' as const,
    },
    {
      title: 'Общая стоимость',
      value: stats.totalValue,
      change: 0,
      icon: DollarSign,
      color: 'success' as const,
      format: 'currency' as const,
    },
    {
      title: 'Средняя цена',
      value: stats.averagePrice,
      change: 0,
      icon: BarChart3,
      color: 'primary' as const,
      format: 'currency' as const,
    },
  ] : [];

  const recentActivities = [
    { id: 1, action: 'Добавлена новая запчасть', part: 'Двигатель BMW M54', time: '2 минуты назад' },
    { id: 2, action: 'Продажа запчасти', part: 'Тормозные колодки', time: '15 минут назад' },
    { id: 3, action: 'Новый клиент', part: 'Иван Петров', time: '1 час назад' },
    { id: 4, action: 'Зарезервирована запчасть', part: 'Коробка передач', time: '2 часа назад' },
    { id: 5, action: 'Обновлена цена', part: 'Амортизаторы', time: '3 часа назад' },
  ];

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
                <StatCard key={index} {...stat} />
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
                <Card>
                  <CardHeader>
                    <CardTitle>Быстрые действия</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                                         <Link href="/parts/new" className="w-full">
                       <Button variant="primary" className="w-full justify-start">
                         <Plus className="w-4 h-4 mr-2" />
                         Добавить запчасть
                       </Button>
                     </Link>
                    <Button variant="outline" className="w-full justify-start">
                      <Search className="w-4 h-4 mr-2" />
                      Найти запчасть
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Добавить клиента
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Новая продажа
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Последние действия */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Последние действия</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium text-neutral-900">
                                {activity.action}
                              </p>
                              <p className="text-sm text-neutral-600">
                                {activity.part}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-neutral-500">
                            {activity.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Графики и аналитика */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Аналитика продаж</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                      <p className="text-neutral-600">Графики будут добавлены позже</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      
      {/* Панель отладки */}
      <DebugPanel />
    </div>
  );
}
