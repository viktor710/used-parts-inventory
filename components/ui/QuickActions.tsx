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
import { 
  addPartAction, 
  searchPartsAction, 
  addClientAction, 
  createSaleAction 
} from '@/lib/actions';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  variant: 'primary' | 'outline';
  action: () => void;
}

/**
 * Компонент быстрых действий с модальными окнами
 */
export const QuickActions: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSearch = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const result = await searchPartsAction(formData);
      if (result.success) {
        console.log('Поиск выполнен успешно:', result.results);
        setActiveModal(null);
        setSearchQuery('');
        setSelectedCategory('');
        setSelectedStatus('');
      } else {
        console.error('Ошибка поиска:', result.message);
      }
    } catch (error) {
      console.error('Ошибка при выполнении поиска:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPart = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const result = await addPartAction(formData);
      if (result.success) {
        console.log('Запчасть добавлена успешно:', result.message);
        setActiveModal(null);
      } else {
        console.error('Ошибка добавления:', result.message);
      }
    } catch (error) {
      console.error('Ошибка при добавлении запчасти:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClient = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const result = await addClientAction(formData);
      if (result.success) {
        console.log('Клиент добавлен успешно:', result.message);
        setActiveModal(null);
      } else {
        console.error('Ошибка добавления клиента:', result.message);
      }
    } catch (error) {
      console.error('Ошибка при добавлении клиента:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSale = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const result = await createSaleAction(formData);
      if (result.success) {
        console.log('Продажа оформлена успешно:', result.message);
        setActiveModal(null);
      } else {
        console.error('Ошибка оформления продажи:', result.message);
      }
    } catch (error) {
      console.error('Ошибка при оформлении продажи:', error);
    } finally {
      setIsLoading(false);
    }
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
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form action={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Поисковый запрос
                  </label>
                  <input
                    type="text"
                    name="query"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Введите название запчасти..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Категория
                  </label>
                  <select
                    name="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isLoading}
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
                    name="status"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isLoading}
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
                    type="button"
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setActiveModal(null)}
                    disabled={isLoading}
                  >
                    Отмена
                  </Button>
                  <Button 
                    type="submit"
                    variant="primary" 
                    className="flex-1"
                    disabled={isLoading}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {isLoading ? 'Поиск...' : 'Найти'}
                  </Button>
                </div>
              </form>
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
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form action={handleAddPart} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Название запчасти
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Введите название..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Категория
                  </label>
                  <select 
                    name="category"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    disabled={isLoading}
                  >
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
                    name="price"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setActiveModal(null)}
                    disabled={isLoading}
                  >
                    Отмена
                  </Button>
                  <Button 
                    type="submit"
                    variant="primary" 
                    className="flex-1"
                    disabled={isLoading}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {isLoading ? 'Добавление...' : 'Добавить'}
                  </Button>
                </div>
              </form>
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
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form action={handleAddClient} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Имя клиента
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Введите имя..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+7 (999) 999-99-99"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="client@example.com"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setActiveModal(null)}
                    disabled={isLoading}
                  >
                    Отмена
                  </Button>
                  <Button 
                    type="submit"
                    variant="primary" 
                    className="flex-1"
                    disabled={isLoading}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {isLoading ? 'Добавление...' : 'Добавить'}
                  </Button>
                </div>
              </form>
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
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form action={handleNewSale} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Выберите запчасть
                  </label>
                  <select 
                    name="partId"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    disabled={isLoading}
                  >
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
                  <select 
                    name="clientId"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    disabled={isLoading}
                  >
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
                    name="price"
                    placeholder="0"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setActiveModal(null)}
                    disabled={isLoading}
                  >
                    Отмена
                  </Button>
                  <Button 
                    type="submit"
                    variant="primary" 
                    className="flex-1"
                    disabled={isLoading}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {isLoading ? 'Оформление...' : 'Оформить'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
