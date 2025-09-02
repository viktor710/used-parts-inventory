import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  console.log('🔧 [DEBUG] API GET /api/test-db: Запрос получен');
  
  try {
    // Пробуем подключиться к базе данных
    await prisma.$connect();
    console.log('✅ Подключение к базе данных успешно');
    
    // Пробуем выполнить простой запрос
    const carCount = await prisma.car.count();
    console.log('📊 Количество автомобилей в базе:', carCount);
    
    const partCount = await prisma.part.count();
    console.log('📦 Количество запчастей в базе:', partCount);
    
    return NextResponse.json({
      success: true,
      data: {
        connected: true,
        carCount,
        partCount
      }
    });
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Ошибка подключения к базе данных',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
