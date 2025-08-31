import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/database-service';
import { UpdateCarInput } from '@/types';

/**
 * GET /api/cars/[id]
 * Получение конкретного автомобиля по ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('🔧 [DEBUG] API GET /api/cars/[id]: Запрос получен для ID:', params.id);
  
  try {
    const car = await dbService.getCarById(params.id);
    
    if (!car) {
      return NextResponse.json(
        { success: false, error: 'Автомобиль не найден' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: car,
    });
  } catch (error) {
    console.error('Ошибка при получении автомобиля:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cars/[id]
 * Обновление автомобиля
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('🔧 [DEBUG] API PUT /api/cars/[id]: Запрос на обновление автомобиля ID:', params.id);
  
  try {
    const body = await request.json();
    
    // Проверяем существование автомобиля
    const existingCar = await dbService.getCarById(params.id);
    if (!existingCar) {
      return NextResponse.json(
        { success: false, error: 'Автомобиль не найден' },
        { status: 404 }
      );
    }
    
    // Если обновляется VIN, проверяем уникальность
    if (body.vin && body.vin !== existingCar.vin) {
      const carsWithSameVin = await dbService.searchCars(body.vin);
      const carWithSameVin = carsWithSameVin.find(car => car.vin === body.vin && car.id !== params.id);
      if (carWithSameVin) {
        return NextResponse.json(
          { success: false, error: 'Автомобиль с таким VIN уже существует' },
          { status: 400 }
        );
      }
    }
    
    // Обновление автомобиля в базе данных
    const updateData: UpdateCarInput = {
      ...body,
    };
    
    const updatedCar = await dbService.updateCar(params.id, updateData);
    
    if (!updatedCar) {
      return NextResponse.json(
        { success: false, error: 'Ошибка при обновлении автомобиля' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedCar,
    });
  } catch (error) {
    console.error('Ошибка при обновлении автомобиля:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cars/[id]
 * Удаление автомобиля
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('🔧 [DEBUG] API DELETE /api/cars/[id]: Запрос на удаление автомобиля ID:', params.id);
  
  try {
    const success = await dbService.deleteCar(params.id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Нельзя удалить автомобиль с запчастями или автомобиль не найден' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Автомобиль успешно удален',
    });
  } catch (error) {
    console.error('Ошибка при удалении автомобиля:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
