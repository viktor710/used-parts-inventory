"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { InteractiveStatCard } from '@/components/ui/InteractiveStatCard';
import { QuickActions } from '@/components/ui/QuickActions';
import { ActivityFeed } from '@/components/ui/ActivityFeed';
import { InteractiveCharts } from '@/components/ui/InteractiveCharts';
import { SmartWidgets } from '@/components/ui/SmartWidgets';
import { DragDropUpload } from '@/components/ui/DragDropUpload';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  BarChart3
} from 'lucide-react';

/**
 * Демонстрационная страница с интерактивными компонентами
 */
export default function DemoPage() {
  // Демонстрационные данные для статистических карточек
  const demoStats = [
    {
      title: 'Всего запчастей',
      value: 75,
      change: 12,
      icon: Package,
      color: 'primary' as const,
      format: 'count' as const,
      countType: 'parts' as const,
      details: {
        description: 'Общее количество запчастей в системе',
        items: [
          { id: '1', name: 'Двигатели', value: 15, status: 'active' },
          { id: '2', name: 'Трансмиссия', value: 12, status: 'active' },
          { id: '3', name: 'Подвеска', value: 20, status: 'active' },
          { id: '4', name: 'Тормоза', value: 18, status: 'active' },
          { id: '5', name: 'Электрика', value: 10, status: 'active' }
        ]
      }
    },
    {
      title: 'Доступные',
      value: 45,
      change: 8,
      icon: Package,
      color: 'success' as const,
      format: 'count' as const,
      countType: 'parts' as const,
      details: {
        description: 'Запчасти готовые к продаже',
        items: [
          { id: '1', name: 'Отличное состояние', value: 25, status: 'active' },
          { id: '2', name: 'Хорошее состояние', value: 15, status: 'active' },
          { id: '3', name: 'Удовлетворительное', value: 5, status: 'active' }
        ]
      }
    },
    {
      title: 'Зарезервированные',
      value: 18,
      change: -3,
      icon: Users,
      color: 'secondary' as const,
      format: 'count' as const,
      countType: 'parts' as const,
      details: {
        description: 'Запчасти зарезервированные клиентами',
        items: [
          { id: '1', name: 'Ожидают оплаты', value: 12, status: 'active' },
          { id: '2', name: 'В процессе', value: 6, status: 'active' }
        ]
      }
    },
    {
      title: 'Продано',
      value: 12,
      change: 25,
      icon: ShoppingCart,
      color: 'warning' as const,
      format: 'count' as const,
      countType: 'parts' as const,
      details: {
        description: 'Запчасти проданные в этом месяце',
        items: [
          { id: '1', name: 'Этот месяц', value: 12, status: 'active' },
          { id: '2', name: 'Прошлый месяц', value: 8, status: 'active' }
        ]
      }
    },
    {
      title: 'Общая стоимость',
      value: 3250000,
      change: 18,
      icon: DollarSign,
      color: 'success' as const,
      format: 'currency' as const,
      details: {
        description: 'Общая стоимость всех запчастей',
        items: [
          { id: '1', name: 'Двигатели', value: 1800000, status: 'active' },
          { id: '2', name: 'Трансмиссия', value: 960000, status: 'active' },
          { id: '3', name: 'Подвеска', value: 450000, status: 'active' },
          { id: '4', name: 'Тормоза', value: 240000, status: 'active' }
        ]
      }
    },
    {
      title: 'Средняя цена',
      value: 43333,
      change: 5,
      icon: BarChart3,
      color: 'primary' as const,
      format: 'currency' as const,
      details: {
        description: 'Средняя цена за запчасть',
        items: [
          { id: '1', name: 'Двигатели', value: 120000, status: 'active' },
          { id: '2', name: 'Трансмиссия', value: 80000, status: 'active' },
          { id: '3', name: 'Подвеска', value: 22500, status: 'active' },
          { id: '4', name: 'Тормоза', value: 13333, status: 'active' }
        ]
      }
    }
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
                Демонстрация интерактивных компонентов
              </h1>
              <p className="text-neutral-600">
                Показ всех активных элементов главной страницы
              </p>
            </div>

            {/* Интерактивные статистические карточки */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">
                📊 Интерактивные статистические карточки
              </h2>
              <p className="text-neutral-600 mb-4">
                Кликабельные карточки с модальными окнами для детальной информации
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {demoStats.map((stat, index) => (
                  <InteractiveStatCard key={index} {...stat} />
                ))}
              </div>
            </div>

            {/* Быстрые действия */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">
                ⚡ Быстрые действия с модальными окнами
              </h2>
              <p className="text-neutral-600 mb-4">
                Интерактивные кнопки с модальными окнами для быстрых операций
              </p>
              <div className="max-w-md">
                <QuickActions />
              </div>
            </div>

            {/* Лента активности */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">
                📝 Интерактивная лента активности
              </h2>
              <p className="text-neutral-600 mb-4">
                Фильтруемая лента с возможностью отметить как прочитанное
              </p>
              <div className="max-w-2xl">
                <ActivityFeed />
              </div>
            </div>

            {/* Интерактивные графики */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">
                📈 Интерактивные графики и аналитика
              </h2>
              <p className="text-neutral-600 mb-4">
                Графики с фильтрами, переключением типов и экспортом данных
              </p>
              <InteractiveCharts />
            </div>

            {/* Умные виджеты */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">
                🧠 Умные виджеты
              </h2>
              <p className="text-neutral-600 mb-4">
                Прогнозы, рекомендации и алерты с интерактивными элементами
              </p>
              <SmartWidgets />
            </div>

            {/* Drag & Drop загрузка */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">
                📁 Drag & Drop загрузка изображений
              </h2>
              <p className="text-neutral-600 mb-4">
                Интерактивная загрузка файлов с предварительным просмотром
              </p>
              <DragDropUpload 
                title="Загрузка изображений запчастей"
                description="Перетащите изображения запчастей сюда для демонстрации"
                maxFiles={6}
              />
            </div>

            {/* Инструкции по использованию */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                💡 Как использовать интерактивные элементы
              </h3>
              <div className="space-y-2 text-blue-800">
                <p>• <strong>Статистические карточки:</strong> Нажмите на любую карточку для просмотра детальной информации</p>
                <p>• <strong>Быстрые действия:</strong> Нажмите на кнопки для открытия модальных окон с формами</p>
                <p>• <strong>Лента активности:</strong> Используйте фильтры и отмечайте уведомления как прочитанные</p>
                <p>• <strong>Графики:</strong> Переключайте типы графиков, изменяйте периоды и категории</p>
                <p>• <strong>Умные виджеты:</strong> Переключайтесь между прогнозами, рекомендациями и алертами</p>
                <p>• <strong>Загрузка файлов:</strong> Перетащите изображения или нажмите для выбора файлов</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
