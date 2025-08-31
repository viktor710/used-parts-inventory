import React from 'react';
import { cn } from '@/utils/cn';

/**
 * Интерфейс пропсов карточки
 */
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Основной контейнер карточки
 */
export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div 
      className={cn(
        'bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden',
        'transition-all duration-200 hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

/**
 * Заголовок карточки
 */
export const CardHeader: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4 border-b border-neutral-200', className)}>
      {children}
    </div>
  );
};

/**
 * Содержимое карточки
 */
export const CardContent: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
};

/**
 * Футер карточки
 */
export const CardFooter: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn('px-6 py-4 border-t border-neutral-200 bg-neutral-50', className)}>
      {children}
    </div>
  );
};

/**
 * Заголовок карточки
 */
export const CardTitle: React.FC<CardProps> = ({ children, className }) => {
  return (
    <h3 className={cn('text-lg font-semibold text-neutral-900', className)}>
      {children}
    </h3>
  );
};

/**
 * Подзаголовок карточки
 */
export const CardDescription: React.FC<CardProps> = ({ children, className }) => {
  return (
    <p className={cn('text-sm text-neutral-600 mt-1', className)}>
      {children}
    </p>
  );
};
