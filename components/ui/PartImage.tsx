'use client';

import React from 'react';
import { Package, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { OptimizedImage } from './OptimizedImage';

interface PartImageProps {
  images: string[];
  className?: string;
  aspectRatio?: 'square' | 'video' | 'auto';
  showPlaceholder?: boolean;
  placeholderText?: string;
  onClick?: () => void;
}

export const PartImage: React.FC<PartImageProps> = ({
  images,
  className,
  aspectRatio = 'square',
  showPlaceholder = true,
  placeholderText = 'Нет фото',
  onClick
}) => {
  const hasImages = images && images.length > 0;
  const firstImage = hasImages && images[0] ? images[0] : '';
  const imageCount = images?.length || 0;

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

  if (!hasImages && !showPlaceholder) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative rounded-lg overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200',
        getAspectClass(),
        onClick && 'cursor-pointer hover:shadow-lg transition-all duration-200',
        className
      )}
      onClick={onClick}
    >
      {hasImages ? (
        <>
          <OptimizedImage
            src={firstImage}
            alt="Изображение запчасти"
            width={400}
            height={400}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            quality={80}
            priority={false}
          />
          
          {/* Overlay с количеством изображений - показываем только если больше одного */}
          {imageCount > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              +{imageCount - 1}
            </div>
          )}
          
          {/* Hover overlay - показываем иконку зума только если есть onClick или больше одного изображения */}
          {(onClick || imageCount > 1) && (
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <Package className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-sm text-neutral-500 font-medium">{placeholderText}</p>
          </div>
        </div>
      )}
    </div>
  );
};
