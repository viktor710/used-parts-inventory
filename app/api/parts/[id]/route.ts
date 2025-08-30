import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { UpdatePartInput } from '@/types';

/**
 * GET /api/parts/[id]
 * Получение конкретной запчасти по ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID запчасти не указан' },
        { status: 400 }
      );
    }
    
    const part = db.getPartById(id);
    
    if (!part) {
      return NextResponse.json(
        { success: false, error: 'Запчасть не найдена' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: part,
    });
  } catch (error) {
    console.error('Ошибка при получении запчасти:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/parts/[id]
 * Обновление запчасти
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID запчасти не указан' },
        { status: 400 }
      );
    }
    
    // Проверяем существование запчасти
    const existingPart = db.getPartById(id);
    if (!existingPart) {
      return NextResponse.json(
        { success: false, error: 'Запчасть не найдена' },
        { status: 404 }
      );
    }
    
    // Подготовка данных для обновления
    const updateData: UpdatePartInput = { ...body };
    
    // Преобразование даты если она передана
    if (body.purchaseDate) {
      updateData.purchaseDate = new Date(body.purchaseDate);
    }
    
    // Обновление запчасти в базе данных
    const updatedPart = db.updatePart(id, updateData);
    
    if (!updatedPart) {
      return NextResponse.json(
        { success: false, error: 'Ошибка при обновлении запчасти' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedPart,
    });
  } catch (error) {
    console.error('Ошибка при обновлении запчасти:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/parts/[id]
 * Удаление запчасти
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID запчасти не указан' },
        { status: 400 }
      );
    }
    
    // Проверяем существование запчасти
    const existingPart = db.getPartById(id);
    if (!existingPart) {
      return NextResponse.json(
        { success: false, error: 'Запчасть не найдена' },
        { status: 404 }
      );
    }
    
    // Удаление запчасти из базы данных
    const deleted = db.deletePart(id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Ошибка при удалении запчасти' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Запчасть успешно удалена',
    });
  } catch (error) {
    console.error('Ошибка при удалении запчасти:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
