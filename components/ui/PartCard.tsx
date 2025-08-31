'use client';

import React, { memo } from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { OptimizedImage } from './OptimizedImage';
import { ImageGallery } from './ImageGallery';
import { cn } from '@/utils/cn';
import { Part, PartCondition, PartStatus } from '@/types';

interface PartCardProps {
  part: Part;
  onClick?: () => void;
  className?: string;
  showImages?: boolean;
}

/**
 * Карточка запчасти с оптимизацией производительности
 */
export const PartCard: React.FC<PartCardProps> = memo(({
  part,
  onClick,
  className,
  showImages = true
}) => {
  // Определяем цвет статуса
  const getStatusColor = (status: PartStatus) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-red-100 text-red-800';
      case 'scrapped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Определяем цвет состояния
  const getConditionColor = (condition: PartCondition) => {
    switch (condition) {
      case 'excellent': return 'bg-emerald-100 text-emerald-800';
      case 'good': return 'bg-green-100 text-green-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-orange-100 text-orange-800';
      case 'broken': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]',
        className
      )}
      {...(onClick && { onClick })}
    >
      <div className="p-4">
        {/* Заголовок */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {part.zapchastName}
          </h3>
          <div className="flex flex-col gap-1 ml-2">
            <Badge className={getStatusColor(part.status)}>
              {part.status === 'available' && 'Доступна'}
              {part.status === 'reserved' && 'Зарезервирована'}
              {part.status === 'sold' && 'Продана'}
              {part.status === 'scrapped' && 'Утилизирована'}
            </Badge>
            <Badge className={getConditionColor(part.condition)}>
              {part.condition === 'excellent' && 'Отличное'}
              {part.condition === 'good' && 'Хорошее'}
              {part.condition === 'fair' && 'Удовлетворительное'}
              {part.condition === 'poor' && 'Плохое'}
              {part.condition === 'broken' && 'Сломанное'}
            </Badge>
          </div>
        </div>

        {/* Изображения */}
        {showImages && part.images.length > 0 && (
          <div className="mb-3">
            {part.images.length === 1 ? (
              <OptimizedImage
                src={part.images[0] || ''}
                alt={part.zapchastName}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <ImageGallery
                images={part.images}
                alt={part.zapchastName}
                className="h-48"
              />
            )}
          </div>
        )}

        {/* Информация */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Категория:</span>
            <span className="text-sm font-medium">{part.category}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Цена:</span>
            <span className="text-lg font-bold text-green-600">
              {part.price.toLocaleString('ru-RU')} ₽
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Место хранения:</span>
            <span className="text-sm font-medium">{part.location}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Поставщик:</span>
            <span className="text-sm font-medium">{part.supplier}</span>
          </div>
        </div>

        {/* Описание */}
        {part.description && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600 line-clamp-2">
              {part.description}
            </p>
          </div>
        )}

        {/* Дополнительная информация */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Приобретена: {new Date(part.purchaseDate).toLocaleDateString('ru-RU')}</span>
            <span>Цена покупки: {part.purchasePrice.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
      </div>
    </Card>
  );
});

PartCard.displayName = 'PartCard';
