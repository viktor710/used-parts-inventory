import { NextResponse } from 'next/server';
import { dbService } from '@/lib/database-service';

/**
 * GET /api/stats
 * Получение статистики инвентаря
 */
export async function GET() {
  console.log('🔧 [DEBUG] API GET /api/stats: Запрос получен');
  console.log('🔧 [DEBUG] API GET /api/stats: DATABASE_URL установлена:', !!process.env['DATABASE_URL']);
  
  try {
    const stats = await dbService.getInventoryStats();
    
    console.log('🔧 [DEBUG] API GET /api/stats: Статистика получена:', stats);
    
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
    
    // Возвращаем более информативную ошибку
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ошибка при получении статистики',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
