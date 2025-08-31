"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown, X, Check, Loader2 } from 'lucide-react';
import { debounce } from '@/utils/debounce';

/**
 * Интерфейс для запчасти
 */
interface Zapchast {
  id: number;
  name: string;
}

/**
 * Интерфейс пропсов компонента автодополнения
 */
interface AutocompleteOptimizedProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (zapchast: Zapchast) => void;
  placeholder?: string;
  className?: string;
  error?: string | undefined;
  disabled?: boolean;
  required?: boolean;
  debounceDelay?: number;
  maxSuggestions?: number;
}

/**
 * Оптимизированный компонент автодополнения с ленивой загрузкой
 */
export const AutocompleteOptimized: React.FC<AutocompleteOptimizedProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = "Начните вводить название запчасти...",
  className,
  error,
  disabled = false,
  required = false,
  debounceDelay = 300,
  maxSuggestions = 10,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Zapchast[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationLoading, setValidationLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Отладочная информация
  console.log('🔧 [DEBUG] AutocompleteOptimized: Рендеринг компонента', { 
    value, 
    isOpen, 
    suggestionsCount: suggestions.length,
    isLoading,
    isValid 
  });

  // Функция для поиска запчастей через API
  const searchZapchasti = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // Отменяем предыдущий запрос
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Создаем новый AbortController
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    
    try {
      const response = await fetch(
        `/api/zapchasti/search?q=${encodeURIComponent(query)}&limit=${maxSuggestions}&type=autocomplete`,
        {
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error('Ошибка поиска');
      }

      const data = await response.json();
      
      if (data.success) {
        setSuggestions(data.data.results);
        setIsOpen(data.data.results.length > 0);
        setHighlightedIndex(-1);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Запрос был отменен, ничего не делаем
        return;
      }
      console.error('Ошибка поиска запчастей:', error);
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, [maxSuggestions]);

  // Функция для валидации запчасти
  const validateZapchast = useCallback(async (name: string) => {
    if (!name.trim()) {
      setIsValid(null);
      return;
    }

    setValidationLoading(true);
    
    try {
      const response = await fetch(
        `/api/zapchasti/validate?name=${encodeURIComponent(name)}`
      );

      if (response.ok) {
        const data = await response.json();
        setIsValid(data.success && data.data.exists);
      } else {
        setIsValid(false);
      }
    } catch (error) {
      console.error('Ошибка валидации запчасти:', error);
      setIsValid(false);
    } finally {
      setValidationLoading(false);
    }
  }, []);

  // Дебаунсированный поиск
  const debouncedSearch = useMemo(
    () => debounce(searchZapchasti, debounceDelay),
    [searchZapchasti, debounceDelay]
  );

  // Дебаунсированная валидация
  const debouncedValidation = useMemo(
    () => debounce(validateZapchast, 500),
    [validateZapchast]
  );

  // Обработка изменений в поле ввода
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Сбрасываем валидацию при изменении
    setIsValid(null);
    
    // Запускаем поиск и валидацию
    debouncedSearch(newValue);
    debouncedValidation(newValue);
  }, [onChange, debouncedSearch, debouncedValidation]);

  // Обработка выбора запчасти
  const handleSelect = useCallback((zapchast: Zapchast) => {
    onChange(zapchast.name);
    onSelect?.(zapchast);
    setIsOpen(false);
    setSuggestions([]);
    setHighlightedIndex(-1);
    setIsValid(true);
    inputRef.current?.focus();
  }, [onChange, onSelect]);

  // Обработка навигации по клавиатуре
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  }, [isOpen, suggestions, highlightedIndex, handleSelect]);

  // Обработка клика вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Определяем состояние валидации
  const validationState = useMemo(() => {
    if (validationLoading) return 'loading';
    if (isValid === null) return 'neutral';
    return isValid ? 'valid' : 'invalid';
  }, [isValid, validationLoading]);

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (value.trim() && suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(
            'w-full px-3 py-2 border rounded-lg text-sm transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
            'disabled:bg-neutral-100 disabled:cursor-not-allowed',
            error ? 'border-error focus:ring-error' : 
            validationState === 'valid' ? 'border-success' :
            validationState === 'invalid' ? 'border-error' : 'border-neutral-300',
            'pr-10' // Место для иконки
          )}
        />
        
        {/* Иконка состояния */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {validationState === 'loading' && (
            <Loader2 className="w-4 h-4 text-neutral-400 animate-spin" />
          )}
          {validationState === 'valid' && value && (
            <Check className="w-4 h-4 text-success" />
          )}
          {validationState === 'invalid' && value && (
            <X className="w-4 h-4 text-error" />
          )}
        </div>
        
        {/* Иконка выпадающего списка */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <ChevronDown 
            className={cn(
              'w-4 h-4 text-neutral-400 transition-transform duration-200',
              isOpen && 'rotate-180'
            )} 
          />
        </div>
      </div>

      {/* Сообщение об ошибке */}
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}

      {/* Сообщение о валидации */}
      {value && validationState === 'invalid' && (
        <p className="mt-1 text-sm text-error">
          Запчасть не найдена в списке. Выберите из предложенных вариантов.
        </p>
      )}

      {/* Выпадающий список */}
      {isOpen && (suggestions.length > 0 || isLoading) && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {isLoading && (
            <div className="px-3 py-2 text-sm text-neutral-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Поиск запчастей...
            </div>
          )}
          
          {!isLoading && suggestions.map((zapchast, index) => (
            <div
              key={zapchast.id}
              className={cn(
                'px-3 py-2 cursor-pointer text-sm transition-colors duration-150',
                'hover:bg-neutral-50',
                highlightedIndex === index && 'bg-primary/10 text-primary'
              )}
              onClick={() => handleSelect(zapchast)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {zapchast.name}
            </div>
          ))}
          
          {!isLoading && suggestions.length === 0 && value.trim() && (
            <div className="px-3 py-2 text-sm text-neutral-500">
              Запчасти не найдены
            </div>
          )}
        </div>
      )}

      {/* Сообщение о количестве результатов */}
      {isOpen && suggestions.length > 0 && !isLoading && (
        <div className="absolute z-40 w-full mt-1 bg-neutral-50 border border-neutral-200 rounded-b-lg px-3 py-1 text-xs text-neutral-500">
          Найдено {suggestions.length} запчастей. Используйте ↑↓ для навигации, Enter для выбора.
        </div>
      )}
    </div>
  );
};
