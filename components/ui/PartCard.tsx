'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CategoryBadge, ConditionBadge, StatusBadge } from '@/components/ui/Badge';
import { ImageGallery } from '@/components/ui/ImageGallery';
import { PartImage } from '@/components/ui/PartImage';
import { Part, Car } from '@/types';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Package,
  MapPin,
  User
} from 'lucide-react';

interface PartCardProps {
  part: Part;
  car?: Car;
  variant?: 'compact' | 'detailed';
  onView?: (part: Part) => void;
  onEdit?: (part: Part) => void;
  onDelete?: (part: Part) => void;
}

export const PartCard: React.FC<PartCardProps> = ({
  part,
  car,
  variant = 'detailed',
  onView,
  onEdit,
  onDelete
}) => {
  const [showGallery, setShowGallery] = useState(false);

  // Отладочная информация
  console.log('🔧 [DEBUG] PartCard: Рендеринг карточки запчасти:', part.id, part.zapchastName);

  const handleImageClick = () => {
    if (part.images && part.images.length > 0) {
      setShowGallery(true);
    }
  };

  if (variant === 'compact') {
    return (
      <Card className="card-hover group">
        <div className="p-4">
          <div className="flex gap-4">
            {/* Изображение */}
            <div className="flex-shrink-0">
              <PartImage
                images={part.images}
                className="w-20 h-20"
                onClick={handleImageClick}
              />
            </div>
            
            {/* Информация */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-neutral-900 truncate group-hover:text-primary transition-colors">
                {part.zapchastName}
              </h3>
              {car && (
                <p className="text-sm text-neutral-600 truncate">
                  {car.brand} {car.model} ({car.year})
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <CategoryBadge category={part.category} />
                <span className="text-lg font-bold text-primary">
                  ₽{part.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="card-hover group">
        {/* Изображения запчасти */}
        <div className="relative">
          {part.images && part.images.length > 0 ? (
            <div className="p-4 pb-0">
              {part.images.length === 1 ? (
                // Для одного изображения используем PartImage
                <PartImage
                  images={part.images}
                  aspectRatio="video"
                  className="mb-3"
                  onClick={handleImageClick}
                />
              ) : (
                // Для нескольких изображений используем ImageGallery
                <ImageGallery 
                  images={part.images} 
                  maxPreview={3}
                  showCount={false}
                  className="mb-3"
                />
              )}
            </div>
          ) : (
            // Заглушка для отсутствующих изображений
            <div className="p-4 pb-0">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center group-hover:from-neutral-200 group-hover:to-neutral-300 transition-all duration-200">
                <div className="text-center">
                  <Package className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                  <p className="text-sm text-neutral-500 font-medium">Нет фото</p>
                  <p className="text-xs text-neutral-400">Добавьте изображения запчасти</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary transition-colors">
                {part.zapchastName}
              </h3>
              {car && (
                <p className="text-sm text-neutral-600 mb-3 flex items-center">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2"></span>
                  {car.brand} {car.model} ({car.year})
                </p>
              )}
              <div className="flex flex-wrap gap-2 mb-3">
                <CategoryBadge category={part.category} />
                <ConditionBadge condition={part.condition} />
                <StatusBadge status={part.status} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                ₽{part.price.toLocaleString()}
              </p>
              <p className="text-sm text-neutral-500 flex items-center justify-end mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {part.location}
              </p>
            </div>
          </div>
          
          <p className="text-sm text-neutral-700 mb-4 line-clamp-2">
            {part.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-500 flex items-center">
              <User className="w-3 h-3 mr-1" />
              {part.supplier}
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover:bg-primary/10 hover:text-primary"
                onClick={() => onView?.(part)}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover:bg-primary/10 hover:text-primary"
                onClick={() => onEdit?.(part)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-error hover:text-error hover:bg-error/10"
                onClick={() => onDelete?.(part)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Модальное окно с галереей */}
      {showGallery && part.images && part.images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          <div className="relative max-w-5xl max-h-full p-4">
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-4 right-4 z-10 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors backdrop-blur-sm"
            >
              ✕
            </button>
            <ImageGallery 
              images={part.images}
              maxPreview={part.images.length}
              showCount={true}
            />
          </div>
        </div>
      )}
    </>
  );
};
