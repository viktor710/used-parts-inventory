import React from 'react';
import { cn } from '@/utils/cn';
import { PartCategory, PartCondition, PartStatus } from '@/types';

/**
 * Типы для вариантов бейджа
 */
type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

/**
 * Интерфейс пропсов бейджа
 */
interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

/**
 * Компонент бейджа для отображения статусов, категорий и других меток
 */
export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default',
  className 
}) => {
  const variantClasses = {
    default: 'bg-neutral-100 text-neutral-800',
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    error: 'bg-error/10 text-error border border-error/20',
    info: 'bg-info/10 text-info border border-info/20',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variantClasses[variant],
      className
    )}>
      {children}
    </span>
  );
};

/**
 * Бейдж для отображения категории запчасти
 */
export const CategoryBadge: React.FC<{ category: PartCategory }> = ({ category }) => {
  const categoryLabels: Record<PartCategory, string> = {
    engine: 'Двигатель',
    transmission: 'Трансмиссия',
    suspension: 'Подвеска',
    brakes: 'Тормоза',
    electrical: 'Электрика',
    body: 'Кузов',
    interior: 'Салон',
    exterior: 'Внешние элементы',
    other: 'Прочее',
  };

  const categoryColors: Record<PartCategory, BadgeVariant> = {
    engine: 'error',
    transmission: 'warning',
    suspension: 'info',
    brakes: 'error',
    electrical: 'info',
    body: 'default',
    interior: 'default',
    exterior: 'default',
    other: 'default',
  };

  return (
    <Badge variant={categoryColors[category]}>
      {categoryLabels[category]}
    </Badge>
  );
};

/**
 * Бейдж для отображения состояния запчасти
 */
export const ConditionBadge: React.FC<{ condition: PartCondition }> = ({ condition }) => {
  const conditionLabels: Record<PartCondition, string> = {
    excellent: 'Отличное',
    good: 'Хорошее',
    fair: 'Удовлетворительное',
    poor: 'Плохое',
    broken: 'Сломанное',
  };

  const conditionColors: Record<PartCondition, BadgeVariant> = {
    excellent: 'success',
    good: 'success',
    fair: 'warning',
    poor: 'error',
    broken: 'error',
  };

  return (
    <Badge variant={conditionColors[condition]}>
      {conditionLabels[condition]}
    </Badge>
  );
};

/**
 * Бейдж для отображения статуса запчасти
 */
export const StatusBadge: React.FC<{ status: PartStatus }> = ({ status }) => {
  const statusLabels: Record<PartStatus, string> = {
    available: 'Доступна',
    reserved: 'Зарезервирована',
    sold: 'Продана',
    scrapped: 'Утилизирована',
  };

  const statusColors: Record<PartStatus, BadgeVariant> = {
    available: 'success',
    reserved: 'warning',
    sold: 'info',
    scrapped: 'error',
  };

  return (
    <Badge variant={statusColors[status]}>
      {statusLabels[status]}
    </Badge>
  );
};
