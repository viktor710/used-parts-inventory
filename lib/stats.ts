import { prisma } from '@/lib/prisma';
import { InventoryStats } from '@/types';
import { mockInventoryStats, isDatabaseAvailable } from '@/lib/mock-data';

/**
 * Серверная функция для получения статистики инвентаря
 */
export async function getInventoryStats(): Promise<InventoryStats> {
  try {
    console.log('🔧 [DEBUG] getInventoryStats: Загрузка статистики с сервера');

    // Проверяем, доступна ли база данных
    const dbAvailable = await isDatabaseAvailable();
    
    if (!dbAvailable) {
      console.log('🔧 [DEBUG] getInventoryStats: База данных недоступна, используем моковые данные');
      return mockInventoryStats;
    }

    // Получаем общее количество запчастей
    const totalParts = await prisma.part.count().catch(() => 0);

    // Получаем доступные запчасти
    const availableParts = await prisma.part.count({
      where: {
        status: 'available'
      }
    }).catch(() => 0);

    // Получаем зарезервированные запчасти
    const reservedParts = await prisma.part.count({
      where: {
        status: 'reserved'
      }
    }).catch(() => 0);

    // Получаем проданные запчасти
    const soldParts = await prisma.part.count({
      where: {
        status: 'sold'
      }
    }).catch(() => 0);

    // Получаем общую стоимость всех запчастей
    const totalValueResult = await prisma.part.aggregate({
      _sum: {
        price: true
      }
    }).catch(() => ({ _sum: { price: 0 } }));

    // Получаем среднюю цену
    const averagePriceResult = await prisma.part.aggregate({
      _avg: {
        price: true
      }
    }).catch(() => ({ _avg: { price: 0 } }));

    // Получаем общее количество автомобилей
    const totalCars = await prisma.car.count().catch(() => 0);

    // Получаем распределение по категориям
    const categoryDistribution = await prisma.part.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    }).catch(() => []);

    // Получаем распределение по состоянию
    const conditionDistribution = await prisma.part.groupBy({
      by: ['condition'],
      _count: {
        condition: true
      }
    }).catch(() => []);

    // Преобразуем результаты в нужный формат
    const categoryDist: Record<string, number> = {};
    categoryDistribution.forEach(item => {
      categoryDist[item.category] = item._count.category;
    });

    const conditionDist: Record<string, number> = {};
    conditionDistribution.forEach(item => {
      conditionDist[item.condition] = item._count.condition;
    });

    const stats: InventoryStats = {
      totalParts,
      availableParts,
      reservedParts,
      soldParts,
      totalCars,
      totalValue: totalValueResult._sum.price || 0,
      averagePrice: averagePriceResult._avg.price || 0,
      categoryDistribution: categoryDist as Record<string, number>,
      conditionDistribution: conditionDist as Record<string, number>
    };

    console.log('🔧 [DEBUG] getInventoryStats: Статистика загружена:', stats);
    return stats;

  } catch (error) {
    console.error('🔧 [DEBUG] getInventoryStats: Ошибка загрузки статистики:', error);
    
    // Возвращаем моковые данные в случае ошибки
    console.log('🔧 [DEBUG] getInventoryStats: Возвращаем моковые данные');
    return mockInventoryStats;
  } finally {
    // Закрываем подключение к базе данных
    try {
      await prisma.$disconnect();
    } catch {
      // Игнорируем ошибки при закрытии соединения
    }
  }
}
