import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/database-service';
import { CreateCarInput } from '@/types';
import { checkDatabaseConnection } from '@/lib/prisma';

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
    // Проверяем подключение к базе данных
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.error('🔧 [DEBUG] API GET /api/cars: Нет подключения к базе данных');
      return NextResponse.json(
        { success: false, error: 'Ошибка подключения к базе данных' },
        { status: 503 }
      );
    }

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
    console.log('🔧 [DEBUG] API GET /api/cars: Запрос к базе данных', { filters });
    const result = await dbService.getCars(page, limit, filters);
    
    console.log('🔧 [DEBUG] API GET /api/cars: Получено автомобилей', { 
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
    console.error('🔧 [DEBUG] API GET /api/cars: Ошибка при получении автомобилей', error);
    
    // Проверяем тип ошибки
    if (error instanceof Error && error.message.includes('Prisma')) {
      return NextResponse.json(
        { success: false, error: 'Ошибка базы данных' },
        { status: 503 }
      );
    }
    
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
    // Проверяем подключение к базе данных
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.error('🔧 [DEBUG] API POST /api/cars: Нет подключения к базе данных');
      return NextResponse.json(
        { success: false, error: 'Ошибка подключения к базе данных' },
        { status: 503 }
      );
    }

    // Парсим тело запроса
    let body: any;
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
    
    // Валидация обязательных полей
    const requiredFields = ['brand', 'model', 'year', 'bodyType', 'fuelType', 'engineVolume', 'transmission', 'mileage', 'vin', 'color'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.error('🔧 [DEBUG] API POST /api/cars: Отсутствуют поля:', missingFields);
      return NextResponse.json(
        { success: false, error: `Отсутствуют обязательные поля: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Валидация типов данных
    if (typeof body.year !== 'number' || body.year < 1900 || body.year > new Date().getFullYear() + 1) {
      return NextResponse.json(
        { success: false, error: 'Неверный год выпуска' },
        { status: 400 }
      );
    }

    if (typeof body.mileage !== 'number' || body.mileage < 0) {
      return NextResponse.json(
        { success: false, error: 'Неверный пробег' },
        { status: 400 }
      );
    }

    if (typeof body.vin !== 'string' || body.vin.length !== 17) {
      return NextResponse.json(
        { success: false, error: 'VIN номер должен содержать ровно 17 символов' },
        { status: 400 }
      );
    }
    
    // Валидация VIN (должен быть уникальным)
    try {
      const existingCars = await dbService.searchCars(body.vin);
      const existingCar = existingCars.find(car => car.vin === body.vin);
      if (existingCar) {
        console.error('🔧 [DEBUG] API POST /api/cars: VIN уже существует:', body.vin);
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
      brand: body.brand.trim(),
      model: body.model.trim(),
      year: body.year,
      bodyType: body.bodyType,
      fuelType: body.fuelType,
      engineVolume: body.engineVolume.trim(),
      transmission: body.transmission.trim(),
      mileage: body.mileage,
      vin: body.vin.trim().toUpperCase(),
      color: body.color.trim(),
      description: body.description || '',
      images: body.images || [],
      notes: body.notes || '',
    };
    
    console.log('🔧 [DEBUG] API POST /api/cars: Создаем автомобиль с данными:', carData);
    
    const newCar = await dbService.createCar(carData);
    
    console.log('🔧 [DEBUG] API POST /api/cars: Автомобиль успешно создан:', newCar);
    
    return NextResponse.json({
      success: true,
      data: newCar,
    }, { status: 201 });
  } catch (error) {
    console.error('🔧 [DEBUG] API POST /api/cars: Ошибка при создании автомобиля:', error);
    
    // Проверяем тип ошибки
    if (error instanceof Error) {
      if (error.message.includes('Prisma')) {
        return NextResponse.json(
          { success: false, error: 'Ошибка базы данных' },
          { status: 503 }
        );
      }
      
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { success: false, error: 'Автомобиль с таким VIN уже существует' },
          { status: 400 }
        );
      }
      
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { success: false, error: 'Ошибка связей в базе данных' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
