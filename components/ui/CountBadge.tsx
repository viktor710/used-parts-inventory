"use client";

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { formatNumber, getScreenSize } from '@/utils/format';

/**
 * Интерфейс для компонента счетчика
 */
interface CountBadgeProps {
  count: number;
  type?: 'parts' | 'cars' | 'general';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  responsive?: boolean;
  showLabel?: boolean;
  className?: string;
}

/**
 * Адаптивный компонент для отображения количества элементов
 */
export const CountBadge: React.FC<CountBadgeProps> = ({
  count,
  type = 'general',
  variant = 'default',
  size = 'md',
  responsive = true,
  showLabel = true,
  className = ''
}) => {
  const [screenSize, setScreenSize] = React.useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('lg');

  // Отслеживаем изменение размера экрана
  React.useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize(getScreenSize());
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Получаем правильное слово для количества
  const getCountWord = (): string => {
    if (!showLabel) return '';
    
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (type === 'parts') {
      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'запчастей';
      if (lastDigit === 1) return 'запчасть';
      if (lastDigit >= 2 && lastDigit <= 4) return 'запчасти';
      return 'запчастей';
    }
    
    if (type === 'cars') {
      if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'автомобилей';
      if (lastDigit === 1) return 'автомобиль';
      if (lastDigit >= 2 && lastDigit <= 4) return 'автомобиля';
      return 'автомобилей';
    }
    
    return 'элементов';
  };

  // Адаптивное форматирование числа
  const formatCount = (): string => {
    if (!responsive) {
      return count.toString();
    }

    // На очень маленьких экранах показываем только число
    if (screenSize === 'xs') {
      return count.toString();
    }

    // На маленьких экранах показываем сокращенную форму для больших чисел
    if (screenSize === 'sm' && count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }

    // На средних и больших экранах показываем полную форму
    return formatNumber(count, { responsive: false });
  };

  // Определяем размер бейджа
  const getSizeClass = (): string => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'lg':
        return 'text-sm px-3 py-1.5';
      default:
        return 'text-sm px-2.5 py-1';
    }
  };

  const countText = formatCount();
  const countWord = getCountWord();
  const displayText = showLabel ? `${countText} ${countWord}` : countText;

  return (
    <Badge 
      variant={variant} 
      className={`${getSizeClass()} ${className}`}
    >
      {displayText}
    </Badge>
  );
};

/**
 * Компонент для отображения количества запчастей
 */
export const PartsCountBadge: React.FC<Omit<CountBadgeProps, 'type'>> = (props) => (
  <CountBadge {...props} type="parts" />
);

/**
 * Компонент для отображения количества автомобилей
 */
export const CarsCountBadge: React.FC<Omit<CountBadgeProps, 'type'>> = (props) => (
  <CountBadge {...props} type="cars" />
);
