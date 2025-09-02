'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  folder?: string;
  maxImages?: number;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  folder = 'general',
  maxImages = 5,
  className
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = useCallback(async (files: FileList) => {
    console.log('🔧 [DEBUG] ImageUpload: Начало загрузки файлов:', {
      filesCount: files.length,
      currentImagesCount: images.length,
      maxImages: maxImages,
      files: Array.from(files).map(f => ({ name: f.name, size: f.size, type: f.type }))
    });

    if (images.length >= maxImages) {
      alert(`Максимальное количество изображений: ${maxImages}`);
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        console.log(`🔧 [DEBUG] ImageUpload: Загрузка файла ${index + 1}/${files.length}:`, {
          name: file.name,
          size: file.size,
          type: file.type
        });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Ошибка загрузки файла ${file.name}: ${response.status}`);
        }

        const result = await response.json();
        if (process.env.NODE_ENV === 'development') {
  console.log(`🔧 [DEBUG] ImageUpload: Файл ${index + 1} успешно загружен:`, result.data.secure_url);
};
        return result.data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      console.log('🔧 [DEBUG] ImageUpload: Все файлы загружены:', {
        uploadedUrls: uploadedUrls,
        currentImages: images,
        newImages: [...images, ...uploadedUrls]
      });

      onImagesChange([...images, ...uploadedUrls]);
    } catch (error) {
      console.error('🔧 [DEBUG] ImageUpload: Ошибка загрузки:', error);
      alert('Ошибка при загрузке изображений');
    } finally {
      setIsUploading(false);
    }
  }, [images, maxImages, folder, onImagesChange]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleUpload(e.target.files);
    }
  }, [handleUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleUpload(e.dataTransfer.files);
    }
  }, [handleUpload]);

  const removeImage = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Область загрузки */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400',
          isUploading && 'opacity-50 pointer-events-none'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="image-upload"
          disabled={isUploading}
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <div className="flex flex-col items-center space-y-2">
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            ) : (
              <Upload className="h-8 w-8 text-gray-400" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-700">
                {isUploading ? 'Загрузка...' : 'Перетащите изображения сюда или нажмите для выбора'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Поддерживаются: JPG, PNG, GIF (макс. {maxImages} файлов)
              </p>
            </div>
          </div>
        </label>
      </div>

      {/* Предварительный просмотр */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={image}
                  alt={`Изображение ${index + 1}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-image.svg';
                  }}
                />
              </div>
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Счетчик изображений */}
      <div className="text-sm text-gray-500">
        {images.length} / {maxImages} изображений
      </div>
    </div>
  );
};
