import { NextResponse } from 'next/server';
import { Logger } from './logger';

/**
 * Унифицированный формат ответа API
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

/**
 * Успешный ответ API
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
  }, { status });
}

/**
 * Ответ с ошибкой API
 */
export function errorResponse(
  error: string, 
  status: number = 500, 
  details?: unknown
): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    error,
    details,
  }, { status });
}

/**
 * Обработчик ошибок для API роутов
 */
export function handleApiError(error: unknown, operation: string): NextResponse<ApiResponse> {
  Logger.error(`API Error in ${operation}`, { 
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined
  });

  // Обработка различных типов ошибок
  if (error instanceof Error) {
    // Ошибки Prisma
    if (error.message.includes('Prisma')) {
      if (error.message.includes('Unique constraint')) {
        return errorResponse('Нарушение уникальности данных', 400, { 
          operation, 
          details: error.message 
        });
      }
      
      if (error.message.includes('Foreign key constraint')) {
        return errorResponse('Ошибка связей в базе данных', 400, { 
          operation, 
          details: error.message 
        });
      }
      
      if (error.message.includes('Record to delete does not exist')) {
        return errorResponse('Запись не найдена', 404, { 
          operation, 
          details: error.message 
        });
      }
      
      return errorResponse('Ошибка базы данных', 503, { 
        operation, 
        details: error.message 
      });
    }
    
    // Ошибки валидации
    if (error.message.includes('Validation')) {
      return errorResponse('Ошибка валидации данных', 400, { 
        operation, 
        details: error.message 
      });
    }
    
    // Ошибки аутентификации
    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return errorResponse('Недостаточно прав для выполнения операции', 403, { 
        operation, 
        details: error.message 
      });
    }
    
    // Общие ошибки
    return errorResponse(error.message, 500, { 
      operation, 
      details: error.stack 
    });
  }
  
  // Неизвестные ошибки
  return errorResponse('Внутренняя ошибка сервера', 500, { 
    operation, 
    details: String(error) 
  });
}

/**
 * Валидация обязательных полей
 */
export function validateRequiredFields(
  body: Record<string, unknown>, 
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter(field => !body[field]);
  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Проверка типов данных
 */
export function validateFieldTypes(
  body: Record<string, unknown>, 
  fieldValidations: Record<string, { type: string; validator?: (value: unknown) => boolean }>
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const [field, validation] of Object.entries(fieldValidations)) {
    const value = body[field];
    
    if (value !== undefined) {
      // Проверка типа
      if (typeof value !== validation.type) {
        errors.push(`Поле ${field} должно быть типа ${validation.type}`);
        continue;
      }
      
      // Дополнительная валидация
      if (validation.validator && !validation.validator(value)) {
        errors.push(`Поле ${field} не прошло дополнительную валидацию`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Безопасное извлечение параметров запроса
 */
export function safeParseInt(value: string | null, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Безопасное извлечение строковых параметров
 */
export function safeParseString(value: string | null, defaultValue: string = ''): string {
  return value || defaultValue;
}

/**
 * Безопасное извлечение булевых параметров
 */
export function safeParseBoolean(value: string | null, defaultValue: boolean = false): boolean {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
}
