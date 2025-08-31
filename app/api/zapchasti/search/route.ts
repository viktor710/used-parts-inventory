import { NextRequest, NextResponse } from 'next/server';
import { searchZapchasti, getAutocompleteSuggestions } from '@/lib/zapchasti-data';

// Принудительно делаем роут динамическим
export const dynamic = 'force-dynamic';

/**
 * GET /api/zapchasti/search
 * Поиск запчастей с поддержкой автодополнения
 */
export async function GET(request: NextRequest) {
  console.log('🔧 [DEBUG] API GET /api/zapchasti/search: Запрос поиска');
  
  try {
    const { searchParams } = new URL(request.url);

    // Параметры поиска
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type') || 'autocomplete'; // 'search' | 'autocomplete'
    
    console.log('🔧 [DEBUG] API GET /api/zapchasti/search: Параметры:', { query, limit, type });
    
    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        data: {
          results: [],
          total: 0,
          query: '',
        },
      });
    }
    
    let results;
    
    if (type === 'autocomplete') {
      // Для автодополнения - быстрый поиск с ограничением
      results = getAutocompleteSuggestions(query, limit);
    } else {
      // Для полного поиска - все результаты
      results = searchZapchasti(query);
    }
    
    console.log('🔧 [DEBUG] API GET /api/zapchasti/search: Найдено результатов:', results.length);
    
    return NextResponse.json({
      success: true,
      data: {
        results,
        total: results.length,
        query,
        type,
        limit,
      },
    });
  } catch (error) {
    console.error('Ошибка при поиске запчастей:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
