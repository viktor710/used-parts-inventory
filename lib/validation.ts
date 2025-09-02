import { z } from 'zod';

// Базовые схемы для переиспользования
const urlSchema = z.string().url('Неверный формат URL').optional();
const positiveNumberSchema = z.number().positive('Значение должно быть положительным');
const nonEmptyStringSchema = z.string().min(1, 'Поле обязательно для заполнения');

// Схемы для перечислений
const bodyTypeSchema = z.enum(['sedan', 'hatchback', 'wagon', 'suv', 'coupe', 'convertible', 'pickup', 'van', 'other']);
const fuelTypeSchema = z.enum(['gasoline', 'diesel', 'hybrid', 'electric', 'lpg', 'other']);
const partCategorySchema = z.enum(['engine', 'transmission', 'suspension', 'brakes', 'electrical', 'body', 'interior', 'exterior', 'other']);
const partConditionSchema = z.enum(['excellent', 'good', 'fair', 'poor', 'broken']);
const partStatusSchema = z.enum(['available', 'reserved', 'sold', 'scrapped']);

/**
 * Схема валидации для автомобиля
 */
export const CarSchema = z.object({
  brand: nonEmptyStringSchema.min(2, 'Бренд должен содержать минимум 2 символа'),
  model: nonEmptyStringSchema.min(1, 'Модель обязательна'),
  year: z.number()
    .min(1900, 'Год должен быть не раньше 1900')
    .max(new Date().getFullYear() + 1, 'Год не может быть в будущем'),
  bodyType: bodyTypeSchema,
  fuelType: fuelTypeSchema,
  engineVolume: nonEmptyStringSchema.min(1, 'Объем двигателя обязателен'),
  transmission: nonEmptyStringSchema.min(1, 'Трансмиссия обязательна'),
  mileage: z.number().min(0, 'Пробег не может быть отрицательным'),
  vin: nonEmptyStringSchema
    .min(17, 'VIN должен содержать 17 символов')
    .max(17, 'VIN должен содержать 17 символов')
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'Неверный формат VIN'),
  color: nonEmptyStringSchema.min(1, 'Цвет обязателен'),
  description: z.string().optional(),
  images: z.array(urlSchema).default([]),
  notes: z.string().optional(),
});

/**
 * Схема валидации для запчасти
 */
export const PartSchema = z.object({
  zapchastName: nonEmptyStringSchema.min(2, 'Название запчасти должно содержать минимум 2 символа'),
  category: partCategorySchema,
  carId: nonEmptyStringSchema.min(1, 'ID автомобиля обязателен'),
  condition: partConditionSchema,
  status: partStatusSchema,
  price: positiveNumberSchema.max(10000000, 'Цена не может превышать 10 миллионов'),
  description: nonEmptyStringSchema.min(10, 'Описание должно содержать минимум 10 символов'),
  location: nonEmptyStringSchema.min(2, 'Место хранения должно содержать минимум 2 символа'),
  supplier: nonEmptyStringSchema.min(2, 'Поставщик должен содержать минимум 2 символа'),
  purchaseDate: z.date(),
  purchasePrice: positiveNumberSchema.max(10000000, 'Цена приобретения не может превышать 10 миллионов'),
  images: z.array(urlSchema).default([]),
  notes: z.string().optional(),
});

/**
 * Схема валидации для поставщика
 */
export const SupplierSchema = z.object({
  name: nonEmptyStringSchema.min(2, 'Название должно содержать минимум 2 символа'),
  contact: nonEmptyStringSchema.min(2, 'Контактное лицо должно содержать минимум 2 символа'),
  phone: z.string()
    .min(10, 'Телефон должен содержать минимум 10 цифр')
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, 'Неверный формат телефона'),
  email: z.string().email('Неверный формат email'),
  address: nonEmptyStringSchema.min(10, 'Адрес должен содержать минимум 10 символов'),
  notes: z.string().optional(),
});

/**
 * Схема валидации для клиента
 */
export const CustomerSchema = z.object({
  name: nonEmptyStringSchema.min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string()
    .min(10, 'Телефон должен содержать минимум 10 цифр')
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, 'Неверный формат телефона'),
  email: z.string().email('Неверный формат email'),
  address: nonEmptyStringSchema.min(10, 'Адрес должен содержать минимум 10 символов'),
  notes: z.string().optional(),
});

/**
 * Схема валидации для продажи
 */
export const SaleSchema = z.object({
  partId: nonEmptyStringSchema.min(1, 'ID запчасти обязателен'),
  customerId: nonEmptyStringSchema.min(1, 'ID клиента обязателен'),
  price: positiveNumberSchema.max(10000000, 'Цена не может превышать 10 миллионов'),
  saleDate: z.date(),
  notes: z.string().optional(),
});

/**
 * Схема валидации для поиска запчастей
 */
export const PartSearchSchema = z.object({
  query: z.string().min(1, 'Поисковый запрос обязателен'),
  category: partCategorySchema.optional(),
  condition: partConditionSchema.optional(),
  status: partStatusSchema.optional(),
  minPrice: z.number().min(0, 'Минимальная цена не может быть отрицательной').optional(),
  maxPrice: z.number().min(0, 'Максимальная цена не может быть отрицательной').optional(),
  carId: z.string().optional(),
  page: z.number().min(1, 'Номер страницы должен быть больше 0').default(1),
  limit: z.number().min(1, 'Лимит должен быть больше 0').max(100, 'Лимит не может превышать 100').default(20),
});

/**
 * Схема валидации для загрузки изображений
 */
export const ImageUploadSchema = z.object({
  file: z.instanceof(File, { message: 'Файл обязателен' })
    .refine((file) => file.size <= 10 * 1024 * 1024, 'Размер файла не может превышать 10MB')
    .refine((file) => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type), 'Поддерживаются только изображения'),
  folder: z.string().min(1, 'Папка обязательна'),
});

/**
 * Схема валидации для фильтров автомобилей
 */
export const CarFilterSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  yearFrom: z.number().min(1900).optional(),
  yearTo: z.number().max(new Date().getFullYear() + 1).optional(),
  bodyType: bodyTypeSchema.optional(),
  fuelType: fuelTypeSchema.optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

/**
 * Типы для использования в приложении
 */
export type CarInput = z.infer<typeof CarSchema>;
export type PartInput = z.infer<typeof PartSchema>;
export type SupplierInput = z.infer<typeof SupplierSchema>;
export type CustomerInput = z.infer<typeof CustomerSchema>;
export type SaleInput = z.infer<typeof SaleSchema>;
export type PartSearchInput = z.infer<typeof PartSearchSchema>;
export type CarFilterInput = z.infer<typeof CarFilterSchema>;

/**
 * Утилиты для валидации
 */
export class ValidationService {
  /**
   * Валидация данных с возвратом ошибок
   */
  static validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
    try {
      const result = schema.parse(data);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error instanceof z.ZodError ? error.issues.map(issue => issue.message) : ['Неизвестная ошибка валидации'];
        return { success: false, errors };
      }
      return { success: false, errors: ['Неизвестная ошибка валидации'] };
    }
  }

  /**
   * Валидация данных с выбросом исключения
   */
  static validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
    return schema.parse(data);
  }

  /**
   * Безопасная валидация с возвратом null при ошибке
   */
  static safeValidate<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
    try {
      return schema.parse(data);
    } catch {
      return null;
    }
  }

  /**
   * Валидация частичных данных (для обновлений)
   */
  static validatePartial<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: Partial<T> } | { success: false; errors: string[] } {
    try {
      // Проверяем, поддерживает ли схема метод partial
      if ('partial' in schema && typeof schema.partial === 'function') {
        const partialSchema = schema.partial();
        const result = partialSchema.parse(data);
        return { success: true, data: result };
      } else {
        // Если partial не поддерживается, используем обычную валидацию
        const result = schema.parse(data);
        return { success: true, data: result };
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map(issue => issue.message);
        return { success: false, errors };
      }
      return { success: false, errors: ['Неизвестная ошибка валидации'] };
    }
  }
}

/**
 * Middleware для валидации API запросов
 */
export const validateRequest = <T>(schema: z.ZodSchema<T>) => {
  return async (req: Request) => {
    try {
      const body = await req.json();
      const result = ValidationService.validate(schema, body);
      
      if (!result.success) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Ошибка валидации', 
          details: result.errors 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return result.data;
    } catch {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Неверный формат данных' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
};
