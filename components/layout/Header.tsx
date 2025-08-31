import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Settings, Plus, Search, BarChart3, Package, Users, ShoppingCart } from 'lucide-react';

/**
 * Компонент заголовка с навигацией
 * Содержит логотип, основное меню и кнопки действий
 */
export const Header: React.FC = () => {
  // Отладочная информация
  console.log('🔧 [DEBUG] Header: Компонент рендерится');
  
  const navigationItems = [
    { href: '/', label: 'Главная', icon: BarChart3 },
    { href: '/parts', label: 'Запчасти', icon: Package },
    { href: '/customers', label: 'Клиенты', icon: Users },
    { href: '/sales', label: 'Продажи', icon: ShoppingCart },
  ];

  return (
    <header className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Логотип и название */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">
                Запчасти
              </span>
            </Link>
          </div>

          {/* Основная навигация */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:text-primary hover:bg-neutral-100 transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Кнопки действий */}
          <div className="flex items-center space-x-2">
            {/* Поиск */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Search className="w-4 h-4" />
              <span className="ml-2">Поиск</span>
            </Button>

            {/* Добавить запчасть */}
                         <Link href="/parts/new">
               <Button variant="primary" size="sm">
                 <Plus className="w-4 h-4" />
                 <span className="ml-2 hidden sm:inline">Добавить</span>
               </Button>
             </Link>

            {/* Настройки */}
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
