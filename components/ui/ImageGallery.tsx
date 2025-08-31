'use client';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { OptimizedImage } from './OptimizedImage';

interface ImageGalleryProps {
  images: string[];
  className?: string;
  maxPreview?: number;
  showCount?: boolean;
  aspectRatio?: 'square' | 'video' | 'auto';
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  className,
  maxPreview = 4,
  showCount = true,
  aspectRatio = 'square'
}) => {
  if (!images || images.length === 0) {
    return (
      <div className={cn('flex items-center justify-center p-8 text-gray-400', className)}>
        <div className="text-center">
          <ImageIcon className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">Нет изображений</p>
        </div>
      </div>
    );
  }

  const previewImages = images.slice(0, maxPreview);
  const remainingCount = images.length - maxPreview;

  // Отладочная информация
  console.log('🔧 [DEBUG] ImageGallery: Настройки:', {
    totalImages: images.length,
    maxPreview: maxPreview,
    previewImagesCount: previewImages.length,
    remainingCount: remainingCount,
    previewImages: previewImages
  });

  // Определяем классы для разных пропорций
  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'video':
        return 'aspect-video';
      case 'auto':
        return 'aspect-auto';
      default:
        return 'aspect-square';
    }
  };

  // Определяем классы сетки в зависимости от количества изображений
  const getGridClass = () => {
    const count = images.length; // Используем полное количество изображений
    
    // Отладочная информация
    console.log('🔧 [DEBUG] ImageGallery: Количество изображений:', count, 'Сетка:', 
      count === 1 ? 'grid-cols-1' : 
      count === 2 ? 'grid-cols-2' : 
      count === 3 ? 'grid-cols-2 md:grid-cols-3' : 
      'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    );
    
    if (count === 1) {
      return 'grid-cols-1';
    } else if (count === 2) {
      return 'grid-cols-2';
    } else if (count === 3) {
      return 'grid-cols-2 md:grid-cols-3';
    } else {
      return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };

  return (
    <>
      <div 
        className={cn(
          'grid gap-2', 
          getGridClass(), 
          className
        )}
      >
        {previewImages.map((image, index) => {
          // Отладочная информация для каждого изображения
          console.log(`🔧 [DEBUG] ImageGallery: Рендеринг изображения ${index + 1}:`, {
            url: image,
            index: index,
            totalImages: previewImages.length
          });
          
          return (
            <div
              key={index}
              className={cn(
                'relative rounded-lg overflow-hidden bg-gray-100',
                getAspectClass()
              )}
            >
              <OptimizedImage
                src={image}
                alt={`Изображение ${index + 1}`}
                width={300}
                height={300}
                className="w-full h-full object-cover"
                quality={75}
                priority={index < 2}
                onError={() => {
                  console.error(`🔧 [DEBUG] ImageGallery: Ошибка загрузки изображения ${index + 1}:`, image);
                }}
                onLoad={() => {
                  if (process.env.NODE_ENV === 'development') {
  console.log(`🔧 [DEBUG] ImageGallery: Изображение ${index + 1} успешно загружено:`, image);
};
                }}
              />
              
              {/* Счетчик дополнительных изображений */}
              {index === maxPreview - 1 && remainingCount > 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    +{remainingCount}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Счетчик изображений */}
      {showCount && images.length > 0 && (
        <div className="text-sm text-gray-500 mt-2 flex items-center">
          <ImageIcon className="w-4 h-4 mr-1" />
          {images.length} изображений
        </div>
      )}
    </>
  );
};
