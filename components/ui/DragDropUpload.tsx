"use client";

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Upload,
  File,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye
} from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface DragDropUploadProps {
  onFilesUploaded?: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // в байтах
  acceptedTypes?: string[];
  title?: string;
  description?: string;
}

/**
 * Компонент для drag & drop загрузки изображений
 */
export const DragDropUpload: React.FC<DragDropUploadProps> = ({
  onFilesUploaded,
  maxFiles = 5,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  title = 'Загрузка изображений',
  description = 'Перетащите изображения запчастей сюда или нажмите для выбора'
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Генерация уникального ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Проверка типа файла
  const isValidFileType = useCallback((file: File) => {
    return acceptedTypes.includes(file.type);
  }, [acceptedTypes]);

  // Проверка размера файла
  const isValidFileSize = useCallback((file: File) => {
    return file.size <= maxFileSize;
  }, [maxFileSize]);

  // Создание превью для изображения
  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  // Обработка выбранных файлов
  const handleFiles = useCallback(async (selectedFiles: FileList) => {
    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < selectedFiles.length && files.length + newFiles.length < maxFiles; i++) {
      const file = selectedFiles[i];
      
      if (!file) continue;
      
      // Проверка типа файла
      if (!isValidFileType(file)) {
        continue;
      }
      
      // Проверка размера файла
      if (!isValidFileSize(file)) {
        continue;
      }
      
      const id = generateId();
      const preview = await createPreview(file);
      
      newFiles.push({
        id,
        file,
        preview,
        status: 'uploading',
        progress: 0
      });
    }
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Имитация загрузки
    setIsUploading(true);
    newFiles.forEach((uploadedFile) => {
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === uploadedFile.id) {
            const newProgress = f.progress + 20;
            if (newProgress >= 100) {
              clearInterval(interval);
              return { ...f, progress: 100, status: 'success' as const };
            }
            return { ...f, progress: newProgress };
          }
          return f;
        }));
      }, 200);
    });
    
    setTimeout(() => {
      setIsUploading(false);
      if (onFilesUploaded) {
        onFilesUploaded(newFiles.map(f => f.file));
      }
    }, newFiles.length * 1000);
  }, [files.length, maxFiles, onFilesUploaded, isValidFileType, isValidFileSize]);

  // Обработка drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  }, [handleFiles]);

  // Обработка клика по области загрузки
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Обработка выбора файлов через input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      handleFiles(selectedFiles);
    }
  };

  // Удаление файла
  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  // Просмотр файла
  const viewFile = (file: UploadedFile) => {
    window.open(file.preview, '_blank');
  };

  // Получение иконки статуса
  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-error" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  // Форматирование размера файла
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Область загрузки */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-neutral-300 hover:border-primary hover:bg-neutral-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            {isDragOver ? 'Отпустите файлы здесь' : 'Перетащите файлы сюда'}
          </h3>
          <p className="text-neutral-600 mb-4">
            {description}
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-neutral-500">
            <span>Максимум {maxFiles} файлов</span>
            <span>•</span>
            <span>До {formatFileSize(maxFileSize)} каждый</span>
            <span>•</span>
            <span>JPG, PNG, WebP</span>
          </div>
        </div>

        {/* Скрытый input для выбора файлов */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Список загруженных файлов */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-neutral-900">
              Загруженные файлы ({files.length}/{maxFiles})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="relative group border rounded-lg p-3 hover:shadow-md transition-shadow"
                >
                  {/* Превью изображения */}
                  <div className="relative aspect-square mb-3">
                    <Image
                      src={file.preview}
                      alt={file.file.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewFile(file);
                          }}
                          className="bg-white text-neutral-900 hover:bg-white/90"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(file.id);
                          }}
                          className="bg-white text-error hover:bg-white/90"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Информация о файле */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-900 truncate">
                        {file.file.name}
                      </span>
                      {getStatusIcon(file.status)}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span>{formatFileSize(file.file.size)}</span>
                      <span>{file.file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN'}</span>
                    </div>

                    {/* Прогресс загрузки */}
                    {file.status === 'uploading' && (
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}

                    {/* Ошибка */}
                    {file.status === 'error' && file.error && (
                      <p className="text-xs text-error">{file.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Индикатор загрузки */}
        {isUploading && (
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-neutral-600">Загрузка файлов...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
