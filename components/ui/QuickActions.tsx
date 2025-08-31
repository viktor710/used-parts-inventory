"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Plus,
  Search,
  Users,
  ShoppingCart,
  X
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  variant: 'primary' | 'outline';
  action: () => void;
}

interface QuickActionsProps {
  onAddPart?: () => void;
  onSearch?: () => void;
  onAddClient?: () => void;
  onNewSale?: () => void;
}

/**
 * Компонент быстрых действий с модальными окнами
 */
export const QuickActions: React.FC<QuickActionsProps> = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Данные для поиска
  const categories = [
    'Двигатель', 'Трансмиссия', 'Подвеска', 'Тормоза', 
    'Электрика', 'Кузов', 'Салон', 'Внешние элементы', 'Прочее'
  ];

  const statuses = ['Доступна', 'Зарезервирована', 'Продана', 'Утилизирована'];

  const quickActions: QuickAction[] = [
    {
      id: 'add-part',
      title: 'Добавить запчасть',
      description: 'Создать новую запись о запчасти',
      icon: Plus,
      variant: 'primary',
      action: () => setActiveModal('add-part')
    },
    {
      id: 'search',
      title: 'Найти запчасть',
      description: 'Поиск по базе запчастей',
      icon: Search,
      variant: 'outline',
      action: () => setActiveModal('search')
    },
    {
      id: 'add-client',
      title: 'Добавить клиента',
      description: 'Создать нового клиента',
      icon: Users,
      variant: 'outline',
      action: () => setActiveModal('add-client')
    },
    {
      id: 'new-sale',
      title: 'Новая продажа',
      description: 'Оформить продажу запчасти',
      icon: ShoppingCart,
      variant: 'outline',
      action: () => setActiveModal('new-sale')
    }
  ];

  const handleSearch = () => {
    console.log('Поиск:', { searchQuery, selectedCategory, selectedStatus });
    // Здесь можно добавить логику поиска
    setActiveModal(null);
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedStatus('');
  };

  const handleAddPart = () => {
    console.log('Добавление запчасти');
    // Здесь можно добавить логику добавления
    setActiveModal(null);
  };

  const handleAddClient = () => {
    console.log('Добавление клиента');
    // Здесь можно добавить логику добавления клиента
    setActiveModal(null);
  };

  const handleNewSale = () => {
    console.log('Новая продажа');
    // Здесь можно добавить логику продажи
    setActiveModal(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant}
              className="w-full justify-start"
              onClick={action.action}
            >
              <action.icon className="w-4 h-4 mr-2" />
              {action.title}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Модальное окно поиска */}
      {activeModal === 'search' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Поиск запчастей
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveModal(null)}
                  className="p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Поисковый запрос
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Введите название запчасти..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Категория
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Все категории</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Статус
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Все статусы</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setActiveModal(null)}
                  >
                    Отмена
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-1"
                    onClick={handleSearch}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Найти
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно добавления запчасти */}
      {activeModal === 'add-part' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Добавить запчасть
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveModal(null)}
                  className="p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Название запчасти
                  </label>
                  <input
                    type="text"
                    placeholder="Введите название..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Категория
                  </label>
                  <select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="">Выберите категорию</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Цена
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setActiveModal(null)}
                  >
                    Отмена
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-1"
                    onClick={handleAddPart}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно добавления клиента */}
      {activeModal === 'add-client' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Добавить клиента
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveModal(null)}
                  className="p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Имя клиента
                  </label>
                  <input
                    type="text"
                    placeholder="Введите имя..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    placeholder="+7 (999) 999-99-99"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="client@example.com"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setActiveModal(null)}
                  >
                    Отмена
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-1"
                    onClick={handleAddClient}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Добавить
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно новой продажи */}
      {activeModal === 'new-sale' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Новая продажа
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveModal(null)}
                  className="p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Выберите запчасть
                  </label>
                  <select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="">Выберите запчасть</option>
                    <option value="1">Двигатель BMW M54 - 150,000 ₽</option>
                    <option value="2">Тормозные колодки - 5,000 ₽</option>
                    <option value="3">Амортизаторы - 12,000 ₽</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Клиент
                  </label>
                  <select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="">Выберите клиента</option>
                    <option value="1">Иван Петров</option>
                    <option value="2">Алексей Сидоров</option>
                    <option value="3">Мария Иванова</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Цена продажи
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setActiveModal(null)}
                  >
                    Отмена
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-1"
                    onClick={handleNewSale}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Оформить
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
