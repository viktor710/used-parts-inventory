"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  TrendingUp,
  TrendingDown,
  Eye,
  X
} from 'lucide-react';

interface InteractiveStatCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ComponentType<any>;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  format: 'count' | 'currency' | 'percentage';
  countType?: 'parts' | 'clients' | 'sales';
  details?: {
    items?: Array<{
      id: string;
      name: string;
      value: number;
      status?: string;
    }>;
    description?: string;
  };
}

/**
 * Интерактивная статистическая карточка с модальным окном
 */
export const InteractiveStatCard: React.FC<InteractiveStatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  format,
  countType,
  details
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Анимация счетчика
  React.useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [value]);

  // Форматирование значения
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: 'RUB',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val}%`;
      default:
        return val.toLocaleString('ru-RU');
    }
  };

  // Цвета для разных состояний
  const colorClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    error: 'bg-error text-white',
  };



  return (
    <>
      <Card 
        className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
          isAnimating ? 'animate-pulse' : ''
        }`}
        onClick={() => setIsModalOpen(true)}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-600 mb-1">
                {title}
              </p>
              <div className="flex items-center space-x-2">
                <span className={`text-2xl font-bold transition-all duration-500 ${
                  isAnimating ? 'scale-110' : ''
                }`}>
                  {formatValue(value)}
                </span>
                {change !== 0 && (
                  <div className="flex items-center space-x-1">
                    {change > 0 ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-error" />
                    )}
                    <span className={`text-sm font-medium ${
                      change > 0 ? 'text-success' : 'text-error'
                    }`}>
                      {Math.abs(change)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
          
          {/* Индикатор кликабельности */}
          <div className="mt-3 flex items-center text-xs text-neutral-500">
            <Eye className="w-3 h-3 mr-1" />
            <span>Нажмите для деталей</span>
          </div>
        </CardContent>
      </Card>

      {/* Модальное окно с деталями */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatValue(value)}</p>
                    <p className="text-sm text-neutral-600">
                      {countType === 'parts' && 'запчастей'}
                      {countType === 'clients' && 'клиентов'}
                      {countType === 'sales' && 'продаж'}
                    </p>
                  </div>
                </div>

                {details?.description && (
                  <p className="text-sm text-neutral-600 mb-4">
                    {details.description}
                  </p>
                )}

                {details?.items && details.items.length > 0 && (
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-2">Детализация:</h4>
                    <div className="space-y-2">
                      {details.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                          <span className="text-sm text-neutral-700">{item.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">
                              {formatValue(item.value)}
                            </span>
                            {item.status && (
                              <Badge variant={item.status === 'active' ? 'success' : 'default'}>
                                {item.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsModalOpen(false)}
                >
                  Закрыть
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1"
                  onClick={() => {
                    // Здесь можно добавить переход к детальной странице
                    console.log('Переход к детальной странице:', title);
                    setIsModalOpen(false);
                  }}
                >
                  Подробнее
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
