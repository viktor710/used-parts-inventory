"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown, X, Check } from 'lucide-react';
import { Zapchast, getAutocompleteSuggestions, isZapchastExists } from '@/lib/zapchasti-data';

/**
 * Интерфейс пропсов компонента автодополнения
 */
interface AutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (zapchast: Zapchast) => void;
  placeholder?: string;
  className?: string;
  error?: string | undefined;
  disabled?: boolean;
  required?: boolean;
}

/**
 * Компонент автодополнения для выбора запчастей
 */
export const Autocomplete: React.FC<AutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = "Начните вводить название запчасти...",
  className,
  error,
  disabled = false,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Zapchast[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Отладочная информация
  console.log('🔧 [DEBUG] Autocomplete: Рендеринг компонента', { value, isOpen, suggestionsCount: suggestions.length });

  // Обработка изменений в поле ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (newValue.trim()) {
      const newSuggestions = getAutocompleteSuggestions(newValue, 10);
      setSuggestions(newSuggestions);
      setIsOpen(newSuggestions.length > 0);
      setHighlightedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  // Обработка выбора запчасти
  const handleSelect = (zapchast: Zapchast) => {
    onChange(zapchast.name);
    onSelect?.(zapchast);
    setIsOpen(false);
    setSuggestions([]);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  // Обработка навигации по клавиатуре
  const handleKeyDown = (e: React.KeyboardEvent) => {
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
  };

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

  // Проверка валидности значения
  const isValid = value ? isZapchastExists(value) : !required;

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
            isValid ? 'border-success' : 'border-neutral-300',
            'pr-10' // Место для иконки
          )}
        />
        
        {/* Иконка валидации */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {value && (
            isValid ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <X className="w-4 h-4 text-error" />
            )
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
      {value && !isValid && (
        <p className="mt-1 text-sm text-error">
          Запчасть не найдена в списке. Выберите из предложенных вариантов.
        </p>
      )}

      {/* Выпадающий список */}
      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((zapchast, index) => (
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
        </div>
      )}

      {/* Сообщение о количестве результатов */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-40 w-full mt-1 bg-neutral-50 border border-neutral-200 rounded-b-lg px-3 py-1 text-xs text-neutral-500">
          Найдено {suggestions.length} запчастей. Используйте ↑↓ для навигации, Enter для выбора.
        </div>
      )}
    </div>
  );
};
