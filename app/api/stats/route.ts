import { NextResponse } from 'next/server';
import { dbService } from '@/lib/database-service';

/**
 * GET /api/stats
 * Получение статистики инвентаря
 */
export async function GET() {
  console.log('🔧 [DEBUG] API GET /api/stats: Запрос получен');
  
  try {
    const stats = await dbService.getInventoryStats();
    
    console.log('🔧 [DEBUG] API GET /api/stats: Статистика получена:', stats);
    
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
