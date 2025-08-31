import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/database-service';
import { CreateCarInput } from '@/types';
import { Logger } from '@/lib/logger';

// Проверяем, что мы не в процессе сборки
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env['VERCEL'];

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

  Logger.info('API GET /api/cars: Запрос получен');
  
  try {
    const { searchParams } = new URL(request.url);
    
    // Параметры пагинации
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Параметры фильтрации
    const brand = searchParams.get('brand') || undefined;
    const model = searchParams.get('model') || undefined;
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;
    const bodyType = searchParams.get('bodyType') || undefined;
    const fuelType = searchParams.get('fuelType') || undefined;
    const minMileage = searchParams.get('minMileage') ? parseInt(searchParams.get('minMileage')!) : undefined;
    const maxMileage = searchParams.get('maxMileage') ? parseInt(searchParams.get('maxMileage')!) : undefined;
    
    // Построение фильтров
    const filters: any = {};
    if (brand) filters.brand = brand;
    if (model) filters.model = model;
    if (year) filters.year = year;
    if (bodyType) filters.bodyType = bodyType;
    if (fuelType) filters.fuelType = fuelType;
    if (minMileage) filters.minMileage = minMileage;
    if (maxMileage) filters.maxMileage = maxMileage;
    
    // Получение данных из базы
    Logger.info('API GET /api/cars: Запрос к базе данных', { filters });
    const result = await dbService.getCars(page, limit, filters);
    
    Logger.info('API GET /api/cars: Получено автомобилей', { 
      count: result.data.length, 
      total: result.total 
    });
    
    return NextResponse.json({
      success: true,
      data: {
        cars: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      },
    });
  } catch (error) {
    Logger.error('API GET /api/cars: Ошибка при получении автомобилей', error as Error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
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
    const body = await request.json();
    
    // Валидация обязательных полей
    const requiredFields = ['brand', 'model', 'year', 'bodyType', 'fuelType', 'engineVolume', 'transmission', 'mileage', 'vin', 'color'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Отсутствуют обязательные поля: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Валидация VIN (должен быть уникальным)
    const existingCars = await dbService.searchCars(body.vin);
    const existingCar = existingCars.find(car => car.vin === body.vin);
    if (existingCar) {
      return NextResponse.json(
        { success: false, error: 'Автомобиль с таким VIN уже существует' },
        { status: 400 }
      );
    }
    
    // Создание автомобиля в базе данных
    const carData: CreateCarInput = {
      ...body,
      description: body.description || '',
      images: body.images || [],
      notes: body.notes || '',
    };
    
    const newCar = await dbService.createCar(carData);
    
    return NextResponse.json({
      success: true,
      data: newCar,
    }, { status: 201 });
  } catch (error) {
    console.error('Ошибка при создании автомобиля:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
