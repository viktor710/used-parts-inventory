"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatNumber, formatPrice, getScreenSize } from '@/utils/format';

/**
 * Интерфейс для статистической карточки
 */
interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  format?: 'number' | 'currency' | 'count';
  countType?: 'parts' | 'cars';
  responsive?: boolean;
}

/**
 * Адаптивный компонент статистической карточки
 */
export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color,
  format = 'number',
  countType,
  responsive = true
}) => {
  const [screenSize, setScreenSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('lg');

  // Отслеживаем изменение размера экрана
  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize(getScreenSize());
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Отладочная информация
  console.log('🔧 [DEBUG] StatCard: Рендеринг карточки:', { 
    title, 
    value, 
    change, 
    color, 
    format, 
    screenSize 
  });
  
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
  };

  // Форматируем значение в зависимости от типа
  const formatValue = (val: number): string => {
    if (format === 'currency') {
      return formatPrice(val, { responsive });
    }
    
    if (format === 'count') {
      if (countType === 'parts') {
        return `${formatNumber(val, { responsive })} ${getPartsWord(val)}`;
      }
      if (countType === 'cars') {
        return `${formatNumber(val, { responsive })} ${getCarsWord(val)}`;
      }
      return formatNumber(val, { responsive });
    }
    
    return formatNumber(val, { responsive });
  };

  // Получаем правильное слово для количества запчастей
  const getPartsWord = (count: number): string => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'запчастей';
    if (lastDigit === 1) return 'запчасть';
    if (lastDigit >= 2 && lastDigit <= 4) return 'запчасти';
    return 'запчастей';
  };

  // Получаем правильное слово для количества автомобилей
  const getCarsWord = (count: number): string => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'автомобилей';
    if (lastDigit === 1) return 'автомобиль';
    if (lastDigit >= 2 && lastDigit <= 4) return 'автомобиля';
    return 'автомобилей';
  };

  // Адаптивные классы для размера текста
  const getValueSizeClass = (): string => {
    switch (screenSize) {
      case 'xs':
        return 'text-lg';
      case 'sm':
        return 'text-xl';
      case 'md':
        return 'text-2xl';
      case 'lg':
        return 'text-2xl';
      case 'xl':
        return 'text-3xl';
      default:
        return 'text-2xl';
    }
  };

  const getTitleSizeClass = (): string => {
    switch (screenSize) {
      case 'xs':
        return 'text-xs';
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-sm';
      case 'lg':
        return 'text-sm';
      case 'xl':
        return 'text-sm';
      default:
        return 'text-sm';
    }
  };

  const getIconSizeClass = (): string => {
    switch (screenSize) {
      case 'xs':
        return 'w-5 h-5';
      case 'sm':
        return 'w-5 h-5';
      case 'md':
        return 'w-6 h-6';
      case 'lg':
        return 'w-6 h-6';
      case 'xl':
        return 'w-7 h-7';
      default:
        return 'w-6 h-6';
    }
  };

  return (
    <Card className="card-hover">
      <CardContent className={`p-4 sm:p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className={`font-medium text-neutral-600 mb-1 ${getTitleSizeClass()}`}>
              {title}
            </p>
            <p className={`font-bold text-neutral-900 ${getValueSizeClass()}`}>
              {formatValue(value)}
            </p>
            {change !== undefined && (
              <div className="flex items-center mt-2">
                {change >= 0 ? (
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-success" />
                ) : (
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-error" />
                )}
                <span className={`text-xs sm:text-sm ml-1 ${change >= 0 ? 'text-success' : 'text-error'}`}>
                  {change >= 0 ? '+' : ''}{change}%
                </span>
                <span className="text-xs text-neutral-500 ml-1 hidden sm:inline">
                  с прошлого месяца
                </span>
              </div>
            )}
          </div>
          <div className={`p-2 sm:p-3 rounded-lg ${colorClasses[color]} flex-shrink-0 ml-3`}>
            <Icon className={getIconSizeClass()} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
