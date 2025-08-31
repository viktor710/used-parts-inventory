import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { CreatePartInput } from '@/types';

/**
 * GET /api/parts
 * Получение списка запчастей с фильтрацией и пагинацией
 */
export async function GET(request: NextRequest) {
  console.log('🔧 [DEBUG] API GET /api/parts: Запрос получен');
  
  try {
    const { searchParams } = new URL(request.url);
    
    // Параметры пагинации
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Параметры фильтрации
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const carId = searchParams.get('carId') || undefined;
    const location = searchParams.get('location') || undefined;
    const supplier = searchParams.get('supplier') || undefined;
    
    // Построение фильтров
    const filters: any = {};
    if (category) filters.category = category;
    if (status) filters.status = status;
    if (carId) filters.carId = carId;
    if (location) filters.location = location;
    if (supplier) filters.supplier = supplier;
    
    // Получение данных из базы
    console.log('🔧 [DEBUG] API GET /api/parts: Запрос к базе данных с фильтрами:', filters);
    const parts = db.getParts(page, limit, filters);
    
    // Получение общего количества для пагинации
    const totalParts = db.getInventoryStats().totalParts;
    console.log('🔧 [DEBUG] API GET /api/parts: Получено запчастей:', parts.length, 'из', totalParts);
    
    return NextResponse.json({
      success: true,
      data: {
        parts,
        pagination: {
          page,
          limit,
          total: totalParts,
          totalPages: Math.ceil(totalParts / limit),
        },
      },
    });
  } catch (error) {
    console.error('Ошибка при получении запчастей:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/parts
 * Создание новой запчасти
 */
export async function POST(request: NextRequest) {
  console.log('🔧 [DEBUG] API POST /api/parts: Запрос на создание запчасти');
  
  try {
    const body = await request.json();
    
    // Валидация обязательных полей
    const requiredFields = ['name', 'category', 'carId', 'condition', 'status', 'price', 'location', 'supplier', 'purchaseDate', 'purchasePrice'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Отсутствуют обязательные поля: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Преобразование даты
    const partData: CreatePartInput = {
      ...body,
      purchaseDate: new Date(body.purchaseDate),
      images: body.images || [],
      notes: body.notes || '',
      description: body.description || '',
    };
    
    // Создание запчасти в базе данных
    const newPart = db.createPart(partData);
    
    return NextResponse.json({
      success: true,
      data: newPart,
    }, { status: 201 });
  } catch (error) {
    console.error('Ошибка при создании запчасти:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
