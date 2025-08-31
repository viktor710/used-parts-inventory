"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  FileText,
  Truck,
  DollarSign,
  AlertTriangle,
  Car
} from 'lucide-react';

/**
 * Интерфейс для элемента навигации
 */
interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string } | any>;
  badge?: number;
}

/**
 * Компонент боковой панели с навигацией
 * Отображает дополнительные разделы и статистику
 */
export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  
  // Отладочная информация
  console.log('🔧 [DEBUG] Sidebar: Текущий путь:', pathname);
  console.log('🔧 [DEBUG] Sidebar: Компонент рендерится');

  const navigationItems: NavItem[] = [
    { href: '/', label: 'Панель управления', icon: BarChart3 },
    { href: '/cars', label: 'Автомобили', icon: Car, badge: 4 },
    { href: '/parts', label: 'Запчасти', icon: Package, badge: 5 },
    { href: '/parts/available', label: 'Доступные', icon: Package, badge: 3 },
    { href: '/parts/reserved', label: 'Зарезервированные', icon: AlertTriangle, badge: 1 },
    { href: '/customers', label: 'Клиенты', icon: Users, badge: 0 },
    { href: '/suppliers', label: 'Поставщики', icon: Truck, badge: 0 },
    { href: '/sales', label: 'Продажи', icon: ShoppingCart, badge: 1 },
    { href: '/reports', label: 'Отчеты', icon: FileText },
    { href: '/finance', label: 'Финансы', icon: DollarSign },
    { href: '/settings', label: 'Настройки', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 h-full overflow-y-auto">
      <div className="p-4">
        {/* Заголовок боковой панели */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-900">Навигация</h2>
        </div>

        {/* Навигационное меню */}
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-neutral-700 hover:text-primary hover:bg-neutral-100'
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-neutral-500')} />
                  <span>{item.label}</span>
                </div>
                
                {/* Бейдж с количеством */}
                {item.badge && (
                  <span className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-neutral-100 text-neutral-600'
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Быстрые действия */}
        <div className="mt-8 pt-6 border-t border-neutral-200">
          <h3 className="text-sm font-medium text-neutral-900 mb-3">Быстрые действия</h3>
          <div className="space-y-2">
            <Link
              href="/cars/new"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-neutral-700 hover:text-primary hover:bg-neutral-100 transition-colors duration-200"
            >
              <Car className="w-4 h-4" />
              <span>Добавить автомобиль</span>
            </Link>
            <Link
              href="/parts/new"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-neutral-700 hover:text-primary hover:bg-neutral-100 transition-colors duration-200"
            >
              <Package className="w-4 h-4" />
              <span>Добавить запчасть</span>
            </Link>
            <Link
              href="/customers/new"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-neutral-700 hover:text-primary hover:bg-neutral-100 transition-colors duration-200"
            >
              <Users className="w-4 h-4" />
              <span>Добавить клиента</span>
            </Link>
            <Link
              href="/sales/new"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-neutral-700 hover:text-primary hover:bg-neutral-100 transition-colors duration-200"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Новая продажа</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};
