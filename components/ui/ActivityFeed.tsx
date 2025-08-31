"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Filter,
  Check,
  Clock,
  Package,
  ShoppingCart,
  Users,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'add' | 'sale' | 'client' | 'update' | 'alert';
  action: string;
  description: string;
  part?: string;
  client?: string;
  amount?: number;
  time: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface ActivityFeedProps {
  activities?: Activity[];
  onActivityClick?: (activity: Activity) => void;
  onMarkAsRead?: (activityId: string) => void;
  onFilterChange?: (filter: string) => void;
}

/**
 * Интерактивная лента активности
 */
export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities = [],
  onActivityClick,
  onMarkAsRead,
  onFilterChange
}) => {
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Подсчет непрочитанных уведомлений
  useEffect(() => {
    setUnreadCount(activities.filter(activity => !activity.isRead).length);
  }, [activities]);

  // Фильтрация активности
  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !activity.isRead;
    if (filter === 'sales') return activity.type === 'sale';
    if (filter === 'additions') return activity.type === 'add';
    if (filter === 'clients') return activity.type === 'client';
    if (filter === 'alerts') return activity.type === 'alert';
    return true;
  });

  // Получение иконки для типа активности
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'add':
        return Package;
      case 'sale':
        return ShoppingCart;
      case 'client':
        return Users;
      case 'update':
        return TrendingUp;
      case 'alert':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  // Получение цвета для приоритета
  const getPriorityColor = (priority: Activity['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-neutral-500';
    }
  };

  // Обработка клика по активности
  const handleActivityClick = (activity: Activity) => {
    if (!activity.isRead && onMarkAsRead) {
      onMarkAsRead(activity.id);
    }
    if (onActivityClick) {
      onActivityClick(activity);
    }
  };

  // Обработка изменения фильтра
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    if (onFilterChange) {
      onFilterChange(newFilter);
    }
  };

  // Отметить все как прочитанное
  const markAllAsRead = () => {
    activities.forEach(activity => {
      if (!activity.isRead && onMarkAsRead) {
        onMarkAsRead(activity.id);
      }
    });
  };

  // Форматирование времени
  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Только что';
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    if (days < 7) return `${days} дн назад`;
    return timestamp.toLocaleDateString('ru-RU');
  };

  // Моковые данные активности
  const mockActivities: Activity[] = [
    {
      id: '1',
      type: 'add',
      action: 'Добавлена новая запчасть',
      description: 'Двигатель BMW M54 добавлен в каталог',
      part: 'Двигатель BMW M54',
      time: '2 минуты назад',
      timestamp: new Date(Date.now() - 2 * 60000),
      isRead: false,
      priority: 'medium'
    },
    {
      id: '2',
      type: 'sale',
      action: 'Продажа запчасти',
      description: 'Тормозные колодки проданы клиенту',
      part: 'Тормозные колодки',
      client: 'Иван Петров',
      amount: 5000,
      time: '15 минут назад',
      timestamp: new Date(Date.now() - 15 * 60000),
      isRead: false,
      priority: 'high'
    },
    {
      id: '3',
      type: 'client',
      action: 'Новый клиент',
      description: 'Зарегистрирован новый клиент',
      client: 'Алексей Сидоров',
      time: '1 час назад',
      timestamp: new Date(Date.now() - 60 * 60000),
      isRead: true,
      priority: 'low'
    },
    {
      id: '4',
      type: 'update',
      action: 'Обновлена цена',
      description: 'Изменена стоимость амортизаторов',
      part: 'Амортизаторы',
      time: '2 часа назад',
      timestamp: new Date(Date.now() - 120 * 60000),
      isRead: true,
      priority: 'medium'
    },
    {
      id: '5',
      type: 'alert',
      action: 'Низкий запас',
      description: 'Заканчиваются тормозные диски',
      part: 'Тормозные диски',
      time: '3 часа назад',
      timestamp: new Date(Date.now() - 180 * 60000),
      isRead: false,
      priority: 'high'
    }
  ];

  const displayActivities = activities.length > 0 ? filteredActivities : mockActivities;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            Последние действия
            {unreadCount > 0 && (
              <Badge variant="error" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="p-1"
            >
              <Filter className="w-4 h-4" />
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <Check className="w-3 h-3 mr-1" />
                Все прочитано
              </Button>
            )}
          </div>
        </div>

        {/* Фильтры */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              { key: 'all', label: 'Все', count: activities.length || mockActivities.length },
              { key: 'unread', label: 'Непрочитанные', count: unreadCount },
              { key: 'sales', label: 'Продажи', count: (activities.length > 0 ? activities : mockActivities).filter(a => a.type === 'sale').length },
              { key: 'additions', label: 'Добавления', count: (activities.length > 0 ? activities : mockActivities).filter(a => a.type === 'add').length },
              { key: 'clients', label: 'Клиенты', count: (activities.length > 0 ? activities : mockActivities).filter(a => a.type === 'client').length },
              { key: 'alerts', label: 'Алерты', count: (activities.length > 0 ? activities : mockActivities).filter(a => a.type === 'alert').length }
            ].map((filterOption) => (
              <Button
                key={filterOption.key}
                variant={filter === filterOption.key ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange(filterOption.key)}
                className="text-xs"
              >
                {filterOption.label}
                <Badge variant="default" className="ml-1 text-xs">
                  {filterOption.count}
                </Badge>
              </Button>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div
                key={activity.id}
                className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  activity.isRead 
                    ? 'bg-neutral-50 hover:bg-neutral-100' 
                    : 'bg-blue-50 hover:bg-blue-100 border-l-4 border-primary'
                }`}
                onClick={() => handleActivityClick(activity)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.isRead ? 'bg-neutral-200' : 'bg-primary text-white'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${
                      activity.isRead ? 'text-neutral-700' : 'text-neutral-900'
                    }`}>
                      {activity.action}
                    </p>
                    <div className="flex items-center space-x-2">
                      {activity.amount && (
                        <span className="text-sm font-medium text-success">
                          {new Intl.NumberFormat('ru-RU', {
                            style: 'currency',
                            currency: 'RUB',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(activity.amount)}
                        </span>
                      )}
                      <span className={`text-xs ${getPriorityColor(activity.priority)}`}>
                        {activity.priority === 'high' && '🔥'}
                        {activity.priority === 'medium' && '⚡'}
                        {activity.priority === 'low' && '💡'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-neutral-600 mt-1">
                    {activity.description}
                  </p>
                  
                  {(activity.part || activity.client) && (
                    <div className="flex items-center space-x-2 mt-2">
                      {activity.part && (
                        <Badge variant="default" className="text-xs">
                          {activity.part}
                        </Badge>
                      )}
                      {activity.client && (
                        <Badge variant="default" className="text-xs">
                          {activity.client}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center mt-2">
                    <Clock className="w-3 h-3 text-neutral-400 mr-1" />
                    <span className="text-xs text-neutral-500">
                      {formatTime(activity.timestamp)}
                    </span>
                  </div>
                </div>

                {!activity.isRead && (
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            );
          })}
        </div>

        {displayActivities.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600">Нет активности для отображения</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
