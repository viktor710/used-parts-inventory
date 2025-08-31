import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const query = searchParams.get('q') || searchParams.get('query') || '';
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
    
    // Поиск в базе данных
    const results = await prisma.part.findMany({
      where: {
        OR: [
          {
            zapchastName: {
              contains: query,
              mode: 'insensitive' // Регистронезависимый поиск
            }
          },
          {
            description: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            location: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      include: {
        car: {
          select: {
            brand: true,
            model: true,
            year: true
          }
        }
      },
      take: type === 'autocomplete' ? Math.min(limit, 5) : limit,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
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
    console.error('❌ Ошибка при поиске запчастей:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Внутренняя ошибка сервера',
        details: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}
