/**
 * Утилиты для адаптивного форматирования чисел
 */

/**
 * Форматирует число с адаптивным отображением в зависимости от размера экрана
 * @param value - Числовое значение
 * @param options - Опции форматирования
 * @returns Отформатированная строка
 */
export function formatNumber(
  value: number,
  options: {
    compact?: boolean; // Использовать сокращенную форму (1K, 1M)
    currency?: boolean; // Добавить символ валюты
    currencySymbol?: string; // Символ валюты (по умолчанию ₽)
    decimals?: number; // Количество знаков после запятой
    responsive?: boolean; // Адаптивное форматирование
  } = {}
): string {
  const {
    compact = false,
    currency = false,
    currencySymbol = '₽',
    decimals = 0,
    responsive = true
  } = options;

  // Если не нужно адаптивное форматирование, используем стандартное
  if (!responsive) {
    const formatted = new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      ...(compact && {
        notation: 'compact',
        compactDisplay: 'short'
      })
    }).format(value);

    return currency ? `${currencySymbol}${formatted}` : formatted;
  }

  // Адаптивное форматирование
  let formatted: string;

  if (compact) {
    // Сокращенная форма для больших чисел
    if (value >= 1000000) {
      formatted = `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      formatted = `${(value / 1000).toFixed(1)}K`;
    } else {
      formatted = value.toString();
    }
  } else {
    // Полная форма с разделителями
    formatted = new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }

  return currency ? `${currencySymbol}${formatted}` : formatted;
}

/**
 * Форматирует количество элементов с правильными окончаниями
 * @param count - Количество
 * @param singular - Единственное число
 * @param plural - Множественное число (2-4)
 * @param genitive - Родительный падеж (5-20)
 * @returns Отформатированная строка
 */
export function formatCount(
  count: number,
  singular: string,
  plural: string,
  genitive: string
): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  let word: string;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    word = genitive;
  } else if (lastDigit === 1) {
    word = singular;
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    word = plural;
  } else {
    word = genitive;
  }

  return `${formatNumber(count)} ${word}`;
}

/**
 * Форматирует количество запчастей
 * @param count - Количество запчастей
 * @returns Отформатированная строка
 */
export function formatPartsCount(count: number): string {
  return formatCount(count, 'запчасть', 'запчасти', 'запчастей');
}

/**
 * Форматирует количество автомобилей
 * @param count - Количество автомобилей
 * @returns Отформатированная строка
 */
export function formatCarsCount(count: number): string {
  return formatCount(count, 'автомобиль', 'автомобиля', 'автомобилей');
}

/**
 * Форматирует цену с адаптивным отображением
 * @param price - Цена в рублях
 * @param options - Дополнительные опции
 * @returns Отформатированная цена
 */
export function formatPrice(
  price: number,
  options: {
    compact?: boolean;
    responsive?: boolean;
  } = {}
): string {
  return formatNumber(price, {
    currency: true,
    compact: options.compact ?? false,
    responsive: options.responsive ?? false,
    decimals: 0
  });
}

/**
 * Получает размер экрана для адаптивного форматирования
 * @returns Размер экрана
 */
export function getScreenSize(): 'xs' | 'sm' | 'md' | 'lg' | 'xl' {
  if (typeof window === 'undefined') return 'lg';
  
  const width = window.innerWidth;
  
  if (width < 640) return 'xs';
  if (width < 768) return 'sm';
  if (width < 1024) return 'md';
  if (width < 1280) return 'lg';
  return 'xl';
}

/**
 * Адаптивно форматирует число в зависимости от размера экрана
 * @param value - Числовое значение
 * @param options - Опции форматирования
 * @returns Отформатированная строка
 */
export function formatResponsiveNumber(
  value: number,
  options: {
    currency?: boolean;
    compact?: boolean;
    xs?: string; // Формат для очень маленьких экранов
    sm?: string; // Формат для маленьких экранов
    md?: string; // Формат для средних экранов
    lg?: string; // Формат для больших экранов
    xl?: string; // Формат для очень больших экранов
  } = {}
): string {
  const screenSize = getScreenSize();
  
  // Если указан специальный формат для текущего размера экрана
  if (options[screenSize]) {
    return options[screenSize]!;
  }

  // Адаптивное форматирование по умолчанию
  const compactThresholds = {
    xs: 100,    // На очень маленьких экранах сокращаем числа от 100
    sm: 1000,   // На маленьких экранах сокращаем числа от 1000
    md: 10000,  // На средних экранах сокращаем числа от 10000
    lg: 100000, // На больших экранах сокращаем числа от 100000
    xl: 1000000 // На очень больших экранах сокращаем числа от 1000000
  };

  const shouldCompact = value >= compactThresholds[screenSize];
  
  return formatNumber(value, {
    compact: shouldCompact,
    currency: options.currency ?? false,
    responsive: true
  });
}
