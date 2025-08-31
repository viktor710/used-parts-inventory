"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/cn';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
}

/**
 * Оптимизированный компонент изображения с поддержкой Cloudinary
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 400,
  height = 300,
  className,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  fallbackSrc = '/placeholder-image.svg',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  // Обработка ошибок загрузки
  const handleError = () => {
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(true);
    }
    onError?.();
  };

  // Обработка успешной загрузки
  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  // Обновление src при изменении пропса
  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  // Оптимизация URL для Cloudinary
  const getOptimizedUrl = (url: string) => {
    if (!url || url === fallbackSrc) return url;
    
    // Если это Cloudinary URL, добавляем параметры оптимизации
    if (url.includes('res.cloudinary.com')) {
      const baseUrl = url.split('/upload/')[0];
      const imagePath = url.split('/upload/')[1];
      
      if (baseUrl && imagePath) {
        return `${baseUrl}/upload/f_auto,q_${quality},w_${width},h_${height},c_fill/${imagePath}`;
      }
    }
    
    return url;
  };

  const optimizedSrc = getOptimizedUrl(imageSrc);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Плейсхолдер во время загрузки */}
      {isLoading && (
        <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
      )}
      
      {/* Основное изображение */}
      <Image
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          hasError ? 'object-contain' : 'object-cover'
        )}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 50vw, ${width}px`}
      />
      
      {/* Индикатор загрузки */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Индикатор ошибки */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
          <div className="text-center text-neutral-500">
            <div className="w-12 h-12 mx-auto mb-2 bg-neutral-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm">Ошибка загрузки</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
