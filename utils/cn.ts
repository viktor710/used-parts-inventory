import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Утилита для объединения классов CSS
 * Использует clsx для условного объединения классов и tailwind-merge для разрешения конфликтов
 * 
 * @param inputs - Массив классов CSS или объектов с условиями
 * @returns Объединенная строка классов CSS
 * 
 * @example
 * cn('px-2 py-1', 'bg-red-500', { 'text-white': isActive })
 * // Результат: "px-2 py-1 bg-red-500 text-white" (если isActive = true)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
