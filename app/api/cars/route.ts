import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { CreateCarInput } from '@/types';

/**
 * GET /api/cars
 * Получение списка автомобилей с фильтрацией и пагинацией
 */
export async function GET(request: NextRequest) {
  console.log('🔧 [DEBUG] API GET /api/cars: Запрос получен');
  
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
    console.log('🔧 [DEBUG] API GET /api/cars: Запрос к базе данных с фильтрами:', filters);
    const cars = db.getCars(page, limit, filters);
    
    // Получение общего количества для пагинации
    const totalCars = db.getCarStats().totalCars;
    console.log('🔧 [DEBUG] API GET /api/cars: Получено автомобилей:', cars.length, 'из', totalCars);
    
    return NextResponse.json({
      success: true,
      data: {
        cars,
        pagination: {
          page,
          limit,
          total: totalCars,
          totalPages: Math.ceil(totalCars / limit),
        },
      },
    });
  } catch (error) {
    console.error('Ошибка при получении автомобилей:', error);
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
    const existingCar = db.searchCars(body.vin).find(car => car.vin === body.vin);
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
    
    const newCar = db.createCar(carData);
    
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
