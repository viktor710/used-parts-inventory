import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/database-service';
import { CreateCarInput, CarFilters, BodyType, FuelType } from '@/types';
import { successResponse, errorResponse, handleApiError, validateRequiredFields, validateFieldTypes, safeParseInt, safeParseString } from '@/lib/api-utils';

// Проверяем, что мы не в процессе сборки
const isBuildTime = false; // Отключаем проверку времени сборки для development

/**
 * GET /api/cars
 * Получение списка автомобилей с фильтрацией и пагинацией
 */
export async function GET(request: NextRequest) {
  // Если это время сборки, возвращаем пустой ответ
  if (isBuildTime) {
    return NextResponse.json({
      success: true,
      data: {
        cars: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      },
    });
  }

  console.log('🔧 [DEBUG] API GET /api/cars: Запрос получен');
  
  try {

    const { searchParams } = new URL(request.url);
    
    // Параметры пагинации
    const page = safeParseInt(searchParams.get('page'), 1);
    const limit = safeParseInt(searchParams.get('limit'), 20);
    
    // Параметры фильтрации
    const brand = safeParseString(searchParams.get('brand'));
    const model = safeParseString(searchParams.get('model'));
    const year = searchParams.get('year') ? safeParseInt(searchParams.get('year'), 0) : undefined;
    const bodyType = safeParseString(searchParams.get('bodyType'));
    const fuelType = safeParseString(searchParams.get('fuelType'));
    const minMileage = searchParams.get('minMileage') ? safeParseInt(searchParams.get('minMileage'), 0) : undefined;
    const maxMileage = searchParams.get('maxMileage') ? safeParseInt(searchParams.get('maxMileage'), 0) : undefined;
    
    // Построение фильтров
    const filters: CarFilters = {};
    if (brand) filters.brand = brand;
    if (model) filters.model = model;
    if (year) filters.year = year;
    if (bodyType) filters.bodyType = bodyType as BodyType;
    if (fuelType) filters.fuelType = fuelType as FuelType;
    if (minMileage) filters.minMileage = minMileage;
    if (maxMileage) filters.maxMileage = maxMileage;
    
    // Получение данных из базы
    console.log('🔧 [DEBUG] API GET /api/cars: Запрос к базе данных', { filters });
    const result = await dbService.getCars(page, limit, filters);
    
    console.log('🔧 [DEBUG] API GET /api/cars: Получено автомобилей', { 
      count: result.data.length, 
      total: result.total 
    });
    
    return successResponse({
      cars: result.data,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/cars');
  }
}

/**
 * POST /api/cars
 * Создание нового автомобиля
 */
export async function POST(request: NextRequest) {
  // Если это время сборки, возвращаем ошибку
  if (isBuildTime) {
    return NextResponse.json(
      { success: false, error: 'API недоступно во время сборки' },
      { status: 503 }
    );
  }

  console.log('🔧 [DEBUG] API POST /api/cars: Запрос на создание автомобиля');
  
  try {

    // Парсим тело запроса
    let body: unknown;
    try {
      body = await request.json();
      console.log('🔧 [DEBUG] API POST /api/cars: Получены данные:', body);
    } catch (parseError) {
      console.error('🔧 [DEBUG] API POST /api/cars: Ошибка парсинга JSON:', parseError);
      return NextResponse.json(
        { success: false, error: 'Неверный формат JSON в теле запроса' },
        { status: 400 }
      );
    }
    
    // Проверяем, что body является объектом
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Тело запроса должно быть объектом' },
        { status: 400 }
      );
    }
    
    const bodyObj = body as Record<string, unknown>;
    
    // Валидация обязательных полей
    const requiredFields = ['brand', 'model', 'year', 'bodyType', 'fuelType', 'engineVolume', 'transmission', 'mileage', 'vin', 'color'];
    const fieldValidation = validateRequiredFields(bodyObj, requiredFields);
    
    if (!fieldValidation.isValid) {
      return errorResponse(
        `Отсутствуют обязательные поля: ${fieldValidation.missingFields.join(', ')}`,
        400
      );
    }

    // Валидация типов данных
    const typeValidation = validateFieldTypes(bodyObj, {
      year: { 
        type: 'number',
        validator: (value) => typeof value === 'number' && value >= 1900 && value <= new Date().getFullYear() + 1
      },
      mileage: { 
        type: 'number',
        validator: (value) => typeof value === 'number' && value >= 0
      },
      vin: { 
        type: 'string',
        validator: (value) => typeof value === 'string' && value.length === 17
      }
    });
    
    if (!typeValidation.isValid) {
      return errorResponse(
        `Ошибка валидации типов: ${typeValidation.errors.join(', ')}`,
        400
      );
    }
    
    // Валидация VIN (должен быть уникальным)
    try {
      const existingCars = await dbService.searchCars(bodyObj['vin'] as string);
      const existingCar = existingCars.find(car => car.vin === bodyObj['vin']);
      if (existingCar) {
        console.error('🔧 [DEBUG] API POST /api/cars: VIN уже существует:', bodyObj['vin']);
        return NextResponse.json(
          { success: false, error: 'Автомобиль с таким VIN уже существует' },
          { status: 400 }
        );
      }
    } catch (searchError) {
      console.error('🔧 [DEBUG] API POST /api/cars: Ошибка поиска существующего VIN:', searchError);
      // Продолжаем выполнение, так как это может быть временная ошибка
    }
    
    // Создание автомобиля в базе данных
    const carData: CreateCarInput = {
      brand: (bodyObj['brand'] as string).trim(),
      model: (bodyObj['model'] as string).trim(),
      year: bodyObj['year'] as number,
      bodyType: bodyObj['bodyType'] as BodyType,
      fuelType: bodyObj['fuelType'] as FuelType,
      engineVolume: (bodyObj['engineVolume'] as string).trim(),
      transmission: (bodyObj['transmission'] as string).trim(),
      mileage: bodyObj['mileage'] as number,
      vin: (bodyObj['vin'] as string).trim().toUpperCase(),
      color: (bodyObj['color'] as string).trim(),
      description: (bodyObj['description'] as string) || '',
      images: (bodyObj['images'] as string[]) || [],
      notes: (bodyObj['notes'] as string) || '',
    };
    
    console.log('🔧 [DEBUG] API POST /api/cars: Создаем автомобиль с данными:', carData);
    
    const newCar = await dbService.createCar(carData);
    
    console.log('🔧 [DEBUG] API POST /api/cars: Автомобиль успешно создан:', newCar);
    
    return successResponse(newCar, 201);
  } catch (error) {
    return handleApiError(error, 'POST /api/cars');
  }
}
