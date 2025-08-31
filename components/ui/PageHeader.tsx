"use client";

import React from 'react';
import { CountBadge } from './CountBadge';

/**
 * Интерфейс для заголовка страницы
 */
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  countType?: 'parts' | 'cars' | 'general';
  children?: React.ReactNode;
  className?: string;
}

/**
 * Адаптивный компонент заголовка страницы с отображением статистики
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  count,
  countType = 'general',
  children,
  className = ''
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              {title}
            </h1>
            {count !== undefined && (
              <CountBadge
                count={count}
                type={countType}
                variant="info"
                size="lg"
                responsive={true}
              />
            )}
          </div>
          {subtitle && (
            <p className="text-neutral-600 text-sm sm:text-base">
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div className="flex-shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Компонент для заголовка страницы с количеством запчастей
 */
export const PartsPageHeader: React.FC<Omit<PageHeaderProps, 'countType'>> = (props) => (
  <PageHeader {...props} countType="parts" />
);

/**
 * Компонент для заголовка страницы с количеством автомобилей
 */
export const CarsPageHeader: React.FC<Omit<PageHeaderProps, 'countType'>> = (props) => (
  <PageHeader {...props} countType="cars" />
);
