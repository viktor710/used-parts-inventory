import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

/**
 * GET /api/stats
 * Получение статистики инвентаря
 */
export async function GET() {
  console.log('🔧 [DEBUG] API GET /api/stats: Запрос получен');
  
  try {
    const stats = db.getInventoryStats();
    
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
