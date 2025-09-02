"use client";

import React, { useState, useCallback, memo } from 'react';
import { OptimizedImage } from './OptimizedImage';
import { cn } from '@/utils/cn';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
  maxPreview?: number;
  showCount?: boolean;
}

/**
 * Галерея изображений с оптимизацией производительности
 */
export const ImageGallery: React.FC<ImageGalleryProps> = memo(({
  images,
  alt,
  className,
  maxPreview = 3,
  showCount = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowFullscreen(false);
    } else if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  }, [handlePrevious, handleNext]);

  const handleImageClick = useCallback(() => {
    if (images.length > 1) {
      setShowFullscreen(true);
    }
  }, [images.length]);

  if (!images || !Array.isArray(images) || images.length === 0) {
    return (
      <div className={cn(
        'flex items-center justify-center bg-gray-100 rounded-lg',
        className
      )}>
        <div className="text-center text-gray-500">
          <p>Нет изображений</p>
        </div>
      </div>
    );
  }

  const previewImages = images.slice(0, maxPreview);
  const remainingCount = images.length - maxPreview;

  return (
    <>
      {/* Превью галереи */}
      <div className={cn('relative', className)}>
        <div className="grid grid-cols-3 gap-2">
          {previewImages.map((image, index) => (
            <div key={index} className="relative">
              <div onClick={handleImageClick} className="cursor-pointer">
                <OptimizedImage
                  src={image}
                  alt={`${alt} ${index + 1}`}
                  width={200}
                  height={150}
                  className="w-full h-32 object-cover rounded-lg hover:opacity-90 transition-opacity"
                />
              </div>
              {index === maxPreview - 1 && remainingCount > 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <span className="text-white font-semibold text-lg">
                    +{remainingCount}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {showCount && images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Полноэкранная галерея */}
      {showFullscreen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            {/* Кнопка закрытия */}
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 z-10 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors backdrop-blur-sm"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Основное изображение */}
            <div className="relative">
              <OptimizedImage
                src={images[currentIndex] || ''}
                alt={`${alt} ${currentIndex + 1}`}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>

            {/* Навигация */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors backdrop-blur-sm"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors backdrop-blur-sm"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Счетчик */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
});

ImageGallery.displayName = 'ImageGallery';
