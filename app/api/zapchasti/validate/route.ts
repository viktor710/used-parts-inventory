import { NextRequest, NextResponse } from 'next/server';
import { isZapchastExists, findZapchastByName } from '@/lib/zapchasti-data';

// Принудительно делаем роут динамическим
export const dynamic = 'force-dynamic';

/**
 * GET /api/zapchasti/validate
 * Валидация существования запчасти
 */
export async function GET(request: NextRequest) {
  console.log('🔧 [DEBUG] API GET /api/zapchasti/validate: Запрос валидации');
  
  try {
    const { searchParams } = new URL(request.url);

    // Параметры валидации
    const name = searchParams.get('name') || '';
    
    console.log('🔧 [DEBUG] API GET /api/zapchasti/validate: Проверка запчасти:', name);
    
    if (!name.trim()) {
      return NextResponse.json({
        success: true,
        data: {
          exists: false,
          name: '',
          message: 'Название запчасти не указано',
        },
      });
    }
    
    const exists = isZapchastExists(name);
    const zapchast = exists ? findZapchastByName(name) : null;
    
    console.log('🔧 [DEBUG] API GET /api/zapchasti/validate: Результат:', { exists, name });
    
    return NextResponse.json({
      success: true,
      data: {
        exists,
        name,
        zapchast,
        message: exists ? 'Запчасть найдена' : 'Запчасть не найдена в списке',
      },
    });
  } catch (error) {
    console.error('Ошибка при валидации запчасти:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
