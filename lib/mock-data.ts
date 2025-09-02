import { InventoryStats } from '@/types';

/**
 * Моковые данные для статистики инвентаря
 * Используются во время билда и когда база данных недоступна
 */
export const mockInventoryStats: InventoryStats = {
  totalParts: 75,
  availableParts: 45,
  reservedParts: 15,
  soldParts: 12,
  totalCars: 25,
  totalValue: 1250000,
  averagePrice: 16667,
  categoryDistribution: {
    engine: 12,
    transmission: 8,
    suspension: 15,
    brakes: 20,
    electrical: 10,
    body: 5,
    interior: 3,
    exterior: 2,
    other: 0
  },
  conditionDistribution: {
    excellent: 20,
    good: 35,
    fair: 15,
    poor: 3,
    broken: 2
  }
};

/**
 * Проверяет, доступна ли база данных
 * Во время билда всегда возвращает false
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  // Во время билда (NODE_ENV === 'production' и процесс статической генерации)
  // всегда возвращаем false, чтобы использовать моковые данные
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    return false;
  }

  try {
    // Простая проверка подключения к базе данных только в runtime
    const { prisma } = await import('@/lib/prisma');
    await prisma.$connect();
    await prisma.$disconnect();
    return true;
  } catch {
    console.log('База данных недоступна, используем моковые данные');
    return false;
  }
}
